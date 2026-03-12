import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: any[];
}

export class ApiError extends Error {
  statusCode: number;
  details?: any[];

  constructor(message: string, statusCode: number = 500, details?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ApiError';
  }
}

export function successResponse<T>(
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    } as ApiResponse<T>,
    { status: statusCode }
  );
}

export function errorResponse(
  error: string,
  statusCode: number = 500,
  details?: any[]
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
      details,
    } as ApiResponse,
    { status: statusCode }
  );
}

export function handleApiError(error: any): NextResponse {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return errorResponse(error.message, error.statusCode, error.details);
  }

  if (error.name === 'ZodError') {
    return errorResponse(
      'Validation failed',
      400,
      error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }))
    );
  }

  if (error.code === 11000) {
    return errorResponse('Duplicate entry found', 400);
  }

  return errorResponse('Internal server error', 500);
}