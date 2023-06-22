export type APIResponse<T> = {
  data: T;
  error: boolean;
  msg: string;
};
