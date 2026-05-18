"use client";

import { ElevFormData } from "@/lib/elev-types";
import FormHeader from "./FormHeader";

interface ElevConfirmationProps {
  data: ElevFormData;
}


export default function ElevConfirmation({ data }: ElevConfirmationProps) {
  return (
    <div className="w-full min-h-screen flex flex-col bg-[#f5f4f0]">
      <FormHeader />

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[560px]">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12 mb-8">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Tack för er anmälan!
              </h1>
              <p className="text-sm text-text-secondary">
                Vi hör av oss inom kort för att kunna hitta rätt lärare till er.
              </p>
            </div>

            <div className="w-28 md:w-36 flex-shrink-0">
              <img
                src="/Musikglädjen 3.svg"
                alt=""
                aria-hidden="true"
                className="w-full h-auto"
              />
            </div>
          </div>

{data.email && (
            <div className="p-4 rounded-xl bg-white border border-gray-200 text-sm text-text-secondary">
              <p>
                <span className="font-semibold text-text-primary">Bekräftelse skickas till:</span>{" "}
                {data.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
