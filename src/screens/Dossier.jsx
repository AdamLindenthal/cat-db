import { useState } from 'react';
import {
  Stamp, Paw, DangerPaws, TW, HW, Mugshot, Paperclip, WBox, WLine, StatusBadge,
  INK, INK2, RED, BLUE, PAPER, PAPER_DARK
} from '../components/ui';
import { useStore } from '../store';
import { useLang, statusLabel } from '../i18n';

export default function Dossier({ catId, onBack, onEdit, onCapture }) {
  const { cats } = useStore();
  const { T } = useLang();
  const cat = cats.find(c => c.id === catId);

  if (!cat) {
    return (
      <div className="paper-bg" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TW size={14} color={INK2}>{T.fileNotFound}</TW>
      </div>
    );
  }

  const associates = (cat.associates || [])
    .map(id => cats.find(c => c.id === id))
    .filter(Boolean);

  const fileNum = String(cats.indexOf(cat) + 1).padStart(4, '0');
  const createdDate = cat.createdAt
    ? new Date(cat.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })
    : '??/??/??';

  const threatLabel = T.threatLabels[cat.threat] || '';

  return (
    <div className="paper-bg" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top bar — folder tab */}
      <div style={{
        padding: '0 16px',
        borderBottom: `2px solid ${INK}`,
        background: PAPER_DARK,
        flexShrink: 0,
        height: 48,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button
          className="tappable"
          onClick={onBack}
          style={{ fontFamily: '"Special Elite", monospace', fontSize: 13, letterSpacing: 1, color: INK }}
        >{T.back}</button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <TW size={14} bold>{T.suspectDossier}</TW>
        </div>
        <Stamp text={T.classified} rotate={-3} size={11} style={{ padding: '3px 8px' }} />
      </div>

      {/* Body */}
      <div className="scrollable" style={{ flex: 1, padding: '12px 18px', position: 'relative' }}>
        {/* File number strip */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <TW size={10} color={INK2}>
            {T.fileInfo(fileNum, createdDate)}
          </TW>
          {(cat.status === 'MOST WANTED' || cat.status === 'AT LARGE') && (
            <Stamp
              text={statusLabel(cat.status, T)}
              rotate={-4} size={11}
              style={{ padding: '3px 8px' }}
            />
          )}
          {cat.status === 'CAPTURED' && (
            <Stamp text={T.statusCaptured} color={BLUE} rotate={-4} size={12} style={{ padding: '3px 8px' }} />
          )}
          {cat.status === 'UNDER WATCH' && (
            <Stamp text={T.statusUnderWatch} color="#7a6200" rotate={-4} size={10} style={{ padding: '3px 8px' }} />
          )}
        </div>

        <div style={{ display: 'flex', gap: 18 }}>
          {/* LEFT — mugshot + ID fields */}
          <div style={{ width: 240, flexShrink: 0 }}>
            <div style={{ position: 'relative' }}>
              <Mugshot
                photo={cat.photo}
                w={240} h={210}
                name={T.subject(cat.name.toUpperCase())}
                captured={cat.status === 'CAPTURED'}
                tilt={-1}
              />
              <Paperclip size={26} rotate={30} color="#888"
                style={{ position: 'absolute', top: -6, right: 16 }} />
            </div>

            <div style={{ marginTop: 12 }}>
              {[
                [T.fieldName,    cat.name],
                [T.fieldAlias,   `"${cat.alias}"`],
                [T.fieldSpecies, T.stuffedFeline],
                [T.fieldStatus,  statusLabel(cat.status, T)],
              ].map(([k, v]) => (
                <div key={k} style={{
                  display: 'flex', gap: 8, padding: '4px 0',
                  borderBottom: `1px dotted ${INK2}`,
                  alignItems: 'baseline',
                }}>
                  <TW size={10} bold style={{ width: 80, flexShrink: 0 }}>{k}:</TW>
                  <TW size={10} color={k === T.fieldAlias ? RED : INK}>{v}</TW>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {cat.status !== 'CAPTURED' && (
                <button
                  className="tappable"
                  onClick={() => onCapture(cat.id)}
                  style={{
                    padding: '10px 0',
                    border: `2px solid ${RED}`,
                    background: 'rgba(184,53,46,0.1)',
                    color: RED,
                    fontFamily: '"Special Elite", monospace',
                    fontSize: 13, letterSpacing: 1, fontWeight: 700,
                    width: '100%',
                  }}
                >{T.captureBtn}</button>
              )}
              <button
                className="tappable"
                onClick={() => onEdit(cat.id)}
                style={{
                  padding: '10px 0',
                  border: `2px solid ${INK}`,
                  background: 'transparent',
                  fontFamily: '"Special Elite", monospace',
                  fontSize: 13, letterSpacing: 1,
                  width: '100%',
                }}
              >{T.editFile}</button>
            </div>
          </div>

          {/* RIGHT — typed report */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Charges */}
            <div style={{ marginBottom: 14 }}>
              <TW size={11} bold>{T.sectionCharges}</TW>
              <div style={{
                marginTop: 6, background: 'rgba(255,255,255,0.55)',
                padding: '8px 12px',
                border: `1.5px solid ${INK2}`,
              }}>
                <TW size={14}>{cat.crime}</TW>
              </div>
            </div>

            {/* Threat + Location side by side */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 14 }}>
              <div>
                <TW size={11} bold>{T.sectionThreat}</TW>
                <div style={{ marginTop: 6 }}>
                  <DangerPaws rating={cat.threat} size={22} />
                </div>
                <TW size={11} color={RED} bold>{threatLabel}</TW>
              </div>
              <div style={{ flex: 1 }}>
                <TW size={11} bold>{T.sectionLocation}</TW>
                <div style={{ marginTop: 6 }}>
                  <TW size={13}>◉ {cat.location}</TW>
                </div>
                <TW size={9} color={INK2}>{T.reportedToday}</TW>
              </div>
            </div>

            <WLine w={680} style={{ marginBottom: 14 }} />

            {/* Known associates */}
            {associates.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <TW size={11} bold>{T.sectionAssociates}</TW>
                <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                  {associates.map(a => (
                    <div key={a.id} style={{ textAlign: 'center' }}>
                      <Mugshot photo={a.photo} w={62} h={70} tilt={0} />
                      <TW size={9}>{a.name.split(' ')[0]}</TW>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agent notes */}
            <div>
              <TW size={11} bold>{T.sectionNotes}</TW>
              <div style={{
                marginTop: 6,
                background: 'rgba(30,58,95,0.06)',
                padding: '10px 12px',
                borderLeft: `3px solid ${BLUE}`,
              }}>
                <HW size={17} style={{ lineHeight: 1.4 }}>
                  {cat.notes || T.noNotes}
                </HW>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
