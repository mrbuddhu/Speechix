from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime

from app.schemas.base import BaseUser, BaseSubscription, ResponseModel, Token, PaginatedResponse

# Request models
class UserCreate(BaseModel):
    """Request model for user registration."""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    full_name: Optional[str] = Field(None, max_length=255)

class UserLogin(BaseModel):
    """Request model for user login."""
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    """Request model for updating user profile."""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = Field(None, min_length=8, max_length=100)

    @validator('new_password')
    def password_required_if_current_password_provided(cls, v, values):
        if 'current_password' in values and values['current_password'] and not v:
            raise ValueError('New password is required when current password is provided')
        return v

class UserPasswordResetRequest(BaseModel):
    """Request model for password reset request."""
    email: EmailStr

class UserPasswordReset(BaseModel):
    """Request model for password reset."""
    token: str
    new_password: str = Field(..., min_length=8, max_length=100)

class UserFilter(BaseModel):
    """Query parameters for filtering users."""
    email: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[str] = None
    page: int = 1
    limit: int = 10

# Response models
class UserResponse(ResponseModel):
    """Response model for a single user."""
    data: BaseUser

class UsersResponse(PaginatedResponse[BaseUser]):
    """Response model for paginated list of users."""
    pass

class UserWithSubscription(BaseUser):
    """User model with subscription details."""
    subscription: Optional[BaseSubscription] = None

class UserProfileResponse(ResponseModel):
    """Response model for user profile with subscription."""
    data: UserWithSubscription

class UserUsageResponse(ResponseModel):
    """Response model for user usage statistics."""
    data: dict = {
        "daily_usage": 0,
        "daily_limit": 0,
        "monthly_usage": 0,
        "monthly_limit": 0,
        "voice_clones_used": 0,
        "voice_clones_limit": 0
    }

class UserTokenResponse(ResponseModel):
    """Response model for user authentication."""
    data: Token
    user: BaseUser

class UserMessageResponse(ResponseModel):
    """Generic response model for user operations."""
    pass
