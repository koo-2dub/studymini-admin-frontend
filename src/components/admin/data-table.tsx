import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export type Column<T> = { key: string; header: string; render: (row: T) => React.ReactNode };

export function DataTable<T>({ columns, data, filters = [], searchPlaceholder = "검색어를 입력하세요" }: { columns: Column<T>[]; data: T[]; filters?: string[]; searchPlaceholder?: string }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-10" placeholder={searchPlaceholder} />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => <Button key={filter} variant="outline" size="sm">{filter}</Button>)}
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow>{columns.map((column) => <TableHead key={column.key}>{column.header}</TableHead>)}</TableRow>
            </TableHeader>
            <TableBody>
              {data.length ? data.map((row, index) => (
                <TableRow key={index}>{columns.map((column) => <TableCell key={column.key}>{column.render(row)}</TableCell>)}</TableRow>
              )) : (
                <TableRow><TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">표시할 데이터가 없습니다.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between border-t p-4 text-sm text-muted-foreground">
          <span>1-10 / {data.length}개 표시</span>
          <div className="flex gap-2"><Button variant="outline" size="sm">이전</Button><Button variant="outline" size="sm">다음</Button></div>
        </div>
      </CardContent>
    </Card>
  );
}
