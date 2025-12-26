from typing import Optional, List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import uuid

from app.models.user import User, Subscription, UserRole
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password

def get_user(db: Session, user_id: int) -> Optional[User]:
    """Get a user by ID."""
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get a user by email."""
    return db.query(User).filter(User.email == email).first()

def get_users(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    email: Optional[str] = None,
    is_active: Optional[bool] = None,
    role: Optional[str] = None
) -> List[User]:
    """Get a list of users with optional filtering."""
    query = db.query(User)
    
    if email:
        query = query.filter(User.email.ilike(f"%{email}%"))
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    if role:
        query = query.filter(User.role == role)
    
    return query.offset(skip).limit(limit).all()

def create_user(db: Session, user_in: UserCreate) -> User:
    """Create a new user with a subscription."""
    hashed_password = get_password_hash(user_in.password)
    
    # Create user
    db_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        is_active=True,
        role=UserRole.USER
    )
    
    # Create default subscription
    subscription = Subscription(
        plan_id="free",
        is_active=True,
        monthly_character_limit=10000,  # 10K characters
        daily_character_limit=500,      # 500 characters
        max_voice_clones=3,
        current_period_start=datetime.utcnow(),
        current_period_end=datetime.utcnow() + timedelta(days=30)
    )
    
    db_user.subscription = subscription
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

def update_user(
    db: Session, 
    db_user: User, 
    user_in: UserUpdate
) -> User:
    """Update a user's information."""
    update_data = user_in.dict(exclude_unset=True)
    
    if "email" in update_data and update_data["email"] != db_user.email:
        # Check if new email is already in use
        existing_user = get_user_by_email(db, update_data["email"])
        if existing_user and existing_user.id != db_user.id:
            raise ValueError("Email already in use")
    
    if "new_password" in update_data and update_data["new_password"]:
        # Verify current password if changing password
        if not verify_password(update_data["current_password"], db_user.hashed_password):
            raise ValueError("Current password is incorrect")
        
        # Update password
        db_user.hashed_password = get_password_hash(update_data["new_password"])
        # Remove password fields from update data to avoid overwriting
        update_data.pop("current_password", None)
        update_data.pop("new_password", None)
    
    # Update other fields
    for field, value in update_data.items():
        if value is not None:
            setattr(db_user, field, value)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

def delete_user(db: Session, user_id: int) -> bool:
    """Delete a user by ID."""
    db_user = get_user(db, user_id)
    if not db_user:
        return False
    
    db.delete(db_user)
    db.commit()
    return True

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate a user by email and password."""
    user = get_user_by_email(db, email=email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def create_admin_user(db: Session, email: str, password: str, full_name: str = None) -> User:
    """Create an admin user (for initialization)."""
    hashed_password = get_password_hash(password)
    
    db_user = User(
        email=email,
        hashed_password=hashed_password,
        full_name=full_name or "Admin User",
        is_active=True,
        role=UserRole.ADMIN
    )
    
    # Create admin subscription
    subscription = Subscription(
        plan_id="admin",
        is_active=True,
        monthly_character_limit=1000000,  # 1M characters
        daily_character_limit=100000,     # 100K characters
        max_voice_clones=100,
        current_period_start=datetime.utcnow(),
        current_period_end=datetime.utcnow() + timedelta(days=365 * 10)  # 10 years
    )
    
    db_user.subscription = subscription
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

def update_user_subscription(
    db: Session,
    user_id: int,
    plan_id: str,
    is_active: bool = True,
    monthly_character_limit: int = None,
    daily_character_limit: int = None,
    max_voice_clones: int = None
) -> bool:
    """Update a user's subscription."""
    user = get_user(db, user_id)
    if not user or not user.subscription:
        return False
    
    subscription = user.subscription
    
    # Update subscription fields
    subscription.plan_id = plan_id
    subscription.is_active = is_active
    
    if monthly_character_limit is not None:
        subscription.monthly_character_limit = monthly_character_limit
    if daily_character_limit is not None:
        subscription.daily_character_limit = daily_character_limit
    if max_voice_clones is not None:
        subscription.max_voice_clones = max_voice_clones
    
    # Reset period if changing plan
    if plan_id != subscription.plan_id:
        subscription.current_period_start = datetime.utcnow()
        subscription.current_period_end = datetime.utcnow() + timedelta(days=30)
    
    db.add(subscription)
    db.commit()
    
    return True
