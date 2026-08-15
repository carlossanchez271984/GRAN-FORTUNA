import React from 'react';

interface YapeLogoProps {
  className?: string;
  size?: number;
}

export const YapeLogo: React.FC<YapeLogoProps> = ({ className = '', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="250" cy="250" r="250" fill="#742284" />
      
      {/* Turquoise speech bubble at top right */}
      <path
        d="M260 200 C240 200 220 185 220 155 C220 125 245 105 275 105 C305 105 330 125 330 155 C330 175 318 192 300 198 L290 220 L275 200 Z"
        fill="#00D2B4"
      />
      
      {/* S/ text inside speech bubble */}
      <text
        x="275"
        y="163"
        fill="#742284"
        fontSize="44"
        fontWeight="900"
        fontFamily="sans-serif"
        textAnchor="middle"
        letterSpacing="-1"
      >
        S/
      </text>

      {/* Stylized Yape script text */}
      <g fill="#FFFFFF">
        {/* y */}
        <path d="M190 280 C182 295 170 340 150 380 C135 410 115 440 95 440 C85 440 80 435 85 425 C95 405 125 350 145 300 L115 300 C110 300 115 285 125 265 C135 245 145 230 155 230 C165 230 160 250 150 270 L170 270 C180 250 190 230 200 230 C205 230 205 240 195 260 L190 280 Z" />
        
        {/* a */}
        <path d="M245 285 C240 310 215 328 190 328 C175 328 165 315 170 295 C175 270 198 252 225 252 C238 252 246 260 245 275 L245 285 Z M215 270 C200 270 188 280 185 295 C182 305 188 312 198 312 C212 312 225 300 228 285 C230 275 225 270 215 270 Z" />
        
        {/* p */}
        <path d="M285 230 C295 230 295 240 290 255 L260 360 C255 375 245 380 240 380 C232 380 232 370 238 355 L252 305 C245 318 232 328 218 328 C202 328 195 315 200 295 C205 270 228 252 250 252 C262 252 270 258 275 268 L285 230 Z M252 275 C242 275 230 285 228 298 C225 308 230 312 238 312 C248 312 258 302 262 290 C265 280 260 275 252 275 Z" />
        
        {/* e */}
        <path d="M340 280 C335 310 310 328 285 328 C265 328 255 312 260 290 C265 265 288 252 312 252 C332 252 342 265 340 280 Z M285 280 C298 280 318 278 322 270 C322 265 315 262 305 262 C292 262 282 270 280 280 Z" />
        
        {/* Underline swoosh stroke */}
        <path
          d="M100 375 C180 350 270 330 370 320 C375 320 375 330 368 335 C280 355 190 380 95 420 C90 422 88 418 92 410 C96 400 98 385 100 375 Z"
          fill="#FFFFFF"
        />
      </g>
    </svg>
  );
};
