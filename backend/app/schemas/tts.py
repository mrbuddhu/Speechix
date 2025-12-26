from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

from app.schemas.base import ResponseModel, PaginatedResponse

class TTSVoiceType(str, Enum):
    STANDARD = "standard"
    CLONED = "cloned"

class TTSJobStatus(str, Enum):
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

# Request models
class TTSGenerateRequest(BaseModel):
    """Request model for generating TTS audio."""
    text: str = Field(..., min_length=1, max_length=5000, description="Text to convert to speech")
    voice_type: TTSVoiceType = TTSVoiceType.STANDARD
    voice_id: Optional[str] = Field(None, description="Required for standard voices")
    reference_audio_id: Optional[int] = Field(None, description="Required for cloned voices")
    speed: float = Field(1.0, ge=0.5, le=2.0, description="Speech rate (0.5x to 2.0x)")
    pitch: float = Field(0.0, ge=-20.0, le=20.0, description="Pitch adjustment in semitones (-20 to +20)")
    emotion: Optional[str] = Field(None, description="Emotion for voice (e.g., happy, sad, neutral)")
    language: Optional[str] = Field("en-US", description="Language code (e.g., en-US, es-ES)")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")

    @validator('text')
    def validate_text_length(cls, v):
        # This will be validated against user's quota in the API
        if len(v) > 5000:
            raise ValueError('Text exceeds maximum length of 5000 characters')
        return v

class TTSJobFilter(BaseModel):
    """Query parameters for filtering TTS jobs."""
    status: Optional[TTSJobStatus] = None
    voice_type: Optional[TTSVoiceType] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    page: int = 1
    limit: int = 10

class ReferenceAudioCreate(BaseModel):
    """Request model for uploading a reference audio."""
    name: str = Field(..., max_length=255, description="Name for the reference audio")
    description: Optional[str] = Field(None, description="Optional description")
    is_public: bool = Field(False, description="Whether the audio can be used by others")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")

class ReferenceAudioUpdate(BaseModel):
    """Request model for updating a reference audio."""
    name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    is_active: Optional[bool] = None
    metadata: Optional[Dict[str, Any]] = None

# Response models
class TTSJobResponse(ResponseModel):
    """Response model for a single TTS job."""
    class JobData(BaseModel):
        id: int
        status: TTSJobStatus
        created_at: datetime
        updated_at: datetime
        text: str
        voice_type: TTSVoiceType
        voice_id: Optional[str] = None
        reference_audio_id: Optional[int] = None
        audio_url: Optional[str] = None
        audio_duration: Optional[float] = None
        error_message: Optional[str] = None
        metadata: Dict[str, Any] = {}
        
        class Config:
            orm_mode = True
    
    data: Optional[JobData] = None

class TTSJobsResponse(PaginatedResponse):
    """Response model for paginated list of TTS jobs."""
    data: List[TTSJobResponse.JobData] = []

class ReferenceAudioResponse(ResponseModel):
    """Response model for a reference audio."""
    class AudioData(BaseModel):
        id: int
        name: str
        description: Optional[str] = None
        audio_url: str
        audio_duration: float
        is_active: bool
        is_public: bool
        created_at: datetime
        updated_at: datetime
        metadata: Dict[str, Any] = {}
        
        class Config:
            orm_mode = True
    
    data: Optional[AudioData] = None

class ReferenceAudiosResponse(PaginatedResponse):
    """Response model for paginated list of reference audios."""
    data: List[ReferenceAudioResponse.AudioData] = []

class TTSVoicesResponse(ResponseModel):
    """Response model for available TTS voices."""
    class VoiceData(BaseModel):
        id: str
        name: str
        gender: str
        language: str
        language_code: str
        type: str = "standard"
        sample_url: Optional[str] = None
        
    data: List[VoiceData] = []

class TTSUsageResponse(ResponseModel):
    """Response model for TTS usage statistics."""
    data: Dict[str, Any] = {
        "daily_usage": 0,
        "daily_limit": 0,
        "monthly_usage": 0,
        "monthly_limit": 0,
        "voice_clones_used": 0,
        "voice_clones_limit": 0,
        "jobs_today": 0,
        "characters_today": 0,
        "characters_this_month": 0
    }
