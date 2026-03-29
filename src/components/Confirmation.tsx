"use client";

interface ConfirmationProps {
  guardianName: string;
  email: string;
}

export default function Confirmation({
  guardianName,
  email,
}: ConfirmationProps) {
  const firstName = guardianName.split(" ")[0];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">
          Tack, {firstName}! 🎉
        </h1>
        <p className="text-text-secondary text-lg">
          Vi har tagit emot er anmälan och hör av oss till{" "}
          <span className="font-medium text-text-primary">{email}</span> inom 24
          timmar.
        </p>
      </div>

      {/* What happens next */}
      <div className="bg-bg-secondary rounded-2xl p-6 mb-10">
        <h2 className="font-bold text-lg mb-4">Vad händer nu?</h2>
        <ol className="space-y-4">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </span>
            <span>
              Vi går igenom er anmälan och hittar en lärare som matchar.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </span>
            <span>
              Ni får ett mejl med förslag på lärare och uppstartstid.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </span>
            <span>Första lektionen — hemma hos er!</span>
          </li>
        </ol>
      </div>

      {/* Teachers placeholder */}
      <div className="mb-10">
        <h2 className="font-bold text-lg mb-4 text-center">Våra lärare</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "Emma", instrument: "Piano" },
            { name: "Oscar", instrument: "Gitarr" },
            { name: "Maja", instrument: "Sång" },
            { name: "Liam", instrument: "Trummor" },
          ].map((teacher) => (
            <div key={teacher.name} className="text-center">
              <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full mb-2 flex items-center justify-center text-2xl text-gray-400">
                🎵
              </div>
              <p className="font-semibold text-sm">{teacher.name}</p>
              <p className="text-text-secondary text-xs">{teacher.instrument}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials placeholder */}
      <div className="mb-10 space-y-4">
        <blockquote className="bg-accent-soft rounded-2xl p-6 border-l-4 border-primary">
          <p className="italic text-text-primary mb-2">
            &ldquo;Vår dotter älskar sina pianolektioner! Läraren är fantastisk
            och det är så smidigt att slippa åka någonstans.&rdquo;
          </p>
          <cite className="text-text-secondary text-sm not-italic">
            — Anna, förälder
          </cite>
        </blockquote>
        <blockquote className="bg-accent-soft rounded-2xl p-6 border-l-4 border-primary">
          <p className="italic text-text-primary mb-2">
            &ldquo;Bästa beslutet vi tagit. Barnen utvecklas i sin egen takt med
            en lärare som verkligen bryr sig.&rdquo;
          </p>
          <cite className="text-text-secondary text-sm not-italic">
            — Erik, förälder
          </cite>
        </blockquote>
      </div>

      {/* Badges */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-4 bg-bg-secondary rounded-xl">
          <span className="text-2xl block mb-1">🎓</span>
          <p className="text-sm font-semibold">Personlig lärare</p>
        </div>
        <div className="text-center p-4 bg-bg-secondary rounded-xl">
          <span className="text-2xl block mb-1">🏠</span>
          <p className="text-sm font-semibold">Vi kommer hem till er</p>
        </div>
        <div className="text-center p-4 bg-bg-secondary rounded-xl">
          <span className="text-2xl block mb-1">📅</span>
          <p className="text-sm font-semibold">Ingen bindningstid</p>
        </div>
      </div>
    </div>
  );
}
