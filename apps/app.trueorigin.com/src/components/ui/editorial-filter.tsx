"use client";

import { useId } from "react";

type FilterOption = { value: string; label: string };

export function EditorialFilter({ label, options, value, onChange }: {
 label: string;
 options: readonly FilterOption[];
 value: string;
 onChange: (value: string) => void;
}) {
 const labelId = useId();
 return <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
  <p id={labelId} className="shrink-0 text-[11px] text-white/40 sm:w-20">{label}</p>
  <div className="min-w-0 overflow-x-auto pb-1 sm:pb-0">
   <div role="group" aria-labelledby={labelId} className="flex w-max items-center gap-5">
    {options.map((option, index) => {
     const active = value === option.value;
     return <button key={option.value} type="button" aria-pressed={active} onClick={() => onChange(option.value)} className={`flex shrink-0 cursor-pointer items-baseline gap-2 py-2 text-sm transition-colors duration-200 ${active ? "text-white" : "text-white/30 hover:text-white/75"}`}>
      <span aria-hidden="true" className="font-mono text-[9px] opacity-40">{String(index).padStart(2, "0")}</span>
      {option.label}
     </button>;
    })}
   </div>
  </div>
 </div>;
}
