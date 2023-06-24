import { Conversation } from "./Conversation";
import { Nullable } from "./Other";
import { User } from "./User";

export interface Store {
  user: Nullable<User>;
  conversations: Conversation[];
}
