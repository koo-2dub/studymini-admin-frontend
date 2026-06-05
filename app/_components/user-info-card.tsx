import Link from "next/link";
import type { ReactNode } from "react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export type DetailUserInfo = {
  name: string;
  memberId: string;
  email: string;
  phone: string;
  memberStatus: string;
  lastLogin: string;
};

const memberStatusVariant = (status: string): BadgeProps["variant"] => {
  if (status === "정상") return "success";
  if (status === "휴면") return "warning";
  if (status === "탈퇴") return "rose";
  return "slate";
};

function UserInfoItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <div className="mt-2 min-w-0 font-bold text-slate-900">{value}</div>
    </div>
  );
}

export function UserInfoCard({ title, description, user }: { title: string; description: string; user: DetailUserInfo }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <UserInfoItem label="이름/닉네임" value={<span className="whitespace-nowrap">{user.name}</span>} />
          <UserInfoItem
            label="User ID"
            value={
              <Link href={`/members/${user.memberId}`} className="font-mono text-indigo-600 hover:underline">
                {user.memberId}
              </Link>
            }
          />
          <UserInfoItem label="이메일" value={<span className="break-all">{user.email}</span>} />
          <UserInfoItem label="전화번호" value={<span className="whitespace-nowrap">{user.phone}</span>} />
          <UserInfoItem label="회원 상태" value={<Badge variant={memberStatusVariant(user.memberStatus)}>{user.memberStatus}</Badge>} />
          <UserInfoItem label="최근 로그인" value={<span className="whitespace-nowrap">{user.lastLogin}</span>} />
        </div>
        <div className="flex justify-end">
          <Link
            href={`/members/${user.memberId}`}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-indigo-200 bg-white px-4 text-sm font-bold text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50"
          >
            회원 상세 보기
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
