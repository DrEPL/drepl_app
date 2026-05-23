import React from 'react';

interface BackdropProps {
  category: string;
  className?: string;
}

// Grey palette used across all backdrops — from light to dark.
const G = {
  l1: '#e5e7eb', // very light
  l2: '#cbd5e1', // light
  m1: '#9ca3af', // mid
  m2: '#6b7280', // mid-dark
  d1: '#4b5563', // dark
} as const;

export function CategoryBackdrop({ category, className = '' }: BackdropProps) {
  const Backdrop = backdropMap[category] ?? AIBackdrop;
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{
        maskImage: 'linear-gradient(to left, black 0%, black 78%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to left, black 0%, black 78%, transparent 100%)',
      }}
      aria-hidden
    >
      <div className="absolute inset-0 animate-organic">
        <Backdrop />
      </div>
    </div>
  );
}

function AIBackdrop() {
  const xs = [120, 320, 520];
  const layers = [
    [80, 170, 260, 350],
    [50, 130, 210, 290, 370],
    [150, 230, 310],
  ];
  // Stroke palette per column-pair, cycling light↔dark.
  const lineGreysA = [G.m2, G.m1, G.l2];
  const lineGreysB = [G.m1, G.l2, G.l1];
  // Node palette per column.
  const nodeGreys = [G.m2, G.l1, G.m1];

  return (
    <svg
      viewBox="0 0 640 420"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full opacity-[0.28]"
      fill="none"
      aria-hidden
    >
      {layers[0].flatMap((y1, i) =>
        layers[1].map((y2, j) => {
          const base = lineGreysA[(i + j) % lineGreysA.length];
          const alt = lineGreysA[(i + j + 1) % lineGreysA.length];
          return (
            <line
              key={`a-${i}-${j}`}
              x1={xs[0]} y1={y1} x2={xs[1]} y2={y2}
              strokeWidth="0.6" stroke={base} opacity="0.5"
            >
              <animate
                attributeName="stroke"
                values={`${base};${alt};${base}`}
                dur={`${5 + ((i + j) % 3)}s`}
                begin={`${((i + j) % 5) * 0.4}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.2;0.6;0.2"
                dur={`${4 + ((i + j) % 3)}s`}
                begin={`${((i + j) % 5) * 0.4}s`}
                repeatCount="indefinite"
              />
            </line>
          );
        })
      )}
      {layers[1].flatMap((y1, i) =>
        layers[2].map((y2, j) => {
          const base = lineGreysB[(i + j) % lineGreysB.length];
          const alt = lineGreysB[(i + j + 2) % lineGreysB.length];
          return (
            <line
              key={`b-${i}-${j}`}
              x1={xs[1]} y1={y1} x2={xs[2]} y2={y2}
              strokeWidth="0.6" stroke={base} opacity="0.5"
            >
              <animate
                attributeName="stroke"
                values={`${base};${alt};${base}`}
                dur={`${5 + ((i + j) % 3)}s`}
                begin={`${((i + j) % 5) * 0.4 + 1}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.2;0.6;0.2"
                dur={`${4 + ((i + j) % 3)}s`}
                begin={`${((i + j) % 5) * 0.4 + 1}s`}
                repeatCount="indefinite"
              />
            </line>
          );
        })
      )}
      {layers.map((layer, li) =>
        layer.map((y, i) => {
          const base = nodeGreys[li];
          const alt = li === 1 ? G.l2 : li === 0 ? G.d1 : G.l1;
          return (
            <circle
              key={`n-${li}-${i}`}
              cx={xs[li]} cy={y}
              r={li === 1 ? 7 : 5.5}
              fill={base}
              opacity={li === 1 ? 0.95 : 0.75}
            >
              <animate
                attributeName="fill"
                values={`${base};${alt};${base}`}
                dur={`${3.4 + (i % 3) * 0.4}s`}
                begin={`${(li * 0.3 + i * 0.25) % 2.5}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values={li === 1 ? '7;9.5;7' : '5.5;7;5.5'}
                dur={`${2.6 + (i % 3) * 0.4}s`}
                begin={`${(li * 0.3 + i * 0.25) % 2.5}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values={li === 1 ? '0.6;1;0.6' : '0.45;0.85;0.45'}
                dur={`${2.6 + (i % 3) * 0.4}s`}
                begin={`${(li * 0.3 + i * 0.25) % 2.5}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })
      )}
    </svg>
  );
}

function BigDataBackdrop() {
  const flows = [
    { d: 'M 30 280 Q 180 230 320 280 T 620 270', op: 0.7, dur: '6s', a: G.l2, b: G.l1 },
    { d: 'M 30 340 Q 180 380 320 330 T 620 350', op: 0.55, dur: '7s', a: G.m1, b: G.l2 },
    { d: 'M 30 390 Q 180 340 320 380 T 620 400', op: 0.4, dur: '8s', a: G.m2, b: G.m1 },
  ];
  // Three databases each in a different grey shade.
  const dbs = [
    { cx: 140, cy: 80, c: G.m2, alt: G.m1 },
    { cx: 340, cy: 110, c: G.l1, alt: G.l2 },
    { cx: 530, cy: 90, c: G.m1, alt: G.l2 },
  ];
  return (
    <svg
      viewBox="0 0 640 420"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full opacity-[0.26]"
      fill="none"
      aria-hidden
    >
      {dbs.map((db, idx) => (
        <g key={idx} transform={`translate(${db.cx}, ${db.cy})`}>
          <ellipse cx="0" cy="0" rx="56" ry="14" strokeWidth="1.6" stroke={db.c}>
            <animate
              attributeName="stroke"
              values={`${db.c};${db.alt};${db.c}`}
              dur="6s"
              begin={`${idx * 0.6}s`}
              repeatCount="indefinite"
            />
          </ellipse>
          <path d="M -56 0 L -56 110 A 56 14 0 0 0 56 110 L 56 0" strokeWidth="1.6" stroke={db.c}>
            <animate
              attributeName="stroke"
              values={`${db.c};${db.alt};${db.c}`}
              dur="6s"
              begin={`${idx * 0.6}s`}
              repeatCount="indefinite"
            />
          </path>
          <ellipse cx="0" cy="36" rx="56" ry="14" strokeWidth="1" stroke={db.alt} opacity="0.55">
            <animate attributeName="opacity" values="0.25;0.7;0.25" dur="3s" begin={`${idx * 0.5}s`} repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="0" cy="72" rx="56" ry="14" strokeWidth="1" stroke={db.alt} opacity="0.55">
            <animate attributeName="opacity" values="0.25;0.7;0.25" dur="3s" begin={`${idx * 0.5 + 0.7}s`} repeatCount="indefinite" />
          </ellipse>
        </g>
      ))}
      {flows.map((f, i) => (
        <path key={i} d={f.d} strokeWidth="1.2" stroke={f.a} strokeDasharray="6 6" opacity={f.op}>
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-24"
            dur={f.dur}
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke"
            values={`${f.a};${f.b};${f.a}`}
            dur={`${parseFloat(f.dur) + 2}s`}
            repeatCount="indefinite"
          />
        </path>
      ))}
      {[
        { x: 60, c: G.m2, alt: G.l1 },
        { x: 180, c: G.l2, alt: G.m1 },
        { x: 300, c: G.l1, alt: G.m2 },
        { x: 420, c: G.m1, alt: G.l2 },
        { x: 540, c: G.l2, alt: G.l1 },
      ].map((d, i) => (
        <rect key={i} x={d.x} y={300 + (i % 2) * 24} width="6" height="6" fill={d.c} opacity="0.7">
          <animate
            attributeName="fill"
            values={`${d.c};${d.alt};${d.c}`}
            dur={`${3 + (i % 3) * 0.5}s`}
            begin={`${i * 0.3}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.25;0.85;0.25"
            dur="2.5s"
            begin={`${i * 0.3}s`}
            repeatCount="indefinite"
          />
        </rect>
      ))}
    </svg>
  );
}

function WebMobileBackdrop() {
  // Each code line has its own grey level + alt for animation.
  const codeLines = [
    { x1: 110, y1: 135, x2: 220, y2: 135, op: 0.55, c: G.l1, alt: G.l2 },
    { x1: 110, y1: 158, x2: 290, y2: 158, op: 0.45, c: G.m1, alt: G.l2 },
    { x1: 130, y1: 181, x2: 240, y2: 181, op: 0.55, c: G.l2, alt: G.m1 },
    { x1: 110, y1: 204, x2: 200, y2: 204, op: 0.4, c: G.m2, alt: G.m1 },
    { x1: 110, y1: 227, x2: 320, y2: 227, op: 0.5, c: G.l1, alt: G.m1 },
  ];
  return (
    <svg
      viewBox="0 0 640 420"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full opacity-[0.26]"
      fill="none"
      aria-hidden
    >
      {/* Browser frame — light grey */}
      <rect x="80" y="60" width="380" height="250" rx="14" strokeWidth="2" stroke={G.l2} />
      <line x1="80" y1="100" x2="460" y2="100" strokeWidth="1.5" stroke={G.l2} />
      <circle cx="105" cy="80" r="4.5" fill={G.m2} opacity="0.7" />
      <circle cx="125" cy="80" r="4.5" fill={G.m1} opacity="0.7" />
      <circle cx="145" cy="80" r="4.5" fill={G.l2} opacity="0.7" />
      {codeLines.map((l, i) => (
        <line
          key={i}
          x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          strokeWidth="3" strokeLinecap="round" stroke={l.c} opacity={l.op}
        >
          <animate
            attributeName="stroke"
            values={`${l.c};${l.alt};${l.c}`}
            dur={`${4.5 + (i % 3) * 0.6}s`}
            begin={`${i * 0.5}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values={`${l.op};0.15;${l.op}`}
            dur={`${3.5 + (i % 3) * 0.6}s`}
            begin={`${i * 0.45}s`}
            repeatCount="indefinite"
          />
        </line>
      ))}
      {/* Phone frame — darker grey */}
      <rect x="400" y="140" width="130" height="240" rx="20" strokeWidth="2" stroke={G.m2} fill="var(--bg-surface)" />
      <line x1="400" y1="180" x2="530" y2="180" strokeWidth="1" stroke={G.m1} />
      <line x1="400" y1="350" x2="530" y2="350" strokeWidth="1" stroke={G.m1} />
      <circle cx="465" cy="365" r="5" strokeWidth="1.5" stroke={G.m1} />
      {[
        { x: 420, y: 210, w: 90, op: 0.55, c: G.l1, alt: G.m1 },
        { x: 420, y: 230, w: 70, op: 0.4, c: G.l2, alt: G.m2 },
        { x: 420, y: 250, w: 80, op: 0.5, c: G.l1, alt: G.l2 },
      ].map((l, i) => (
        <line
          key={`m-${i}`}
          x1={l.x} y1={l.y} x2={l.x + l.w} y2={l.y}
          strokeWidth="2.5" strokeLinecap="round" stroke={l.c} opacity={l.op}
        >
          <animate
            attributeName="stroke"
            values={`${l.c};${l.alt};${l.c}`}
            dur={`${4 + i * 0.4}s`}
            begin={`${1.2 + i * 0.4}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values={`${l.op};0.15;${l.op}`}
            dur={`${3 + i * 0.4}s`}
            begin={`${1 + i * 0.4}s`}
            repeatCount="indefinite"
          />
        </line>
      ))}
      <text x="30" y="380" fontSize="32" fontFamily="monospace" fill={G.l1} opacity="0.55">{'</>'}</text>
    </svg>
  );
}

function IoTBackdrop() {
  // Each device has its own grey + alt for transition.
  const devices: Array<{ p: [number, number]; c: string; alt: string }> = [
    { p: [120, 90], c: G.l1, alt: G.l2 },
    { p: [510, 100], c: G.m1, alt: G.l2 },
    { p: [90, 320], c: G.l2, alt: G.m1 },
    { p: [540, 320], c: G.m2, alt: G.m1 },
    { p: [320, 50], c: G.l1, alt: G.m1 },
    { p: [320, 380], c: G.m1, alt: G.l1 },
    { p: [40, 210], c: G.l2, alt: G.l1 },
    { p: [600, 210], c: G.m2, alt: G.l2 },
  ];
  return (
    <svg
      viewBox="0 0 640 420"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full opacity-[0.28]"
      fill="none"
      aria-hidden
    >
      {/* Radio pulse waves, each cycling between greys */}
      {[
        { delay: 0, c: G.l1, alt: G.l2 },
        { delay: 1.5, c: G.l2, alt: G.m1 },
        { delay: 3, c: G.m1, alt: G.l2 },
      ].map((p, i) => (
        <circle key={`pulse-${i}`} cx="320" cy="210" r="20" strokeWidth="1.2" stroke={p.c} opacity="0">
          <animate attributeName="r" values="20;200" dur="4.5s" begin={`${p.delay}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0" dur="4.5s" begin={`${p.delay}s`} repeatCount="indefinite" />
          <animate
            attributeName="stroke"
            values={`${p.c};${p.alt};${p.c}`}
            dur="4.5s"
            begin={`${p.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      {/* Orbit rings — three grey levels */}
      <circle cx="320" cy="210" r="60" strokeWidth="1" stroke={G.l1} strokeDasharray="3 5" opacity="0.55" />
      <circle cx="320" cy="210" r="110" strokeWidth="1" stroke={G.m1} strokeDasharray="3 5" opacity="0.45" />
      <circle cx="320" cy="210" r="170" strokeWidth="1" stroke={G.m2} strokeDasharray="3 5" opacity="0.3">
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 320 210"
          to="360 320 210"
          dur="60s"
          repeatCount="indefinite"
        />
      </circle>
      {/* Connection lines — cycle through greys */}
      {devices.map((d, i) => (
        <line key={`l-${i}`} x1="320" y1="210" x2={d.p[0]} y2={d.p[1]} strokeWidth="0.6" stroke={d.c} opacity="0.5">
          <animate
            attributeName="stroke"
            values={`${d.c};${d.alt};${d.c}`}
            dur={`${4 + (i % 3)}s`}
            begin={`${i * 0.35}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.2;0.7;0.2"
            dur="3.2s"
            begin={`${i * 0.35}s`}
            repeatCount="indefinite"
          />
        </line>
      ))}
      {/* Central hub — brightest grey */}
      <circle cx="320" cy="210" r="26" strokeWidth="2" stroke={G.l1} fill={G.l1} fillOpacity="0.2" />
      <circle cx="320" cy="210" r="6" fill={G.l1}>
        <animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite" />
        <animate attributeName="fill" values={`${G.l1};${G.l2};${G.l1}`} dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Device boxes — each its own grey, cycling */}
      {devices.map((d, i) => (
        <rect
          key={`d-${i}`}
          x={d.p[0] - 9} y={d.p[1] - 9}
          width="18" height="18" rx="3"
          strokeWidth="1.4" stroke={d.c}
          fill={d.c} fillOpacity="0.3"
        >
          <animate
            attributeName="fill"
            values={`${d.c};${d.alt};${d.c}`}
            dur={`${3.6 + (i % 3) * 0.3}s`}
            begin={`${i * 0.35}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            values="0.1;0.5;0.1"
            dur="2.8s"
            begin={`${i * 0.35}s`}
            repeatCount="indefinite"
          />
        </rect>
      ))}
    </svg>
  );
}

const backdropMap: Record<string, React.FC> = {
  'IA': AIBackdrop,
  'Big Data': BigDataBackdrop,
  'Web/Mobile': WebMobileBackdrop,
  'IoT': IoTBackdrop,
};
