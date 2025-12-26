import os
import time
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any, Tuple
import random

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.tts import TTSJob, TTSJobStatus, ReferenceAudio, TTSVoiceType
from app.models.user import User, Subscription
from app.schemas.tts import TTSGenerateRequest, TTSJobStatus as TTSJobStatusEnum
from app.services.storage import StorageService

class TTSService:
    def __init__(self, db: Session):
        self.db = db
        self.storage = StorageService()
    
    def _get_available_voice(self) -> str:
        """Simulate getting an available voice ID."""
        # In a real implementation, this would check available voices from the TTS service
        voices = ["en-US-Wavenet-A", "en-US-Wavenet-B", "en-US-Wavenet-C", "en-US-Wavenet-D"]
        return random.choice(voices)
    
    def _get_processing_time(self, text_length: int) -> float:
        """Estimate processing time based on text length."""
        # Base time + time per character (simulated)
        return 1.0 + (text_length / 1000)  # 1s + 1ms per character
    
    def _simulate_tts_processing(self, text: str, voice_id: str) -> Tuple[bytes, float]:
        """Simulate TTS processing."""
        # In a real implementation, this would call the actual TTS service
        processing_time = self._get_processing_time(len(text))
        time.sleep(min(processing_time, 0.1))  # Simulate some processing time
        
        # Generate a mock audio file (empty bytes in this case)
        audio_data = b""  # In a real implementation, this would be the actual audio data
        duration = len(text) / 15  # Rough estimate: 15 characters per second
        
        return audio_data, duration
    
    def create_tts_job(
        self,
        user: User,
        request: TTSGenerateRequest
    ) -> TTSJob:
        """Create a new TTS job."""
        # Check user's subscription and quota
        if not user.subscription or not user.subscription.is_active:
            raise ValueError("No active subscription")
        
        if not user.subscription.has_quota(len(request.text)):
            raise ValueError("Insufficient quota")
        
        # Validate voice type and reference audio
        voice_id = request.voice_id
        reference_audio = None
        
        if request.voice_type == TTSVoiceType.CLONED:
            if not request.reference_audio_id:
                raise ValueError("Reference audio ID is required for cloned voice")
            
            reference_audio = (
                self.db.query(ReferenceAudio)
                .filter(
                    ReferenceAudio.id == request.reference_audio_id,
                    ReferenceAudio.user_id == user.id,
                    ReferenceAudio.is_active == True
                )
                .first()
            )
            
            if not reference_audio:
                raise ValueError("Invalid or inactive reference audio")
            
            # In a real implementation, we would use the voice ID from the cloned voice
            voice_id = f"cloned-{reference_audio.id}"
        else:
            if not voice_id:
                voice_id = self._get_available_voice()
        
        # Create the job
        job = TTSJob(
            user_id=user.id,
            status=TTSJobStatus.QUEUED,
            text=request.text,
            voice_type=request.voice_type,
            voice_id=voice_id,
            reference_audio_id=reference_audio.id if reference_audio else None,
            metadata={
                "speed": request.speed,
                "pitch": request.pitch,
                "emotion": request.emotion,
                "language": request.language,
                **request.metadata
            } if request.metadata else {"speed": request.speed, "pitch": request.pitch, "emotion": request.emotion, "language": request.language}
        )
        
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)
        
        return job
    
    def process_tts_job(self, job_id: int) -> TTSJob:
        """Process a TTS job."""
        # Get the job with a lock to prevent concurrent processing
        job = (
            self.db.query(TTSJob)
            .filter(
                TTSJob.id == job_id,
                TTSJob.status.in_([TTSJobStatus.QUEUED, TTSJobStatus.PROCESSING])
            )
            .with_for_update()
            .first()
        )
        
        if not job:
            raise ValueError("Job not found or already processed")
        
        # Update job status to processing
        job.status = TTSJobStatus.PROCESSING
        self.db.add(job)
        self.db.commit()
        
        try:
            # Simulate TTS processing
            audio_data, duration = self._simulate_tts_processing(job.text, job.voice_id)
            
            # Generate a unique filename
            filename = f"{job.id}_{int(time.time())}.wav"
            filepath = os.path.join("audios", filename)
            
            # Save the audio file
            self.storage.upload_file(filepath, audio_data)
            
            # Update job with results
            job.status = TTSJobStatus.COMPLETED
            job.audio_url = self.storage.get_presigned_url(filepath)
            job.audio_duration = duration
            
            # Update user's subscription usage
            if job.user and job.user.subscription:
                job.user.subscription.record_usage(len(job.text))
            
            self.db.add(job)
            self.db.commit()
            
            return job
            
        except Exception as e:
            # Handle errors
            job.status = TTSJobStatus.FAILED
            job.error_message = str(e)
            self.db.add(job)
            self.db.commit()
            raise
    
    def get_job_status(self, job_id: int, user_id: Optional[int] = None) -> Optional[TTSJob]:
        """Get the status of a TTS job."""
        query = self.db.query(TTSJob).filter(TTSJob.id == job_id)
        
        if user_id is not None:
            query = query.filter(TTSJob.user_id == user_id)
        
        return query.first()
    
    def cancel_job(self, job_id: int, user_id: int) -> bool:
        """Cancel a pending TTS job."""
        job = (
            self.db.query(TTSJob)
            .filter(
                TTSJob.id == job_id,
                TTSJob.user_id == user_id,
                TTSJob.status.in_([TTSJobStatus.QUEUED, TTSJobStatus.PROCESSING])
            )
            .with_for_update()
            .first()
        )
        
        if not job:
            return False
        
        job.status = TTSJobStatus.CANCELLED
        self.db.add(job)
        self.db.commit()
        
        return True
    
    def get_user_jobs(
        self,
        user_id: int,
        status: Optional[TTSJobStatusEnum] = None,
        limit: int = 100,
        offset: int = 0
    ) -> Tuple[List[TTSJob], int]:
        """Get a user's TTS jobs with optional filtering."""
        query = self.db.query(TTSJob).filter(TTSJob.user_id == user_id)
        
        if status is not None:
            query = query.filter(TTSJob.status == status)
        
        total = query.count()
        jobs = query.order_by(TTSJob.created_at.desc()).offset(offset).limit(limit).all()
        
        return jobs, total
    
    def create_reference_audio(
        self,
        user_id: int,
        file_data: bytes,
        filename: str,
        name: str,
        description: Optional[str] = None,
        is_public: bool = False,
        metadata: Optional[Dict[str, Any]] = None
    ) -> ReferenceAudio:
        """Upload and create a reference audio."""
        # Check user's voice clone limit
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user or not user.subscription:
            raise ValueError("User not found or has no subscription")
        
        # Count active reference audios
        active_audios = (
            self.db.query(ReferenceAudio)
            .filter(
                ReferenceAudio.user_id == user_id,
                ReferenceAudio.is_active == True
            )
            .count()
        )
        
        if active_audios >= user.subscription.max_voice_clones:
            raise ValueError(f"Maximum number of voice clones ({user.subscription.max_voice_clones}) reached")
        
        # Generate a unique filename
        file_ext = os.path.splitext(filename)[1].lower()
        if file_ext not in ['.wav', '.mp3', '.ogg', '.flac']:
            raise ValueError("Unsupported file format")
        
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        filepath = os.path.join("reference_audios", unique_filename)
        
        # Upload the file
        self.storage.upload_file(filepath, file_data)
        
        # Get audio duration (simulated)
        duration = 10.0  # In a real implementation, use a library to get the actual duration
        
        # Create the reference audio record
        audio = ReferenceAudio(
            user_id=user_id,
            name=name,
            description=description,
            audio_url=self.storage.get_presigned_url(filepath),
            audio_duration=duration,
            is_public=is_public,
            metadata=metadata or {}
        )
        
        self.db.add(audio)
        self.db.commit()
        self.db.refresh(audio)
        
        return audio
    
    def delete_reference_audio(self, audio_id: int, user_id: int) -> bool:
        """Delete a reference audio."""
        audio = (
            self.db.query(ReferenceAudio)
            .filter(
                ReferenceAudio.id == audio_id,
                ReferenceAudio.user_id == user_id
            )
            .first()
        )
        
        if not audio:
            return False
        
        # Mark as inactive instead of deleting to preserve referential integrity
        audio.is_active = False
        self.db.add(audio)
        self.db.commit()
        
        return True
    
    def get_reference_audios(
        self,
        user_id: int,
        is_active: bool = True,
        limit: int = 100,
        offset: int = 0
    ) -> Tuple[List[ReferenceAudio], int]:
        """Get a user's reference audios."""
        query = self.db.query(ReferenceAudio).filter(
            ReferenceAudio.user_id == user_id,
            ReferenceAudio.is_active == is_active
        )
        
        total = query.count()
        audios = query.order_by(ReferenceAudio.created_at.desc()).offset(offset).limit(limit).all()
        
        return audios, total


def get_tts_service(db: Session) -> TTSService:
    """Dependency to get a TTS service instance."""
    return TTSService(db)
