import { useState, useCallback, useRef } from 'react';
import Home     from './screens/Home';
import Dossier  from './screens/Dossier';
import Search   from './screens/Search';
import AddEdit  from './screens/AddEdit';
import Scanner  from './screens/Scanner';
import { useStore } from './store';
import { useLang } from './i18n';
import { TW, Paw, Stamp, INK, INK2, RED, BLUE, PAPER, PAPER_DARK } from './components/ui';

// ── Settings / backup modal ──────────────────────────────────────────────────
function SettingsModal({ onClose }) {
  const { cats, exportData, importData } = useStore();
  const { lang, setLang, T } = useLang();
  const importRef = useRef(null);
  const [msg, setMsg] = useState('');

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const count = await importData(file);
      setMsg(T.importSuccess(count));
    } catch {
      setMsg(T.importError);
    }
    e.target.value = '';
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(26,22,20,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 90,
    }}>
      <div style={{
        background: PAPER,
        border: `2.5px solid ${INK}`,
        padding: 24,
        width: 380,
        boxShadow: '6px 8px 0 rgba(0,0,0,0.3)',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <TW size={16} bold>{T.settings}</TW>
          <button
            className="tappable"
            onClick={onClose}
            style={{ fontFamily: '"Special Elite", monospace', fontSize: 14 }}
          >✕</button>
        </div>

        <div style={{ borderTop: `1px dashed ${INK2}`, paddingTop: 14 }}>
          <TW size={11} bold style={{ display: 'block', marginBottom: 8 }}>{T.backupRestore}</TW>
          <TW size={10} color={INK2} style={{ display: 'block', marginBottom: 12 }}>
            {T.suspectsOnFile(cats.length)}
          </TW>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="tappable"
              onClick={() => { exportData(); setMsg(T.backupSaved); }}
              style={{
                flex: 1, padding: '10px 0',
                border: `2px solid ${INK}`,
                fontFamily: '"Special Elite", monospace',
                fontSize: 12, letterSpacing: 1,
              }}
            >{T.exportJson}</button>

            <button
              className="tappable"
              onClick={() => importRef.current?.click()}
              style={{
                flex: 1, padding: '10px 0',
                border: `2px solid ${INK}`,
                fontFamily: '"Special Elite", monospace',
                fontSize: 12, letterSpacing: 1,
              }}
            >{T.importJson}</button>
            <input ref={importRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </div>

          {msg && (
            <div style={{ marginTop: 10 }}>
              <TW size={11} color={msg.startsWith('✓') ? BLUE : RED}>{msg}</TW>
            </div>
          )}
        </div>

        <div style={{ borderTop: `1px dashed ${INK2}`, marginTop: 18, paddingTop: 14 }}>
          <TW size={11} bold style={{ display: 'block', marginBottom: 8 }}>{T.language}</TW>
          <div style={{ display: 'flex', gap: 8 }}>
            {['en', 'cs'].map(l => (
              <button
                key={l}
                className="tappable"
                onClick={() => setLang(l)}
                style={{
                  padding: '6px 14px',
                  border: `2px solid ${lang === l ? INK : INK2}`,
                  background: lang === l ? INK : 'transparent',
                  color: lang === l ? PAPER : INK2,
                  fontFamily: '"Special Elite", monospace',
                  fontSize: 12, letterSpacing: 1,
                }}
              >{l.toUpperCase()}</button>
            ))}
          </div>
        </div>

        <div style={{ borderTop: `1px dashed ${INK2}`, marginTop: 18, paddingTop: 14 }}>
          <TW size={10} color={INK2} style={{ letterSpacing: 0.5 }}>
            {T.appName}<br />
            {T.appStorageNote}<br />
            {T.appBackupNote}
          </TW>
        </div>
      </div>
    </div>
  );
}

// ── App root — state-machine routing ────────────────────────────────────────
export default function App() {
  const { cats, updateCat } = useStore();

  const [screen, setScreen] = useState('home');
  const [catId,  setCatId]  = useState(null);
  const [scanner, setScanner] = useState(null); // { catId, catName } or null
  const [showSettings, setShowSettings] = useState(false);

  const goHome    = useCallback(() => { setScreen('home');   setCatId(null); }, []);
  const goDossier = useCallback((id) => { setScreen('dossier'); setCatId(id); }, []);
  const goEdit    = useCallback((id) => { setScreen('edit');    setCatId(id); }, []);
  const goAdd     = useCallback(()   => { setScreen('add');     setCatId(null); }, []);
  const goSearch  = useCallback(()   => setScreen('search'), []);

  const handleCapture = useCallback((id) => {
    const cat = cats.find(c => c.id === id);
    setScanner({ catId: id, catName: cat?.name ?? '' });
  }, [cats]);

  const handleScannerComplete = useCallback(() => {
    if (scanner?.catId) {
      updateCat(scanner.catId, { status: 'CAPTURED' });
    }
    setScanner(null);
  }, [scanner, updateCat]);

  const handleSaveAddEdit = useCallback((id) => {
    goDossier(id);
  }, [goDossier]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Screen router */}
      {screen === 'home' && (
        <Home
          onSelectCat={goDossier}
          onAddNew={goAdd}
          onSearch={goSearch}
          onSettings={() => setShowSettings(true)}
        />
      )}
      {screen === 'dossier' && catId && (
        <Dossier
          catId={catId}
          onBack={goHome}
          onEdit={goEdit}
          onCapture={handleCapture}
        />
      )}
      {screen === 'search' && (
        <Search
          onSelectCat={(id) => { setCatId(id); setScreen('dossier'); }}
          onBack={goHome}
        />
      )}
      {(screen === 'add' || screen === 'edit') && (
        <AddEdit
          catId={screen === 'edit' ? catId : null}
          onSave={handleSaveAddEdit}
          onCancel={screen === 'edit' ? () => goDossier(catId) : goHome}
          onDelete={goHome}
        />
      )}

      {/* Paw scanner overlay */}
      {scanner && (
        <Scanner
          catName={scanner.catName}
          onComplete={handleScannerComplete}
        />
      )}

      {/* Settings modal */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
