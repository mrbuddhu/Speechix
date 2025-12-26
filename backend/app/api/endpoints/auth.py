from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.core import security
from app.core.config import settings
from app.db.session import get_db
from app.schemas.user import (
    UserCreate, 
    UserResponse, 
    UserTokenResponse, 
    UserMessageResponse
)
from app.models.user import User, UserRole
from app.services.user import (
    get_user_by_email,
    create_user,
    authenticate_user,
    get_password_hash
)

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user.
    """
    # Check if user already exists
    db_user = get_user_by_email(db, email=user_in.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = create_user(db, user_in)
    
    return {
        "data": user,
        "message": "User registered successfully"
    }

@router.post("/login", response_model=UserTokenResponse)
async def login(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    # Authenticate user
    user = authenticate_user(
        db=db,
        email=form_data.username,
        password=form_data.password
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires
    )
    
    return {
        "data": {"access_token": access_token, "token_type": "bearer"},
        "user": user,
        "message": "Login successful"
    }

@router.post("/refresh-token", response_model=UserTokenResponse)
async def refresh_token(
    current_user: User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Refresh access token.
    """
    # Create new access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": str(current_user.id)},
        expires_delta=access_token_expires
    )
    
    return {
        "data": {"access_token": access_token, "token_type": "bearer"},
        "user": current_user,
        "message": "Token refreshed successfully"
    }

@router.post("/forgot-password", response_model=UserMessageResponse)
async def forgot_password(
    email: str,
    db: Session = Depends(get_db)
):
    """
    Request password reset.
    """
    user = get_user_by_email(db, email=email)
    if not user:
        # Don't reveal that the user doesn't exist
        return {"message": "If an account exists with this email, a password reset link has been sent"}
    
    # In a real app, you would generate a password reset token and send an email
    # For now, we'll just return a success message
    return {"message": "If an account exists with this email, a password reset link has been sent"}

@router.post("/reset-password", response_model=UserMessageResponse)
async def reset_password(
    token: str,
    new_password: str,
    db: Session = Depends(get_db)
):
    """
    Reset password with a valid token.
    """
    # In a real app, you would validate the token and update the password
    # For now, we'll just return a success message
    return {"message": "Password has been reset successfully"}
