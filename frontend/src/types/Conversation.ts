import { Message } from "./Message";
import { User } from "./User";

export interface Conversation {
  id: number;
  name: string;
  type: "private" | "group";
  conversationUsers?: { User: User }[];
  messages?: Message[];
  selected?: boolean;
}
