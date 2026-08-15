import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import { UserProfile, WalletTransaction, ChatMessage, LeaderboardUser } from '../types';

interface FirebaseContextType {
  firebaseUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  firebaseReady: boolean;
  isLoadingAuth: boolean;
  cloudSyncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  chatMessages: ChatMessage[];
  leaderboardUsers: LeaderboardUser[];
  loginWithGoogle: () => Promise<UserProfile | null>;
  logout: () => Promise<void>;
  updateUserBalanceInCloud: (newBalance: number, deltaStats?: { spins?: number; win?: number; biggest?: number }) => Promise<void>;
  recordCloudTransaction: (tx: WalletTransaction) => Promise<void>;
  recordCloudSpin: (spin: { gameId: string; gameName: string; betAmount: number; winAmount: number; multiplier: number }) => Promise<void>;
  sendCloudChatMessage: (text: string, isSystem?: boolean) => Promise<void>;
  updateCloudLeaderboard: (score: number, biggestWin: number, points: number) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

const DEFAULT_CHATS: ChatMessage[] = [
  { id: '1', sender: 'Mateo_Peru', avatar: '👨‍🌾', text: '¡Increíble la ronda de bonos en Tesoros de Cajamarca!', time: '12:01' },
  { id: '2', sender: 'Lucia_Lima', avatar: '👩‍💼', text: '¡Gané $3,500 en Frutas Diamante Deluxe! 🍉💎', time: '12:02' },
  { id: '3', sender: 'Sistemas Gran Fortuna', avatar: '🤖', text: '¡Felicidades a Diego_Cusco por ganar el bote del Sol Inca!', time: '12:03', isSystem: true },
  { id: '4', sender: 'Roberto_Trujillo', avatar: '🤠', text: '¿Quién lidera el torneo Sol de Oro de hoy?', time: '12:04' },
];

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>('synced');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(DEFAULT_CHATS);
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setFirebaseReady(true);
      setIsLoadingAuth(false);

