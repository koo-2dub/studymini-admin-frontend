import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studymini Admin",
  description: "Studymini 관리자 대시보드 프론트엔드",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
