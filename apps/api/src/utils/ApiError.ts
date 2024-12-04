export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    return {
      success: false,
      message: error.message,
      statusCode: error.statusCode
    };
  }

  // Handle unexpected errors
  console.error('Unexpected error:', error);
  return {
    success: false,
    message: 'An unexpected error occurred',
    statusCode: 500
  };
};
