"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "default";
  icon?: React.ReactNode;
  itemDetails?: {
    label?: string;
    title: string;
    subtitle?: string;
    badge?: string;
  };
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm Action",
  cancelLabel = "Cancel",
  variant = "destructive",
  icon,
  itemDetails,
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const isDestructive = variant === "destructive";

  return (
    <Dialog open={open} onOpenChange={isLoading ? () => {} : onOpenChange}>
      <DialogContent className="max-w-[420px] bg-white border border-zinc-200 p-6 shadow-2xl rounded-xl">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border",
              isDestructive
                ? "bg-red-50 text-red-600 border-red-100"
                : "bg-zinc-100 text-zinc-900 border-zinc-200"
            )}
          >
            {icon ? (
              icon
            ) : isDestructive ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <Info className="h-5 w-5" />
            )}
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <DialogTitle className="text-base font-bold text-zinc-950 tracking-tight leading-snug">
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 leading-relaxed">
              {description}
            </DialogDescription>
          </div>
        </div>

        {itemDetails && (
          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs mt-1 space-y-0.5">
            {itemDetails.label && (
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                {itemDetails.label}
              </div>
            )}
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-zinc-950 truncate">{itemDetails.title}</span>
              {itemDetails.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-zinc-200/80 text-zinc-700 rounded shrink-0">
                  {itemDetails.badge}
                </span>
              )}
            </div>
            {itemDetails.subtitle && (
              <div className="text-[11px] text-zinc-500 font-mono truncate">{itemDetails.subtitle}</div>
            )}
          </div>
        )}

        <DialogFooter className="pt-2 flex items-center gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
            className="h-8 px-3 text-xs border-zinc-300 text-zinc-700 hover:bg-zinc-100"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isLoading}
            onClick={onConfirm}
            className={cn(
              "h-8 px-3.5 text-xs text-white font-medium shadow-xs",
              isDestructive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-zinc-950 hover:bg-zinc-800"
            )}
          >
            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
