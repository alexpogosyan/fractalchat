import { useStore } from "@/store/useStore";

export function buildContext(threadId: string, limit = 20) {
  const { threads, messages, anchors } = useStore.getState();
  let ctx: { role: "user" | "assistant"; content: string }[] = [];

  let curId: string | null = threadId;

  while (curId) {
    ctx = [
      ...(messages[curId] ?? []).map((m) => ({
        role: m.sender,
        content: m.content || "",
      })),
      ...ctx,
    ];

    const parentId: string | null = threads[curId]?.parent_id;
    if (!parentId) break;

    const anch = (anchors[parentId] ?? []).find((a) => a.thread_id === curId);
    if (!anch) break;

    const parentMsg = (messages[parentId] ?? []).find(
      (m) => m.id === anch.message_id
    );
    if (parentMsg?.content) {
      const excerpt = parentMsg.content.slice(anch.start_index, anch.end_index);

      ctx.unshift({
        role: "assistant",
        content:
          `<focus>\nThe user is zooming in on:\n\n"${excerpt}"\n\n` +
          `Answer their follow-up question with that in mind.\n</focus>`,
      });
    }

    const parentMsgs = messages[parentId] ?? [];
    const anchorIdx = parentMsgs.findIndex((m) => m.id === anch.message_id);
    ctx = [
      ...parentMsgs.slice(0, anchorIdx + 1).map((m) => ({
        role: m.sender,
        content: m.content || "",
      })),
      ...ctx,
    ];

    curId = parentId;
  }

  return ctx.slice(-limit);
}
