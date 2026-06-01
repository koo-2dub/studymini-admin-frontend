"use client";

import { useState } from "react";
import { RotateCcw, Search } from "lucide-react";

import { DataTable, StatusBadge } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { inquiries } from "@/lib/mock-data";

type InquiryFilters = {
  query: string;
  startDate: string;
  endDate: string;
  priority: string;
  status: string;
};

const emptyFilters: InquiryFilters = {
  query: "",
  startDate: "",
  endDate: "",
  priority: "all",
  status: "all",
};

export default function InquiriesPage() {
  const [filters, setFilters] = useState(emptyFilters);

  const updateFilter = (key: keyof InquiryFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <>
      <PageHeader
        eyebrow="Support desk"
        title="General inquiries"
        description="Triage member questions, billing issues, and platform support requests."
      />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General inquiries filter</CardTitle>
            <CardDescription>Search inquiry keywords, dates, priority, and status in a compact grid.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <label className="space-y-2 md:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Search</span>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    value={filters.query}
                    onChange={(event) => updateFilter("query", event.target.value)}
                    placeholder="Ticket, subject, requester"
                    className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
              </label>
              <FilterInput label="Start date" type="date" value={filters.startDate} onChange={(value) => updateFilter("startDate", value)} />
              <FilterInput label="End date" type="date" value={filters.endDate} onChange={(value) => updateFilter("endDate", value)} />
              <FilterSelect label="Priority" value={filters.priority} onChange={(value) => updateFilter("priority", value)} options={["all", "High", "Normal", "Low"]} allLabel="All priorities" />
              <FilterSelect label="Status" value={filters.status} onChange={(value) => updateFilter("status", value)} options={["all", "Open", "In progress", "Waiting"]} allLabel="All statuses" />
              <div className="flex items-end justify-end gap-2 md:col-span-2">
                <Button type="button" variant="secondary" onClick={() => setFilters((current) => ({ ...current }))}>필터 적용</Button>
                <Button type="button" variant="outline" onClick={() => setFilters(emptyFilters)}><RotateCcw className="h-4 w-4" />초기화</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <DataTable
          title="Inquiry queue"
          description="Mock general support tickets grouped by urgency."
          data={inquiries}
          columns={[
            { key: "id", header: "Ticket" },
            { key: "subject", header: "Subject" },
            { key: "requester", header: "Requester" },
            { key: "priority", header: "Priority" },
            { key: "status", header: "Status", render: (inquiry) => <StatusBadge value={inquiry.status} /> },
          ]}
        />
      </div>
    </>
  );
}

function FilterSelect({
  label,
  value,
  options,
  allLabel,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  allLabel: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none">
        {options.map((option) => <option key={option} value={option}>{option === "all" ? allLabel : option}</option>)}
      </select>
    </label>
  );
}

function FilterInput({ label, type, value, onChange }: { label: string; type: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none" />
    </label>
  );
}
