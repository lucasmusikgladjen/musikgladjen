'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import html2canvas from 'html2canvas-pro';

type PageState = 'loading' | 'show-agreement' | 'signing' | 'signed' | 'already-signed' | 'error';

interface TeacherData {
  namn: string;
  adress: string;
  ort: string;
  fodelsear: string;
  timlon: number;
  lonepalagg: number;
  harAvtal: boolean;
}

function SignaturePad({ onSignatureChange }: { onSignatureChange: (hasSignature: boolean) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawingRef.current = true;
    lastPosRef.current = getPos(e);
  }, [getPos]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawingRef.current || !lastPosRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPosRef.current = pos;
    onSignatureChange(true);
  }, [getPos, onSignatureChange]);

  const stopDraw = useCallback(() => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onSignatureChange(false);
  }, [onSignatureChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Set canvas resolution
    canvas.width = 600;
    canvas.height = 200;
  }, []);

  return (
    <div>
      <p className="text-sm text-gray-500 mb-2">Rita din signatur nedan:</p>
      <div className="relative border-2 border-dashed rounded-xl overflow-hidden"
        style={{ borderColor: 'var(--groovy-brown, #4a3728)', background: '#fafaf8' }}>
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair touch-none"
          style={{ height: '150px' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
        <button
          type="button"
          onClick={clearCanvas}
          className="absolute top-2 right-2 text-xs px-2 py-1 rounded-lg bg-white/80 hover:bg-white transition-colors"
          style={{ color: 'var(--groovy-brown, #4a3728)' }}
        >
          Rensa
        </button>
      </div>
    </div>
  );
}

function AgreementContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const sig = searchParams.get('sig');

  const [state, setState] = useState<PageState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [teacher, setTeacher] = useState<TeacherData | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const agreementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id || !sig) {
      setState('error');
      setErrorMessage('Ogiltig länk. Kontrollera att du klickade på rätt länk i mejlet.');
      return;
    }
    // Fetch teacher data
    fetch(`/api/arbetsavtal/data?id=${encodeURIComponent(id)}&sig=${sig}`)
      .then(res => {
        if (!res.ok) throw new Error('Kunde inte hämta data');
        return res.json();
      })
      .then(data => {
        setTeacher(data);
        if (data.harAvtal) {
          setState('already-signed');
        } else {
          setState('show-agreement');
        }
      })
      .catch(() => {
        setState('error');
        setErrorMessage('Kunde inte hämta avtalsdata. Kontrollera att länken är korrekt.');
      });
  }, [id, sig]);

  const handleSign = async () => {
    if (!agreementRef.current || !id || !sig) return;
    setState('signing');

    try {
      // Capture the agreement as PNG using html2canvas
      const canvas = await html2canvas(agreementRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const imageData = canvas.toDataURL('image/png');

      const res = await fetch('/api/arbetsavtal/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, sig, imageData }),
      });

      if (res.ok) {
        const data = await res.json();
        setDownloadUrl(data.downloadUrl || '');
        setState('signed');
      } else {
        const data = await res.json();
        setState('error');
        setErrorMessage(data.error || 'Något gick fel. Försök igen.');
      }
    } catch {
      setState('error');
      setErrorMessage('Kunde inte skapa avtalsbild. Försök igen eller kontakta oss.');
    }
  };

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <>
      <div className="bg-white rounded-3xl p-6 sm:p-10 relative"
        style={{ boxShadow: '8px 8px 0px 0px var(--groovy-brown)' }}>

        {state === 'loading' && (
          <div className="text-center py-12">
            <div className="vinyl-record w-16 h-16 mx-auto loading-vinyl" />
            <p className="mt-4" style={{ color: 'var(--groovy-brown)' }}>Laddar avtal...</p>
          </div>
        )}

        {state === 'show-agreement' && teacher && (
          <>
            {/* Agreement content to be captured as PNG */}
            <div ref={agreementRef} className="bg-white">
              <h2 className="text-2xl sm:text-3xl mb-6 text-center" style={{ color: 'var(--groovy-brown)' }}>
                Arbetsavtal
              </h2>

              <div className="prose prose-lg max-w-none space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base">

                {/* 1. Parter */}
                <h3 className="text-lg font-semibold" style={{ color: 'var(--groovy-brown)', fontFamily: "'Outfit', sans-serif" }}>
                  1. Parter
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-lg" style={{ background: 'var(--groovy-cream, #faf5ef)' }}>
                    <p className="font-semibold mb-1">Arbetsgivare</p>
                    <p>Musikglädjen AB</p>
                    <p>Bytaregatan 4D, 222 22 Lund</p>
                    <p><strong>Organisationsnummer:</strong> 559336-9175</p>
                    <p><strong>Kontaktperson:</strong> Loka Tjärnberg</p>
                    <p><strong>E-post:</strong> hej@musikgladjen.se</p>
                    <p><strong>Telefon:</strong> 076-022 34 51</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'var(--groovy-cream, #faf5ef)' }}>
                    <p className="font-semibold mb-1">Arbetstagare</p>
                    <p>{teacher.namn}</p>
                    <p>{teacher.adress}, {teacher.ort}</p>
                    <p><strong>Roll:</strong> Musiklärare</p>
                    <p><strong>Startdatum:</strong> {todayStr}</p>
                  </div>
                </div>

                {/* 2. Din anställning */}
                <h3 className="text-lg font-semibold" style={{ color: 'var(--groovy-brown)', fontFamily: "'Outfit', sans-serif" }}>
                  2. Din anställning
                </h3>
                <p>
                  <strong>Anställningsform:</strong> Tillsvidareanställning med timlön (behovsanställning).
                </p>
                <p>
                  <strong>Uppsägningstid:</strong> 14 dagar från båda parter. För elevens skull förväntas du dock fullfölja terminen.
                </p>
                <p>
                  <strong>Arbetstider:</strong> Du bestämmer själv dina arbetstider i samråd med dina elever och deras vårdnadshavare.
                </p>

                {/* 3. Dina arbetsuppgifter */}
                <h3 className="text-lg font-semibold" style={{ color: 'var(--groovy-brown)', fontFamily: "'Outfit', sans-serif" }}>
                  3. Dina arbetsuppgifter
                </h3>
                <p>
                  Som musiklärare på Musikglädjen undervisar du barn i deras hem. Du planerar och genomför lektioner anpassade efter varje elevs nivå och mål. Efter varje lektion skickar du en kort lektionsrapport med läxa till eleven via lärarsidan.
                </p>

                {/* 4. Ansvar för dina elever */}
                <h3 className="text-lg font-semibold" style={{ color: 'var(--groovy-brown)', fontFamily: "'Outfit', sans-serif" }}>
                  4. Ansvar för dina elever
                </h3>
                <p>
                  Du väljer själv hur många elever du vill ha. När du väl har tagit på dig en elev ansvarar du för att den eleven får sin lektion varje vecka. Detta eftersom våra kunder har ett abonnemang som inkluderar en fast lektion per vecka. Du lägger själv in lektioner och hanterar din kalender via lärarsidan. Vid behov av att byta lektionstid kommunicerar du direkt med elevens vårdnadshavare.
                </p>

                {/* 5. Rapportering och lön */}
                <h3 className="text-lg font-semibold" style={{ color: 'var(--groovy-brown)', fontFamily: "'Outfit', sans-serif" }}>
                  5. Rapportering och lön
                </h3>
                <p>
                  <strong>Rapportering:</strong> Efter varje genomförd lektion markerar du lektionen som genomförd på lärarsidan. Vi rekommenderar att du gör detta direkt efter lektionen, dels för att eleven ska få sin läxa, dels för korrekt löneutbetalning.
                </p>
                <p>
                  <strong>Löneutbetalning:</strong> Lön betalas ut senast den 25:e månaden efter rapporterad lektion. Det är rapportdatumet som avgör vilken månad lektionen räknas till. Exempel: en lektion genomförd den 20 januari men rapporterad den 3 februari räknas som en februari-lektion och betalas ut i mars.
                </p>
                <p>
                  <strong>Viktigt:</strong> Lön betalas endast ut för lektioner som markerats som genomförda på lärarsidan.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr style={{ background: 'var(--groovy-cream, #faf5ef)' }}>
                        <th className="p-2 text-left border" style={{ borderColor: '#ddd' }}>Lönematris</th>
                        <th className="p-2 text-center border" style={{ borderColor: '#ddd' }}>15-17 år</th>
                        <th className="p-2 text-center border" style={{ borderColor: '#ddd' }}>18 år</th>
                        <th className="p-2 text-center border" style={{ borderColor: '#ddd' }}>19-20 år</th>
                        <th className="p-2 text-center border" style={{ borderColor: '#ddd' }}>20+ år</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border text-left" style={{ borderColor: '#ddd' }}>Timlön inkl. semesterersättning (12%)</td>
                        <td className="p-2 border text-center" style={{ borderColor: '#ddd' }}>130,00 kr</td>
                        <td className="p-2 border text-center" style={{ borderColor: '#ddd' }}>145,00 kr</td>
                        <td className="p-2 border text-center" style={{ borderColor: '#ddd' }}>160,00 kr</td>
                        <td className="p-2 border text-center" style={{ borderColor: '#ddd' }}>175,00 kr</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {teacher.lonepalagg > 0 && (
                  <p>
                    Utöver timlönen har du en personlig lönebonus på {teacher.lonepalagg} kr.
                  </p>
                )}
               

                {/* 6. Sjukdom eller annan frånvaro */}
                <h3 className="text-lg font-semibold" style={{ color: 'var(--groovy-brown)', fontFamily: "'Outfit', sans-serif" }}>
                  6. Sjukdom eller annan frånvaro
                </h3>
                <p>
                  Om du blir sjuk eller av annan anledning inte kan genomföra en lektion ska du meddela elevens vårdnadshavare direkt på morgonen samma dag. Ni kommer tillsammans överens om en ersättningslektion.
                </p>

                {/* 7. Ditt ansvar */}
                <h3 className="text-lg font-semibold" style={{ color: 'var(--groovy-brown)', fontFamily: "'Outfit', sans-serif" }}>
                  7. Ditt ansvar
                </h3>
                <p>
                  Du förbinder dig att under din anställningstid följa Musikglädjens riktlinjer och värdegrund som finns tillgängliga på{' '}
                  <a href="http://musikgladjen.se" className="underline" style={{ color: 'var(--groovy-orange)' }}>musikgladjen.se</a>
                  {' '}eller kan begäras från{' '}
                  <a href="mailto:hej@musikgladjen.se" className="underline" style={{ color: 'var(--groovy-orange)' }}>hej@musikgladjen.se</a>.
                  {' '}Du representerar Musikglädjen i möten med elever och vårdnadshavare och förväntas uppträda professionellt och ansvarsfullt.
                </p>

                {/* 8. Avtalets upphörande */}
                <h3 className="text-lg font-semibold" style={{ color: 'var(--groovy-brown)', fontFamily: "'Outfit', sans-serif" }}>
                  8. Avtalets upphörande
                </h3>
                <p>
                  Anställningen kan avslutas av båda parter med 14 dagars uppsägningstid. Vid brott mot anställningsvillkoren, såsom olämpligt beteende, kan anställningen avslutas i förtid i enlighet med gällande lagstiftning.
                </p>

                {/* 9. Behandling av personuppgifter */}
                <h3 className="text-lg font-semibold" style={{ color: 'var(--groovy-brown)', fontFamily: "'Outfit', sans-serif" }}>
                  9. Behandling av personuppgifter
                </h3>
                <p>
                  Musikglädjen behandlar personuppgifter för att kunna genomföra och utveckla vår verksamhet. Dina kontaktuppgifter delas med de elever och vårdnadshavare du undervisar. Läs mer om hur vi hanterar personuppgifter i vår integritetspolicy på{' '}
                  <a href="http://musikgladjen.se/integritetspolicy" className="underline" style={{ color: 'var(--groovy-orange)' }}>musikgladjen.se/integritetspolicy</a>.
                </p>

                {/* 10. Underskrifter */}
                <h3 className="text-lg font-semibold" style={{ color: 'var(--groovy-brown)', fontFamily: "'Outfit', sans-serif" }}>
                  10. Underskrifter
                </h3>
                <p className="text-sm text-gray-500">
                  Detta avtal har upprättats i två likalydande exemplar varav parterna har tagit var sitt.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-lg" style={{ background: 'var(--groovy-cream, #faf5ef)' }}>
                    <p className="font-semibold mb-2">För arbetsgivaren</p>
                    <p className="text-xs text-gray-500 italic">Ort och datum</p>
                    <p>Lund {todayStr}</p>
                    <p className="text-xs text-gray-500 italic mt-2">Underskrift</p>
                    <p className="border-b border-gray-300 pb-1 mt-1 italic text-gray-400" style={{ fontFamily: "'Dancing Script', cursive" }}>Non Raagaard</p>
                    <p className="text-xs text-gray-500 italic mt-2">Namnförtydligande</p>
                    <p>Non Raagaard, huvudansvarig för Musikglädjen</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'var(--groovy-cream, #faf5ef)' }}>
                    <p className="font-semibold mb-2">För arbetstagaren</p>
                    <p className="text-xs text-gray-500 italic">Ort och datum</p>
                    <p>{teacher.ort} {todayStr}</p>
                    <p className="text-xs text-gray-500 italic mt-2">Underskrift</p>
                    <div className="mt-1">
                      <SignaturePad onSignatureChange={setHasSignature} />
                    </div>
                    <p className="text-xs text-gray-500 italic mt-2">Namnförtydligande</p>
                    <p>{teacher.namn}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sign button */}
            <div className="border-t-2 pt-6 mt-6" style={{ borderColor: 'var(--groovy-cream)' }}>
              <p className="text-sm text-gray-500 mb-4">
                Genom att klicka på knappen nedan signerar du avtalet med din digitala signatur ovan.
              </p>
              <button
                onClick={handleSign}
                disabled={!hasSignature}
                className="btn-retro w-full text-white text-lg font-semibold py-4 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                style={{ backgroundColor: 'var(--groovy-orange)' }}
              >
                {hasSignature ? 'Signera avtalet' : 'Rita din signatur ovan för att signera'}
              </button>
            </div>
          </>
        )}

        {state === 'signing' && (
          <div className="text-center py-12">
            <div className="vinyl-record w-16 h-16 mx-auto loading-vinyl" />
            <p className="mt-4 text-lg" style={{ color: 'var(--groovy-brown)' }}>
              Signerar avtalet...
            </p>
          </div>
        )}

        {state === 'signed' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎵</div>
            <h2 className="text-2xl sm:text-3xl mb-3" style={{ color: 'var(--groovy-teal)' }}>
              Tack!
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Du har signerat arbetsavtalet. Välkommen till Musikglädjen!
            </p>
            {downloadUrl && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                download="arbetsavtal-musikgladjen.png"
                className="inline-block mt-6 px-6 py-3 rounded-xl text-white font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--groovy-teal)' }}
              >
                Ladda ner ditt signerade avtal
              </a>
            )}
          </div>
        )}

        {state === 'already-signed' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl sm:text-3xl mb-3" style={{ color: 'var(--groovy-teal)' }}>
              Redan signerat
            </h2>
            <p className="text-lg text-gray-600">
              Du har redan signerat arbetsavtalet. Inget mer att göra!
            </p>
          </div>
        )}

        {state === 'error' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl sm:text-3xl mb-3" style={{ color: 'var(--groovy-rust)' }}>
              Något gick fel
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              {errorMessage}
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Kontakta oss på{' '}
              <a href="mailto:hej@musikgladjen.se" className="underline" style={{ color: 'var(--groovy-orange)' }}>
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

export default function JobbavtalPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'var(--groovy-yellow)' }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'var(--groovy-orange)' }} />
        <div className="absolute top-1/3 right-10 w-48 h-48 rounded-full opacity-5"
          style={{ background: 'var(--groovy-teal)' }} />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl mb-2" style={{ color: 'var(--groovy-brown)' }}>
            Musikglädjen
          </h1>
          <p className="text-lg" style={{ color: 'var(--groovy-rust)' }}>
            Arbetsavtal
          </p>
        </div>

        <Suspense fallback={
          <div className="bg-white rounded-3xl p-6 sm:p-10" style={{ boxShadow: '8px 8px 0px 0px var(--groovy-brown)' }}>
            <div className="text-center py-12">
              <div className="vinyl-record w-16 h-16 mx-auto loading-vinyl" />
              <p className="mt-4" style={{ color: 'var(--groovy-brown)' }}>Laddar...</p>
            </div>
          </div>
        }>
          <AgreementContent />
        </Suspense>

        {/* Footer */}
        <p className="text-center text-sm mt-6" style={{ color: 'var(--groovy-rust)' }}>
          &copy; {new Date().getFullYear()} Musikglädjen
        </p>
      </div>
    </div>
  );
}
