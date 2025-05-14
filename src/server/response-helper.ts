
export type ResendAPIErrorType =
  | [
      "invalid_idempotency_key",
      "validation_error",
      "missing_api_key",
      "restricted_api_key",
      "invalid_api_key",
      "validation_error",
      "not_found",
      "method_not_allowed",
      "invalid_idempotent_request",
      "concurrent_idempotent_requests",
      "invalid_attachment",
      "invalid_from_address",
      "invalid_access",
      "invalid_parameter",
      "invalid_region",
      "missing_required_field",
      "daily_quota_exceeded",
      "rate_limit_exceeded",
      "security_error",
      "application_error",
      "internal_server_error",
    ][number]
  | "not_implemented";

export type ResendStatusCode =
  | 400
  | 401
  | 403
  | 404
  | 405
  | 409
  | 422
  | 429
  | 451
  | 500
  | 501;

export class ResendResponseError extends Error {
  statusCode: ResendStatusCode;
  type: ResendAPIErrorType;
  message: string;

  constructor(
    statusCode: ResendStatusCode,
    type: ResendAPIErrorType,
    message: string,
  ) {
    super(`ResendResponseError: ${type} - ${message}`);
    this.name = "ResendResponseError";

    this.statusCode = statusCode;
    this.type = type;
    this.message = message;
  }
}
