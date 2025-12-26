from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
from typing import Optional
import enum

from app.db.base import BaseModel

class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"

class User(BaseModel):
    __tablename__ = "users"
    
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean(), default=True)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    last_login = Column(DateTime, nullable=True)
    
    # Relationships
    subscription = relationship("Subscription", back_populates="user", uselist=False)
    tts_jobs = relationship("TTSJob", back_populates="user")
    reference_audios = relationship("ReferenceAudio", back_populates="user")
    
    def __repr__(self):
        return f"<User {self.email}>"

class Subscription(BaseModel):
    __tablename__ = "subscriptions"
    
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    plan_id = Column(String(50), nullable=False)
    is_active = Column(Boolean, default=True)
    monthly_character_limit = Column(Integer, default=10000)  # in characters
    monthly_character_usage = Column(Integer, default=0)  # in characters
    daily_character_limit = Column(Integer, default=500)  # in characters
    daily_character_usage = Column(Integer, default=0)  # in characters
    max_voice_clones = Column(Integer, default=3)
    
    # Billing cycle
    current_period_start = Column(DateTime, default=datetime.utcnow)
    current_period_end = Column(DateTime, default=lambda: datetime.utcnow() + timedelta(days=30))
    
    # Relationships
    user = relationship("User", back_populates="subscription")
    
    def has_quota(self, text_length: int) -> bool:
        now = datetime.utcnow()
        
        # Reset daily usage if it's a new day
        if now.date() > (self.updated_at.date() if self.updated_at else now.date()):
            self.daily_character_usage = 0
        
        # Check daily quota
        if (self.daily_character_usage + text_length) > self.daily_character_limit:
            return False
            
        # Check monthly quota
        if (self.monthly_character_usage + text_length) > self.monthly_character_limit:
            return False
            
        return True
    
    def record_usage(self, text_length: int) -> None:
        self.daily_character_usage += text_length
        self.monthly_character_usage += text_length
