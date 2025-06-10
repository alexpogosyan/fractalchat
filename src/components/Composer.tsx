"use client";
import { useState } from "react";
import Button from "@/components/Button";

export default function Composer({
  onSend,
}: {
  onSend: (prompt: string) => void;
}) {
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    send();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 p-3 max-w-[80%] mx-auto"
    >
      <textarea
        value={text}
        placeholder="Type your prompt…"
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="flex-1 border border-gray-200 rounded-xl p-2 text-sm"
      />

      <Button type="submit" variant="solid" size="md" disabled={!text.trim()}>
        Send
      </Button>
    </form>
  );
}
