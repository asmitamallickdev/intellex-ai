"use client";

import React from "react";
import { modalColors } from "@/lib/modal-mock-data";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ColorPickerProps {
  selectedColor: string; // Dynamic accent colorName
  onChange: (colorName: string) => void;
}

export default function ColorPicker({
  selectedColor,
  onChange,
}: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
        Accent Color
      </label>
      <div className="flex flex-wrap gap-2.5">
        {modalColors.map((color) => {
          const isSelected = selectedColor === color.colorName;
          
          return (
            <button
              key={color.name}
              type="button"
              onClick={() => onChange(color.colorName)}
              className={cn(
                "w-6.5 h-6.5 rounded-full cursor-pointer flex items-center justify-center border border-black/45 transition-transform duration-200 hover:scale-105 active:scale-95",
                color.bgClass,
                isSelected && "ring-2 ring-violet-500 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950"
              )}
              title={color.name}
            >
              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
