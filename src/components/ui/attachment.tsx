import * as React from "react";
import { Paperclip, Download, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AttachmentProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: string;
  url?: string;
  onRemove?: () => void;
}

export function Attachment({
  name,
  size,
  url,
  onRemove,
  className,
  ...props
}: AttachmentProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100",
        className
      )}
      {...props}
    >
      <Paperclip className="h-3.5 w-3.5 text-zinc-500" />
      <span className="font-medium truncate max-w-[180px]">{name}</span>
      {size && <span className="text-zinc-400 font-mono text-[10px]">({size})</span>}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 text-zinc-500 hover:text-black dark:hover:text-white"
        >
          <Download className="h-3.5 w-3.5" />
        </a>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 text-zinc-400 hover:text-black dark:hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
