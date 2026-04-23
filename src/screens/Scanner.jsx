import { useState, useEffect } from 'react';
import { Paw, Stamp, TW, INK, INK2, RED, PAPER } from '../components/ui';
import { useLang } from '../i18n';

export default function Scanner({ catName, onComplete }) {
  const { T } = useLang();
  const [phase, setPhase] = useState('scanning'); // 'scanning' | 'confirmed'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('confirmed'), 2500);
    const t2 = setTimeout(() => onComplete(), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(26,22,20,0.96)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 18, zIndex: 100,
    }}>
      {phase === 'scanning' ? (
        <>
          <TW size={20} bold color={PAPER} style={{ letterSpacing: 3 }}>
            {T.placeOnScanner}
          </TW>

          {/* Scanner circle */}
          <div style={{ position: 'relative', width: 240, height: 240 }}>
            {/* Outer ring */}
            <div className="scanner-ring" style={{
              position: 'absolute', inset: 0,
              border: `3px solid ${RED}`,
              borderRadius: '50%',
            }} />
            {/* Inner dashed ring */}
            <div style={{
              position: 'absolute', inset: 16,
              border: `1.5px dashed rgba(184,53,46,0.5)`,
              borderRadius: '50%',
            }} />
            {/* Corner brackets */}
            {[
              { top: 0, left: 0,   borderTop: `3px solid ${PAPER}`,   borderLeft:  `3px solid ${PAPER}` },
              { top: 0, right: 0,  borderTop: `3px solid ${PAPER}`,   borderRight: `3px solid ${PAPER}` },
              { bottom: 0, left: 0,  borderBottom: `3px solid ${PAPER}`, borderLeft:  `3px solid ${PAPER}` },
              { bottom: 0, right: 0, borderBottom: `3px solid ${PAPER}`, borderRight: `3px solid ${PAPER}` },
            ].map((s, i) => (
              <div key={i} style={{ position: 'absolute', width: 20, height: 20, ...s }} />
            ))}
            {/* Paw print */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Paw size={130} color={PAPER} style={{ opacity: 0.9 }} />
            </div>
            {/* Scan line */}
            <div className="scanline" style={{
              position: 'absolute', left: '8%', right: '8%', height: 2,
              background: RED,
              boxShadow: `0 0 10px ${RED}, 0 0 4px ${RED}`,
              opacity: 0.9,
            }} />
          </div>

          <TW size={13} color={RED} style={{ letterSpacing: 2 }}>{T.scanning}</TW>

          {/* Progress bar */}
          <div style={{
            width: 280, height: 12,
            border: `1.5px solid rgba(244,236,216,0.4)`,
            overflow: 'hidden',
          }}>
            <div className="fill-bar" style={{ height: '100%', background: RED }} />
          </div>

          <TW size={10} color="rgba(244,236,216,0.5)" style={{ letterSpacing: 1.5 }}>
            {T.holdStill}
          </TW>
        </>
      ) : (
        <div className="fade-in" style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 20,
        }}>
          <div>
            <Stamp text={T.caseClosed} color={RED} rotate={-6} size={36}
              style={{ padding: '10px 24px', borderWidth: 4 }} />
          </div>
          <TW size={22} bold color={PAPER} style={{ letterSpacing: 3 }}>
            {T.identityConfirmed}
          </TW>
          {catName && (
            <TW size={14} color="rgba(184,53,46,0.9)" style={{ letterSpacing: 2 }}>
              {T.capturedMsg(catName.toUpperCase())}
            </TW>
          )}
          <Paw size={60} color={RED} style={{ opacity: 0.7, marginTop: 8 }} />
          <TW size={11} color="rgba(244,236,216,0.5)" style={{ letterSpacing: 1.5 }}>
            {T.closingFile}
          </TW>
        </div>
      )}
    </div>
  );
}
