import React, { useId } from 'react';

interface HeroAvatarProps {
  src?: string;
  alt?: string;
  className?: string;
}

/**
 * Organic, liquid avatar built with SVG <feTurbulence> + <feDisplacementMap>.
 * The image is clipped to a circle, then the whole result is warped by an
 * animated noise field — so both the silhouette and the pixels undulate
 * continuously, giving a true liquid/blob feel (not a CSS border-radius lerp).
 */
export default function HeroAvatar({
  src = '/drepl.jpg',
  alt = 'Dr EPL',
  className = '',
}: HeroAvatarProps) {
  const uid = useId().replace(/:/g, '');
  const filterId = `liquid-${uid}`;
  const maskId = `mask-${uid}`;
  const noiseId = `noise-${uid}`;

  return (
    <div
      className={`relative w-64 h-64 sm:w-80 sm:h-80 xl:w-96 xl:h-96 group ${className}`}
    >
      {/* Soft glowing aura behind — gentle organic float */}
      <div
        aria-hidden
        className="absolute -inset-8 rounded-full bg-gradient-to-br from-[var(--accent-teal)]/35 via-[var(--accent-blue)]/25 to-[var(--accent-teal-dark)]/35 blur-3xl opacity-80 animate-organic"
      />

      {/* Pulsing teal halo ring */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full animate-border-glow border-2 border-transparent"
      />

      <svg
        viewBox="0 0 400 400"
        className="relative z-10 w-full h-full overflow-visible transition-transform duration-700 group-hover:scale-[1.04]"
        role="img"
        aria-label={alt}
      >
        <defs>
          <filter
            id={filterId}
            x="-60%"
            y="-60%"
            width="220%"
            height="220%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.006"
              numOctaves="2"
              seed="3"
              result={noiseId}
            >
              <animate
                attributeName="baseFrequency"
                dur="9s"
                values="0.005 0.007;0.011 0.006;0.007 0.012;0.005 0.007"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2={noiseId} scale="120">
              <animate
                attributeName="scale"
                dur="6s"
                values="95;140;105;135;95"
                repeatCount="indefinite"
              />
            </feDisplacementMap>
          </filter>

          {/* Mask is a circle that gets warped by the liquid filter.
              Only the silhouette wobbles — the image stays perfectly sharp. */}
          <mask id={maskId} maskUnits="userSpaceOnUse">
            <g filter={`url(#${filterId})`}>
              <circle cx="200" cy="200" r="170" fill="white" />
            </g>
          </mask>
        </defs>

        {/* Photo: undistorted, just clipped by the wobbling mask */}
        <image
          href={src}
          x="0"
          y="0"
          width="400"
          height="400"
          preserveAspectRatio="xMidYMid slice"
          mask={`url(#${maskId})`}
        />
      </svg>
    </div>
  );
}
