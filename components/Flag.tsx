import React from 'react';

interface Props {
  country: 'fr' | 'gb';
  className?: string;
}

export default function Flag({ country, className }: Props) {
  const baseClass = `inline-block rounded-sm overflow-hidden ${className ?? ''}`;
  if (country === 'fr') {
    return (
      <svg viewBox="0 0 3 2" className={baseClass} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="1" height="2" fill="#0055A4" />
        <rect x="1" width="1" height="2" fill="#FFFFFF" />
        <rect x="2" width="1" height="2" fill="#EF4135" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 60 30" className={baseClass} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <clipPath id="uk-t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-t)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}
