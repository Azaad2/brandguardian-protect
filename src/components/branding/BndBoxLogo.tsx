
import React from 'react';

type LogoVariant = 'full' | 'icon' | 'logotype';
type LogoSize = 'sm' | 'md' | 'lg';

interface BndBoxLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
}

const BndBoxLogo: React.FC<BndBoxLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
}) => {
  // Size mappings
  const sizeMap = {
    sm: {
      width: variant === 'full' ? 120 : variant === 'icon' ? 32 : 100,
      height: variant === 'full' ? 40 : variant === 'icon' ? 32 : 24,
      iconSize: 24,
      fontSize: 16,
      taglineFontSize: 7,
    },
    md: {
      width: variant === 'full' ? 180 : variant === 'icon' ? 48 : 150,
      height: variant === 'full' ? 60 : variant === 'icon' ? 48 : 36,
      iconSize: 36,
      fontSize: 24,
      taglineFontSize: 10,
    },
    lg: {
      width: variant === 'full' ? 240 : variant === 'icon' ? 64 : 200,
      height: variant === 'full' ? 80 : variant === 'icon' ? 64 : 48,
      iconSize: 48,
      fontSize: 32,
      taglineFontSize: 12,
    },
  };

  const dimensions = sizeMap[size];
  
  // Colors
  const primaryColor = "#2E4053";
  const secondaryColor = "#FF9900";
  
  // Icon-only variant
  if (variant === 'icon') {
    return (
      <svg
        width={dimensions.iconSize}
        height={dimensions.iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Stylized B made of interconnected boxes forming a shield */}
        <path
          d="M24 4L6 10V22C6 32.4 13.6 42 24 46C34.4 42 42 32.4 42 22V10L24 4Z"
          fill={primaryColor}
        />
        <path
          d="M24 8L12 12V22C12 30 17.2 37.2 24 40C30.8 37.2 36 30 36 22V12L24 8Z"
          fill="white"
          fillOpacity="0.2"
        />
        <path
          d="M24 12L18 14V22C18 24.6 18.8 27 20.4 28.6C22 30.2 24.4 31 27 31H30V22C30 18.8 28.4 15.8 26 14L24 12Z"
          fill={secondaryColor}
        />
        <path
          d="M24 16L20 18V22C20 23.6 20.4 25 21.6 26.2C22.8 27.4 24.2 28 26 28H28V22C28 20.4 27.2 18.8 26 18L24 16Z"
          fill="white"
          fillOpacity="0.3"
        />
      </svg>
    );
  }

  // Logotype-only variant
  if (variant === 'logotype') {
    return (
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 200 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* BndBox Text */}
        <text
          x="0"
          y="30"
          fontFamily="Arial, sans-serif"
          fontSize={dimensions.fontSize}
          fontWeight="700"
          fill={primaryColor}
        >
          BndBox
        </text>
        
        {/* Tagline */}
        <text
          x="2"
          y="44"
          fontFamily="Arial, sans-serif"
          fontSize={dimensions.taglineFontSize}
          fontWeight="600"
          letterSpacing="1"
          fill={secondaryColor}
        >
          CONNECT. PROTECT. GROW.
        </text>
      </svg>
    );
  }

  // Full logo (default)
  return (
    <svg
      width={dimensions.width}
      height={dimensions.height}
      viewBox="0 0 240 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Icon */}
      <g transform="translate(0, 16)">
        <path
          d="M24 4L6 10V22C6 32.4 13.6 42 24 46C34.4 42 42 32.4 42 22V10L24 4Z"
          fill={primaryColor}
        />
        <path
          d="M24 8L12 12V22C12 30 17.2 37.2 24 40C30.8 37.2 36 30 36 22V12L24 8Z"
          fill="white"
          fillOpacity="0.2"
        />
        <path
          d="M24 12L18 14V22C18 24.6 18.8 27 20.4 28.6C22 30.2 24.4 31 27 31H30V22C30 18.8 28.4 15.8 26 14L24 12Z"
          fill={secondaryColor}
        />
        <path
          d="M24 16L20 18V22C20 23.6 20.4 25 21.6 26.2C22.8 27.4 24.2 28 26 28H28V22C28 20.4 27.2 18.8 26 18L24 16Z"
          fill="white"
          fillOpacity="0.3"
        />
      </g>
      
      {/* Text */}
      <g transform="translate(50, 0)">
        {/* BndBox Text */}
        <text
          x="0"
          y="42"
          fontFamily="Arial, sans-serif"
          fontSize={dimensions.fontSize * 1.2}
          fontWeight="700"
          fill={primaryColor}
        >
          BndBox
        </text>
        
        {/* Tagline */}
        <text
          x="2"
          y="56"
          fontFamily="Arial, sans-serif"
          fontSize={dimensions.taglineFontSize}
          fontWeight="600"
          letterSpacing="1"
          fill={secondaryColor}
        >
          CONNECT. PROTECT. GROW.
        </text>
      </g>
    </svg>
  );
};

export default BndBoxLogo;
