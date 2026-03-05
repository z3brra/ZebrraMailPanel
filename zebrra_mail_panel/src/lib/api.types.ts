export type ApiErrorCode =
    | "AUTH_REQUIRED"
    | "AUTH_INVALID"
    | "BAD_REQUEST"
    | "FORBIDDEN"
    | "SCOPE_VIOLATION"
    | "NOT_FOUND"
    | "CONFLICT"
    | "VALIDATION_ERROR"
    | "RATE_LIMITED"
    | "INTERNAL_ERROR";

export type ApiErrorResponse = {
    error: {
        code: ApiErrorCode;
        message: string;
        details: Record<string, unknown> | null;
        requestId: string | null;
    };
};

export function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
    if (!data || typeof data !== "object") {
        return false;
    }
    const error = (data as any).error;
    return (
        error &&
        typeof error === "object" &&
        typeof error.code === "string" &&
        typeof error.message === "string"
    );
}