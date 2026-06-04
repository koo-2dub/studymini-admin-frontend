"use client";

import { Download, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const periodOptions = ["오늘", "최근 7일", "최근 30일", "이번 달", "사용자 지정"];
const comparisonOptions = ["전일 대비", "전주 대비", "전월 대비", "전년 대비"];
const metricOptions = ["순매출", "총 결제금액", "총 환불금액", "주문건수"] as const;

type MetricKey = (typeof metricOptions)[number];
type TrendPoint = { date: string; label: string; netRevenue: number; grossPayment: number; refundAmount: number; orderCount: number; compareNetRevenue: number; compareGrossPayment: number; compareRefundAmount: number; compareOrderCount: number };
type Kpi = { label: string; value: string; change: string; trend: "up" | "down"; positive: boolean; compareLabel: string };

const trendData: TrendPoint[] = [
  { date: "2026.05.06", label: "5/6", netRevenue: 980000, grossPayment: 1210000, refundAmount: 70000, orderCount: 31, compareNetRevenue: 860000, compareGrossPayment: 1030000, compareRefundAmount: 82000, compareOrderCount: 27 },
  { date: "2026.05.09", label: "5/9", netRevenue: 1220000, grossPayment: 1460000, refundAmount: 90000, orderCount: 38, compareNetRevenue: 940000, compareGrossPayment: 1180000, compareRefundAmount: 120000, compareOrderCount: 29 },
  { date: "2026.05.12", label: "5/12", netRevenue: 1090000, grossPayment: 1370000, refundAmount: 120000, orderCount: 34, compareNetRevenue: 1010000, compareGrossPayment: 1240000, compareRefundAmount: 96000, compareOrderCount: 32 },
  { date: "2026.05.15", label: "5/15", netRevenue: 1650000, grossPayment: 1970000, refundAmount: 80000, orderCount: 47, compareNetRevenue: 980000, compareGrossPayment: 1190000, compareRefundAmount: 110000, compareOrderCount: 30 },
  { date: "2026.05.18", label: "5/18", netRevenue: 1320000, grossPayment: 1580000, refundAmount: 130000, orderCount: 41, compareNetRevenue: 1120000, compareGrossPayment: 1360000, compareRefundAmount: 140000, compareOrderCount: 34 },
  { date: "2026.05.21", label: "5/21", netRevenue: 1510000, grossPayment: 1840000, refundAmount: 95000, orderCount: 44, compareNetRevenue: 1270000, compareGrossPayment: 1520000, compareRefundAmount: 125000, compareOrderCount: 37 },
  { date: "2026.05.24", label: "5/24", netRevenue: 1430000, grossPayment: 1710000, refundAmount: 100000, orderCount: 42, compareNetRevenue: 1180000, compareGrossPayment: 1430000, compareRefundAmount: 118000, compareOrderCount: 35 },
  { date: "2026.05.27", label: "5/27", netRevenue: 1780000, grossPayment: 2120000, refundAmount: 85000, orderCount: 52, compareNetRevenue: 1360000, compareGrossPayment: 1680000, compareRefundAmount: 132000, compareOrderCount: 39 },
  { date: "2026.05.30", label: "5/30", netRevenue: 1590000, grossPayment: 1930000, refundAmount: 150000, orderCount: 46, compareNetRevenue: 1280000, compareGrossPayment: 1570000, compareRefundAmount: 160000, compareOrderCount: 38 },
  { date: "2026.06.02", label: "6/2", netRevenue: 1880000, grossPayment: 2290000, refundAmount: 105000, orderCount: 55, compareNetRevenue: 1490000, compareGrossPayment: 1810000, compareRefundAmount: 145000, compareOrderCount: 43 },
  { date: "2026.06.04", label: "6/4", netRevenue: 1710000, grossPayment: 2080000, refundAmount: 110000, orderCount: 49, compareNetRevenue: 1390000, compareGrossPayment: 1690000, compareRefundAmount: 130000, compareOrderCount: 40 },
];

const metricConfig: Record<MetricKey, { current: keyof TrendPoint; compare: keyof TrendPoint; unit: "currency" | "count"; summary: string; currentTotal: string; compareTotal: string; change: string; positive: boolean }> = {
  순매출: { current: "netRevenue", compare: "compareNetRevenue", unit: "currency", summary: "순매출이 전월 대비 18.2% 증가했습니다.", currentTotal: "₩35,000,000", compareTotal: "₩29,600,000", change: "▲ 18.2%", positive: true },
  "총 결제금액": { current: "grossPayment", compare: "compareGrossPayment", unit: "currency", summary: "총 결제금액이 전월 대비 12.4% 증가했습니다.", currentTotal: "₩42,800,000", compareTotal: "₩38,080,000", change: "▲ 12.4%", positive: true },
  "총 환불금액": { current: "refundAmount", compare: "compareRefundAmount", unit: "currency", summary: "총 환불금액이 전월 대비 6.8% 감소했습니다.", currentTotal: "₩2,100,000", compareTotal: "₩2,253,000", change: "▼ 6.8%", positive: true },
  주문건수: { current: "orderCount", compare: "compareOrderCount", unit: "count", summary: "주문건수가 전월 대비 10.6% 증가했습니다.", currentTotal: "1,240건", compareTotal: "1,121건", change: "▲ 10.6%", positive: true },
};

const kpis: Kpi[] = [
  { label: "순매출", value: "₩35,000,000", change: "▲ 18.2%", trend: "up", positive: true, compareLabel: "전월 대비" },
  { label: "총 결제금액", value: "₩42,800,000", change: "▲ 12.4%", trend: "up", positive: true, compareLabel: "전월 대비" },
  { label: "총 환불금액", value: "₩2,100,000", change: "▼ 6.8%", trend: "down", positive: true, compareLabel: "전월 대비" },
  { label: "신규 결제회원", value: "842명", change: "▲ 9.1%", trend: "up", positive: true, compareLabel: "전월 대비" },
  { label: "재구매율", value: "38.4%", change: "▲ 3.2%p", trend: "up", positive: true, compareLabel: "전월 대비" },
];

const productTop10 = [
  { product: "스페인어 풀패키지", language: "스페인어", quantity: 214, netRevenue: "₩8,400,000", change: "+24.1%" },
  { product: "프랑스어 베이직", language: "프랑스어", quantity: 168, netRevenue: "₩5,900,000", change: "+11.8%" },
  { product: "독일어 마스터", language: "독일어", quantity: 121, netRevenue: "₩4,200,000", change: "-3.4%" },
  { product: "영어 회화 집중반", language: "영어", quantity: 98, netRevenue: "₩3,640,000", change: "+9.7%" },
  { product: "일본어 스타터", language: "일본어", quantity: 86, netRevenue: "₩2,980,000", change: "+6.2%" },
  { product: "중국어 입문", language: "중국어", quantity: 73, netRevenue: "₩2,410,000", change: "+4.8%" },
  { product: "이탈리아어 여행 회화", language: "이탈리아어", quantity: 61, netRevenue: "₩1,980,000", change: "+13.5%" },
  { product: "러시아어 알파벳", language: "러시아어", quantity: 54, netRevenue: "₩1,620,000", change: "-2.1%" },
  { product: "아랍어 기초", language: "아랍어", quantity: 47, netRevenue: "₩1,420,000", change: "+7.4%" },
  { product: "포르투갈어 스타터", language: "포르투갈어", quantity: 39, netRevenue: "₩1,180,000", change: "+5.6%" },
];

const countryRevenue = [
  { country: "대한민국", revenue: "₩24.1M", share: "68.9%", change: "+16.2%" },
  { country: "미국", revenue: "₩5.2M", share: "14.8%", change: "+22.4%" },
  { country: "일본", revenue: "₩2.7M", share: "7.7%", change: "-4.1%" },
  { country: "캐나다", revenue: "₩1.6M", share: "4.6%", change: "+8.9%" },
];

const dailySales = [
  { date: "2026.05.06", orders: 42, gross: "₩1,520,000", refund: "₩80,000", coupon: "₩110,000", net: "₩1,330,000", shipping: "₩34,000", total: "₩1,364,000", change: "+12.4%" },
  { date: "2026.05.07", orders: 38, gross: "₩1,310,000", refund: "₩60,000", coupon: "₩95,000", net: "₩1,155,000", shipping: "₩28,000", total: "₩1,183,000", change: "+8.1%" },
  { date: "2026.05.08", orders: 45, gross: "₩1,680,000", refund: "₩120,000", coupon: "₩130,000", net: "₩1,430,000", shipping: "₩37,000", total: "₩1,467,000", change: "+19.6%" },
  { date: "2026.05.09", orders: 51, gross: "₩1,940,000", refund: "₩90,000", coupon: "₩155,000", net: "₩1,695,000", shipping: "₩42,000", total: "₩1,737,000", change: "+23.5%" },
];

function formatChartValue(value: number, unit: "currency" | "count") {
  if (unit === "count") return `${value}건`;
  return `₩${Math.round(value / 10000).toLocaleString("ko-KR")}만`;
}

function buildPath(points: number[], width: number, height: number, padding: number, max: number, min: number) {
  return points
    .map((value, index) => {
      const x = padding + (index * (width - padding * 2)) / (points.length - 1);
      const ratio = max === min ? 0.5 : (value - min) / (max - min);
      const y = height - padding - ratio * (height - padding * 2);
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export default function AnalyticsPage() {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("순매출");
  const activeMetric = metricConfig[selectedMetric];

  const chart = useMemo(() => {
    const currentValues = trendData.map((item) => Number(item[activeMetric.current]));
    const compareValues = trendData.map((item) => Number(item[activeMetric.compare]));
    const allValues = [...currentValues, ...compareValues];
    const max = Math.max(...allValues) * 1.08;
    const min = Math.min(...allValues) * 0.86;
    const width = 900;
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
  }, [activeMetric]);

  return (
    <>
      <PageHeader eyebrow="Revenue analytics" title="Sales Analytics" description="기간별 순매출, 결제, 환불, 구매회원 흐름을 비교 기준과 함께 확인합니다." />

      <Card>
        <CardContent className="space-y-5 pt-6">
          <div className="flex flex-wrap gap-2">
            {periodOptions.map((option) => (
              <Button key={option} variant={option === "최근 30일" ? "default" : "outline"} size="sm">{option}</Button>
            ))}
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-bold text-slate-700">비교 기준</span>
              {comparisonOptions.map((option) => (
                <Button key={option} variant={option === "전월 대비" ? "secondary" : "outline"} size="sm">{option}</Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">적용</Button>
              <Button size="sm"><Download className="h-4 w-4" /> 다운로드</Button>
            </div>
          </div>
          <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 md:grid-cols-3">
            <span><strong className="text-slate-900">현재 기간</strong> 2026.05.06 ~ 2026.06.04</span>
            <span><strong className="text-slate-900">비교 기간</strong> 2026.04.06 ~ 2026.05.05</span>
            <span><strong className="text-slate-900">비교 기준</strong> 전월 대비</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 overflow-hidden">
        <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
          <div>
            <CardTitle className="text-2xl">{selectedMetric} 추이</CardTitle>
            <CardDescription>현재 기간과 비교 기간의 일별 흐름을 같은 축에서 비교합니다.</CardDescription>
            <div className="mt-4 flex flex-wrap items-end gap-4">
              <div>
                <div className={activeMetric.positive ? "text-3xl font-black text-emerald-600" : "text-3xl font-black text-rose-600"}>
                  {activeMetric.change}
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-700">{activeMetric.summary}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                현재 {activeMetric.currentTotal} / 비교 {activeMetric.compareTotal}
              </div>
            </div>
          </div>
          <label className="flex items-center gap-2 rounded-2xl border bg-white px-3 py-2 text-sm font-bold text-slate-700">
            지표
            <select
              className="bg-transparent text-sm font-black outline-none"
              value={selectedMetric}
              onChange={(event) => setSelectedMetric(event.target.value as MetricKey)}
              aria-label="그래프 지표 선택"
            >
              {metricOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        </CardHeader>
        <CardContent>
          <div className="rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-4">
            <div className="mb-4 flex flex-wrap gap-4 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-2"><span className="h-1 w-8 rounded-full bg-indigo-600" />현재 기간</span>
              <span className="flex items-center gap-2"><span className="h-1 w-8 rounded-full border-t-2 border-dashed border-sky-400" />비교 기간</span>
            </div>
            <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-[360px] w-full" role="img" aria-label={`${selectedMetric} 현재 기간과 비교 기간 라인 그래프`}>
              {[0, 1, 2, 3].map((line) => {
                const y = chart.padding + (line * (chart.height - chart.padding * 2)) / 3;
                return <line key={line} x1={chart.padding} x2={chart.width - chart.padding} y1={y} y2={y} stroke="#dbeafe" strokeDasharray="4 8" />;
              })}
              <path d={chart.comparePath} fill="none" stroke="#38bdf8" strokeDasharray="8 10" strokeLinecap="round" strokeWidth="5" />
              <path d={chart.currentPath} fill="none" stroke="#4f46e5" strokeLinecap="round" strokeWidth="6" />
              {trendData.map((item, index) => {
                const x = chart.padding + (index * (chart.width - chart.padding * 2)) / (trendData.length - 1);
                const currentRatio = (chart.currentValues[index] - chart.min) / (chart.max - chart.min);
                const compareRatio = (chart.compareValues[index] - chart.min) / (chart.max - chart.min);
                const currentY = chart.height - chart.padding - currentRatio * (chart.height - chart.padding * 2);
                const compareY = chart.height - chart.padding - compareRatio * (chart.height - chart.padding * 2);
                return (
                  <g key={item.date}>
                    <circle cx={x} cy={compareY} r="4" fill="#38bdf8" opacity="0.7" />
                    <circle cx={x} cy={currentY} r="5" fill="#4f46e5" stroke="white" strokeWidth="3" />
                    {index % 2 === 0 && <text x={x} y={chart.height - 10} textAnchor="middle" className="fill-slate-500 text-[18px] font-bold">{item.label}</text>}
                  </g>
                );
              })}
              <text x={chart.padding} y="26" className="fill-slate-500 text-[18px] font-bold">{formatChartValue(chart.max, activeMetric.unit)}</text>
              <text x={chart.padding} y={chart.height - 22} className="fill-slate-500 text-[18px] font-bold">{formatChartValue(chart.min, activeMetric.unit)}</text>
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
                <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-500" style={{ width: item.share }} /></div>
                <div className="mt-1 flex justify-between text-xs font-semibold text-slate-500"><span>{item.share}</span><span className={item.change.startsWith("+") ? "text-emerald-600" : "text-rose-600"}>{item.change}</span></div>
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
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">신규 구매 매출</p><p className="mt-2 text-xl font-black">₩21.0M</p><p className="text-sm font-bold text-emerald-600">▲ 14.0%</p></div>
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">재구매 매출</p><p className="mt-2 text-xl font-black">₩14.0M</p><p className="text-sm font-bold text-emerald-600">▲ 25.5%</p></div>
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">재구매율</p><p className="mt-2 text-xl font-black">38.4%</p><p className="text-sm font-bold text-emerald-600">▲ 3.2%p</p></div>
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
            {[{ label: "총 환불금액", value: "₩2,100,000", change: "▼ 6.8%" }, { label: "환불건수", value: "63건", change: "▼ 4.2%" }, { label: "환불률", value: "4.9%", change: "▼ 0.8%p" }, { label: "환불 TOP 상품", value: "독일어 마스터", change: "₩480,000" }].map((item) => (
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
          <div><CardTitle>일별 판매 합계</CardTitle><CardDescription>PDF 요구사항 기준 일별 매출 합계와 다운로드 기능입니다.</CardDescription></div>
          <Button variant="outline" size="sm"><Download className="h-4 w-4" /> CSV 다운로드</Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>날짜</TableHead>
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
                <TableCell className="text-right">1,240건</TableCell>
                <TableCell className="text-right">₩42,800,000</TableCell>
                <TableCell className="text-right">₩2,100,000</TableCell>
                <TableCell className="text-right">₩5,700,000</TableCell>
                <TableCell className="text-right">₩35,000,000</TableCell>
                <TableCell className="text-right">₩800,000</TableCell>
                <TableCell className="text-right">₩35,800,000</TableCell>
                <TableCell className="text-right text-emerald-600">+18.2%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
