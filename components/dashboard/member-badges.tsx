import { Badge } from "@/components/ui/badge";
import type { CustomerType, MemberStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function MemberStatusBadge({ value }: { value: MemberStatus }) {
  return <Badge variant={value === "정상" ? "success" : value === "탈퇴" ? "rose" : "slate"}>{value}</Badge>;
}

export function CustomerBadge({ value }: { value: CustomerType }) {
  return (
    <Badge variant={value === "구매회원" ? "default" : "slate"} className={cn(value === "구매회원" && "border-blue-200 bg-blue-50 text-blue-700")}>
      {value}
    </Badge>
  );
}
