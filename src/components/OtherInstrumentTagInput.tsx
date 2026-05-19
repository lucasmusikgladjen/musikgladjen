"use client";

import { KeyboardEvent, useMemo, useRef, useState } from "react";

interface OtherInstrumentTagInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  label?: string;
  description?: string;
  placeholder?: string;
  inputId?: string;
}

export default function OtherInstrumentTagInput({
  value,
  onChange,
  suggestions: suggestionPool,
  label = "Lägg till andra instrument",
  description = "Välj eller skriv andra instrument",
  placeholder = "T.ex. ukulele, didgeridoo...",
  inputId = "instrumentOther",
}: OtherInstrumentTagInputProps) {
  const [input, setInput] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const tags = useMemo(
    () => value.split(",").map((v) => v.trim()).filter(Boolean),
    [value],
  );

  const suggestions = input.trim()
    ? suggestionPool
        .filter(
          (s) =>
            s.toLowerCase().includes(input.toLowerCase()) &&
            !tags.some((tag) => tag.toLowerCase() === s.toLowerCase()),
        )
        .slice(0, 6)
    : [];

  const updateTags = (next: string[]) => onChange(next.join(", "));

  const addTag = (raw: string) => {
    const tag = raw.trim().replace(/,+$/, "").trim();
    if (!tag) return;
    if (tags.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      setInput("");
      setHighlightedIndex(-1);
      return;
    }
    updateTags([...tags, tag]);
    setInput("");
    setHighlightedIndex(-1);
  };

  const removeTag = (tag: string) => updateTags(tags.filter((t) => t !== tag));

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setHighlightedIndex(-1);
      setInput("");
    } else if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        addTag(suggestions[highlightedIndex]);
      } else {
        addTag(input);
      }
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      updateTags(tags.slice(0, -1));
    }
  };

  return (
    <div className="mt-4">
      <label htmlFor={inputId} className="block text-sm font-medium text-text-primary mb-1">
        {label}
      </label>
      <p className="text-xs text-text-secondary mb-2">{description}</p>
      <div ref={containerRef} className="relative">
        <div
          className="min-h-[48px] flex flex-wrap gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] bg-bg-white cursor-text"
          onClick={() => document.getElementById(inputId)?.focus()}
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
                className="text-primary/60 hover:text-primary leading-none"
                aria-label={`Ta bort ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
          <input
            id={inputId}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setHighlightedIndex(-1);
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
            placeholder={tags.length === 0 ? placeholder : ""}
            autoComplete="off"
            className="flex-1 min-w-[120px] outline-none text-sm bg-transparent text-text-primary placeholder:text-gray-400 placeholder:text-sm"
            maxLength={100}
          />
        </div>

        {(suggestions.length > 0 || input.trim()) && (
          <ul className="absolute z-10 left-0 right-0 bottom-full mb-1 bg-bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
            {input.trim() &&
              !tags.some((tag) => tag.toLowerCase() === input.trim().toLowerCase()) && (
                <li>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addTag(input);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-primary bg-accent-soft/60 hover:bg-accent-soft transition-colors font-medium"
                  >
                    Lägg till “{input.trim()}”
                  </button>
                </li>
              )}
            {suggestions.map((suggestion, index) => (
              <li key={suggestion}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addTag(suggestion);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    index === highlightedIndex
                      ? "bg-accent-soft text-primary"
                      : "text-text-primary hover:bg-gray-50"
                  }`}
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
