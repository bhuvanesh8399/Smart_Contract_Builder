from typing import Any, Generic, TypeVar

from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

T = TypeVar("T")


class ErrorDetail(BaseModel):
    code: str
    message: str
    details: list[Any] = Field(default_factory=list)


class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str
    data: T


class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorDetail


def success_response(data: T, message: str) -> ApiResponse[T]:
    return ApiResponse[T](message=message, data=data)


def _normalize_details(details: Any) -> list[Any]:
    if details is None:
        return []
    if isinstance(details, list):
        return details
    return [details]


def error_payload(code: str, message: str, details: Any = None) -> dict[str, Any]:
    return ErrorResponse(
        error=ErrorDetail(code=code, message=message, details=_normalize_details(details))
    ).model_dump()


async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
    detail = exc.detail
    message = detail if isinstance(detail, str) else "Request failed"
    details = None if isinstance(detail, str) else detail
    code = f"http_{exc.status_code}"
    return JSONResponse(
        status_code=exc.status_code,
        content=error_payload(code=code, message=message, details=details),
    )


async def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content=error_payload(
            code="validation_error",
            message="Request validation failed",
            details=exc.errors(),
        ),
    )


async def unhandled_exception_handler(_: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content=error_payload(
            code="internal_server_error",
            message="An unexpected server error occurred",
            details=[str(exc)],
        ),
    )
