'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

type PageState = 'loading' | 'form' | 'submitting' | 'done' | 'error';

interface TeacherData {
  namn: string;
  adress: string;
  postnummer: string;
  ort: string;
  epost: string;
  telefon: string;
  instrument: string;
  undervisningsomraden: string;
  personnummer: string;
  bankkontonummer: string;
  bank: string;
  biografi: string;
}

const BANKS = [
  'Danske Bank',
  'Handelsbanken',
  'ICA Banken',
  'Länsförsäkringar',
  'Nordea',
  'SEB',
  'Sparbanken',
  'Swedbank / Sparbanken',
  'Övriga',
];

const BIO_MIN = 150;
const BIO_MAX = 700;

function splitTags(str: string): string[] {
  return str.split(/[,;]+/).map((s) => s.trim()).filter(Boolean);
}

function toStartCase(s: string): string {
  return s.replace(/\S+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

// Format personnummer: accepts 12-digit (YYYYMMDD+XXXX) or 10-digit (YYMMDD+XXXX).
// Dash auto-inserted after 8 digits for 12-digit input, after 6 digits for 10-digit.
function formatPersonnummer(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 12);
  const is12digit = digits.length >= 9 && (digits.startsWith('19') || digits.startsWith('20'));
  if (is12digit) return digits.slice(0, 8) + '-' + digits.slice(8, 12);
  if (digits.length > 6) return digits.slice(0, 6) + '-' + digits.slice(6, 10);
  return digits;
}


// Format postnummer: NNN NN display (max 5 digits)
function formatPostnummer(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 5);
  if (digits.length > 3) return digits.slice(0, 3) + ' ' + digits.slice(3);
  return digits;
}

// Format telefon: NNN-NNN NN NN display (070-123 45 67)
function formatTelefon(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 10);
  let r = d.slice(0, 3);
  if (d.length > 3) r += `-${d.slice(3, 6)}`;
  if (d.length > 6) r += ` ${d.slice(6, 8)}`;
  if (d.length > 8) r += ` ${d.slice(8, 10)}`;
  return r;
}

// Format kontonummer: auto-group digits NNN NNN NNN, user places dash wherever their bank requires
function formatKontonummer(raw: string): string {
  const cleaned = raw.replace(/[^\d-]/g, '').replace(/-+/g, '-');
  const dashIdx = cleaned.indexOf('-');
  if (dashIdx !== -1) {
    const before = cleaned.slice(0, dashIdx).replace(/(\d{3})(?=\d)/g, '$1 ');
    const after = cleaned.slice(dashIdx + 1).replace(/\D/g, '');
    return `${before}-${after}`;
  }
  return cleaned.replace(/(\d{3})(?=\d)/g, '$1 ');
}

function isValidSwedishPhone(phone: string): boolean {
  return /^07[0-9]{8}$/.test(phone.replace(/\D/g, ''));
}

function isValidPersonnummer(pnr: string): boolean {
  return /^\d{8}-\d{4}$/.test(pnr) || /^\d{6}-\d{4}$/.test(pnr);
}

// Källa: lista över platser/områden. Hårdkodad kopia — Airtable är källa för
// nya värden (skapas automatiskt när lärare skriver in en ny). Synka med
// musikgladjen/src/lib/job-types.ts AREA_SUGGESTIONS.
const AREA_SUGGESTIONS = [
  'Innerstan','Vasastan','Södermalm','Östermalm','Norrmalm','Kungsholmen','Gamla Stan',
  'Djurgården','Hammarby Sjöstad','Gärdet','Odenplan','Hornstull','Skanstull','Fridhemsplan',
  'Bromma','Hägersten','Mälarhöjden','Aspudden','Midsommarkransen','Telefonplan','Liljeholmen',
  'Alvik','Skärholmen','Älvsjö','Enskede','Farsta','Farsta Strand','Skarpnäck','Bagarmossen',
  'Bandhagen','Rågsved','Vällingby','Hässelby','Spånga','Tensta','Rinkeby','Kista','Järva',
  'Stockholm','Botkyrka','Danderyd','Ekerö','Haninge','Huddinge','Järfälla','Lidingö','Nacka',
  'Norrtälje','Nykvarn','Nynäshamn','Salem','Sigtuna','Sollentuna','Solna','Sundbyberg',
  'Södertälje','Tyresö','Täby','Upplands-Bro','Upplands Väsby','Vallentuna','Vaxholm','Värmdö',
  'Österåker','Handen','Sickla','Tullinge','Tumba','Flemingsberg',
  'Uppsala','Göteborg','Malmö','Linköping','Örebro','Västerås','Helsingborg','Norrköping',
  'Jönköping','Umeå','Lund','Borås','Gävle',
];

