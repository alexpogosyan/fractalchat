"use client";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";

export default function Composer({
  onSend,
  autoFocus = false,
}: {
  onSend: (prompt: string) => void;
  autoFocus?: boolean;
}) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const send = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    send();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-[750px] mx-auto">
      <div className="relative mb-2">
        <textarea
          ref={textareaRef}
          value={text}
          placeholder="Type your prompt…"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          className="w-full border border-gray-200 rounded-xl p-3 pr-16 text-sm"
        />

        <Button
          type="submit"
          variant="solid"
          size="sm"
          disabled={!text.trim()}
          className="absolute bottom-3 right-3 h-8 px-4 text-sm"
        >
          Send
        </Button>
      </div>
    </form>
  );
}
