export interface ApiSuccessResponse<T> {
  data: T;
  message: string;
}

export interface ApiCollectionResponse<T> {
  data: T[];
  meta: {
    total: number;
  };
  message: string;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> =
  | ApiSuccessResponse<T>
  | ApiCollectionResponse<T>
  | ApiErrorBody;
