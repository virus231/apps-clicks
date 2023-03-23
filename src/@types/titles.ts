export interface ITitles {
  titles: string[];
  success: boolean;
}

export type ApiResponse<T> = {
  success: boolean;
  data: T
}
