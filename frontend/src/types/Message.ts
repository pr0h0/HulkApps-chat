import { User } from "./User";

export interface Message {
  id: number;
  text: string;
  userId: number;
  conversationId: number;
  createdAt: string;
  User?: User;
}