      if (user) {
        setCloudSyncStatus('syncing');
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const profile: UserProfile = {
              id: user.uid,
              name: data.displayName || user.displayName || 'Jugador VIP',
              email: user.email || '',
              avatar: data.photoURL || user.photoURL || '👑',
              provider: 'gmail',
              isVip: Boolean(data.isVip ?? true),
              vipTier: data.vipLevel || 'Oro',
              country: 'Perú',
              connectedAt: data.createdAt ? new Date(data.createdAt).toLocaleTimeString() : new Date().toLocaleTimeString(),
              claimedWelcomeBonus: true,
              totalSpins: data.totalSpins || 0,
              totalWon: data.totalWon || 0,
            };
            setUserProfile(profile);
          } else {
            // First time registration doc
            const newProfileData = {
              userId: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Jugador VIP Gran Fortuna',
              photoURL: user.photoURL || '👑',
              balance: 10000,
              currency: 'USD',
              vipLevel: 'Oro',
              vipPoints: 2500,
              totalSpins: 0,
              totalWon: 0,
              biggestWin: 0,
              isVip: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newProfileData);
            setUserProfile({
              id: user.uid,
              name: newProfileData.displayName,
              email: newProfileData.email,
              avatar: newProfileData.photoURL,
              provider: 'gmail',
              isVip: true,
              vipTier: 'Oro',
              country: 'Perú',
              connectedAt: new Date().toLocaleTimeString(),
              claimedWelcomeBonus: true,
              totalSpins: 0,
              totalWon: 0,
            });
          }
          setCloudSyncStatus('synced');
        } catch (err) {
          console.error('Error fetching user profile from firestore:', err);
          setCloudSyncStatus('error');
        }
      } else {
        setUserProfile(null);
        setCloudSyncStatus('offline');
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time Live Chat Listener (only if signed in or public fallback)
  useEffect(() => {
    if (!firebaseUser) return;

    const chatColRef = collection(db, 'chat_messages');
    const q = query(chatColRef, orderBy('timestamp', 'desc'), limit(25));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedMsgs: ChatMessage[] = snapshot.docs
            .map((docSnap) => {
              const data = docSnap.data();
              return {
                id: docSnap.id,
                sender: data.sender || 'Jugador VIP',
                avatar: data.avatar || '🎰',
                text: data.text || '',
                time: data.timestamp ? new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ahora',
                isSystem: Boolean(data.isSystem),
              };
            })
            .reverse();
          setChatMessages(loadedMsgs);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'chat_messages');
      }
    );

    return () => unsubscribe();
  }, [firebaseUser]);

  // 3. Real-time Leaderboard Listener
  useEffect(() => {
    const lbColRef = collection(db, 'leaderboard');
    const q = query(lbColRef, orderBy('score', 'desc'), limit(10));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedLeaders: LeaderboardUser[] = snapshot.docs.map((docSnap, idx) => {
            const data = docSnap.data();
            return {
              rank: idx + 1,
              name: data.displayName || 'VIP Jugador',
              avatar: data.avatar || '👑',
              weeklyWins: data.score || 0,
              biggestWin: data.biggestWin || 0,
              vipTier: data.vipLevel || 'Oro',
              country: 'Perú',
            };
          });
          setLeaderboardUsers(loadedLeaders);
        }
      },
      (error) => {
        // Non-blocking leaderboard error logging
        console.warn('Leaderboard snapshot notice:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const loginWithGoogle = async (): Promise<UserProfile | null> => {
    try {
      setIsLoadingAuth(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      let profile: UserProfile;
      if (docSnap.exists()) {
        const data = docSnap.data();
        profile = {
          id: user.uid,
          name: data.displayName || user.displayName || 'Jugador VIP Gran Fortuna',
          email: user.email || '',
          avatar: user.photoURL || data.photoURL || '👑',
          provider: 'gmail',
          isVip: true,
          vipTier: data.vipLevel || 'Oro',
          country: 'Perú',
          connectedAt: new Date().toLocaleTimeString(),
          claimedWelcomeBonus: true,
          totalSpins: data.totalSpins || 0,
          totalWon: data.totalWon || 0,
        };
      } else {
        const initialData = {
          userId: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Jugador VIP Gran Fortuna',
          photoURL: user.photoURL || '👑',
          balance: 10000,
          currency: 'USD',
          vipLevel: 'Oro',
          vipPoints: 2500,
          totalSpins: 0,
          totalWon: 0,
          biggestWin: 0,
          isVip: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, initialData);
        profile = {
          id: user.uid,
          name: initialData.displayName,
          email: initialData.email,
          avatar: initialData.photoURL,
          provider: 'gmail',
          isVip: true,
          vipTier: 'Oro',
          country: 'Perú',
          connectedAt: new Date().toLocaleTimeString(),
          claimedWelcomeBonus: true,
          totalSpins: 0,
          totalWon: 0,
        };
      }
      setUserProfile(profile);
      setCloudSyncStatus('synced');
      return profile;
    } catch (error) {
      console.error('Login with Google error:', error);
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await fbSignOut(auth);
      setFirebaseUser(null);
      setUserProfile(null);
      setCloudSyncStatus('offline');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Sync Balance & Game Stats
  const updateUserBalanceInCloud = async (
    newBalance: number,
    deltaStats?: { spins?: number; win?: number; biggest?: number }
  ) => {
    if (!firebaseUser) return;
    try {
      setCloudSyncStatus('syncing');
      const userRef = doc(db, 'users', firebaseUser.uid);
      const updatePayload: Record<string, any> = {
        balance: newBalance,
        updatedAt: new Date().toISOString(),
      };
      if (deltaStats) {
        if (deltaStats.spins) updatePayload.totalSpins = (userProfile?.totalSpins || 0) + deltaStats.spins;
        if (deltaStats.win) updatePayload.totalWon = (userProfile?.totalWon || 0) + deltaStats.win;
      }
      await updateDoc(userRef, updatePayload);
      setCloudSyncStatus('synced');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${firebaseUser.uid}`);
    }
  };

  // Record Transaction
  const recordCloudTransaction = async (tx: WalletTransaction) => {
    if (!firebaseUser) return;
    try {
      const cleanTxId = tx.id.replace(/[^a-zA-Z0-9_-]/g, '') || `tx-${Date.now()}`;
      const txDocRef = doc(db, 'users', firebaseUser.uid, 'transactions', cleanTxId);
      const payload = {
        id: cleanTxId,
        userId: firebaseUser.uid,
        type: tx.type === 'withdrawal' ? 'withdraw' : tx.type === 'bonus' ? 'bonus' : 'deposit',
        amount: tx.amount,
        currency: 'USD',
        method: tx.method.substring(0, 120),
        status: tx.status === 'Procesando' ? 'Procesando' : 'Completado',
        referenceId: tx.referenceId || `GF-REF-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      await setDoc(txDocRef, payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${firebaseUser.uid}/transactions`);
    }
  };

  // Record Spin outcome
  const recordCloudSpin = async (spin: {
    gameId: string;
    gameName: string;
    betAmount: number;
    winAmount: number;
    multiplier: number;
  }) => {
    if (!firebaseUser) return;
    try {
      const spinId = `spin-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const spinDocRef = doc(db, 'users', firebaseUser.uid, 'spins', spinId);
      const payload = {
        id: spinId,
        userId: firebaseUser.uid,
        gameId: spin.gameId.substring(0, 64),
        gameName: spin.gameName.substring(0, 120),
        betAmount: spin.betAmount,
        winAmount: spin.winAmount,
        multiplier: spin.multiplier,
        timestamp: new Date().toISOString(),
      };
      await setDoc(spinDocRef, payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${firebaseUser.uid}/spins`);
    }
  };

  // Send live chat message
  const sendCloudChatMessage = async (text: string, isSystem = false) => {
    if (!firebaseUser) return;
    try {
      const msgId = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const msgDocRef = doc(db, 'chat_messages', msgId);
      const payload = {
        id: msgId,
        userId: firebaseUser.uid,
        sender: userProfile?.name || firebaseUser.displayName || 'Jugador VIP',
        avatar: userProfile?.avatar || '👑',
        text: text.trim().substring(0, 480),
        isSystem: Boolean(isSystem),
        timestamp: new Date().toISOString(),
      };
      await setDoc(msgDocRef, payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'chat_messages');
    }
  };

  // Update cloud leaderboard entry
  const updateCloudLeaderboard = async (score: number, biggestWin: number, points: number) => {
    if (!firebaseUser) return;
    try {
      const lbDocRef = doc(db, 'leaderboard', firebaseUser.uid);
      const payload = {
        userId: firebaseUser.uid,
        displayName: userProfile?.name || firebaseUser.displayName || 'Jugador VIP Gran Fortuna',
        avatar: userProfile?.avatar || '👑',
        vipLevel: userProfile?.vipTier || 'Oro',
        score,
        biggestWin,
        tournamentPoints: points,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(lbDocRef, payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `leaderboard/${firebaseUser.uid}`);
    }
  };

  const contextValue = useMemo(
    () => ({
      firebaseUser,
      userProfile,
      firebaseReady,
      isLoadingAuth,
      cloudSyncStatus,
      chatMessages,
      leaderboardUsers,
      loginWithGoogle,
      logout,
      updateUserBalanceInCloud,
      recordCloudTransaction,
      recordCloudSpin,
      sendCloudChatMessage,
      updateCloudLeaderboard,
    }),
    [firebaseUser, userProfile, firebaseReady, isLoadingAuth, cloudSyncStatus, chatMessages, leaderboardUsers]
  );

  return <FirebaseContext.Provider value={contextValue}>{children}</FirebaseContext.Provider>;
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
