import { type Article } from "@prisma/client";

export interface ITitle {
  response: Article[];
  success: boolean;
}

export type ApiResponse<T> = {
  success: boolean;
  data: T
}
