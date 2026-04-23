import { createContext, useContext, useState } from 'react';

const en = {
  // Navigation
  back: '‹ BACK',
  cancel: '‹ CANCEL',

  // Home header
  caseBoard: 'CASE BOARD',
  atLargeCount: (n) => `${n} AT LARGE`,
  capturedCount: (n) => `${n} CAPTURED`,
  viewBoard: '⊞ BOARD',
  viewList: '≡ LIST',
  searchBtn: '⌕ SEARCH',
  newFile: '+ NEW FILE',
  settingsTitle: 'Backup & Settings',
  showStrings: '⬡ STRINGS',

  // Home content
  noSuspects: 'NO SUSPECTS ON FILE',
  addFirst: '+ ADD FIRST SUSPECT',
  tapCard: '— TAP A CARD TO OPEN DOSSIER —',

  // List column headers
  colFile: 'FILE #',
  colMugshot: 'MUGSHOT',
  colNameAlias: 'NAME / ALIAS',
  colCharges: 'CHARGES',
  colThreat: 'THREAT',
  colLastSeen: 'LAST SEEN',
  colStatus: 'STATUS',

  // Dossier
  fileNotFound: 'FILE NOT FOUND',
  suspectDossier: '— SUSPECT DOSSIER —',
  classified: 'CLASSIFIED',
  fileInfo: (num, date) => `FILE #${num} · OPENED ${date} · UPDATED TODAY`,
  captureBtn: '⚑ CAPTURE!',
  editFile: '✎ EDIT FILE',
  fieldName: 'NAME',
  fieldAlias: 'ALIAS',
  fieldSpecies: 'SPECIES',
  fieldStatus: 'STATUS',
  stuffedFeline: 'Stuffed feline',
  subject: (name) => `SUBJECT: ${name}`,
  sectionCharges: '◆ CHARGES',
  sectionThreat: '◆ THREAT LEVEL',
  sectionLocation: '◆ LAST KNOWN LOCATION',
  reportedToday: '· Reported by Agent, today ·',
  sectionAssociates: '◆ KNOWN ASSOCIATES',
  sectionNotes: '◆ AGENT NOTES',
  noNotes: '— no notes on file —',

  // AddEdit
  newSuspectFile: '+ NEW SUSPECT FILE',
  saving: 'SAVING…',
  save: 'SAVE →',
  sectionMugshot: '◆ MUGSHOT',
  tapToChange: 'TAP TO CHANGE',
  tapToSnap: 'TAP TO SNAP',
  uploadFromRoll: 'or upload from roll',
  sectionThreatPicker: '◆ THREAT LEVEL',
  tapPawsToSet: 'tap paws to set · ',
  sectionStatusPicker: '◆ STATUS',
  fieldNameLabel: 'NAME',
  fieldNameHint: 'e.g. Mr. Mittens',
  fieldAliasLabel: 'ALIAS / CODENAME',
  fieldAliasHint: '"The Yarnsmith"',
  fieldCrimeLabel: 'CHARGES — what did they do?',
  fieldCrimeHint: 'e.g. Grand theft sock (x27)',
  fieldLocationLabel: 'LAST SEEN LOCATION',
  fieldLocationHint: 'e.g. Under the bed',
  fieldNotesLabel: 'AGENT NOTES',
  fieldNotesHint: 'anything else the agency should know…',
  sectionKnownAssociates: '◆ KNOWN ASSOCIATES',
  deleteFile: '⚠ DELETE THIS FILE',
  deleteConfirm: 'Are you sure? This cannot be undone.',
  deleteYes: 'YES, DELETE',
  deleteCancelBtn: 'CANCEL',

  // Search
  findSuspect: '⌕ FIND A SUSPECT',
  filesCount: (r, total) => `${r} / ${total} FILES`,
  clearAll: 'CLEAR ALL',
  byThreat: 'BY THREAT',
  byStatus: 'BY STATUS',
  byArea: 'BY AREA',
  searchPlaceholder: 'type name, alias, or crime…',
  noMatchingFiles: 'NO MATCHING FILES',

  // Scanner
  placeOnScanner: 'PLACE PAW ON SCANNER',
  scanning: '◉ SCANNING…',
  holdStill: 'HOLD STILL · DO NOT REMOVE PAW',
  caseClosed: 'CASE CLOSED',
  identityConfirmed: 'IDENTITY CONFIRMED',
  capturedMsg: (name) => `${name} HAS BEEN CAPTURED`,
  closingFile: '— CLOSING FILE —',

  // Status display labels (data values stay as English keys)
  statusAtLarge: 'AT LARGE',
  statusCaptured: 'CAPTURED',
  statusMostWanted: 'MOST WANTED',
  statusUnderWatch: 'UNDER WATCH',

  // Threat labels (index 1–5)
  threatLabels: ['', 'LOW', 'MINOR', 'MODERATE', 'HIGH', 'EXTREME'],

  // Areas: key used for fuzzy matching, label for display
  areas: [
    { key: 'Kitchen',     label: 'Kitchen' },
    { key: 'Bedroom',     label: 'Bedroom' },
    { key: 'Living room', label: 'Living room' },
    { key: 'Playroom',    label: 'Playroom' },
    { key: 'Coat',        label: 'Coat' },
    { key: 'Laundry',     label: 'Laundry' },
    { key: 'Unknown',     label: 'Unknown' },
  ],

  // Settings modal
  settings: '⚙ SETTINGS',
  backupRestore: 'BACKUP & RESTORE',
  suspectsOnFile: (n) => `${n} suspect${n !== 1 ? 's' : ''} on file. Export saves a JSON file you can copy anywhere.`,
  exportJson: '⬇ EXPORT JSON',
  importJson: '⬆ IMPORT JSON',
  importSuccess: (n) => `✓ Imported ${n} suspects.`,
  importError: '✗ Could not read that file. Is it a cat-db backup?',
  backupSaved: '✓ Backup saved to Downloads.',
  appName: 'CAT · DB — Stuffed Feline Suspect Database',
  appStorageNote: "Data stored in this device's browser storage.",
  appBackupNote: 'Export regularly to keep a safe backup.',
  language: 'LANGUAGE',

  // Mugshot placeholder
  noPhoto: '[ MUGSHOT ]\nno photo',
};

