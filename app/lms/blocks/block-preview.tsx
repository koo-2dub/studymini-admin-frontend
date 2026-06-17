import { ExternalLink } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import type { ContentBlock } from "./data";

export function BlockPreview({ block }: { block: ContentBlock }) {
  if (block.type === "영상") {
    return (
      <video className="aspect-video w-full rounded-3xl bg-slate-950" src={block.mediaUrl} controls>
        영상 player를 지원하지 않는 브라우저입니다.
      </video>
    );
  }

  if (block.type === "오디오") {
    return (
      <div className="rounded-3xl bg-emerald-50 p-5">
        <audio className="w-full" src={block.mediaUrl} controls>
          오디오 player를 지원하지 않는 브라우저입니다.
        </audio>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-amber-50 p-5">
      <p className="break-all text-sm font-semibold text-amber-900">{block.mediaUrl}</p>
      <Button asChild className="mt-4 bg-amber-500 hover:bg-amber-600">
        <Link href={block.mediaUrl} target="_blank" rel="noreferrer">
          바로가기
          <ExternalLink className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
