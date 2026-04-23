import { useState } from 'react';
import { Stamp, Paw, DangerPaws, TW, Mugshot, StatusBadge, simpleHash, INK, INK2, RED, BLUE, PAPER, PAPER_DARK } from '../components/ui';
import { useStore } from '../store';
import { useLang, statusLabel } from '../i18n';

// ── Layout constants for corkboard ──────────────────────────────────────────
const CORK_COLS     = 4;
const CARD_W        = 148;
const CARD_H        = 196;
const COL_SPACING   = 238;
const ROW_SPACING   = 218;
const BOARD_MARGIN_X = 18;
const BOARD_MARGIN_Y = 12;

function getCorkPos(idx, id) {
  const col = idx % CORK_COLS;
  const row = Math.floor(idx / CORK_COLS);
  const h = simpleHash(id);
  const dx  = (h % 22) - 11;
  const dy  = ((h >> 4) % 14) - 7;
  const rot = ((h >> 8) % 10) - 5;
  const pinColor = h % 3 === 0 ? RED : h % 3 === 1 ? BLUE : '#4a7c2f';
  return {
    x: BOARD_MARGIN_X + col * COL_SPACING + dx,
    y: BOARD_MARGIN_Y + row * ROW_SPACING + dy,
    cx: BOARD_MARGIN_X + col * COL_SPACING + dx + CARD_W / 2,
    cy: BOARD_MARGIN_Y + row * ROW_SPACING + dy + CARD_H / 2,
    rot, pinColor,
  };
}

