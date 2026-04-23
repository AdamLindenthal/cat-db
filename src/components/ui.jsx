// Shared UI primitives — spy/dossier aesthetic
import { useLang, statusLabel } from '../i18n';

export const INK   = '#1a1614';
export const INK2  = '#3a332c';
export const RED   = '#b8352e';
export const BLUE  = '#1e3a5f';
export const PAPER = '#f4ecd8';
export const PAPER_DARK = '#e6dcc0';

// Deterministic hash for layout pseudo-randomness
export function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h = h & h;
  }
  return Math.abs(h);
}

// Rubber stamp
export function Stamp({ text, color = RED, rotate = -8, size = 22, style, subtext }) {
  return (
    <div style={{
      display: 'inline-block',
      padding: '5px 12px',
      border: `3px solid ${color}`,
      color,
      fontFamily: '"Special Elite", "Courier Prime", monospace',
      fontSize: size,
      fontWeight: 700,
      letterSpacing: 2,
      transform: `rotate(${rotate}deg)`,
      textTransform: 'uppercase',
      opacity: 0.88,
      mixBlendMode: 'multiply',
      lineHeight: 1.1,
      textAlign: 'center',
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {text}
      {subtext && <div style={{ fontSize: size * 0.5, marginTop: 2, letterSpacing: 1 }}>{subtext}</div>}
    </div>
  );
}

// Paw print SVG
export function Paw({ size = 40, color = INK, style, rotate = 0 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40"
      style={{ transform: `rotate(${rotate}deg)`, display: 'inline-block', flexShrink: 0, ...style }}>
      <ellipse cx="20" cy="26" rx="9" ry="7" fill={color} />
      <ellipse cx="10" cy="15" rx="3.5" ry="5" fill={color} />
      <ellipse cx="17" cy="9"  rx="3"   ry="4.5" fill={color} />
      <ellipse cx="23" cy="9"  rx="3"   ry="4.5" fill={color} />
      <ellipse cx="30" cy="15" rx="3.5" ry="5" fill={color} />
    </svg>
  );
}

// Paw danger rating — optionally interactive
export function DangerPaws({ rating = 3, max = 5, size = 14, interactive = false, onChange, style }) {
  return (
    <div style={{ display: 'inline-flex', gap: 2, verticalAlign: 'middle', ...style }}>
      {Array.from({ length: max }).map((_, i) => (
        <Paw
          key={i}
          size={size}
          color={i < rating ? RED : PAPER_DARK}
          style={interactive ? { cursor: 'pointer' } : undefined}
          {...(interactive && onChange ? {
            onClick: (e) => { e.stopPropagation(); onChange(i + 1); }
          } : {})}
        />
      ))}
    </div>
  );
}

// Typewriter-style text
export function TW({ children, size = 12, bold = false, color = INK, style }) {
  return (
    <span style={{
      fontFamily: '"Special Elite", "Courier Prime", monospace',
      fontSize: size,
      fontWeight: bold ? 700 : 400,
      color,
      letterSpacing: 0.3,
      lineHeight: 1.3,
      ...style,
    }}>{children}</span>
  );
}

// Handwritten text
export function HW({ children, size = 14, color = BLUE, style }) {
  return (
    <span style={{
      fontFamily: '"Caveat", "Gochi Hand", cursive',
      fontSize: size,
      color,
      lineHeight: 1.3,
      ...style,
    }}>{children}</span>
  );
}

function NoPhotoPlaceholder() {
  const { T } = useLang();
  const lines = T.noPhoto.split('\n');
  return (
    <div style={{
      width: '100%', height: '100%',
      backgroundImage: `repeating-linear-gradient(135deg, rgba(0,0,0,0.07) 0 2px, transparent 2px 10px)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 9, color: INK2,
      fontFamily: '"Special Elite", monospace',
      textAlign: 'center',
      padding: 4,
    }}>
      {lines[0]}<br />{lines[1]}
    </div>
  );
}

// Mugshot — shows actual photo or a striped placeholder
export function Mugshot({ photo, name, w = 140, h = 160, tilt = 0, captured = false, style }) {
  return (
    <div style={{
      width: w,
      height: h + (name ? 22 : 0),
      position: 'relative',
      transform: `rotate(${tilt}deg)`,
      flexShrink: 0,
      ...style,
    }}>
      <div style={{
        width: w, height: h,
        border: `2px solid ${INK}`,
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box',
        background: PAPER_DARK,
      }}>
        {photo ? (
          <img
            src={photo}
            alt={name || 'suspect'}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <NoPhotoPlaceholder />
        )}
        {/* height chart */}
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 12,
          borderLeft: `1px solid rgba(58,51,44,0.4)`,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: '3px 1px', fontSize: 5, color: INK2, background: 'rgba(255,255,255,0.3)',
        }}>
          <span>24"</span><span>18"</span><span>12"</span><span>6"</span>
        </div>
        {captured && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.15)',
          }}>
            <div className="stamp-drop">
              <Stamp text="CAPTURED" rotate={-12} size={w > 100 ? 16 : 10} />
            </div>
          </div>
        )}
      </div>
      {name && (
        <div style={{
          fontFamily: '"Special Elite", monospace',
          fontSize: 10, textAlign: 'center', marginTop: 3,
          color: INK, letterSpacing: 1,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          width: w,
        }}>{name}</div>
      )}
    </div>
  );
}

// Masking tape strip
export function Tape({ w = 60, h = 22, rotate = -4, color = '#e8d9a8', style }) {
  return (
    <div style={{
      width: w, height: h,
      background: color,
      opacity: 0.78,
      transform: `rotate(${rotate}deg)`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      backgroundImage: `repeating-linear-gradient(90deg, transparent 0 8px, rgba(0,0,0,0.03) 8px 9px)`,
      flexShrink: 0,
      ...style,
    }} />
  );
}

// Paperclip SVG
export function Paperclip({ size = 40, rotate = -20, color = '#888', style }) {
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 20 32"
      style={{ transform: `rotate(${rotate}deg)`, display: 'block', ...style }}>
      <path
        d="M 6 4 Q 6 2, 10 2 Q 14 2, 14 6 L 14 22 Q 14 26, 10 26 Q 6 26, 6 22 L 6 8 Q 6 6, 8 6 Q 10 6, 10 8 L 10 20"
        stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"
      />
    </svg>
  );
}

// Wobbly SVG box — hand-drawn rectangle feel
export function WBox({ children, w, h, stroke = INK, strokeWidth = 1.8, fill = 'none', style, rotate = 0, wobble = 2 }) {
  const r = (seed) => {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return (x - Math.floor(x)) * wobble - wobble / 2;
  };
  const pts = [
    [r(1), r(2)], [w + r(3), r(4)],
    [w + r(5), h + r(6)], [r(7), h + r(8)],
  ];
  const d = `M ${pts[0][0]} ${pts[0][1]} L ${pts[1][0]} ${pts[1][1]} L ${pts[2][0]} ${pts[2][1]} L ${pts[3][0]} ${pts[3][1]} Z`;
  return (
    <div style={{ position: 'relative', width: w, height: h, display: 'inline-block', transform: `rotate(${rotate}deg)`, ...style }}>
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}>
        <path d={d} stroke={stroke} strokeWidth={strokeWidth} fill={fill} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div style={{ position: 'relative', width: w, height: h }}>{children}</div>
    </div>
  );
}

// Wobbly line
export function WLine({ w = 100, stroke = INK, strokeWidth = 1.5, dashed = false, style }) {
  const r = (s) => {
    const x = Math.sin(s * 9301 + 49297) * 233280;
    return (x - Math.floor(x)) * 1.5 - 0.75;
  };
  const n = Math.max(3, Math.floor(w / 30));
  let d = `M 0 ${r(0)}`;
  for (let i = 1; i <= n; i++) {
    d += ` L ${(w / n) * i} ${r(i)}`;
  }
  return (
    <svg width={w} height={4} style={{ display: 'block', overflow: 'visible', flexShrink: 0, ...style }}>
      <path d={d} stroke={stroke} strokeWidth={strokeWidth} fill="none"
        strokeDasharray={dashed ? '4,3' : undefined} strokeLinecap="round" />
    </svg>
  );
}

// Status badge
export function StatusBadge({ status, size = 9 }) {
  const { T } = useLang();
  const color = status === 'CAPTURED' ? BLUE
    : status === 'MOST WANTED' ? RED
    : status === 'UNDER WATCH' ? '#7a6200'
    : RED;
  return (
    <div style={{
      display: 'inline-block',
      padding: '2px 7px',
      border: `1.5px solid ${color}`,
      color,
      fontSize: size,
      fontFamily: '"Special Elite", monospace',
      letterSpacing: 0.5,
      whiteSpace: 'nowrap',
    }}>{statusLabel(status, T)}</div>
  );
}

// Resize an image File to max 400px and encode as base64 JPEG
export function resizePhoto(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 300;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.65));
    };
    img.src = url;
  });
}
