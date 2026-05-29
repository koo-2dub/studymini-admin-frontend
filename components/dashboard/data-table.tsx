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
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => {
              return (
                <TableRow key={item.id ?? index}>
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
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
  const variant = value.match(/active|paid|answered|live|issued|정상/i)
    ? "success"
    : value.match(/failed|refund|ending|withdrawn|탈퇴/i)
      ? "rose"
      : value.match(/trial|scheduled|progress|assigned|paused|dormant|휴면/i)
        ? "warning"
        : "slate";
  return <Badge variant={variant}>{value}</Badge>;
}
