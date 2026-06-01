"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("h-10 rounded-xl border border-slate-200 bg-white/80 px-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100", props.className)} />;
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn("h-10 rounded-xl border border-slate-200 bg-white/80 px-3 text-sm font-semibold outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100", props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("min-h-36 rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100", props.className)} />;
}

export function SummaryGrid({ items }: { items: { label: string; value: number | string; tone: string }[] }) {
  return (
    <section className="mb-6 grid gap-4 md:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label} className="overflow-hidden">
          <CardContent className="p-5">
            <p className="text-sm font-bold text-slate-500">{item.label}</p>
            <p className={cn("mt-2 text-3xl font-black", item.tone)}>{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

export function FilterActions({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-wrap items-end gap-2">
      <Button type="button"><Search className="h-4 w-4" />필터 적용</Button>
      <Button type="button" variant="outline" onClick={onReset}><RotateCcw className="h-4 w-4" />초기화</Button>
    </div>
  );
}

export function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (page: number) => void }) {
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
      <span>페이지 {page} / {totalPages}</span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}><ChevronLeft className="h-4 w-4" />이전</Button>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>다음<ChevronRight className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}

export function ClickableTable({ children, title, description }: { children: ReactNode; title: string; description: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-[1180px]">{children}</Table>
        </div>
      </CardContent>
    </Card>
  );
}

export { TableBody, TableCell, TableHead, TableHeader, TableRow };

export function UserLink({ userId, children }: { userId: string; children: ReactNode }) {
  return (
    <Link href={`/members/${userId}`} onClick={(event) => event.stopPropagation()} className="font-bold text-indigo-700 hover:underline">
      {children}
    </Link>
  );
}

export function CourseLink({ children }: { children: ReactNode }) {
  return (
    <a href="https://studymini.com" target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="inline-flex items-center gap-1 font-bold text-indigo-700 hover:underline">
      {children}<ExternalLink className="h-3 w-3" />
    </a>
  );
}
