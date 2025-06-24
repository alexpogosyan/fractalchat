export interface Thread {
  id: string;
  user_id: string;
  parent_id: string | null;
  title: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  thread_id: string;
  sender: "user" | "assistant";
  content: string | null;
  created_at: string;
}

export type TextQuoteSelector = {
  exact: string;
  prefix?: string;
  suffix?: string;
};

export interface Anchor {
  id: string;
  message_id: string;
  thread_id: string;
  selector: TextQuoteSelector;
}

export interface ThreadBundle {
  thread: Thread;
  messages: Message[];
  anchors: Anchor[];
}
