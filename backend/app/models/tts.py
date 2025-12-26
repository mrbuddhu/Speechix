from sqlalchemy import Column, String, Enum, Integer, ForeignKey, Text, Boolean, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from enum import Enum as PyEnum
from typing import Optional, Dict, Any

from app.db.base import BaseModel

class TTSJobStatus(str, PyEnum):
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class TTSVoiceType(str, PyEnum):
    STANDARD = "standard"
    CLONED = "cloned"

class TTSJob(BaseModel):
    __tablename__ = "tts_jobs"
    
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum(TTSJobStatus), default=TTSJobStatus.QUEUED, nullable=False)
    text = Column(Text, nullable=False)
    voice_type = Column(Enum(TTSVoiceType), default=TTSVoiceType.STANDARD, nullable=False)
    voice_id = Column(String(100), nullable=True)  # For standard voices
    reference_audio_id = Column(Integer, ForeignKey("reference_audios.id"), nullable=True)  # For cloned voices
    audio_url = Column(String(500), nullable=True)
    audio_duration = Column(Integer, nullable=True)  # in seconds
    error_message = Column(Text, nullable=True)
    metadata = Column(JSON, default=dict, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="tts_jobs")
    reference_audio = relationship("ReferenceAudio", back_populates="tts_jobs")
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "text": self.text,
            "voice_type": self.voice_type,
            "voice_id": self.voice_id,
            "audio_url": self.audio_url,
            "audio_duration": self.audio_duration,
            "error_message": self.error_message,
            "metadata": self.metadata or {}
        }

class ReferenceAudio(BaseModel):
    __tablename__ = "reference_audios"
    
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    audio_url = Column(String(500), nullable=False)
    audio_duration = Column(Integer, nullable=False)  # in seconds
    is_active = Column(Boolean, default=True, nullable=False)
    metadata = Column(JSON, default=dict, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="reference_audios")
    tts_jobs = relationship("TTSJob", back_populates="reference_audio")
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "audio_url": self.audio_url,
            "audio_duration": self.audio_duration,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "metadata": self.metadata or {}
        }
