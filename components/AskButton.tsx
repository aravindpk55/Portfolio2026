"use client";
import { MessageSquare } from "lucide-react";

export function AskButton() {
  return (
    <button type="button" className="btn-ghost" onClick={() => window.dispatchEvent(new CustomEvent("open-chat"))}>
      <MessageSquare size={17} /> Ask about my work
    </button>
  );
}