function TagInput({
  tags,
  onChange,
  placeholder,
  suggestions,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}) {
  const [input, setInput] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = suggestions && input.trim()
    ? suggestions
        .filter((s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.some((t) => t.toLowerCase() === s.toLowerCase()))
        .slice(0, 6)
    : [];

  const addTag = (val: string) => {
    const trimmed = toStartCase(val.trim().replace(/,+$/, '').trim());
    if (trimmed && !tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...tags, trimmed]);
    }
    setInput('');
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && filteredSuggestions.length > 0) {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, filteredSuggestions.length - 1));
    } else if (e.key === 'ArrowUp' && filteredSuggestions.length > 0) {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setHighlightedIndex(-1);
      setInput('');
    } else if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
        addTag(filteredSuggestions[highlightedIndex]);
      } else {
        addTag(input);
      }
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        className="flex flex-wrap gap-2 px-3 py-2 rounded-xl border-2 min-h-[48px] cursor-text"
        style={{ borderColor: '#e0d8cf', background: '#fafaf8' }}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, i) => (
          <span
            key={i}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium"
            style={{ background: '#ede8e2', color: 'var(--groovy-brown)', border: '1.5px solid #d4c8bd' }}
          >
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(tags.filter((_, j) => j !== i)); }}
              className="ml-0.5 hover:opacity-60 leading-none"
              style={{ color: 'var(--groovy-brown)' }}
            >
              ×
            </button>
          </span>
        ))}
        <div className="flex items-center gap-1.5 flex-1 min-w-[100px]">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              const v = e.target.value;
              setHighlightedIndex(-1);
              if (v.endsWith(',')) { addTag(v); } else { setInput(v); }
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              setTimeout(() => {
                if (!containerRef.current?.contains(document.activeElement)) {
                  if (input.trim()) addTag(input);
                  setHighlightedIndex(-1);
                }
              }, 100);
            }}
            placeholder={tags.length === 0 ? placeholder : ''}
            autoComplete="off"
            className="flex-1 min-w-0 bg-transparent text-sm focus:outline-none"
            style={{ color: 'var(--groovy-brown)' }}
          />
          {input.trim() && filteredSuggestions.length === 0 && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => addTag(input)}
              className="flex-shrink-0 px-2 py-1 rounded-md text-xs font-semibold transition-colors"
              style={{ background: '#ede8e2', color: 'var(--groovy-brown)' }}
            >
              + Lägg till
            </button>
          )}
        </div>
      </div>

      {(filteredSuggestions.length > 0 || (suggestions && input.trim())) && (
        <ul
          className="absolute z-10 left-0 right-0 mt-1 rounded-xl shadow-md overflow-hidden border-2"
          style={{ background: '#fafaf8', borderColor: '#e0d8cf' }}
        >
          {input.trim() && !tags.some((t) => t.toLowerCase() === input.trim().toLowerCase()) && !filteredSuggestions.some((s) => s.toLowerCase() === input.trim().toLowerCase()) && (
            <li>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); addTag(input); }}
                className="w-full text-left px-3 py-2 text-sm font-medium hover:opacity-80"
                style={{ background: '#ede8e2', color: 'var(--groovy-brown)' }}
              >
                Lägg till “{toStartCase(input.trim())}”
              </button>
            </li>
          )}
          {filteredSuggestions.map((suggestion, index) => (
            <li key={suggestion}>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); addTag(suggestion); }}
                onMouseEnter={() => setHighlightedIndex(index)}
                className="w-full text-left px-3 py-2 text-sm transition-colors"
                style={{
                  background: index === highlightedIndex ? '#ede8e2' : 'transparent',
                  color: 'var(--groovy-brown)',
                }}
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FileUploadField({
  label,
  name,
  accept,
  helpText,
  fileRef,
  required,
}: {
  label: string;
  name: string;
  accept: string;
  helpText?: string;
  fileRef: React.RefObject<HTMLInputElement | null>;
  required?: boolean;
}) {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--groovy-brown)' }}>
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {helpText && <p className="text-xs mb-2" style={{ color: '#8a7060' }}>{helpText}</p>}
      <div
        className="relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-opacity-70 transition-colors"
        style={{ borderColor: 'var(--groovy-brown, #4a3728)', background: '#fafaf8' }}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          name={name}
          accept={accept}
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
        />
        {fileName ? (
          <p className="text-sm" style={{ color: 'var(--groovy-brown)' }}>{fileName}</p>
        ) : (
          <p className="text-sm" style={{ color: '#b8a898' }}>Klicka för att välja fil</p>
        )}
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs mt-1 text-red-500">{message}</p>;
}

