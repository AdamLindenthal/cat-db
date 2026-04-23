import { useState, useMemo } from 'react';
import { TW, DangerPaws, Mugshot, StatusBadge, WLine, INK, INK2, RED, PAPER, PAPER_DARK } from '../components/ui';
import { useStore } from '../store';
import { useLang, statusLabel } from '../i18n';

const ALL_STATUSES = ['AT LARGE', 'CAPTURED', 'MOST WANTED', 'UNDER WATCH'];

function areaMatch(location, areaKey) {
  return location.toLowerCase().includes(areaKey.toLowerCase());
}

export default function Search({ onSelectCat, onBack }) {
  const { cats } = useStore();
  const { T } = useLang();
  const [query, setQuery] = useState('');
  const [selectedThreats, setSelectedThreats] = useState(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState(new Set());
  const [selectedAreas, setSelectedAreas] = useState(new Set());

  const toggleSet = (setter, val) => {
    setter(prev => {
      const next = new Set(prev);
      next.has(val) ? next.delete(val) : next.add(val);
      return next;
    });
  };

  const results = useMemo(() => {
    return cats.filter(cat => {
      const q = query.toLowerCase();
      if (q && !cat.name.toLowerCase().includes(q)
            && !cat.alias.toLowerCase().includes(q)
            && !cat.crime.toLowerCase().includes(q)) return false;
      if (selectedThreats.size > 0 && !selectedThreats.has(cat.threat)) return false;
      if (selectedStatuses.size > 0 && !selectedStatuses.has(cat.status)) return false;
      if (selectedAreas.size > 0) {
        const matches = [...selectedAreas].some(key => areaMatch(cat.location, key));
        if (!matches) return false;
      }
      return true;
    });
  }, [cats, query, selectedThreats, selectedStatuses, selectedAreas]);

  const clearFilters = () => {
    setQuery('');
    setSelectedThreats(new Set());
    setSelectedStatuses(new Set());
    setSelectedAreas(new Set());
  };

  const hasFilters = query || selectedThreats.size || selectedStatuses.size || selectedAreas.size;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        padding: '0 14px', height: 48,
        borderBottom: `2px solid ${INK}`,
        background: PAPER_DARK,
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button
          className="tappable"
          onClick={onBack}
          style={{ fontFamily: '"Special Elite", monospace', fontSize: 13, color: INK }}
        >{T.back}</button>
        <TW size={15} bold>{T.findSuspect}</TW>
        <div style={{ flex: 1 }} />
        <TW size={10} color={INK2}>{T.filesCount(results.length, cats.length)}</TW>
        {hasFilters && (
          <button
            className="tappable"
            onClick={clearFilters}
            style={{
              padding: '5px 10px', border: `1.5px solid ${INK2}`,
              fontFamily: '"Special Elite", monospace', fontSize: 10, color: INK2,
            }}
          >{T.clearAll}</button>
        )}
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left filter rail */}
        <div className="scrollable" style={{
          width: 200, flexShrink: 0,
          borderRight: `2px dashed ${INK2}`,
          padding: '12px 14px',
          background: 'rgba(230,220,192,0.4)',
        }}>
          <TW size={11} bold>{T.byThreat}</TW>
          <div style={{ marginTop: 8 }}>
            {[5, 4, 3, 2, 1].map(n => (
              <div
                key={n}
                className="tappable"
                onClick={() => toggleSet(setSelectedThreats, n)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 4px', cursor: 'pointer',
                  background: selectedThreats.has(n) ? 'rgba(184,53,46,0.1)' : 'transparent',
                }}
              >
                <div style={{
                  width: 14, height: 14, flexShrink: 0,
                  border: `1.5px solid ${INK}`,
                  background: selectedThreats.has(n) ? INK : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {selectedThreats.has(n) && <span style={{ color: PAPER, fontSize: 10 }}>✓</span>}
                </div>
                <DangerPaws rating={n} size={11} />
              </div>
            ))}
          </div>

          <WLine w={172} dashed style={{ margin: '12px 0' }} />

          <TW size={11} bold>{T.byStatus}</TW>
          <div style={{ marginTop: 6 }}>
            {ALL_STATUSES.map(s => (
              <div
                key={s}
                className="tappable"
                onClick={() => toggleSet(setSelectedStatuses, s)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 4px', cursor: 'pointer',
                  background: selectedStatuses.has(s) ? 'rgba(184,53,46,0.1)' : 'transparent',
                }}
              >
                <div style={{
                  width: 14, height: 14, flexShrink: 0,
                  border: `1.5px solid ${INK}`,
                  background: selectedStatuses.has(s) ? INK : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {selectedStatuses.has(s) && <span style={{ color: PAPER, fontSize: 10 }}>✓</span>}
                </div>
                <TW size={10}>{statusLabel(s, T)}</TW>
              </div>
            ))}
          </div>

          <WLine w={172} dashed style={{ margin: '12px 0' }} />

          <TW size={11} bold>{T.byArea}</TW>
          <div style={{ marginTop: 6 }}>
            {T.areas.map(({ key, label }) => (
              <div
                key={key}
                className="tappable"
                onClick={() => toggleSet(setSelectedAreas, key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 4px', cursor: 'pointer',
                  background: selectedAreas.has(key) ? 'rgba(184,53,46,0.1)' : 'transparent',
                }}
              >
                <div style={{
                  width: 14, height: 14, flexShrink: 0,
                  border: `1.5px solid ${INK}`,
                  background: selectedAreas.has(key) ? INK : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {selectedAreas.has(key) && <span style={{ color: PAPER, fontSize: 10 }}>✓</span>}
                </div>
                <TW size={10}>{label}</TW>
              </div>
            ))}
          </div>
        </div>

        {/* Results area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Search input */}
          <div style={{
            padding: '10px 14px',
            borderBottom: `1px solid rgba(0,0,0,0.15)`,
            flexShrink: 0,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              border: `2px solid ${INK}`,
              background: 'rgba(255,255,255,0.6)',
              padding: '6px 12px',
            }}>
              <TW size={14}>⌕</TW>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={T.searchPlaceholder}
                autoFocus
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  fontSize: 13, outline: 'none', letterSpacing: 0.3,
                }}
              />
              {query && (
                <button onClick={() => setQuery('')} style={{ color: INK2, fontSize: 14 }}>✕</button>
              )}
            </div>
          </div>

          {/* Results grid */}
          <div className="scrollable paper-bg" style={{ flex: 1, padding: 14 }}>
            {results.length === 0 ? (
              <div style={{ textAlign: 'center', paddingTop: 60 }}>
                <TW size={13} color={INK2}>{T.noMatchingFiles}</TW>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 12,
              }}>
                {results.map(cat => (
                  <div
                    key={cat.id}
                    className="tappable"
                    onClick={() => onSelectCat(cat.id)}
                    style={{
                      background: PAPER,
                      border: `1.5px solid ${INK2}`,
                      padding: 10,
                      cursor: 'pointer',
                      display: 'flex', gap: 10,
                    }}
                  >
                    <Mugshot
                      photo={cat.photo}
                      w={70} h={80}
                      captured={cat.status === 'CAPTURED'}
                      tilt={0}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TW size={12} bold>{cat.name}</TW>
                      <div><TW size={10} color={RED}>"{cat.alias}"</TW></div>
                      <div style={{ marginTop: 4 }}>
                        <DangerPaws rating={cat.threat} size={10} />
                      </div>
                      <div style={{ marginTop: 4 }}>
                        <TW size={9} color={INK2}
                          style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {cat.crime}
                        </TW>
                      </div>
                      <div style={{ marginTop: 4 }}>
                        <StatusBadge status={cat.status} size={8} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
