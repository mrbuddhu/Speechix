from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import json

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.tts import TTSJob, TTSJobStatus, ReferenceAudio
from app.schemas.tts import (
    TTSGenerateRequest,
    TTSJobResponse,
    TTSJobsResponse,
    TTSVoicesResponse,
    ReferenceAudioResponse,
    ReferenceAudiosResponse,
    TTSUsageResponse,
    TTSJobFilter
)
from app.services.tts import TTSService, get_tts_service
from app.services.storage import StorageService

router = APIRouter()

@router.post("/submit", response_model=TTSJobResponse, status_code=status.HTTP_202_ACCEPTED)
async def submit_tts_job(
    request: TTSGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    tts_service: TTSService = Depends(get_tts_service)
):
    """
    Submit a new text-to-speech job.
    """
    try:
        # Create the TTS job
        job = tts_service.create_tts_job(current_user, request)
        
        # In a real implementation, you would queue the job for processing
        # For now, we'll simulate processing it immediately
        try:
            tts_service.process_tts_job(job.id)
        except Exception as e:
            # Log the error but don't fail the request
            print(f"Error processing TTS job: {e}")
        
        return {
            "data": job,
            "message": "TTS job submitted successfully"
        }
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing your request"
        )

@router.get("/status/{job_id}", response_model=TTSJobResponse)
async def get_tts_job_status(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    tts_service: TTSService = Depends(get_tts_service)
):
    """
    Get the status of a TTS job.
    """
    job = tts_service.get_job_status(job_id, current_user.id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    return {"data": job}

@router.post("/cancel/{job_id}", response_model=TTSJobResponse)
async def cancel_tts_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    tts_service: TTSService = Depends(get_tts_service)
):
    """
    Cancel a pending TTS job.
    """
    success = tts_service.cancel_job(job_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not cancel job. It may have already been processed or does not exist."
        )
    
    return {
        "data": tts_service.get_job_status(job_id, current_user.id),
        "message": "Job cancelled successfully"
    }

@router.get("/history", response_model=TTSJobsResponse)
async def get_tts_history(
    status: Optional[TTSJobStatus] = None,
    page: int = 1,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    tts_service: TTSService = Depends(get_tts_service)
):
    """
    Get the current user's TTS job history.
    """
    offset = (page - 1) * limit
    jobs, total = tts_service.get_user_jobs(
        current_user.id,
        status=status,
        limit=limit,
        offset=offset
    )
    
    return {
        "data": jobs,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit if limit > 0 else 0
    }

@router.get("/voices", response_model=TTSVoicesResponse)
async def get_available_voices(
    language: Optional[str] = None,
    gender: Optional[str] = None
):
    """
    Get a list of available TTS voices.
    In a real implementation, this would query the TTS service for available voices.
    """
    # This is a mock implementation
    voices = [
        {
            "id": "en-US-Wavenet-A",
            "name": "US English (Wavenet A)",
            "gender": "FEMALE",
            "language": "en-US",
            "language_code": "en-US",
            "type": "standard",
            "sample_url": "https://example.com/samples/en-US-Wavenet-A.wav"
        },
        {
            "id": "en-US-Wavenet-B",
            "name": "US English (Wavenet B)",
            "gender": "MALE",
            "language": "en-US",
            "language_code": "en-US",
            "type": "standard",
            "sample_url": "https://example.com/samples/en-US-Wavenet-B.wav"
        },
        # Add more voices as needed
    ]
    
    # Filter voices based on query parameters
    if language:
        voices = [v for v in voices if v["language"].lower() == language.lower()]
    
    if gender:
        voices = [v for v in voices if v["gender"].lower() == gender.lower()]
    
    return {"data": voices}

@router.post("/reference-audios/upload", response_model=ReferenceAudioResponse, status_code=status.HTTP_201_CREATED)
async def upload_reference_audio(
    file: UploadFile = File(...),
    name: str = Form(...),
    description: Optional[str] = Form(None),
    is_public: bool = Form(False),
    metadata: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    tts_service: TTSService = Depends(get_tts_service)
):
    """
    Upload a reference audio file for voice cloning.
    """
    try:
        # Parse metadata if provided
        metadata_dict = {}
        if metadata:
            try:
                metadata_dict = json.loads(metadata)
                if not isinstance(metadata_dict, dict):
                    raise ValueError("Metadata must be a JSON object")
            except json.JSONDecodeError:
                raise ValueError("Invalid metadata format. Must be a valid JSON object")
        
        # Read the file data
        file_data = await file.read()
        
        # Create the reference audio
        audio = tts_service.create_reference_audio(
            user_id=current_user.id,
            file_data=file_data,
            filename=file.filename,
            name=name,
            description=description,
            is_public=is_public,
            metadata=metadata_dict
        )
        
        return {
            "data": audio,
            "message": "Reference audio uploaded successfully"
        }
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while uploading the reference audio"
        )

@router.get("/reference-audios", response_model=ReferenceAudiosResponse)
async def get_reference_audios(
    is_active: bool = True,
    page: int = 1,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    tts_service: TTSService = Depends(get_tts_service)
):
    """
    Get the current user's reference audios.
    """
    offset = (page - 1) * limit
    audios, total = tts_service.get_reference_audios(
        current_user.id,
        is_active=is_active,
        limit=limit,
        offset=offset
    )
    
    return {
        "data": audios,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit if limit > 0 else 0
    }

@router.delete("/reference-audios/{audio_id}", response_model=ReferenceAudioResponse)
async def delete_reference_audio(
    audio_id: int,
    current_user: User = Depends(get_current_user),
    tts_service: TTSService = Depends(get_tts_service)
):
    """
    Delete a reference audio.
    """
    success = tts_service.delete_reference_audio(audio_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reference audio not found or already deleted"
        )
    
    return {
        "message": "Reference audio deleted successfully"
    }

@router.get("/usage", response_model=TTSUsageResponse)
async def get_tts_usage(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get the current user's TTS usage statistics.
    """
    if not current_user.subscription:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active subscription found"
        )
    
    # Get job statistics
    from sqlalchemy import func, and_, extract
    from datetime import datetime, timedelta
    
    today = datetime.utcnow().date()
    start_of_month = datetime.utcnow().replace(day=1).date()
    
    # Get today's jobs
    today_jobs = db.query(TTSJob).filter(
        TTSJob.user_id == current_user.id,
        func.date(TTSJob.created_at) == today,
        TTSJob.status == TTSJobStatus.COMPLETED
    ).all()
    
    # Get this month's jobs
    month_jobs = db.query(TTSJob).filter(
        TTSJob.user_id == current_user.id,
        func.date(TTSJob.created_at) >= start_of_month,
        TTSJob.status == TTSJobStatus.COMPLETED
    ).all()
    
    # Count active reference audios
    active_audios = db.query(ReferenceAudio).filter(
        ReferenceAudio.user_id == current_user.id,
        ReferenceAudio.is_active == True
    ).count()
    
    return {
        "data": {
            "daily_usage": current_user.subscription.daily_character_usage,
            "daily_limit": current_user.subscription.daily_character_limit,
            "monthly_usage": current_user.subscription.monthly_character_usage,
            "monthly_limit": current_user.subscription.monthly_character_limit,
            "voice_clones_used": active_audios,
            "voice_clones_limit": current_user.subscription.max_voice_clones,
            "jobs_today": len(today_jobs),
            "characters_today": sum(len(job.text) for job in today_jobs),
            "characters_this_month": sum(len(job.text) for job in month_jobs)
        }
    }