function OnboardingForm() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const sig = searchParams.get('sig');

  const [state, setState] = useState<PageState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [form, setForm] = useState<TeacherData>({
    namn: '',
    adress: '',
    postnummer: '',
    ort: '',
    epost: '',
    telefon: '',
    instrument: '',
    undervisningsomraden: '',
    personnummer: '',
    bankkontonummer: '',
    bank: '',
    biografi: '',
  });
  const [instrumentTags, setInstrumentTags] = useState<string[]>([]);
  const [omradenTags, setOmradenTags] = useState<string[]>([]);
  const [clearingnummer, setClearingnummer] = useState('');
  const [kontonummer, setKontonummer] = useState('');
  const [bankOvrigaText, setBankOvrigaText] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const profilbildRef = useRef<HTMLInputElement>(null);
  const jamkningRef = useRef<HTMLInputElement>(null);
  const belastningsregisterRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id || !sig) {
      setState('error');
      setErrorMessage('Ogiltig länk. Kontrollera att du klickade på rätt länk i mejlet.');
      return;
    }
    fetch(`/api/onboarding/data?id=${encodeURIComponent(id)}&sig=${sig}`)
      .then((res) => {
        if (!res.ok) throw new Error('Kunde inte hämta data');
        return res.json();
      })
      .then((data: TeacherData) => {
        // Parse bankkontonummer into clearing + kontonummer
        const [rawClearing, ...restParts] = (data.bankkontonummer || '').split(',');
        setClearingnummer(rawClearing?.trim() ?? '');
        setKontonummer(formatKontonummer(restParts.join(',').trim()));

        // Parse bank — if it's not a known bank, treat as Övriga
        const knownBanks = BANKS.slice(0, -1);
        if (data.bank && !knownBanks.includes(data.bank)) {
          setBankOvrigaText(data.bank);
          data = { ...data, bank: 'Övriga' };
        }

        // Format postnummer for display (NNN NN)
        data = { ...data, postnummer: formatPostnummer(data.postnummer || '') };
        data = { ...data, telefon: formatTelefon(data.telefon || '') };

        setForm(data);
        setInstrumentTags(splitTags(data.instrument));
        setOmradenTags(splitTags(data.undervisningsomraden));
        setState('form');
      })
      .catch((err) => {
        console.error('Onboarding data fetch failed:', err);
        setState('error');
        setErrorMessage('Kunde inte hämta dina uppgifter. Kontrollera att länken är korrekt.');
      });
  }, [id, sig]);

  const handleChange = (field: keyof TeacherData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isValidSwedishPhone(form.telefon)) {
      newErrors.telefon = 'Ange ett giltigt svenskt mobilnummer, t.ex. 070-123 45 67';
    }
    if (!isValidPersonnummer(form.personnummer)) {
      newErrors.personnummer = 'Ange personnummer i formatet ÅÅMMDD-XXXX eller ÅÅÅÅMMDD-XXXX';
    }
    if (!/^\d{4,5}$/.test(clearingnummer)) {
      newErrors.clearingnummer = 'Clearingnummer ska vara 4–5 siffror';
    }
    if (kontonummer.replace(/[\s-]/g, '').length < 5) {
      newErrors.kontonummer = 'Ange ett giltigt kontonummer';
    }
    if (form.bank === 'Övriga' && !bankOvrigaText.trim()) {
      newErrors.bankOvriga = 'Ange bankens namn';
    }
    if (form.biografi.length < BIO_MIN) {
      newErrors.biografi = `Biografin är för kort — skriv minst ${BIO_MIN} tecken`;
    }
    if (instrumentTags.length === 0) {
      newErrors.instrument = 'Lägg till minst ett instrument';
    }
    if (omradenTags.length === 0) {
      newErrors.undervisningsomraden = 'Lägg till minst ett område';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !sig) return;
    if (!validate()) return;

    setState('submitting');

    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('sig', sig);

      // Text fields — normalize postnummer (strip space) and bank (resolve Övriga)
      const bankValue = form.bank === 'Övriga' ? bankOvrigaText.trim() : form.bank;
      const postnummerValue = form.postnummer.replace(/\s/g, '');
      const bankkontonummerValue = `${clearingnummer.trim()}, ${kontonummer.trim()}`;

      // Convert personnummer: 12-digit (YYYYMMDD-XXXX) → 10-digit (YYMMDD-XXXX)
      const pnrDigits = form.personnummer.replace(/\D/g, '');
      const personnummerValue = pnrDigits.length === 12
        ? pnrDigits.slice(2, 8) + '-' + pnrDigits.slice(8)
        : form.personnummer;

      for (const [key, value] of Object.entries(form)) {
        if (['instrument', 'undervisningsomraden', 'bank', 'postnummer', 'bankkontonummer', 'personnummer'].includes(key)) continue;
        formData.append(key, value);
      }
      formData.append('personnummer', personnummerValue);
      formData.append('bank', bankValue);
      formData.append('postnummer', postnummerValue);
      formData.append('bankkontonummer', bankkontonummerValue);
      formData.append('instrument', instrumentTags.join(', '));
      formData.append('undervisningsomraden', omradenTags.join(', '));

      // Files
      const profilbildFile = profilbildRef.current?.files?.[0];
      if (profilbildFile) formData.append('profilbild', profilbildFile);

      const jamkningFile = jamkningRef.current?.files?.[0];
      if (jamkningFile) formData.append('jamkning', jamkningFile);

      const belastningsregisterFile = belastningsregisterRef.current?.files?.[0];
      if (belastningsregisterFile) formData.append('belastningsregister', belastningsregisterFile);

      const res = await fetch('/api/onboarding/submit', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setState('done');
      } else {
        const data = await res.json();
        setState('error');
        setErrorMessage(data.error || 'Något gick fel. Försök igen.');
      }
    } catch {
      setState('error');
      setErrorMessage('Kunde inte skicka uppgifterna. Försök igen eller kontakta oss.');
    }
  };

  const inputClass =
    'warm-input w-full px-4 py-3 rounded-xl border-2 text-sm focus:outline-none focus:ring-2 transition-colors';
  const inputStyle = {
    borderColor: '#e0d8cf',
    background: '#fafaf8',
    color: 'var(--groovy-brown, #4a3728)',
  };
  const errorInputStyle = {
    ...inputStyle,
    borderColor: '#f87171',
  };

  return (
    <>
      <div
        className="bg-white rounded-3xl p-6 sm:p-10 relative"
        style={{ boxShadow: '8px 8px 0px 0px var(--groovy-brown)' }}
      >
        {state === 'loading' && (
          <div className="text-center py-12">
            <div className="vinyl-record w-16 h-16 mx-auto loading-vinyl" />
            <p className="mt-4" style={{ color: 'var(--groovy-brown)' }}>
              Laddar dina uppgifter...
            </p>
          </div>
        )}

        {state === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Section: Kontaktuppgifter */}
            <section>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: 'var(--groovy-brown)', fontFamily: "'Outfit', sans-serif" }}
              >
                Kontaktuppgifter
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--groovy-brown)' }}>
                    Namn<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.namn}
                    onChange={(e) => handleChange('namn', e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--groovy-brown)' }}>
                    E-post<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.epost}
                    onChange={(e) => handleChange('epost', e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--groovy-brown)' }}>
                    Telefon<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.telefon}
                    onChange={(e) => handleChange('telefon', formatTelefon(e.target.value))}
                    className={inputClass}
                    style={errors.telefon ? errorInputStyle : inputStyle}
                    placeholder="070-123 45 67"
                    maxLength={13}
                    required
                  />
                  <FieldError message={errors.telefon} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--groovy-brown)' }}>
                    Adress<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.adress}
                    onChange={(e) => handleChange('adress', e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--groovy-brown)' }}>
                    Postnummer<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.postnummer}
                    onChange={(e) => handleChange('postnummer', formatPostnummer(e.target.value))}
                    className={inputClass}
                    style={inputStyle}
                    placeholder="123 45"
                    inputMode="numeric"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--groovy-brown)' }}>
                    Ort<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.ort}
                    onChange={(e) => handleChange('ort', e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>
            </section>

            {/* Section: Instrument */}
            <section>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: 'var(--groovy-brown)', fontFamily: "'Outfit', sans-serif" }}
              >
                Instrument
              </h3>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--groovy-brown)' }}>
                  Instrument<span className="text-red-500 ml-0.5">*</span>
                </label>
                <p className="text-xs mb-2" style={{ color: '#8a7060' }}>
                  Lägg till alla instrument du kan spela måttligt — inte bara ditt huvudinstrument. Tryck Enter eller komma efter varje.
                </p>
                <TagInput
                  tags={instrumentTags}
                  onChange={(tags) => { setInstrumentTags(tags); if (errors.instrument) setErrors(p => ({ ...p, instrument: '' })); }}
                  placeholder="t.ex. Piano, Gitarr, Ukulele…"
                />
                <FieldError message={errors.instrument} />
              </div>
            </section>

            {/* Section: Undervisningsområden */}
            <section>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: 'var(--groovy-brown)', fontFamily: "'Outfit', sans-serif" }}
              >
                Undervisningsområden
              </h3>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--groovy-brown)' }}>
                  Var kan du tänka dig att undervisa?<span className="text-red-500 ml-0.5">*</span>
                </label>
                <p className="text-xs mb-2" style={{ color: '#8a7060' }}>
                  Ange stadsdelar eller områden du kan ta dig till. Ju fler, desto lättare att matcha dig med en elev. Tryck Enter eller komma efter varje.
                </p>
                <TagInput
                  tags={omradenTags}
                  onChange={(tags) => { setOmradenTags(tags); if (errors.undervisningsomraden) setErrors(p => ({ ...p, undervisningsomraden: '' })); }}
                  placeholder="t.ex. Bromma, Vasastan, Söder…"
                  suggestions={AREA_SUGGESTIONS}
                />
                <FieldError message={errors.undervisningsomraden} />
              </div>
            </section>

            {/* Section: Personnummer & bankuppgifter */}
            <section>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: 'var(--groovy-brown)', fontFamily: "'Outfit', sans-serif" }}
              >
                Personnummer & bankuppgifter
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Personnummer */}
                <div className="sm:col-span-2 sm:max-w-xs">
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--groovy-brown)' }}>
                    Personnummer<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <p className="text-xs mb-2" style={{ color: '#8a7060' }}>Format: ÅÅMMDD-XXXX (t.ex. 050101-1234) eller 12 siffror med sekelsiffra</p>
                  <input
                    type="text"
                    value={form.personnummer}
                    onChange={(e) => handleChange('personnummer', formatPersonnummer(e.target.value))}
                    className={inputClass}
                    style={errors.personnummer ? errorInputStyle : inputStyle}
                    placeholder="050101-1234"
                    inputMode="numeric"
                    required
                  />
                  <FieldError message={errors.personnummer} />
                </div>

                {/* Bank — full width if known bank, half width if Övriga */}
                <div className={form.bank !== 'Övriga' ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--groovy-brown)' }}>
                    Bank<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <select
                    value={form.bank}
                    onChange={(e) => { handleChange('bank', e.target.value); if (e.target.value !== 'Övriga') setBankOvrigaText(''); }}
                    className={`${inputClass} min-h-[50px]`}
                    style={inputStyle}
                    required
                  >
                    <option value="">Välj bank…</option>
                    {BANKS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Övriga banknamn — visas i kolumn 2 på samma rad som Bank-dropdown */}
                {form.bank === 'Övriga' && (
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--groovy-brown)' }}>
                      Bankens namn<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankOvrigaText}
                      onChange={(e) => { setBankOvrigaText(e.target.value); if (errors.bankOvriga) setErrors(p => ({ ...p, bankOvriga: '' })); }}
                      className={inputClass}
                      style={errors.bankOvriga ? errorInputStyle : inputStyle}
                      placeholder="Bankens namn"
                      required
                    />
                    <FieldError message={errors.bankOvriga} />
                  </div>
                )}

                {/* Clearingnummer */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--groovy-brown)' }}>
                    Clearingnummer<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <p className="text-xs mb-2" style={{ color: '#8a7060' }}>4–5 siffror, t.ex. 3300</p>
                  <input
                    type="text"
                    value={clearingnummer}
                    onChange={(e) => { setClearingnummer(e.target.value.replace(/\D/g, '').slice(0, 5)); if (errors.clearingnummer) setErrors(p => ({ ...p, clearingnummer: '' })); }}
                    className={inputClass}
                    style={errors.clearingnummer ? errorInputStyle : inputStyle}
                    placeholder="3300"
                    inputMode="numeric"
                    required
                  />
                  <FieldError message={errors.clearingnummer} />
                </div>

                {/* Kontonummer */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--groovy-brown)' }}>
                    Kontonummer<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <p className="text-xs mb-2" style={{ color: '#8a7060' }}>Utan clearingnummer, t.ex. 1234567890 eller 123456789-0</p>
                  <input
                    type="text"
                    value={kontonummer}
                    onChange={(e) => { setKontonummer(formatKontonummer(e.target.value)); if (errors.kontonummer) setErrors(p => ({ ...p, kontonummer: '' })); }}
                    className={inputClass}
                    style={errors.kontonummer ? errorInputStyle : inputStyle}
                    placeholder="1234567890"
                    inputMode="numeric"
                    required
                  />
                  <FieldError message={errors.kontonummer} />
                </div>

              </div>
            </section>

            {/* Section: Lärarprofil */}
            <section>
              <h3
                className="text-lg font-semibold mb-1"
                style={{ color: 'var(--groovy-brown)', fontFamily: "'Outfit', sans-serif" }}
              >
                Lärarprofil
              </h3>
              <p className="text-sm mb-4" style={{ color: '#8a7060' }}>
                Vi använder det här för att kunna berätta om dig till vårdnadshavare och elever och skapa en trygg upplevelse. Bild är frivilligt men ökar trovärdigheten och gör att vårdnadshavaren vet vem som kommer hem till dem.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--groovy-brown)' }}>
                    Kort biografi<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <p className="text-xs mb-2" style={{ color: '#8a7060' }}>
                    Berätta lite om dig själv — vem du är, ditt musikintresse och eventuell erfarenhet med barn. Minst {BIO_MIN} tecken.
                  </p>
                  <textarea
                    value={form.biografi}
                    onChange={(e) => handleChange('biografi', e.target.value.slice(0, BIO_MAX))}
                    className={inputClass}
                    style={{ ...(errors.biografi ? errorInputStyle : inputStyle), minHeight: '140px', resize: 'vertical' }}
                    placeholder="t.ex. Jag är en glad 16-åring som tycker om att sjunga och spela instrument. Jag går musiklinjen och har spelat piano i drygt 10 år..."
                    required
                  />
                  <div className="flex justify-between mt-1">
                    <FieldError message={errors.biografi} />
                    <p
                      className="text-xs ml-auto"
                      style={{ color: form.biografi.length < BIO_MIN ? '#f87171' : form.biografi.length > BIO_MAX * 0.9 ? '#f59e0b' : '#8a7060' }}
                    >
                      {form.biografi.length} / {BIO_MAX}
                    </p>
                  </div>
                </div>
                <FileUploadField
                  label="Profilbild"
                  name="profilbild"
                  accept="image/*"
                  helpText="Frivilligt — men en bild gör att föräldrar vet vem som kommer hem till dem."
                  fileRef={profilbildRef}
                />
              </div>
            </section>

            {/* Section: Dokument */}
            <section>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: 'var(--groovy-brown)', fontFamily: "'Outfit', sans-serif" }}
              >
                Dokument
              </h3>
              <div className="space-y-6">
                <div>
                  <FileUploadField
                    label="Belastningsregister"
                    name="belastningsregister"
                    accept="image/*,.pdf"
                    helpText="Foto eller PDF av utdrag ur belastningsregistret."
                    fileRef={belastningsregisterRef}
                  />
                  <p className="mt-2 text-xs" style={{ color: '#8a7060' }}>
                    Har du inte beställt utdraget ännu? Du hittar blanketten hos{' '}
                    <a
                      href="https://polisen.se/tjanster-tillstand/belastningsregistret/barn-annan-verksamhet/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:opacity-70"
                      style={{ color: 'var(--groovy-brown)' }}
                    >
                      Polisen
                    </a>
                    . Du kan skicka in det här formuläret nu och ladda upp utdraget senare.
                  </p>
                </div>
                <div>
                  <FileUploadField
                    label="Jämkningsblankett"
                    name="jamkning"
                    accept="image/*,.pdf"
                    helpText="Foto eller PDF av din jämkningsblankett — ladda upp om du har en."
                    fileRef={jamkningRef}
                  />
                  <div
                    className="mt-3 p-3 rounded-xl text-xs space-y-2"
                    style={{ color: '#8a7060', background: '#f5f2ee' }}
                  >
                    <p>
                      Det är upp till dig om vi ska dra av skatt från din lön, men det är väldigt ovanligt att behöva betala full skatt när man pluggar. De flesta som jobbar på Musikglädjen behöver inte skatta.
                    </p>
                    <p>
                      Gränsbeloppet för när man behöver betala skatt skiftar från år till år — du kan se vilket belopp som gäller på{' '}
                      <a
                        href="https://www.skatteverket.se/privat/etjansterochblanketter/blanketterbroschyrer/broschyrer/info/434.4.2b543913a42158acf800028924.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:opacity-70"
                        style={{ color: 'var(--groovy-brown)' }}
                      >
                        Skatteverkets hemsida
                      </a>
                      . Är du osäker kan du alltid fråga oss om råd.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Submit */}
            <div className="border-t-2 pt-6" style={{ borderColor: 'var(--groovy-cream)' }}>
              <button
                type="submit"
                className="btn-retro w-full text-white text-lg font-semibold py-4 transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--groovy-orange)' }}
              >
                Skicka uppgifter
              </button>
            </div>
          </form>
        )}

        {state === 'submitting' && (
          <div className="text-center py-12">
            <div className="vinyl-record w-16 h-16 mx-auto loading-vinyl" />
            <p className="mt-4 text-lg" style={{ color: 'var(--groovy-brown)' }}>
              Skickar dina uppgifter...
            </p>
          </div>
        )}

        {state === 'done' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0" style={{ background: 'rgba(74, 55, 40, 0.45)' }} />
            <div
              className="relative rounded-3xl p-8 sm:p-12 text-center max-w-sm w-full"
              style={{ background: '#faf8f5', boxShadow: '8px 8px 0px 0px var(--groovy-brown)' }}
            >
              <div className="text-5xl mb-4">🎵</div>
              <h2
                className="text-2xl sm:text-3xl font-bold mb-3"
                style={{ color: 'var(--groovy-teal)', fontFamily: "'Outfit', sans-serif" }}
              >
                Tack!
              </h2>
              <p className="text-base" style={{ color: '#8a7060' }}>
                Dina uppgifter har sparats. Vi hör av oss snart!
              </p>
            </div>
          </div>
        )}

        {state === 'error' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl sm:text-3xl mb-3" style={{ color: 'var(--groovy-rust)' }}>
              Något gick fel
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">{errorMessage}</p>
            <p className="text-sm text-gray-400 mt-4">
              Kontakta oss på{' '}
              <a
                href="mailto:hej@musikgladjen.se"
                className="underline"
                style={{ color: 'var(--groovy-orange)' }}
              >
                hej@musikgladjen.se
              </a>{' '}
              om problemet kvarstår.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'var(--groovy-yellow)' }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'var(--groovy-orange)' }}
        />
        <div
          className="absolute top-1/3 right-10 w-48 h-48 rounded-full opacity-5"
          style={{ background: 'var(--groovy-teal)' }}
        />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl mb-2" style={{ color: 'var(--groovy-brown)' }}>
            Musikglädjen
          </h1>
          <p className="text-lg" style={{ color: 'var(--groovy-rust)' }}>
            Välkommen ombord!
          </p>
        </div>

        <Suspense
          fallback={
            <div
              className="bg-white rounded-3xl p-6 sm:p-10"
              style={{ boxShadow: '8px 8px 0px 0px var(--groovy-brown)' }}
            >
              <div className="text-center py-12">
                <div className="vinyl-record w-16 h-16 mx-auto loading-vinyl" />
                <p className="mt-4" style={{ color: 'var(--groovy-brown)' }}>
                  Laddar...
                </p>
              </div>
            </div>
          }
        >
          <OnboardingForm />
        </Suspense>

        {/* Footer */}
        <p className="text-center text-sm mt-6" style={{ color: 'var(--groovy-rust)' }}>
          &copy; {new Date().getFullYear()} Musikglädjen
        </p>
      </div>
    </div>
  );
}
