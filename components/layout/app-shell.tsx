"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Bell, Command, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen xl:grid xl:grid-cols-[288px_1fr]">
      <aside className="hidden border-r border-white/70 bg-white/70 p-5 shadow-panel backdrop-blur-2xl xl:block">
        <Link href="/" className="flex items-center gap-3 rounded-3xl bg-slate-950 p-4 text-white shadow-glow">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-white/60">StudyMini</p>
            <h1 className="text-lg font-black tracking-tight">Admin OS</h1>
          </div>
        </Link>
        <nav className="mt-8 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const children = item.children;
            const active = children
              ? children.some((child) => pathname.startsWith(child.href))
              : item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            if (children) {
              return (
                <div key={item.title}>
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-white hover:text-slate-950 hover:shadow-sm",
                      active && "bg-white text-primary shadow-sm ring-1 ring-indigo-100",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </div>
                  <div className="mt-1 space-y-1.5 pl-7">
                    {children.map((child) => {
                      const childActive = pathname.startsWith(child.href);

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-white hover:text-slate-950 hover:shadow-sm",
                            childActive && "bg-white text-primary shadow-sm ring-1 ring-indigo-100",
                          )}
                        >
                          {child.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-white hover:text-slate-950 hover:shadow-sm",
                  active && "bg-white text-primary shadow-sm ring-1 ring-indigo-100",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-white/70 bg-white/70 px-4 py-4 backdrop-blur-2xl lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center gap-4">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-500">Search members, orders, tickets...</span>
              <kbd className="ml-auto hidden items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500 sm:flex">
                <Command className="h-3 w-3" />K
              </kbd>
            </div>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl p-0" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="hidden items-center gap-3 rounded-2xl bg-slate-950 px-4 py-3 text-white sm:flex">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-300 to-sky-300" />
              <div>
                <p className="text-xs text-white/50">Operations</p>
                <p className="text-sm font-bold">Admin Team</p>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