// ── Corkboard view ───────────────────────────────────────────────────────────
function CorkboardView({ cats, onSelectCat, showConnections }) {
  const { T } = useLang();
  const rows = Math.ceil(cats.length / CORK_COLS);
  const boardH = BOARD_MARGIN_Y + rows * ROW_SPACING + 30;

  const connections = [];
  const seen = new Set();
  cats.forEach((cat, i) => {
    const pos = getCorkPos(i, cat.id);
    (cat.associates || []).forEach(assocId => {
      const key = [cat.id, assocId].sort().join('~');
      if (seen.has(key)) return;
      seen.add(key);
      const ai = cats.findIndex(c => c.id === assocId);
      if (ai === -1) return;
      const apos = getCorkPos(ai, assocId);
      connections.push({ x1: pos.cx, y1: pos.cy + 30, x2: apos.cx, y2: apos.cy + 30 });
    });
  });

  return (
    <div className="cork-bg scrollable" style={{ flex: 1, position: 'relative', minHeight: boardH }}>
      {/* SVG string layer */}
      {showConnections && (
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: boardH, pointerEvents: 'none', zIndex: 1 }}
          viewBox={`0 0 1024 ${boardH}`} preserveAspectRatio="none"
        >
          {connections.map((c, i) => (
            <line key={i} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke={RED} strokeWidth="1.5" opacity="0.65"
              strokeDasharray="none"
            />
          ))}
        </svg>
      )}

      {/* Cat cards */}
      <div style={{ position: 'relative', height: boardH, zIndex: 2 }}>
        {cats.map((cat, i) => {
          const { x, y, rot, pinColor } = getCorkPos(i, cat.id);
          return (
            <div
              key={cat.id}
              className="tappable"
              onClick={() => onSelectCat(cat.id)}
              style={{
                position: 'absolute',
                left: x, top: y,
                width: CARD_W,
                cursor: 'pointer',
                transform: `rotate(${rot}deg)`,
                zIndex: 3,
              }}
            >
              {/* Pushpin */}
              <div style={{
                position: 'absolute', left: '50%', top: -6,
                transform: 'translateX(-50%)',
                width: 12, height: 12, borderRadius: '50%',
                background: pinColor,
                boxShadow: `0 2px 4px rgba(0,0,0,0.4), inset -2px -2px 3px rgba(0,0,0,0.3)`,
                zIndex: 5,
              }} />

              {/* Card body */}
              <div style={{
                background: PAPER,
                padding: '10px 8px 8px',
                boxShadow: '2px 4px 8px rgba(0,0,0,0.28)',
                textAlign: 'center',
              }}>
                <Mugshot
                  photo={cat.photo}
                  w={CARD_W - 16} h={Math.round((CARD_W - 16) * 1.1)}
                  captured={cat.status === 'CAPTURED'}
                  tilt={0}
                />
                <div style={{ marginTop: 5 }}>
                  <TW size={11} bold>{cat.name.toUpperCase()}</TW>
                </div>
                <div style={{ marginTop: 2 }}>
                  <TW size={9} color={RED}>"{cat.alias}"</TW>
                </div>
                <div style={{ marginTop: 4 }}>
                  <DangerPaws rating={cat.threat} size={10} />
                </div>
                {cat.status === 'MOST WANTED' && (
                  <div style={{ marginTop: 4 }}>
                    <Stamp text={T.statusMostWanted} rotate={-4} size={8} style={{ padding: '2px 6px' }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── List view ────────────────────────────────────────────────────────────────
function ListView({ cats, onSelectCat }) {
  const { T } = useLang();
  return (
    <div className="paper-bg scrollable" style={{ flex: 1 }}>
      {/* Column headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '46px 100px 1.4fr 1.5fr 70px 1fr 110px',
        padding: '6px 14px',
        borderBottom: `2px solid ${INK}`,
        background: PAPER_DARK,
        gap: 8, alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <TW size={8} bold>{T.colFile}</TW>
        <TW size={8} bold>{T.colMugshot}</TW>
        <TW size={8} bold>{T.colNameAlias}</TW>
        <TW size={8} bold>{T.colCharges}</TW>
        <TW size={8} bold>{T.colThreat}</TW>
        <TW size={8} bold>{T.colLastSeen}</TW>
        <TW size={8} bold>{T.colStatus}</TW>
      </div>

      {cats.map((cat, i) => (
        <div
          key={cat.id}
          className="tappable"
          onClick={() => onSelectCat(cat.id)}
          style={{
            display: 'grid',
            gridTemplateColumns: '46px 100px 1.4fr 1.5fr 70px 1fr 110px',
            padding: '6px 14px',
            borderBottom: `1px dashed rgba(0,0,0,0.18)`,
            alignItems: 'center',
            gap: 8,
            background: i % 2 === 0 ? 'transparent' : 'rgba(139,115,85,0.05)',
            cursor: 'pointer',
          }}
        >
          <TW size={10} color={INK2}>#{String(i + 1).padStart(4, '0')}</TW>
          <Mugshot
            photo={cat.photo}
            w={72} h={80}
            captured={cat.status === 'CAPTURED'}
            tilt={0}
          />
          <div>
            <TW size={12} bold>{cat.name}</TW>
            <div><TW size={10} color={RED}>"{cat.alias}"</TW></div>
          </div>
          <TW size={10} color={INK2} style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {cat.crime}
          </TW>
          <DangerPaws rating={cat.threat} size={11} />
          <TW size={10} color={INK2} style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {cat.location}
          </TW>
          <StatusBadge status={cat.status} />
        </div>
      ))}
    </div>
  );
}

// ── Home screen ──────────────────────────────────────────────────────────────
export default function Home({ onSelectCat, onAddNew, onSearch, onSettings }) {
  const { cats } = useStore();
  const { T } = useLang();
  const [view, setView] = useState('cork'); // 'cork' | 'list'
  const [showConnections, setShowConnections] = useState(true);

  const atLarge  = cats.filter(c => c.status !== 'CAPTURED').length;
  const captured = cats.filter(c => c.status === 'CAPTURED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        padding: '0 14px',
        borderBottom: `2.5px solid ${INK}`,
        background: PAPER_DARK,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: 52,
      }}>
        <Paw size={24} color={INK} />
        <TW size={18} bold style={{ letterSpacing: 2 }}>{T.caseBoard}</TW>
        <TW size={10} color={INK2} style={{ marginLeft: 4 }}>
          {T.atLargeCount(atLarge)} · {T.capturedCount(captured)}
        </TW>

        <div style={{ flex: 1 }} />

        {/* View toggle */}
        <div style={{ display: 'flex', border: `2px solid ${INK}` }}>
          <button
            onClick={() => setView('cork')}
            style={{
              padding: '6px 12px',
              background: view === 'cork' ? INK : 'transparent',
              color: view === 'cork' ? PAPER : INK,
              fontFamily: '"Special Elite", monospace',
              fontSize: 11,
              letterSpacing: 1,
              borderRight: `1px solid ${INK}`,
            }}
          >{T.viewBoard}</button>
          <button
            onClick={() => setView('list')}
            style={{
              padding: '6px 12px',
              background: view === 'list' ? INK : 'transparent',
              color: view === 'list' ? PAPER : INK,
              fontFamily: '"Special Elite", monospace',
              fontSize: 11,
              letterSpacing: 1,
            }}
          >{T.viewList}</button>
        </div>

        {/* Connections toggle — only shown in board view */}
        {view === 'cork' && cats.length > 0 && (
          <button
            className="tappable"
            onClick={() => setShowConnections(v => !v)}
            style={{
              padding: '6px 10px',
              border: `2px solid ${showConnections ? RED : INK2}`,
              background: showConnections ? 'rgba(184,53,46,0.1)' : 'transparent',
              color: showConnections ? RED : INK2,
              fontFamily: '"Special Elite", monospace',
              fontSize: 11,
              letterSpacing: 1,
            }}
            title={T.showStrings}
          >{T.showStrings}</button>
        )}

        {/* Action buttons */}
        <button
          className="tappable"
          onClick={onSearch}
          style={{
            padding: '7px 14px',
            border: `2px solid ${INK}`,
            background: 'transparent',
            fontFamily: '"Special Elite", monospace',
            fontSize: 12,
            letterSpacing: 1,
          }}
        >{T.searchBtn}</button>

        <button
          className="tappable"
          onClick={onAddNew}
          style={{
            padding: '7px 14px',
            border: `2px solid ${RED}`,
            background: 'rgba(184,53,46,0.08)',
            color: RED,
            fontFamily: '"Special Elite", monospace',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >{T.newFile}</button>

        <button
          className="tappable"
          onClick={onSettings}
          style={{
            padding: '7px 10px',
            border: `2px solid ${INK2}`,
            background: 'transparent',
            fontFamily: '"Special Elite", monospace',
            fontSize: 13,
            color: INK2,
          }}
          title={T.settingsTitle}
        >⚙</button>
      </div>

      {/* Content */}
      {cats.length === 0 ? (
        <div className="paper-bg" style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 14,
        }}>
          <Paw size={60} color={PAPER_DARK} />
          <TW size={16} color={INK2}>{T.noSuspects}</TW>
          <button
            className="tappable"
            onClick={onAddNew}
            style={{
              padding: '10px 24px',
              border: `2px solid ${RED}`,
              color: RED,
              background: 'rgba(184,53,46,0.08)',
              fontFamily: '"Special Elite", monospace',
              fontSize: 14,
              letterSpacing: 1,
            }}
          >{T.addFirst}</button>
        </div>
      ) : view === 'cork' ? (
        <CorkboardView cats={cats} onSelectCat={onSelectCat} showConnections={showConnections} />
      ) : (
        <ListView cats={cats} onSelectCat={onSelectCat} />
      )}

      {/* Corkboard hint */}
      {view === 'cork' && cats.length > 0 && (
        <div style={{
          position: 'absolute', bottom: 8, left: 0, right: 0,
          textAlign: 'center', pointerEvents: 'none', zIndex: 20,
        }}>
          <TW size={9} color={INK2} style={{ opacity: 0.55, letterSpacing: 1 }}>
            {T.tapCard}
          </TW>
        </div>
      )}
    </div>
  );
}
