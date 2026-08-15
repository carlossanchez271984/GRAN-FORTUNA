# Security Specification & Threat Model

## 1. Data Invariants
1. **User Profile Isolation**: Users can only read and write their own profile document (`/users/{userId}`).
2. **Identity Integrity**: `userId` must strictly match `request.auth.uid`. No user can impersonate another user.
3. **Financial Records Security**: Transactions (`/users/{userId}/transactions/{txId}`) and Spins (`/users/{userId}/spins/{spinId}`) can only be created by the verified owner.
4. **Chat & Feed Guardrails**: Any authenticated user can read public chat messages and leaderboard rankings. Any authenticated user can post a chat message where `userId == request.auth.uid` with strict character length limits (≤500 chars).
5. **Leaderboard Integrity**: Users can update only their own entry (`/leaderboard/{userId}`) matching their `request.auth.uid`.
6. **Denial-of-Wallet & Injection Protection**: All string fields are constrained by length (`size() <= N`), and IDs are validated with regex `^[a-zA-Z0-9_\\-]+$`.

## 2. The Dirty Dozen Payloads (Negative Tests)
1. **Spoofed User Creation**: Attacker attempts to create a document at `/users/victimUid` with their own auth token -> **REJECTED**.
2. **Balance Hijack**: Attacker tries to update another user's balance at `/users/otherUser` -> **REJECTED**.
3. **Oversized Chat Message**: Attacker sends a 10KB string payload into `/chat_messages` -> **REJECTED**.
4. **Ghost Field Injection**: Attacker injects `isAdmin: true` into their `/users/{userId}` document -> **REJECTED**.
5. **Foreign Transaction Creation**: Attacker attempts to post a deposit record into another user's subcollection -> **REJECTED**.
6. **Unauthenticated Read of Private User Data**: Anonymous / unauthenticated client tries to read `/users/{userId}` -> **REJECTED**.
7. **Negative Bet Amount**: Attacker posts a spin record with negative bet amount or invalid type -> **REJECTED**.
8. **Document ID Path Poisoning**: Attacker passes a 2KB garbage string as document ID -> **REJECTED**.
9. **Fake Leaderboard Impersonation**: Attacker attempts to write to `/leaderboard/otherUser` -> **REJECTED**.
10. **Chat Message User Spoofing**: Attacker submits a message with `userId` of an admin -> **REJECTED**.
11. **Malicious Transaction Status Tamper**: Attacker creates a transaction without required fields -> **REJECTED**.
12. **Unverified Auth Mutation**: Client attempts writes with null authentication token -> **REJECTED**.
