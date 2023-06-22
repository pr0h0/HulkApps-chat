import { Nullable } from "./Other";
import { User } from "./User";

export interface Store {
  user: Nullable<User>;
}
