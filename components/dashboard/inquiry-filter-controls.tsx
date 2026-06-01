"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";

type SelectOption = {
  label: string;
  value: string;
};

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

type FilterInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
};

type FilterSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
};

export function InquirySearchField({ value, onChange, placeholder }: SearchFieldProps) {
  return (
    <label className="space-y-2 lg:col-span-2">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">검색</span>
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-11 flex-1 bg-transparent text-sm outline-none"
        />
      </div>
    </label>
  );
}

export function InquiryFilterInput({ label, value, onChange, type = "text", placeholder }: FilterInputProps) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
      />
    </label>
  );
}

export function InquiryFilterSelect({ label, value, onChange, options }: FilterSelectProps) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

export function InquiryFilterActions({ onApply, onReset }: { onApply: () => void; onReset: () => void }) {
  return (
    <div className="flex flex-wrap items-end gap-2 lg:col-span-2">
      <Button type="button" onClick={onApply}>필터 적용</Button>
      <Button type="button" variant="outline" onClick={onReset}>초기화</Button>
    </div>
  );
}

export const answerStatusOptions: SelectOption[] = [
  { label: "전체 답변상태", value: "전체" },
  { label: "답변대기", value: "답변대기" },
  { label: "답변중", value: "답변중" },
  { label: "답변완료", value: "답변완료" },
];

export function toSelectOptions(values: string[], allLabel: string): SelectOption[] {
  return [{ label: allLabel, value: "전체" }, ...values.map((value) => ({ label: value, value }))];
}
