from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session, Session
from contextlib import contextmanager
from typing import Generator

from app.core.config import settings

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=20,
    max_overflow=10,
    pool_recycle=3600,
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create scoped session factory for background tasks
ScopedSession = scoped_session(SessionLocal)

# Dependency to get DB session
def get_db() -> Generator[Session, None, None]:
    """Dependency that provides a DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@contextmanager
def get_scoped_session() -> Generator[Session, None, None]:
    """Context manager for scoped sessions (for background tasks)."""
    session = ScopedSession()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
        ScopedSession.remove()

def init_db() -> None:
    ""
    Initialize the database by creating all tables.
    In a production environment, use migrations instead.
    """
    from app.models.user import User, Subscription, UserRole
    from app.models.tts import TTSJob, ReferenceAudio, TTSJobStatus, TTSVoiceType
    
    Base.metadata.create_all(bind=engine)
    
    # Create admin user if not exists
    db = SessionLocal()
    try:
        # Check if admin user exists
        admin = db.query(User).filter(User.email == "admin@example.com").first()
        if not admin:
            # In production, use proper password hashing
            admin = User(
                email="admin@example.com",
                hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "secret"
                full_name="Admin User",
                role=UserRole.ADMIN,
                is_active=True,
            )
            db.add(admin)
            
            # Create subscription for admin
            subscription = Subscription(
                user=admin,
                plan_id="admin",
                is_active=True,
                monthly_character_limit=1000000,  # 1M characters
                daily_character_limit=100000,     # 100K characters
                max_voice_clones=100,
            )
            db.add(subscription)
            db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error initializing database: {e}")
    finally:
        db.close()
