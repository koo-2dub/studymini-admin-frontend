import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
};

export function DataTable<T extends { id?: string }>({
  title,
  description,
  columns,
  data,
}: {
  title: string;
  description: string;
  columns: Column<T>[];
  data: T[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table className="min-w-[980px] text-sm">
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)} className="whitespace-nowrap px-3 py-3 text-xs font-black uppercase tracking-wide text-slate-500">{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => {
              return (
                <TableRow key={item.id ?? index}>
                  {columns.map((column) => (
                    <TableCell key={String(column.key)} className="px-3 py-3 align-middle">
                      {column.render ? column.render(item) : String(item[column.key as keyof T] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


export function StatusBadge({ value }: { value: string }) {
  const variant = value.match(/정상|active|paid|answered|live|issued/i)
    ? "success"
    : value.match(/탈퇴|failed|refund|ending/i)
      ? "rose"
      : value.match(/휴면/i)
        ? "slate"
        : value.match(/trial|scheduled|progress|assigned/i)
          ? "warning"
          : "slate";
  return <Badge variant={variant}>{value}</Badge>;
}

export function MarketingBadge({ agreed }: { agreed: boolean }) {
  return <Badge variant={agreed ? "default" : "slate"}>{agreed ? "동의" : "미동의"}</Badge>;
}
