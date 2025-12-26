from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any, TypeVar, Generic
from datetime import datetime

# Generic type for paginated responses
T = TypeVar('T')

class ResponseModel(BaseModel):
    """Base response model with success flag and message."""
    success: bool = True
    message: str = ""

class PaginatedResponse(Generic[T], ResponseModel):
    """Generic paginated response model."""
    data: List[T] = []
    total: int = 0
    page: int = 1
    limit: int = 10
    total_pages: int = 1

class Token(BaseModel):
    """JWT token response model."""
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    """Token data model."""
    id: Optional[int] = None
    email: Optional[str] = None

class BaseUser(BaseModel):
    """Base user model for responses."""
    id: int
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool = True
    role: str
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        orm_mode = True

class BaseSubscription(BaseModel):
    """Base subscription model for responses."""
    plan_id: str
    is_active: bool
    monthly_character_limit: int
    monthly_character_usage: int
    daily_character_limit: int
    daily_character_usage: int
    max_voice_clones: int
    current_period_start: datetime
    current_period_end: datetime

    class Config:
        orm_mode = True
