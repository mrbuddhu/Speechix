from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.security import get_current_user, get_current_admin_user
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.user import (
    UserResponse,
    UsersResponse,
    UserProfileResponse,
    UserUpdate,
    UserUsageResponse,
    UserFilter,
    UserMessageResponse
)
from app.services.user import (
    get_user,
    get_users as get_users_service,
    update_user as update_user_service,
    delete_user as delete_user_service,
    update_user_subscription
)

router = APIRouter()

@router.get("/me", response_model=UserProfileResponse)
async def read_user_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current user's profile.
    """
    # Refresh the user to get the latest data
    db_user = get_user(db, current_user.id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"data": db_user}

@router.put("/me", response_model=UserResponse)
async def update_user_me(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update current user's profile.
    """
    try:
        updated_user = update_user_service(db, current_user, user_in)
        return {
            "data": updated_user,
            "message": "Profile updated successfully"
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me/usage", response_model=UserUsageResponse)
async def get_my_usage(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current user's usage statistics.
    """
    if not current_user.subscription:
        raise HTTPException(status_code=400, detail="No subscription found")
    
    sub = current_user.subscription
    
    return {
        "data": {
            "daily_usage": sub.daily_character_usage,
            "daily_limit": sub.daily_character_limit,
            "monthly_usage": sub.monthly_character_usage,
            "monthly_limit": sub.monthly_character_limit,
            "voice_clones_used": 0,  # Will be implemented with reference audios
            "voice_clones_limit": sub.max_voice_clones
        }
    }

# Admin routes
@router.get("/", response_model=UsersResponse)
async def get_users(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    email: Optional[str] = None,
    is_active: Optional[bool] = None,
    role: Optional[UserRole] = None,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get a list of users (admin only).
    """
    skip = (page - 1) * limit
    
    # Get filtered users
    users = get_users_service(
        db,
        skip=skip,
        limit=limit,
        email=email,
        is_active=is_active,
        role=role.value if role else None
    )
    
    # Get total count for pagination
    total = db.query(User).count()
    
    return {
        "data": users,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }

@router.get("/{user_id}", response_model=UserProfileResponse)
async def get_user_by_id(
    user_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get a user by ID (admin only).
    """
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"data": user}

@router.put("/{user_id}", response_model=UserResponse)
async def update_user_by_id(
    user_id: int,
    user_in: UserUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Update a user by ID (admin only).
    """
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        updated_user = update_user_service(db, db_user, user_in)
        return {
            "data": updated_user,
            "message": "User updated successfully"
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{user_id}", response_model=UserMessageResponse)
async def delete_user_by_id(
    user_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Delete a user by ID (admin only).
    """
    if current_user.id == user_id:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete your own account"
        )
    
    if not delete_user_service(db, user_id):
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User deleted successfully"}

@router.post("/{user_id}/suspend", response_model=UserResponse)
async def suspend_user(
    user_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Suspend or unsuspend a user (admin only).
    """
    if current_user.id == user_id:
        raise HTTPException(
            status_code=400,
            detail="Cannot suspend your own account"
        )
    
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.is_active = not db_user.is_active
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    action = "suspended" if not db_user.is_active else "activated"
    
    return {
        "data": db_user,
        "message": f"User {action} successfully"
    }

@router.post("/{user_id}/set-admin", response_model=UserResponse)
async def set_admin(
    user_id: int,
    is_admin: bool = True,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Grant or revoke admin privileges (admin only).
    """
    if current_user.id == user_id:
        raise HTTPException(
            status_code=400,
            detail="Cannot modify your own admin status"
        )
    
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.role = UserRole.ADMIN if is_admin else UserRole.USER
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    action = "granted admin privileges to" if is_admin else "revoked admin privileges from"
    
    return {
        "data": db_user,
        "message": f"Successfully {action} user"
    }

@router.post("/{user_id}/set-plan", response_model=UserResponse)
async def set_user_plan(
    user_id: int,
    plan_id: str,
    monthly_character_limit: int,
    daily_character_limit: int,
    max_voice_clones: int,
    is_active: bool = True,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Set a user's subscription plan (admin only).
    """
    db_user = get_user(db, user_id)
    if not db_user or not db_user.subscription:
        raise HTTPException(status_code=404, detail="User or subscription not found")
    
    success = update_user_subscription(
        db=db,
        user_id=user_id,
        plan_id=plan_id,
        is_active=is_active,
        monthly_character_limit=monthly_character_limit,
        daily_character_limit=daily_character_limit,
        max_voice_clones=max_voice_clones
    )
    
    if not success:
        raise HTTPException(status_code=400, detail="Failed to update subscription")
    
    # Refresh user data
    db_user = get_user(db, user_id)
    
    return {
        "data": db_user,
        "message": "Subscription updated successfully"
    }

@router.post("/{user_id}/adjust-credits", response_model=UserResponse)
async def adjust_user_credits(
    user_id: int,
    daily_credits: Optional[int] = None,
    monthly_credits: Optional[int] = None,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Adjust a user's credit limits (admin only).
    """
    db_user = get_user(db, user_id)
    if not db_user or not db_user.subscription:
        raise HTTPException(status_code=404, detail="User or subscription not found")
    
    subscription = db_user.subscription
    
    if daily_credits is not None:
        subscription.daily_character_limit = daily_credits
    if monthly_credits is not None:
        subscription.monthly_character_limit = monthly_credits
    
    db.add(subscription)
    db.commit()
    db.refresh(db_user)
    
    return {
        "data": db_user,
        "message": "Credits adjusted successfully"
    }
