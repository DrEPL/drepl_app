import type { SVGProps } from 'react';

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'size'> {
  size?: number | string;
}

// Visual signature: each icon has exactly ONE filled accent (in currentColor),
// the rest is outline. Creates a unified bespoke language across sections.

const base = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
};

// Contexte & Objectifs — lens scrutinizing a horizon, with a focal dot
export function ContextIcon({ size = 24, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} {...base} {...rest}>
      <circle cx="11" cy="11" r="7" />
      <path d="M4 13h14" />
      <path d="M15.8 15.8L20 20" />
      <circle cx="11" cy="11" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Problématique — ring with a missing arc, dot at the core of the fracture
export function ProblemIcon({ size = 24, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} {...base} {...rest}>
      <path d="M21 12a9 9 0 0 1 -9 9" />
      <path d="M12 21a9 9 0 0 1 -9 -9" />
      <path d="M3 12a9 9 0 0 1 9 -9" />
      <path d="M12 3a9 9 0 0 1 5 1.5" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Solution — wave navigating from one anchor to the next, apex filled
export function SolutionIcon({ size = 24, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} {...base} {...rest}>
      <path d="M3 17c3 0 3 -10 9 -10s6 10 9 10" />
      <circle cx="3" cy="17" r="1.5" />
      <circle cx="21" cy="17" r="1.5" />
      <circle cx="12" cy="7" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Résultats & Impact — ascending bars topped by a flight path ending in a filled tip
export function ResultsIcon({ size = 24, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} {...base} {...rest}>
      <path d="M3 20h18" />
      <path d="M6 20v-4" />
      <path d="M11 20v-7" />
      <path d="M16 20v-10" />
      <path d="M4 9l5 -3 5 3 6 -4" />
      <circle cx="20" cy="5" r="1.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Pipeline — three sequenced nodes with directional chevrons, terminal node filled
export function PipelineIcon({ size = 24, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} {...base} {...rest}>
      <circle cx="4" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="20" cy="12" r="2" fill="currentColor" stroke="none" />
      <path d="M6 12h4" />
      <path d="M14 12h4" />
      <path d="M9 10l1.2 2 -1.2 2" />
      <path d="M17 10l1.2 2 -1.2 2" />
    </svg>
  );
}

// Équipe — triad of connected members, the lead filled
export function TeamIcon({ size = 24, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} {...base} {...rest}>
      <circle cx="12" cy="5" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="5" cy="17" r="2.5" />
      <circle cx="19" cy="17" r="2.5" />
      <path d="M7.2 15.5l3.3 -7.5" />
      <path d="M16.8 15.5l-3.3 -7.5" />
      <path d="M8 17h8" strokeDasharray="0.6 2.5" />
    </svg>
  );
}

// Adaptations — square morphing into a circle through a dashed transition
export function AdaptationsIcon({ size = 24, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} {...base} {...rest}>
      <rect x="3" y="7" width="8" height="10" rx="1.5" />
      <path d="M11.5 12h3.2" strokeDasharray="1.5 2" />
      <circle cx="18.5" cy="12" r="3.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
