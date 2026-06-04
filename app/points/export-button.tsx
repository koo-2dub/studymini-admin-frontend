"use client";

import { FileSpreadsheet } from "lucide-react";

import { Button } from "@/components/ui/button";

type ExportButtonProps = {
  filename: string;
  label: string;
  rows: Record<string, string | number | boolean>[];
  variant?: "default" | "secondary" | "outline" | "ghost";
  className?: string;
};

function escapeCsvCell(value: string | number | boolean) {
  const text = String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function ExportButton({ filename, label, rows, variant = "secondary", className }: ExportButtonProps) {
  const handleDownload = () => {
    const headers = Object.keys(rows[0] ?? { empty: "" });
    const csv = [headers.join(","), ...rows.map((row) => headers.map((header) => escapeCsvCell(row[header] ?? "")).join(","))].join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Button className={className} onClick={handleDownload} type="button" variant={variant}>
      <FileSpreadsheet className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
