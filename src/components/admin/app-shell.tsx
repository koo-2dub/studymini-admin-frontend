import Link from "next/link";
import { Bell, Command, Search, Settings } from "lucide-react";
import { navItems } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r bg-white xl:block">
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 font-black text-white">S</div>
          <div>
            <p className="text-lg font-black">Studymini</p>
            <p className="text-xs font-medium text-muted-foreground">Admin Console</p>
          </div>
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-orange-700">
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="xl:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/90 px-4 backdrop-blur md:px-8">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-10" placeholder="회원명, 이메일, 주문번호, 문의 ID 통합 검색" />
          </div>
          <div className="ml-4 flex items-center gap-2">
            <Button variant="outline" size="sm"><Command className="h-4 w-4" />단축키</Button>
            <Button variant="ghost" size="icon" aria-label="알림"><Bell className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" aria-label="설정"><Settings className="h-5 w-5" /></Button>
            <div className="hidden rounded-full bg-slate-900 px-3 py-2 text-xs font-bold text-white md:block">관리자 김</div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
