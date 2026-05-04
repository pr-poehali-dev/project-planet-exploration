export interface Message {
  role: "user" | "assistant";
  content: string;
  image_base64?: string;
  video_base64?: string;
}

export interface ChatSession {
  id: string;
  product: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export interface CodeBlockProps {
  code: string;
  lang: string;
}
