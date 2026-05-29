"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { chartData } from "@/lib/mock-data";

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={chartData}>
        <defs><linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.35}/><stop offset="95%" stopColor="#f97316" stopOpacity={0}/></linearGradient></defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" /><YAxis /><Tooltip />
        <Area type="monotone" dataKey="revenue" stroke="#f97316" fillOpacity={1} fill="url(#revenue)" name="매출(만원)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function OrdersChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" /><YAxis /><Tooltip />
        <Bar dataKey="orders" fill="#fb923c" radius={[8, 8, 0, 0]} name="주문" />
      </BarChart>
    </ResponsiveContainer>
  );
}
