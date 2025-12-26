import os
import boto3
from typing import Optional, Union, BinaryIO
from datetime import datetime, timedelta
from urllib.parse import urljoin

from app.core.config import settings

class StorageService:
    """Service for handling file storage operations."""
    
    def __init__(self):
        self.storage_type = settings.STORAGE_TYPE
        self.base_path = settings.LOCAL_STORAGE_PATH
        
        if self.storage_type == 's3':
            self.s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION
            )
            self.bucket_name = settings.S3_BUCKET_NAME
    
    def _get_local_path(self, filepath: str) -> str:
        """Get the full local path for a file."""
        # Create the directory if it doesn't exist
        os.makedirs(os.path.dirname(os.path.join(self.base_path, filepath)), exist_ok=True)
        return os.path.join(self.base_path, filepath)
    
    def upload_file(self, filepath: str, file_data: Union[bytes, BinaryIO]) -> str:
        """
        Upload a file to storage.
        
        Args:
            filepath: The path where the file should be stored (relative to storage root)
            file_data: The file data as bytes or a file-like object
            
        Returns:
            The path where the file was stored
        """
        if self.storage_type == 's3':
            # Upload to S3
            self.s3_client.upload_fileobj(
                file_data if hasattr(file_data, 'read') else file_data,
                self.bucket_name,
                filepath
            )
        else:
            # Save to local filesystem
            full_path = self._get_local_path(filepath)
            with open(full_path, 'wb') as f:
                if hasattr(file_data, 'read'):
                    # If it's a file-like object, read and write in chunks
                    chunk_size = 8192
                    while True:
                        chunk = file_data.read(chunk_size)
                        if not chunk:
                            break
                        f.write(chunk)
                else:
                    # If it's bytes, write directly
                    f.write(file_data)
        
        return filepath
    
    def download_file(self, filepath: str) -> bytes:
        """
        Download a file from storage.
        
        Args:
            filepath: The path to the file in storage
            
        Returns:
            The file data as bytes
        """
        if self.storage_type == 's3':
            # Download from S3
            response = self.s3_client.get_object(Bucket=self.bucket_name, Key=filepath)
            return response['Body'].read()
        else:
            # Read from local filesystem
            full_path = self._get_local_path(filepath)
            with open(full_path, 'rb') as f:
                return f.read()
    
    def get_presigned_url(self, filepath: str, expires_in: int = 3600) -> str:
        """
        Generate a presigned URL for accessing a file.
        
        Args:
            filepath: The path to the file in storage
            expires_in: Expiration time in seconds (default: 1 hour)
            
        Returns:
            A URL that can be used to access the file
        """
        if self.storage_type == 's3':
            # Generate a presigned URL for S3
            return self.s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': filepath
                },
                ExpiresIn=expires_in
            )
        else:
            # For local storage, return a direct file URL
            # In a production environment, you might want to serve these files through a web server
            return f"/storage/{filepath}"
    
    def delete_file(self, filepath: str) -> bool:
        """
        Delete a file from storage.
        
        Args:
            filepath: The path to the file in storage
            
        Returns:
            True if the file was deleted, False otherwise
        """
        try:
            if self.storage_type == 's3':
                # Delete from S3
                self.s3_client.delete_object(Bucket=self.bucket_name, Key=filepath)
            else:
                # Delete from local filesystem
                full_path = self._get_local_path(filepath)
                if os.path.exists(full_path):
                    os.remove(full_path)
            return True
        except Exception:
            return False
    
    def file_exists(self, filepath: str) -> bool:
        """
        Check if a file exists in storage.
        
        Args:
            filepath: The path to the file in storage
            
        Returns:
            True if the file exists, False otherwise
        """
        try:
            if self.storage_type == 's3':
                # Check if file exists in S3
                self.s3_client.head_object(Bucket=self.bucket_name, Key=filepath)
                return True
            else:
                # Check if file exists in local filesystem
                full_path = self._get_local_path(filepath)
                return os.path.exists(full_path)
        except Exception:
            return False
    
    def get_file_size(self, filepath: str) -> Optional[int]:
        """
        Get the size of a file in bytes.
        
        Args:
            filepath: The path to the file in storage
            
        Returns:
            The file size in bytes, or None if the file doesn't exist
        """
        try:
            if self.storage_type == 's3':
                # Get file size from S3
                response = self.s3_client.head_object(Bucket=self.bucket_name, Key=filepath)
                return response['ContentLength']
            else:
                # Get file size from local filesystem
                full_path = self._get_local_path(filepath)
                if os.path.exists(full_path):
                    return os.path.getsize(full_path)
                return None
        except Exception:
            return None
    
    def get_file_modified_time(self, filepath: str) -> Optional[datetime]:
        """
        Get the last modified time of a file.
        
        Args:
            filepath: The path to the file in storage
            
        Returns:
            The last modified time as a datetime object, or None if the file doesn't exist
        """
        try:
            if self.storage_type == 's3':
                # Get last modified time from S3
                response = self.s3_client.head_object(Bucket=self.bucket_name, Key=filepath)
                return response['LastModified']
            else:
                # Get last modified time from local filesystem
                full_path = self._get_local_path(filepath)
                if os.path.exists(full_path):
                    return datetime.fromtimestamp(os.path.getmtime(full_path))
                return None
        except Exception:
            return None
