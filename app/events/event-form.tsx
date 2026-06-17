"use client";

import Link from "next/link";
import { Link2, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { eventDetailImageFields, eventStatusOptions, eventStatusVariant, type EventRecord } from "./data";

type EventFormProps = {
  mode: "create" | "edit";
  event?: EventRecord;
};

const emptyEvent: EventRecord = {
  id: "new-event",
  title: "",
  cardTitle: "",
  cardBottomText: "",
  thumbnailImage: "",
  detailImages: { desktop1920: "", desktop1280: "", tablet768: "", mobile375: "" },
  floatingBar: { enabled: true, topText: "", highlightText: "", buttonText: "", buttonUrl: "" },
  status: "비노출",
  startDate: "2026-06-15",
  endDate: "2026-06-30",
  updatedAt: "-",
};

function fieldClassName() {
  return "mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary";
}

function textareaClassName() {
  return "mt-1 min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary";
}

function ImageUploader({ label, guide, value, onChange }: { label: string; guide: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-900">{label}</p>
          <p className="mt-1 text-xs text-slate-500">{guide}</p>
        </div>
        {value ? <Button type="button" size="sm" variant="ghost" onClick={() => onChange("")}><Trash2 className="h-3.5 w-3.5" />삭제</Button> : null}
      </div>
      <label className="mt-4 block text-sm font-semibold text-slate-700">
        이미지 URL 입력
        <input className={fieldClassName()} placeholder="https://..." value={value} onChange={(event) => onChange(event.target.value)} />
      </label>
      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {value ? (
          <img src={value} alt={`${label} 미리보기`} className="h-48 w-full object-cover" />
        ) : (
          <div className="flex h-48 items-center justify-center bg-slate-100 text-sm font-semibold text-slate-400">이미지 미리보기</div>
        )}
      </div>
    </div>
  );
}

export function EventForm({ mode, event }: EventFormProps) {
  const initialEvent = useMemo(() => event ?? emptyEvent, [event]);
  const [form, setForm] = useState<EventRecord>(initialEvent);
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(initialEvent));
  const isCreate = mode === "create";
  const isDirty = JSON.stringify(form) !== savedSnapshot;
  const saveDisabled = !isCreate && !isDirty;

  function handleSave() {
    setSavedSnapshot(JSON.stringify(form));
  }

  return (
    <>
      <PageHeader
        eyebrow="Marketing"
        title={isCreate ? "이벤트 생성" : "이벤트 상세/수정"}
        description={isCreate ? "웹사이트에 노출할 이벤트 정보를 입력합니다." : "생성된 이벤트 내용을 확인하고 같은 화면에서 수정합니다."}
        action={<Button asChild variant="outline"><Link href="/events">목록으로</Link></Button>}
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>이벤트 타이틀, 노출 상태, 노출 기간을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1 text-sm font-semibold text-slate-700 md:col-span-2">이벤트 타이틀<input className={fieldClassName()} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
              <label className="space-y-1 text-sm font-semibold text-slate-700">이벤트 상태<select className={fieldClassName()} value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as EventRecord["status"] })}>{eventStatusOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
              <div className="flex items-end"><Badge variant={eventStatusVariant(form.status)}>{form.status}</Badge></div>
              <label className="space-y-1 text-sm font-semibold text-slate-700">노출 시작일<input type="date" className={fieldClassName()} value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} /></label>
              <label className="space-y-1 text-sm font-semibold text-slate-700">노출 종료일<input type="date" className={fieldClassName()} value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} /></label>
              {!isCreate ? <p className="text-sm font-semibold text-slate-500 md:col-span-2">수정일: {form.updatedAt}</p> : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>카드 정보</CardTitle>
              <CardDescription>웹사이트 이벤트 목록 카드에 노출되는 정보를 입력합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUploader label="카드 썸네일 이미지" guide="이벤트 목록 카드에 표시되는 대표 이미지" value={form.thumbnailImage} onChange={(value) => setForm({ ...form, thumbnailImage: value })} />
              <label className="block text-sm font-semibold text-slate-700">카드 타이틀<input className={fieldClassName()} value={form.cardTitle} onChange={(event) => setForm({ ...form, cardTitle: event.target.value })} /></label>
              <label className="block text-sm font-semibold text-slate-700">카드 하단 문구<textarea className={textareaClassName()} value={form.cardBottomText} onChange={(event) => setForm({ ...form, cardBottomText: event.target.value })} /></label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>상세 이미지</CardTitle>
              <CardDescription>이벤트 상세 화면에 사용할 반응형 통이미지를 사이즈별로 등록합니다.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-2">
              {eventDetailImageFields.map((field) => <ImageUploader key={field.key} label={field.label} guide={field.guide} value={form.detailImages[field.key]} onChange={(value) => setForm({ ...form, detailImages: { ...form.detailImages, [field.key]: value } })} />)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>하단 플로팅 바</CardTitle>
              <CardDescription>이벤트 상세 화면 하단에 고정 노출되는 CTA 영역입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm font-semibold text-slate-700">
                플로팅 바 사용 여부
                <div className="mt-2 flex flex-wrap gap-2">
                  {[{ label: "사용", value: true }, { label: "사용 안 함", value: false }].map((option) => (
                    <label key={option.label} className="flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-primary/40">
                      <input
                        type="radio"
                        name="floatingBarEnabled"
                        checked={form.floatingBar.enabled === option.value}
                        onChange={() => setForm({ ...form, floatingBar: { ...form.floatingBar, enabled: option.value } })}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
              {form.floatingBar.enabled ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm font-semibold text-slate-700">플로팅 바 상단 문구<input className={fieldClassName()} value={form.floatingBar.topText} onChange={(event) => setForm({ ...form, floatingBar: { ...form.floatingBar, topText: event.target.value } })} /></label>
                  <label className="block text-sm font-semibold text-slate-700">플로팅 바 강조 문구<input className={fieldClassName()} value={form.floatingBar.highlightText} onChange={(event) => setForm({ ...form, floatingBar: { ...form.floatingBar, highlightText: event.target.value } })} /></label>
                  <label className="block text-sm font-semibold text-slate-700">버튼 문구<input className={fieldClassName()} value={form.floatingBar.buttonText} onChange={(event) => setForm({ ...form, floatingBar: { ...form.floatingBar, buttonText: event.target.value } })} /></label>
                  <label className="block text-sm font-semibold text-slate-700">버튼 링크<input className={fieldClassName()} value={form.floatingBar.buttonUrl} onChange={(event) => setForm({ ...form, floatingBar: { ...form.floatingBar, buttonUrl: event.target.value } })} /></label>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="sticky top-28">
            <CardHeader>
              <CardTitle>이벤트 카드 미리보기</CardTitle>
              <CardDescription>목록 카드 노출 정보를 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                {form.thumbnailImage ? <img src={form.thumbnailImage} alt="카드 썸네일 미리보기" className="h-44 w-full object-cover" /> : <div className="flex h-44 items-center justify-center bg-slate-100 text-sm font-semibold text-slate-400">썸네일 이미지</div>}
                <div className="space-y-3 p-4">
                  <Badge variant={eventStatusVariant(form.status)}>{form.status}</Badge>
                  <div>
                    <p className="text-lg font-black text-slate-950">{form.title || "이벤트 타이틀"}</p>
                    <p className="mt-1 text-sm font-semibold text-primary">{form.cardTitle || "카드 타이틀"}</p>
                    <p className="mt-2 text-sm text-slate-500">{form.cardBottomText || "카드 하단 문구"}</p>
                  </div>
                  <dl className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div><dt className="font-bold text-slate-700">노출 시작일</dt><dd>{form.startDate}</dd></div>
                    <div><dt className="font-bold text-slate-700">노출 종료일</dt><dd>{form.endDate}</dd></div>
                    <div className="col-span-2"><dt className="font-bold text-slate-700">수정일</dt><dd>{form.updatedAt}</dd></div>
                  </dl>
                </div>
              </div>
              {form.floatingBar.enabled ? (
                <div className="rounded-2xl bg-slate-950 p-4 text-white">
                  <p className="text-xs text-white/60">{form.floatingBar.topText || "플로팅 바 상단 문구"}</p>
                  <p className="mt-1 text-lg font-black">{form.floatingBar.highlightText || "플로팅 바 강조 문구"}</p>
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-white px-3 py-2 text-slate-950">
                    <span className="text-sm font-bold">{form.floatingBar.buttonText || "버튼 문구"}</span>
                    <Link2 className="h-4 w-4" />
                  </div>
                </div>
              ) : null}
              <Button className="w-full" type="button" disabled={saveDisabled} onClick={handleSave}>{isCreate ? "이벤트 생성" : "수정 저장"}</Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}
