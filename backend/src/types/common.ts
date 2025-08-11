export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  successMessage: string | null;
  errorMessage: string | null;
};

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function createSuccessResponse<T>(
  data: T,
  successMessage: string = "Operation successful"
): ApiResponse<T> {
  return {
    success: true,
    data,
    successMessage,
    errorMessage: null,
  };
}

export function createErrorResponse(
  errorMessage: string = "An error occurred"
): ApiResponse<null> {
  return {
    success: false,
    errorMessage,
    successMessage: null,
    data: null,
  };
}
