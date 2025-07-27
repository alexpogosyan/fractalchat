export function getOffsets(root: HTMLElement | null, range: Range) {
  if (!root) return { startAbs: -1, endAbs: -1 };
  let offset = 0;
  let startAbs = -1,
    endAbs = -1;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const len = node.textContent?.length ?? 0;

    if (node === range.startContainer) startAbs = offset + range.startOffset;
    if (node === range.endContainer) endAbs = offset + range.endOffset;

    offset += len;
    node = walker.nextNode();
  }
  return { startAbs, endAbs };
}
