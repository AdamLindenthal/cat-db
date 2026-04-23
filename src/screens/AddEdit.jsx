import { useState, useRef } from 'react';
import { TW, HW, DangerPaws, Mugshot, Stamp, WLine, resizePhoto, INK, INK2, RED, BLUE, PAPER, PAPER_DARK } from '../components/ui';
import { useStore } from '../store';
import { useLang, statusLabel } from '../i18n';

const STATUSES = ['AT LARGE', 'UNDER WATCH', 'MOST WANTED', 'CAPTURED'];

function Field({ label, value, onChange, hint, multiline = false }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <TW size={10} bold style={{ display: 'block', marginBottom: 4 }}>{label}</TW>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={hint}
          rows={3}
          style={{
            width: '100%',
            border: `2px solid ${INK2}`,
            background: 'rgba(255,255,255,0.55)',
            padding: '8px 10px',
            fontSize: 13,
            resize: 'none',
            outline: 'none',
          }}
        />
      ) : (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={hint}
          style={{
            width: '100%',
            border: `2px solid ${INK2}`,
            background: 'rgba(255,255,255,0.55)',
            padding: '8px 10px',
            fontSize: 13,
            outline: 'none',
          }}
        />
      )}
    </div>
  );
}

export default function AddEdit({ catId, onSave, onCancel, onDelete }) {
  const { cats, addCat, updateCat, deleteCat } = useStore();
  const { T } = useLang();
  const existing = catId ? cats.find(c => c.id === catId) : null;

  const [name,       setName]       = useState(existing?.name     ?? '');
  const [alias,      setAlias]      = useState(existing?.alias    ?? '');
  const [crime,      setCrime]      = useState(existing?.crime    ?? '');
  const [location,   setLocation]   = useState(existing?.location ?? '');
  const [notes,      setNotes]      = useState(existing?.notes    ?? '');
  const [threat,     setThreat]     = useState(existing?.threat   ?? 3);
  const [status,     setStatus]     = useState(existing?.status   ?? 'AT LARGE');
  const [photo,      setPhoto]      = useState(existing?.photo    ?? null);
  const [associates, setAssociates] = useState(new Set(existing?.associates ?? []));
  const [saving,     setSaving]     = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const fileInputRef = useRef(null);

  const otherCats = cats.filter(c => c.id !== catId);

  const toggleAssociate = (id) => {
    setAssociates(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const encoded = await resizePhoto(file);
    setPhoto(encoded);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    setSaving(true);
    const data = {
      name:       name.trim(),
      alias:      alias.trim() || 'Unknown',
      crime:      crime.trim() || 'Unknown charges',
      location:   location.trim() || 'Unknown',
      notes:      notes.trim(),
      threat,
      status,
      photo:      photo ?? null,
      associates: [...associates],
    };
    if (existing) {
      updateCat(catId, data);
      onSave(catId);
    } else {
      const newId = addCat(data);
      onSave(newId);
    }
  };

  const handleDelete = () => {
    deleteCat(catId);
    (onDelete ?? onCancel)();
  };

  return (
    <div className="paper-bg" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        padding: '0 16px', height: 48,
        borderBottom: `2px solid ${INK}`,
        background: PAPER_DARK,
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button
          className="tappable"
          onClick={onCancel}
          style={{ fontFamily: '"Special Elite", monospace', fontSize: 13, color: INK }}
        >{T.cancel}</button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <TW size={14} bold>{existing ? T.editFile : T.newSuspectFile}</TW>
        </div>
        <button
          className="tappable"
          onClick={handleSave}
          disabled={!name.trim() || saving}
          style={{
            padding: '7px 14px',
            border: `2px solid ${RED}`,
            background: name.trim() ? 'rgba(184,53,46,0.1)' : 'transparent',
            color: name.trim() ? RED : INK2,
            fontFamily: '"Special Elite", monospace',
            fontSize: 13, fontWeight: 700, letterSpacing: 1,
          }}
        >{saving ? T.saving : T.save}</button>
      </div>

      {/* Body */}
      <div className="scrollable" style={{ flex: 1, padding: 16 }}>
        <div style={{ display: 'flex', gap: 22 }}>
          {/* LEFT — photo + threat + status */}
          <div style={{ width: 220, flexShrink: 0 }}>
            <TW size={10} bold style={{ display: 'block', marginBottom: 6 }}>{T.sectionMugshot}</TW>
            <div
              className="tappable"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: 220, height: 240,
                border: `2.5px dashed ${INK}`,
                background: 'rgba(255,255,255,0.4)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 8, cursor: 'pointer', overflow: 'hidden',
                position: 'relative',
              }}
            >
              {photo ? (
                <>
                  <img src={photo} alt="mugshot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'rgba(26,22,20,0.6)',
                    padding: '6px 0', textAlign: 'center',
                  }}>
                    <TW size={10} color={PAPER}>{T.tapToChange}</TW>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 38 }}>📷</div>
                  <TW size={13} color={INK2}>{T.tapToSnap}</TW>
                  <TW size={9} color={INK2}>{T.uploadFromRoll}</TW>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhoto}
              style={{ display: 'none' }}
            />

            {/* Threat level picker */}
            <div style={{ marginTop: 14 }}>
              <TW size={10} bold style={{ display: 'block', marginBottom: 6 }}>{T.sectionThreatPicker}</TW>
              <DangerPaws rating={threat} size={30} interactive onChange={setThreat} />
              <div style={{ marginTop: 4 }}>
                <TW size={9} color={INK2}>{T.tapPawsToSet}</TW>
                <TW size={9} color={RED} bold>
                  {T.threatLabels[threat]}
                </TW>
              </div>
            </div>

            {/* Status picker */}
            <div style={{ marginTop: 14 }}>
              <TW size={10} bold style={{ display: 'block', marginBottom: 6 }}>{T.sectionStatusPicker}</TW>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {STATUSES.map(s => (
                  <button
                    key={s}
                    className="tappable"
                    onClick={() => setStatus(s)}
                    style={{
                      padding: '7px 10px',
                      border: `2px solid ${s === status ? RED : INK2}`,
                      background: s === status ? 'rgba(184,53,46,0.1)' : 'transparent',
                      color: s === status ? RED : INK2,
                      fontFamily: '"Special Elite", monospace',
                      fontSize: 11, letterSpacing: 0.5,
                      textAlign: 'left',
                    }}
                  >{s === status ? '● ' : '○ '}{statusLabel(s, T)}</button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — text fields */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <Field label={T.fieldNameLabel} value={name} onChange={setName} hint={T.fieldNameHint} />
              </div>
              <div style={{ flex: 1 }}>
                <Field label={T.fieldAliasLabel} value={alias} onChange={setAlias} hint={T.fieldAliasHint} />
              </div>
            </div>
            <Field label={T.fieldCrimeLabel} value={crime} onChange={setCrime} hint={T.fieldCrimeHint} />
            <Field label={T.fieldLocationLabel} value={location} onChange={setLocation} hint={T.fieldLocationHint} />
            <Field label={T.fieldNotesLabel} value={notes} onChange={setNotes} hint={T.fieldNotesHint} multiline />

            {/* Associates */}
            {otherCats.length > 0 && (
              <div style={{ marginTop: 4 }}>
                <TW size={10} bold style={{ display: 'block', marginBottom: 8 }}>{T.sectionKnownAssociates}</TW>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {otherCats.map(c => {
                    const selected = associates.has(c.id);
                    return (
                      <div
                        key={c.id}
                        className="tappable"
                        onClick={() => toggleAssociate(c.id)}
                        style={{
                          textAlign: 'center', cursor: 'pointer',
                          padding: 6,
                          border: `2px solid ${selected ? RED : INK2}`,
                          background: selected ? 'rgba(184,53,46,0.08)' : 'transparent',
                        }}
                      >
                        <Mugshot photo={c.photo} w={56} h={64} tilt={0} />
                        <TW size={9} color={selected ? RED : INK}>{c.name.split(' ')[0]}</TW>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Delete button for existing cats */}
            {existing && (
              <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px dashed ${INK2}` }}>
                {!showDelete ? (
                  <button
                    className="tappable"
                    onClick={() => setShowDelete(true)}
                    style={{
                      padding: '8px 14px',
                      border: `1.5px solid ${INK2}`,
                      color: INK2,
                      fontFamily: '"Special Elite", monospace',
                      fontSize: 11,
                    }}
                  >{T.deleteFile}</button>
                ) : (
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <TW size={11} color={RED}>{T.deleteConfirm}</TW>
                    <button
                      className="tappable"
                      onClick={handleDelete}
                      style={{
                        padding: '8px 14px',
                        border: `2px solid ${RED}`,
                        background: 'rgba(184,53,46,0.1)',
                        color: RED,
                        fontFamily: '"Special Elite", monospace',
                        fontSize: 11, fontWeight: 700,
                      }}
                    >{T.deleteYes}</button>
                    <button
                      className="tappable"
                      onClick={() => setShowDelete(false)}
                      style={{
                        padding: '8px 14px',
                        border: `1.5px solid ${INK2}`,
                        fontFamily: '"Special Elite", monospace',
                        fontSize: 11,
                      }}
                    >{T.deleteCancelBtn}</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
