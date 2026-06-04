"use client";

import { Download, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const periodOptions = ["오늘", "최근 7일", "최근 30일", "이번 달", "사용자 지정"] as const;
const comparisonOptions = ["전일 대비", "전주 대비", "전월 대비", "전년 대비"] as const;
const metricOptions = ["순매출", "총 결제금액", "총 환불금액", "주문건수"] as const;
const baseDate = new Date("2026-06-04T00:00:00");

type PeriodOption = (typeof periodOptions)[number];
type ComparisonOption = (typeof comparisonOptions)[number];
type MetricKey = (typeof metricOptions)[number];
type TrendPoint = {
  date: string;
  label: string;
  compareLabel: string;
  netRevenue: number;
  grossPayment: number;
  refundAmount: number;
  orderCount: number;
  compareNetRevenue: number;
  compareGrossPayment: number;
  compareRefundAmount: number;
  compareOrderCount: number;
};
type MetricConfig = { current: keyof TrendPoint; compare: keyof TrendPoint; unit: "currency" | "count"; positiveDirection: "up" | "down" };
type Kpi = { label: string; value: string; change: string; trend: "up" | "down"; positive: boolean; compareLabel: string };

type DailySale = {
  date: string;
  orders: number;
  gross: string;
  refund: string;
  coupon: string;
  net: string;
  shipping: string;
  total: string;
  change: string;
};

const metricConfig: Record<MetricKey, MetricConfig> = {
  순매출: { current: "netRevenue", compare: "compareNetRevenue", unit: "currency", positiveDirection: "up" },
  "총 결제금액": { current: "grossPayment", compare: "compareGrossPayment", unit: "currency", positiveDirection: "up" },
  "총 환불금액": { current: "refundAmount", compare: "compareRefundAmount", unit: "currency", positiveDirection: "down" },
  주문건수: { current: "orderCount", compare: "compareOrderCount", unit: "count", positiveDirection: "up" },
};

const comparisonOffset: Record<ComparisonOption, { days?: number; months?: number; years?: number }> = {
  "전일 대비": { days: 1 },
  "전주 대비": { days: 7 },
  "전월 대비": { months: 1 },
  "전년 대비": { years: 1 },
};

const productSeeds = [
  { product: "스페인어 풀패키지", language: "스페인어", quantity: 214, revenue: 8400000, change: 24.1 },
  { product: "프랑스어 베이직", language: "프랑스어", quantity: 168, revenue: 5900000, change: 11.8 },
  { product: "독일어 마스터", language: "독일어", quantity: 121, revenue: 4200000, change: -3.4 },
  { product: "영어 회화 집중반", language: "영어", quantity: 98, revenue: 3640000, change: 9.7 },
  { product: "일본어 스타터", language: "일본어", quantity: 86, revenue: 2980000, change: 6.2 },
  { product: "중국어 입문", language: "중국어", quantity: 73, revenue: 2410000, change: 4.8 },
  { product: "이탈리아어 여행 회화", language: "이탈리아어", quantity: 61, revenue: 1980000, change: 13.5 },
  { product: "러시아어 알파벳", language: "러시아어", quantity: 54, revenue: 1620000, change: -2.1 },
  { product: "아랍어 기초", language: "아랍어", quantity: 47, revenue: 1420000, change: 7.4 },
  { product: "포르투갈어 스타터", language: "포르투갈어", quantity: 39, revenue: 1180000, change: 5.6 },
];

const countrySeeds = [
  { country: "대한민국", share: 68.9, change: 16.2 },
  { country: "미국", share: 14.8, change: 22.4 },
  { country: "일본", share: 7.7, change: -4.1 },
  { country: "캐나다", share: 4.6, change: 8.9 },
];

function addDate(date: Date, offset: { days?: number; months?: number; years?: number }, direction: 1 | -1 = 1) {
  const next = new Date(date);
  if (offset.days) next.setDate(next.getDate() + offset.days * direction);
  if (offset.months) next.setMonth(next.getMonth() + offset.months * direction);
  if (offset.years) next.setFullYear(next.getFullYear() + offset.years * direction);
  return next;
}

function formatDate(date: Date) {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function parseInputDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatShortDate(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function getPeriodRange(period: PeriodOption, customStart: string, customEnd: string) {
  if (period === "오늘") return { start: new Date(baseDate), end: new Date(baseDate), isHourly: true };
  if (period === "최근 7일") {
    const start = new Date(baseDate);
    start.setDate(start.getDate() - 6);
    return { start, end: new Date(baseDate), isHourly: false };
  }
  if (period === "이번 달") return { start: new Date(baseDate.getFullYear(), baseDate.getMonth(), 1), end: new Date(baseDate), isHourly: false };
  if (period === "사용자 지정") return { start: parseInputDate(customStart), end: parseInputDate(customEnd), isHourly: false };
  const start = new Date(baseDate);
  start.setDate(start.getDate() - 29);
  return { start, end: new Date(baseDate), isHourly: false };
}

function getDaysBetween(start: Date, end: Date) {
  return Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);
}

function formatCurrency(value: number) {
  return `₩${Math.round(value).toLocaleString("ko-KR")}`;
}

function formatCompactCurrency(value: number) {
  if (value >= 1000000) return `₩${(value / 1000000).toFixed(1)}M`;
  return `₩${Math.round(value / 10000).toLocaleString("ko-KR")}만`;
}

function formatMetricValue(value: number, unit: "currency" | "count") {
  return unit === "count" ? `${Math.round(value).toLocaleString("ko-KR")}건` : formatCurrency(value);
}

function formatAxisValue(value: number, unit: "currency" | "count") {
  return unit === "count" ? `${Math.round(value)}건` : `₩${Math.round(value / 10000).toLocaleString("ko-KR")}만`;
}

function buildPath(points: number[], width: number, height: number, padding: number, max: number, min: number) {
  if (points.length === 1) return `M${padding},${height / 2} L${width - padding},${height / 2}`;
  return points
    .map((value, index) => {
      const x = padding + (index * (width - padding * 2)) / (points.length - 1);
      const ratio = max === min ? 0.5 : (value - min) / (max - min);
      const y = height - padding - ratio * (height - padding * 2);
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function getComparisonFactor(comparison: ComparisonOption) {
  return ({ "전일 대비": 0.92, "전주 대비": 0.88, "전월 대비": 0.84, "전년 대비": 0.73 } as Record<ComparisonOption, number>)[comparison];
}

function getPeriodBoost(period: PeriodOption) {
  return ({ 오늘: 0.18, "최근 7일": 0.08, "최근 30일": 0.16, "이번 달": 0.22, "사용자 지정": 0.12 } as Record<PeriodOption, number>)[period];
}

function makeTrendData(period: PeriodOption, comparison: ComparisonOption, customStart: string, customEnd: string) {
  const { start, end, isHourly } = getPeriodRange(period, customStart, customEnd);
  const offset = comparisonOffset[comparison];
  const compareStart = addDate(start, offset, -1);
  const compareEnd = addDate(end, offset, -1);
  const pointCount = isHourly ? 12 : Math.min(getDaysBetween(start, end), 30);
  const daySpan = Math.max(1, getDaysBetween(start, end) - 1);
  const compareFactor = getComparisonFactor(comparison);
  const periodBoost = getPeriodBoost(period);
  const points: TrendPoint[] = Array.from({ length: pointCount }, (_, index) => {
    const currentDate = new Date(start);
    if (isHourly) currentDate.setHours(9 + index, 0, 0, 0);
    else currentDate.setDate(start.getDate() + Math.round((index * daySpan) / Math.max(1, pointCount - 1)));

    const compareDate = addDate(currentDate, offset, -1);
    const wave = Math.sin(index * 0.85) * 95000 + Math.cos(index * 0.35) * 52000;
    const base = isHourly ? 118000 + index * 12000 : 840000 + index * 23000;
    const netRevenue = Math.max(35000, Math.round((base + wave) * (1 + periodBoost)));
    const grossPayment = Math.round(netRevenue * (1.18 + (index % 4) * 0.015));
    const refundAmount = Math.round(grossPayment * (0.043 + (index % 5) * 0.004));
    const orderCount = Math.max(3, Math.round(netRevenue / (isHourly ? 38000 : 36000) + (index % 6)));
    const compareNetRevenue = Math.round(netRevenue * compareFactor * (0.96 + (index % 5) * 0.018));
    const compareGrossPayment = Math.round(grossPayment * compareFactor * (0.97 + (index % 4) * 0.013));
    const compareRefundAmount = Math.round(refundAmount * (comparison === "전년 대비" ? 1.05 : 0.94 + (index % 3) * 0.05));
    const compareOrderCount = Math.max(1, Math.round(orderCount * compareFactor));

    return {
      date: isHourly ? `${formatDate(currentDate)} ${String(currentDate.getHours()).padStart(2, "0")}:00` : formatDate(currentDate),
      label: isHourly ? `${currentDate.getHours()}시` : formatShortDate(currentDate),
      compareLabel: isHourly ? `${String(compareDate.getHours()).padStart(2, "0")}:00` : formatShortDate(compareDate),
      netRevenue,
      grossPayment,
      refundAmount,
      orderCount,
      compareNetRevenue,
      compareGrossPayment,
      compareRefundAmount,
      compareOrderCount,
    };
  });

  return { points, start, end, compareStart, compareEnd, isHourly };
}

function getChange(current: number, previous: number, positiveDirection: "up" | "down" = "up") {
  const rate = previous === 0 ? 0 : ((current - previous) / previous) * 100;
  const trend: "up" | "down" = rate >= 0 ? "up" : "down";
  const positive = positiveDirection === "up" ? rate >= 0 : rate <= 0;
  return { rate, trend, positive, label: `${rate >= 0 ? "▲" : "▼"} ${Math.abs(rate).toFixed(1)}%` };
}

function makeDailyRows(points: TrendPoint[], isHourly: boolean): DailySale[] {
  return points.slice(0, isHourly ? 8 : 10).map((point) => {
    const coupon = Math.round(point.grossPayment * 0.08);
    const shipping = Math.round(point.orderCount * 900);
    const total = point.netRevenue + shipping;
    return {
      date: point.date,
      orders: point.orderCount,
      gross: formatCurrency(point.grossPayment),
      refund: formatCurrency(point.refundAmount),
      coupon: formatCurrency(coupon),
      net: formatCurrency(point.netRevenue),
      shipping: formatCurrency(shipping),
      total: formatCurrency(total),
      change: getChange(point.netRevenue, point.compareNetRevenue).label,
    };
  });
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>("최근 30일");
  const [selectedComparison, setSelectedComparison] = useState<ComparisonOption>("전월 대비");
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("순매출");
  const [draftStart, setDraftStart] = useState("2026-05-20");
  const [draftEnd, setDraftEnd] = useState("2026-06-04");
  const [customStart, setCustomStart] = useState("2026-05-20");
  const [customEnd, setCustomEnd] = useState("2026-06-04");

  const trend = useMemo(() => makeTrendData(selectedPeriod, selectedComparison, customStart, customEnd), [selectedPeriod, selectedComparison, customStart, customEnd]);
  const activeMetric = metricConfig[selectedMetric];

  const summary = useMemo(() => {
    const currentTotal = trend.points.reduce((sum, point) => sum + Number(point[activeMetric.current]), 0);
    const compareTotal = trend.points.reduce((sum, point) => sum + Number(point[activeMetric.compare]), 0);
    const change = getChange(currentTotal, compareTotal, activeMetric.positiveDirection);
    return { currentTotal, compareTotal, ...change };
  }, [activeMetric, trend.points]);

  const chart = useMemo(() => {
    const currentValues = trend.points.map((item) => Number(item[activeMetric.current]));
    const compareValues = trend.points.map((item) => Number(item[activeMetric.compare]));
    const allValues = [...currentValues, ...compareValues];
    const max = Math.max(...allValues) * 1.08;
    const min = Math.min(...allValues) * 0.88;
    const width = 920;
    const height = 320;
    const padding = 44;

    return {
      currentPath: buildPath(currentValues, width, height, padding, max, min),
      comparePath: buildPath(compareValues, width, height, padding, max, min),
      currentValues,
      compareValues,
      width,
      height,
      padding,
      max,
      min,
    };
  }, [activeMetric, trend.points]);

  const totals = useMemo(() => {
    const netRevenue = trend.points.reduce((sum, point) => sum + point.netRevenue, 0);
    const compareNetRevenue = trend.points.reduce((sum, point) => sum + point.compareNetRevenue, 0);
    const grossPayment = trend.points.reduce((sum, point) => sum + point.grossPayment, 0);
    const compareGrossPayment = trend.points.reduce((sum, point) => sum + point.compareGrossPayment, 0);
    const refundAmount = trend.points.reduce((sum, point) => sum + point.refundAmount, 0);
    const compareRefundAmount = trend.points.reduce((sum, point) => sum + point.compareRefundAmount, 0);
    const orderCount = trend.points.reduce((sum, point) => sum + point.orderCount, 0);
    const compareOrderCount = trend.points.reduce((sum, point) => sum + point.compareOrderCount, 0);
    const newMembers = Math.round(orderCount * 0.68);
    const compareNewMembers = Math.round(compareOrderCount * 0.65);
    const repeatRate = Math.min(48, 34 + trend.points.length * 0.16 + (selectedComparison === "전년 대비" ? 3 : 0));
    const compareRepeatRate = repeatRate - 3.2;

    return { netRevenue, compareNetRevenue, grossPayment, compareGrossPayment, refundAmount, compareRefundAmount, orderCount, newMembers, compareNewMembers, repeatRate, compareRepeatRate };
  }, [selectedComparison, trend.points]);

  const kpis: Kpi[] = useMemo(() => {
    const net = getChange(totals.netRevenue, totals.compareNetRevenue);
    const gross = getChange(totals.grossPayment, totals.compareGrossPayment);
    const refund = getChange(totals.refundAmount, totals.compareRefundAmount, "down");
    const members = getChange(totals.newMembers, totals.compareNewMembers);
    const repeatPoint = totals.repeatRate - totals.compareRepeatRate;
    return [
      { label: "순매출", value: formatCurrency(totals.netRevenue), change: net.label, trend: net.trend, positive: net.positive, compareLabel: selectedComparison },
      { label: "총 결제금액", value: formatCurrency(totals.grossPayment), change: gross.label, trend: gross.trend, positive: gross.positive, compareLabel: selectedComparison },
      { label: "총 환불금액", value: formatCurrency(totals.refundAmount), change: refund.label, trend: refund.trend, positive: refund.positive, compareLabel: selectedComparison },
      { label: "신규 결제회원", value: `${totals.newMembers.toLocaleString("ko-KR")}명`, change: members.label, trend: members.trend, positive: members.positive, compareLabel: selectedComparison },
      { label: "재구매율", value: `${totals.repeatRate.toFixed(1)}%`, change: `▲ ${repeatPoint.toFixed(1)}%p`, trend: "up", positive: true, compareLabel: selectedComparison },
    ];
  }, [selectedComparison, totals]);

  const productTop10 = useMemo(() => {
    const scale = Math.max(0.18, totals.netRevenue / 35000000);
    return productSeeds.map((item) => ({
      ...item,
      quantity: Math.max(1, Math.round(item.quantity * scale)),
      netRevenue: formatCurrency(item.revenue * scale),
      change: `${item.change >= 0 ? "+" : ""}${(item.change + (selectedComparison === "전년 대비" ? 3 : 0)).toFixed(1)}%`,
    }));
  }, [selectedComparison, totals.netRevenue]);

  const countryRevenue = useMemo(() => countrySeeds.map((item) => ({
    ...item,
    revenue: formatCompactCurrency((totals.netRevenue * item.share) / 100),
    shareLabel: `${item.share}%`,
    change: `${item.change >= 0 ? "+" : ""}${(item.change + (selectedComparison === "전주 대비" ? 1.2 : 0)).toFixed(1)}%`,
  })), [selectedComparison, totals.netRevenue]);

  const dailySales = useMemo(() => makeDailyRows(trend.points, trend.isHourly), [trend.points, trend.isHourly]);
  const lastPoint = trend.points[trend.points.length - 1];
  const lastCurrent = Number(lastPoint[activeMetric.current]);
  const lastCompare = Number(lastPoint[activeMetric.compare]);
  const lastChange = getChange(lastCurrent, lastCompare, activeMetric.positiveDirection);
  const couponTotal = Math.round(totals.grossPayment * 0.08);
  const shippingTotal = totals.orderCount * 900;
  const tableNetTotal = totals.grossPayment - totals.refundAmount - couponTotal;

  const applyCustomPeriod = () => {
    setCustomStart(draftStart);
    setCustomEnd(draftEnd);
    setSelectedPeriod("사용자 지정");
  };

  return (
    <>
      <PageHeader eyebrow="Revenue analytics" title="Sales Analytics" description="기간별 순매출, 결제, 환불, 구매회원 흐름을 비교 기준과 함께 확인합니다." />

      <Card>
        <CardContent className="space-y-5 pt-6">
          <div className="flex flex-wrap gap-2">
            {periodOptions.map((option) => (
              <Button key={option} variant={selectedPeriod === option ? "default" : "outline"} size="sm" onClick={() => setSelectedPeriod(option)}>{option}</Button>
            ))}
          </div>
          {selectedPeriod === "사용자 지정" && (
            <div className="grid gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 sm:grid-cols-[1fr_1fr_auto]">
              <label className="text-xs font-bold text-slate-600">시작일<input className="mt-1 h-10 w-full rounded-xl border bg-white px-3 text-sm text-slate-900" type="date" value={draftStart} onChange={(event) => setDraftStart(event.target.value)} /></label>
              <label className="text-xs font-bold text-slate-600">종료일<input className="mt-1 h-10 w-full rounded-xl border bg-white px-3 text-sm text-slate-900" type="date" value={draftEnd} onChange={(event) => setDraftEnd(event.target.value)} /></label>
              <Button className="self-end" size="sm" onClick={applyCustomPeriod}>적용</Button>
            </div>
          )}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-bold text-slate-700">비교 기준</span>
              {comparisonOptions.map((option) => (
                <Button key={option} variant={selectedComparison === option ? "secondary" : "outline"} size="sm" onClick={() => setSelectedComparison(option)}>{option}</Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">적용</Button>
              <Button size="sm"><Download className="h-4 w-4" /> 다운로드</Button>
            </div>
          </div>
          <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 md:grid-cols-3">
            <span><strong className="text-slate-900">현재 기간</strong> {formatDate(trend.start)} ~ {formatDate(trend.end)}</span>
            <span><strong className="text-slate-900">비교 기간</strong> {formatDate(trend.compareStart)} ~ {formatDate(trend.compareEnd)}</span>
            <span><strong className="text-slate-900">비교 기준</strong> {selectedComparison}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 overflow-hidden">
        <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
          <div>
            <CardTitle className="text-2xl">{selectedMetric} 추이</CardTitle>
            <CardDescription>현재 기간과 비교 기간의 {trend.isHourly ? "시간대별" : "일별"} 흐름을 같은 축에서 비교합니다.</CardDescription>
            <div className="mt-4 flex flex-wrap items-end gap-4">
              <div>
                <div className={summary.positive ? "text-3xl font-black text-emerald-600" : "text-3xl font-black text-rose-600"}>{summary.label}</div>
                <p className="mt-1 text-sm font-semibold text-slate-700">{selectedMetric}이 {selectedComparison} {summary.positive ? "개선" : "악화"}되었습니다.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                현재 {formatMetricValue(summary.currentTotal, activeMetric.unit)} / 비교 {formatMetricValue(summary.compareTotal, activeMetric.unit)}
              </div>
            </div>
          </div>
          <label className="flex items-center gap-2 rounded-2xl border bg-white px-3 py-2 text-sm font-bold text-slate-700">
            지표
            <select className="bg-transparent text-sm font-black outline-none" value={selectedMetric} onChange={(event) => setSelectedMetric(event.target.value as MetricKey)} aria-label="그래프 지표 선택">
              {metricOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        </CardHeader>
        <CardContent>
          <div className="rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-600">
              <div className="flex flex-wrap gap-4">
                <span className="flex items-center gap-2"><span className="h-1 w-8 rounded-full bg-indigo-600" />현재 기간</span>
                <span className="flex items-center gap-2"><span className="h-1 w-8 rounded-full border-t-2 border-dashed border-sky-400" />비교 기간</span>
              </div>
              <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm">마지막 포인트: {lastPoint.date} · 현재 {formatMetricValue(lastCurrent, activeMetric.unit)} / 비교 {formatMetricValue(lastCompare, activeMetric.unit)} · {lastChange.label}</span>
            </div>
            <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-[360px] w-full" role="img" aria-label={`${selectedMetric} 현재 기간과 비교 기간 라인 그래프`}>
              {[0, 1, 2, 3].map((line) => {
                const y = chart.padding + (line * (chart.height - chart.padding * 2)) / 3;
                return <line key={line} x1={chart.padding} x2={chart.width - chart.padding} y1={y} y2={y} stroke="#dbeafe" strokeDasharray="4 8" />;
              })}
              <path d={chart.comparePath} fill="none" stroke="#38bdf8" strokeDasharray="6 8" strokeLinecap="round" strokeWidth="2.25" />
              <path d={chart.currentPath} fill="none" stroke="#4f46e5" strokeLinecap="round" strokeWidth="3" />
              {trend.points.map((item, index) => {
                const x = chart.padding + (index * (chart.width - chart.padding * 2)) / Math.max(1, trend.points.length - 1);
                const currentRatio = (chart.currentValues[index] - chart.min) / (chart.max - chart.min);
                const compareRatio = (chart.compareValues[index] - chart.min) / (chart.max - chart.min);
                const currentY = chart.height - chart.padding - currentRatio * (chart.height - chart.padding * 2);
                const compareY = chart.height - chart.padding - compareRatio * (chart.height - chart.padding * 2);
                const showLabel = trend.isHourly || trend.points.length <= 14 || index % Math.ceil(trend.points.length / 12) === 0 || index === trend.points.length - 1;
                return (
                  <g key={`${item.date}-${index}`}>
                    <title>{`${item.date}\n현재 ${selectedMetric}: ${formatMetricValue(Number(item[activeMetric.current]), activeMetric.unit)}\n비교 ${selectedMetric}: ${formatMetricValue(Number(item[activeMetric.compare]), activeMetric.unit)}`}</title>
                    <circle cx={x} cy={compareY} r="2.5" fill="#38bdf8" opacity="0.7" />
                    <circle cx={x} cy={currentY} r="3" fill="#4f46e5" stroke="white" strokeWidth="1.5" />
                    {showLabel && <text x={x} y={chart.height - 8} textAnchor="end" transform={`rotate(-35 ${x} ${chart.height - 8})`} className="fill-slate-500 text-[13px] font-bold">{item.label}</text>}
                  </g>
                );
              })}
              <text x={chart.padding} y="26" className="fill-slate-500 text-[16px] font-bold">{formatAxisValue(chart.max, activeMetric.unit)}</text>
              <text x={chart.padding} y={chart.height - 22} className="fill-slate-500 text-[16px] font-bold">{formatAxisValue(chart.min, activeMetric.unit)}</text>
            </svg>
          </div>
        </CardContent>
      </Card>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-6">
              <p className="text-sm font-bold text-slate-500">{kpi.label}</p>
              <p className="mt-3 text-2xl font-black text-slate-950">{kpi.value}</p>
              <p className={kpi.positive ? "mt-3 flex items-center gap-1 text-sm font-black text-emerald-600" : "mt-3 flex items-center gap-1 text-sm font-black text-rose-600"}>
                {kpi.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {kpi.change} <span className="font-semibold text-slate-500">{kpi.compareLabel}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>상품별 매출 TOP10</CardTitle>
                <CardDescription>어떤 언어 상품이 실제 순매출을 만들고 성장하는지 확인합니다.</CardDescription>
              </div>
              <Badge variant="success">중요</Badge>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>상품명</TableHead>
                  <TableHead>언어</TableHead>
                  <TableHead className="text-right">판매수량</TableHead>
                  <TableHead className="text-right">순매출</TableHead>
                  <TableHead className="text-right">증감률</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productTop10.map((item, index) => (
                  <TableRow key={item.product}>
                    <TableCell className="font-bold text-slate-900"><span className="mr-3 text-slate-400">{index + 1}</span>{item.product}</TableCell>
                    <TableCell><Badge variant="default">{item.language}</Badge></TableCell>
                    <TableCell className="text-right font-semibold">{item.quantity}개</TableCell>
                    <TableCell className="text-right font-black">{item.netRevenue}</TableCell>
                    <TableCell className={item.change.startsWith("+") ? "text-right font-black text-emerald-600" : "text-right font-black text-rose-600"}>{item.change}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>국가별 매출</CardTitle>
            <CardDescription>순매출 기준 국가별 기여도입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {countryRevenue.map((item) => (
              <div key={item.country}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-800">{item.country}</span>
                  <span className="font-black">{item.revenue}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-500" style={{ width: item.shareLabel }} /></div>
                <div className="mt-1 flex justify-between text-xs font-semibold text-slate-500"><span>{item.shareLabel}</span><span className={item.change.startsWith("+") ? "text-emerald-600" : "text-rose-600"}>{item.change}</span></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>신규 구매 vs 재구매</CardTitle><CardDescription>성장이 신규 유입인지 기존 회원 재구매인지 구분합니다.</CardDescription></CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">신규 구매 매출</p><p className="mt-2 text-xl font-black">{formatCompactCurrency(totals.netRevenue * 0.6)}</p><p className="text-sm font-bold text-emerald-600">▲ 14.0%</p></div>
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">재구매 매출</p><p className="mt-2 text-xl font-black">{formatCompactCurrency(totals.netRevenue * 0.4)}</p><p className="text-sm font-bold text-emerald-600">▲ 25.5%</p></div>
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">재구매율</p><p className="mt-2 text-xl font-black">{totals.repeatRate.toFixed(1)}%</p><p className="text-sm font-bold text-emerald-600">▲ 3.2%p</p></div>
            </div>
            <div className="space-y-2">
              <div className="flex h-5 overflow-hidden rounded-full bg-slate-100"><div className="bg-indigo-500" style={{ width: "60%" }} /><div className="bg-sky-400" style={{ width: "40%" }} /></div>
              <div className="flex justify-between text-xs font-bold text-slate-500"><span>신규 구매 60%</span><span>재구매 40%</span></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>환불 분석</CardTitle><CardDescription>순매출을 훼손하는 환불 흐름을 확인합니다.</CardDescription></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {[{ label: "총 환불금액", value: formatCurrency(totals.refundAmount), change: getChange(totals.refundAmount, totals.compareRefundAmount, "down").label }, { label: "환불건수", value: `${Math.round(totals.orderCount * 0.052)}건`, change: "▼ 4.2%" }, { label: "환불률", value: `${((totals.refundAmount / totals.grossPayment) * 100).toFixed(1)}%`, change: "▼ 0.8%p" }, { label: "환불 TOP 상품", value: "독일어 마스터", change: formatCurrency(totals.refundAmount * 0.23) }].map((item) => (
              <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-500">{item.label}</p>
                <p className="mt-2 text-xl font-black text-slate-950">{item.value}</p>
                <p className="text-sm font-bold text-emerald-600">{item.change}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card className="mt-6">
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div><CardTitle>{trend.isHourly ? "시간대별" : "일별"} 판매 합계</CardTitle><CardDescription>필터 선택에 따라 mock 합계와 다운로드 대상이 함께 변경됩니다.</CardDescription></div>
          <Button variant="outline" size="sm"><Download className="h-4 w-4" /> CSV 다운로드</Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{trend.isHourly ? "시간" : "날짜"}</TableHead>
                <TableHead className="text-right">주문건수</TableHead>
                <TableHead className="text-right">총 결제금액</TableHead>
                <TableHead className="text-right">환불금액</TableHead>
                <TableHead className="text-right">쿠폰</TableHead>
                <TableHead className="text-right">순매출</TableHead>
                <TableHead className="text-right">배송</TableHead>
                <TableHead className="text-right">총판매</TableHead>
                <TableHead className="text-right">증감률</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dailySales.map((item) => (
                <TableRow key={item.date}>
                  <TableCell className="font-bold">{item.date}</TableCell>
                  <TableCell className="text-right">{item.orders}건</TableCell>
                  <TableCell className="text-right">{item.gross}</TableCell>
                  <TableCell className="text-right">{item.refund}</TableCell>
                  <TableCell className="text-right">{item.coupon}</TableCell>
                  <TableCell className="text-right font-black">{item.net}</TableCell>
                  <TableCell className="text-right">{item.shipping}</TableCell>
                  <TableCell className="text-right">{item.total}</TableCell>
                  <TableCell className="text-right font-black text-emerald-600">{item.change}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-slate-50/80 font-black">
                <TableCell>합계</TableCell>
                <TableCell className="text-right">{totals.orderCount.toLocaleString("ko-KR")}건</TableCell>
                <TableCell className="text-right">{formatCurrency(totals.grossPayment)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totals.refundAmount)}</TableCell>
                <TableCell className="text-right">{formatCurrency(couponTotal)}</TableCell>
                <TableCell className="text-right">{formatCurrency(tableNetTotal)}</TableCell>
                <TableCell className="text-right">{formatCurrency(shippingTotal)}</TableCell>
                <TableCell className="text-right">{formatCurrency(tableNetTotal + shippingTotal)}</TableCell>
                <TableCell className={summary.positive ? "text-right text-emerald-600" : "text-right text-rose-600"}>{summary.label}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
