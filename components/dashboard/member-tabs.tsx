"use client";

import { useState } from "react";
import { BookOpenCheck, CreditCard, MessageSquareText, Sparkles } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "Overview", icon: Sparkles },
  { id: "orders", label: "Orders", icon: CreditCard },
  { id: "lessons", label: "Lessons", icon: BookOpenCheck },
  { id: "support", label: "Support", icon: MessageSquareText },
] as const;

type Member = {
  name: string;
  plan: string;
  spend: string;
  points: number;
  lessons: number;
  segment: string;
};

export function MemberTabs({ member, timeline }: { member: Member; timeline: string[] }) {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("overview");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member workspace</CardTitle>
        <CardDescription>Client-side App Router tabs for account operations.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid gap-2 rounded-2xl bg-slate-100 p-2 md:grid-cols-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 transition-all",
                  active === tab.id && "bg-white text-indigo-600 shadow-sm",
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {active === "overview" && (
          <div className="grid gap-4 md:grid-cols-3">
            {["Plan: " + member.plan, "Segment: " + member.segment, "Points: " + member.points.toLocaleString()].map((item) => (
              <div key={item} className="rounded-3xl border bg-white p-5 font-bold shadow-sm">{item}</div>
            ))}
          </div>
        )}
        {active === "orders" && <Panel title="Payment history" items={[`${member.spend} lifetime spend`, "Latest renewal paid successfully", "No chargebacks in mock data"]} />}
        {active === "lessons" && <Panel title="Learning activity" items={[`${member.lessons} lessons completed`, ...timeline.filter((item) => item.includes("lesson") || item.includes("Algebra") || item.includes("Physics"))]} />}
        {active === "support" && <Panel title="Support context" items={["Preferred channel: email", "Last satisfaction score: 96%", "No escalations currently open"]} />}
      </CardContent>
    </Card>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border bg-gradient-to-br from-white to-indigo-50 p-6">
      <h3 className="text-lg font-black">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => <div key={item} className="rounded-2xl bg-white/80 p-4 text-sm font-semibold text-slate-600 shadow-sm">{item}</div>)}
      </div>
    </div>
  );
}
