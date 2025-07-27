declare module "dom-anchor-text-quote" {
  export interface TextQuoteSelector {
    exact: string;
    prefix?: string;
    suffix?: string;
  }

  export function fromRange(root: HTMLElement, range: Range): TextQuoteSelector;

  export function toRange(
    root: HTMLElement,
    selector: TextQuoteSelector,
    options?: { hint?: number }
  ): Range | null;
}
