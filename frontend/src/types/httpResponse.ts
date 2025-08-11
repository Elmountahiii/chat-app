export type HttpResponse<T = unknown> = {
  success: boolean;
  data: T;
  successMessage: string | null;
  errorMessage: string | null;
};