const cs = {
  // Navigation
  back: '‹ ZPĚT',
  cancel: '‹ ZRUŠIT',

  // Home header
  caseBoard: 'NÁSTĚNKA PŘÍPADŮ',
  atLargeCount: (n) => `${n} NA SVOBODĚ`,
  capturedCount: (n) => `${n} CHYCENO`,
  viewBoard: '⊞ NÁSTĚNKA',
  viewList: '≡ SEZNAM',
  searchBtn: '⌕ HLEDAT',
  newFile: '+ NOVÝ SOUBOR',
  settingsTitle: 'Záloha a nastavení',
  showStrings: '⬡ PROVÁZKY',

  // Home content
  noSuspects: 'ŽÁDNÍ PODEZŘELÍ V DATABÁZI',
  addFirst: '+ PŘIDAT PRVNÍHO PODEZŘELÉHO',
  tapCard: '— KLEPNI NA KARTU PRO OTEVŘENÍ SPISU —',

  // List column headers
  colFile: 'SOUBOR #',
  colMugshot: 'FOTO',
  colNameAlias: 'JMÉNO / PŘEZDÍVKA',
  colCharges: 'OBVINĚNÍ',
  colThreat: 'HROZBA',
  colLastSeen: 'NAPOSLEDY VIDĚN',
  colStatus: 'STAV',

  // Dossier
  fileNotFound: 'SOUBOR NENALEZEN',
  suspectDossier: '— SPIS PODEZŘELÉHO —',
  classified: 'PŘÍSNĚ TAJNÉ',
  fileInfo: (num, date) => `SOUBOR #${num} · OTEVŘEN ${date} · AKTUALIZOVÁN DNES`,
  captureBtn: '⚑ CHYTIT!',
  editFile: '✎ UPRAVIT SOUBOR',
  fieldName: 'JMÉNO',
  fieldAlias: 'PŘEZDÍVKA',
  fieldSpecies: 'DRUH',
  fieldStatus: 'STAV',
  stuffedFeline: 'Plyšová kočka',
  subject: (name) => `SUBJEKT: ${name}`,
  sectionCharges: '◆ OBVINĚNÍ',
  sectionThreat: '◆ ÚROVEŇ HROZBY',
  sectionLocation: '◆ POSLEDNÍ ZNÁMÉ MÍSTO',
  reportedToday: '· Hlášeno agentem, dnes ·',
  sectionAssociates: '◆ ZNÁMÍ SPOLUPACHATELÉ',
  sectionNotes: '◆ POZNÁMKY AGENTA',
  noNotes: '— žádné poznámky —',

  // AddEdit
  newSuspectFile: '+ NOVÝ SOUBOR PODEZŘELÉHO',
  saving: 'UKLÁDÁM…',
  save: 'ULOŽIT →',
  sectionMugshot: '◆ FOTO',
  tapToChange: 'KLEPNI PRO ZMĚNU',
  tapToSnap: 'KLEPNI PRO FOCENÍ',
  uploadFromRoll: 'nebo nahraj z galerie',
  sectionThreatPicker: '◆ ÚROVEŇ HROZBY',
  tapPawsToSet: 'klepni na tlapky pro nastavení · ',
  sectionStatusPicker: '◆ STAV',
  fieldNameLabel: 'JMÉNO',
  fieldNameHint: 'např. Pan Ponožka',
  fieldAliasLabel: 'PŘEZDÍVKA / KÓD',
  fieldAliasHint: '"Vlňák"',
  fieldCrimeLabel: 'OBVINĚNÍ — co provedl/a?',
  fieldCrimeHint: 'např. Krádež ponožek (x27)',
  fieldLocationLabel: 'NAPOSLEDY VIDĚN NA',
  fieldLocationHint: 'např. Pod postelí',
  fieldNotesLabel: 'POZNÁMKY AGENTA',
  fieldNotesHint: 'cokoliv, co by agentura měla vědět…',
  sectionKnownAssociates: '◆ ZNÁMÍ SPOLUPACHATELÉ',
  deleteFile: '⚠ SMAZAT TENTO SOUBOR',
  deleteConfirm: 'Jsi si jistý/á? Tuto akci nelze vrátit.',
  deleteYes: 'ANO, SMAZAT',
  deleteCancelBtn: 'ZRUŠIT',

  // Search
  findSuspect: '⌕ HLEDAT PODEZŘELÉHO',
  filesCount: (r, total) => `${r} / ${total} SOUBORŮ`,
  clearAll: 'VYMAZAT VŠE',
  byThreat: 'PODLE HROZBY',
  byStatus: 'PODLE STAVU',
  byArea: 'PODLE MÍSTA',
  searchPlaceholder: 'zadej jméno, přezdívku nebo obvinění…',
  noMatchingFiles: 'ŽÁDNÉ ODPOVÍDAJÍCÍ SOUBORY',

  // Scanner
  placeOnScanner: 'POLOŽ TLAPKU NA SCANNER',
  scanning: '◉ SKENOVÁNÍ…',
  holdStill: 'NEHÝBEJ SE · NESUNDÁVEJ TLAPKU',
  caseClosed: 'PŘÍPAD UZAVŘEN',
  identityConfirmed: 'TOTOŽNOST POTVRZENA',
  capturedMsg: (name) => `${name} BYL/A CHYCEN/A`,
  closingFile: '— ZAVÍRÁNÍ SOUBORU —',

  // Status display labels
  statusAtLarge: 'NA SVOBODĚ',
  statusCaptured: 'CHYCEN/A',
  statusMostWanted: 'NEJHLEDANĚJŠÍ',
  statusUnderWatch: 'POD DOHLEDEM',

  // Threat labels (index 1–5)
  threatLabels: ['', 'NÍZKÁ', 'MALÁ', 'STŘEDNÍ', 'VYSOKÁ', 'EXTRÉMNÍ'],

  // Areas
  areas: [
    { key: 'Kitchen',     label: 'Kuchyně' },
    { key: 'Bedroom',     label: 'Ložnice' },
    { key: 'Living room', label: 'Obývák' },
    { key: 'Playroom',    label: 'Herna' },
    { key: 'Coat',        label: 'Kabát' },
    { key: 'Laundry',     label: 'Prádelna' },
    { key: 'Unknown',     label: 'Neznámé' },
  ],

  // Settings modal
  settings: '⚙ NASTAVENÍ',
  backupRestore: 'ZÁLOHA A OBNOVA',
  suspectsOnFile: (n) => `${n} podezřelých v databázi. Export uloží JSON soubor, který můžeš zkopírovat kamkoliv.`,
  exportJson: '⬇ EXPORTOVAT JSON',
  importJson: '⬆ IMPORTOVAT JSON',
  importSuccess: (n) => `✓ Importováno ${n} podezřelých.`,
  importError: '✗ Nepodařilo se přečíst soubor. Je to záloha cat-db?',
  backupSaved: '✓ Záloha uložena do Stahování.',
  appName: 'CAT · DB — Databáze Podezřelých Plyšových Koček',
  appStorageNote: 'Data jsou uložena v prohlížeči tohoto zařízení.',
  appBackupNote: 'Pravidelně exportuj pro bezpečnou zálohu.',
  language: 'JAZYK',

  // Mugshot placeholder
  noPhoto: '[ FOTO ]\nbez fotky',
};

export const translations = { en, cs };

// Maps a data-model status key to the current locale's display label
export function statusLabel(status, T) {
  switch (status) {
    case 'AT LARGE':    return T.statusAtLarge;
    case 'CAPTURED':    return T.statusCaptured;
    case 'MOST WANTED': return T.statusMostWanted;
    case 'UNDER WATCH': return T.statusUnderWatch;
    default: return status;
  }
}

const LANG_KEY = 'cat-db-lang';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem(LANG_KEY) || 'en');

  const setLang = (l) => {
    localStorage.setItem(LANG_KEY, l);
    setLangState(l);
  };

  const T = translations[lang] || translations.en;

  return (
    <LangContext.Provider value={{ lang, setLang, T }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
