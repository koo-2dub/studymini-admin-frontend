"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { DataTable, StatusBadge } from "@/components/dashboard/data-table";
import { generalInquiries, inquiryStorageKey, type GeneralInquiry } from "@/lib/inquiry-state";

function mergeStoredInquiries(stored: GeneralInquiry[]) {
  return generalInquiries.map((inquiry) => stored.find((item) => item.id === inquiry.id) ?? inquiry);
}

export function InquiriesClient() {
  const [items, setItems] = useState(generalInquiries);

  useEffect(() => {
    const stored = window.localStorage.getItem(inquiryStorageKey);
    if (!stored) return;

    try {
      setItems(mergeStoredInquiries(JSON.parse(stored) as GeneralInquiry[]));
    } catch {
      setItems(generalInquiries);
    }
  }, []);

  return (
    <DataTable
      title="일반 문의 목록"
      description="일반 문의는 문의 1건당 관리자 답변 1건으로 처리합니다."
      data={items}
      columns={[
        {
          key: "id",
          header: "문의번호",
          render: (inquiry) => (
            <Link className="font-semibold text-primary hover:underline" href={`/inquiries/${inquiry.id}`}>
              {inquiry.id}
            </Link>
          ),
        },
        { key: "subject", header: "제목" },
        { key: "requester", header: "문의자" },
        { key: "priority", header: "우선순위" },
        { key: "manager", header: "담당자", render: (inquiry) => inquiry.manager || "-" },
        { key: "status", header: "상태", render: (inquiry) => <StatusBadge value={inquiry.status} /> },
      ]}
    />
  );
}
