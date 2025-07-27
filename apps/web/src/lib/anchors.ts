import * as textQuote from "dom-anchor-text-quote";
import type { TextQuoteSelector } from "@/types/app";

export function rangeToSelector(
  root: HTMLElement,
  range: Range
): TextQuoteSelector {
  const sel = textQuote.fromRange(root, range) as {
    exact: string;
    prefix?: string;
    suffix?: string;
  };

  return {
    exact: sel.exact,
    prefix: sel.prefix ?? "",
    suffix: sel.suffix ?? "",
  };
}

export function selectorToRange(
  root: HTMLElement,
  selector: TextQuoteSelector
): Range | null {
  return textQuote.toRange(root, selector) as Range | null;
}
