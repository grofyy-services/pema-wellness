"""
CMS models for content management
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.postgresql import Base


class CmsPage(Base):
    __tablename__ = "cms_pages"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Page identification
    slug = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    
    # Content
    body = Column(Text, nullable=True)  # Markdown or HTML content
    excerpt = Column(String(500), nullable=True)
    
    # SEO metadata
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(String(500), nullable=True)
    meta_keywords = Column(Text, nullable=True)
    
    # Additional metadata (attribute renamed to avoid reserved name)
    metadata_json = Column("metadata", JSON, nullable=True)  # Flexible metadata storage mapped to column 'metadata'
    
    # Publishing
    published = Column(Boolean, default=False, nullable=False)
    featured = Column(Boolean, default=False, nullable=False)
    sort_order = Column(Integer, default=0, nullable=False)
    
    # Template and layout
    template = Column(String(100), default="default", nullable=False)
    layout_config = Column(JSON, nullable=True)  # Layout-specific configuration
    
    # Author and editing
    author_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    last_edited_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    published_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    author = relationship("User", foreign_keys=[author_id])
    editor = relationship("User", foreign_keys=[last_edited_by])
    
    def __repr__(self):
        return f"<CmsPage(id={self.id}, slug='{self.slug}', published={self.published})>"


class Article(Base):
    __tablename__ = "articles"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Article content
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    excerpt = Column(String(500), nullable=True)
    body = Column(Text, nullable=False)
    
    # Categorization
    category = Column(String(100), nullable=True)
    tags = Column(JSON, nullable=True)  # Array of tag strings
    
    # Media
    featured_image = Column(String(500), nullable=True)  # S3 URL
    gallery_images = Column(JSON, nullable=True)  # Array of S3 URLs
    
    # Attachments and resources
    attachments = Column(JSON, nullable=True)  # Array of file references
    
    # SEO
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(String(500), nullable=True)
    
    # Publishing
    published = Column(Boolean, default=False, nullable=False)
    featured = Column(Boolean, default=False, nullable=False)
    
    # Author and editing
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    last_edited_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    published_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    author = relationship("User", foreign_keys=[author_id])
    editor = relationship("User", foreign_keys=[last_edited_by])
    download_requests = relationship("PdfDownloadRequest", back_populates="article")
    
    def __repr__(self):
        return f"<Article(id={self.id}, title='{self.title}', published={self.published})>"


class PdfDownloadRequest(Base):
    __tablename__ = "pdf_download_requests"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign key
    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False, index=True)
    
    # Requester information
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(20), nullable=True)
    
    # Download tracking
    download_token = Column(String(255), unique=True, nullable=False, index=True)
    downloaded_at = Column(DateTime(timezone=True), nullable=True)
    download_count = Column(Integer, default=0, nullable=False)
    
    # Request metadata
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    referrer = Column(String(500), nullable=True)
    
    # Token expiry
    expires_at = Column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    article = relationship("Article", back_populates="download_requests")
    
    def __repr__(self):
        return f"<PdfDownloadRequest(id={self.id}, email='{self.email}', downloaded={self.downloaded_at is not None})>"
    
    @property
    def is_expired(self) -> bool:
        """Check if download token is expired"""
        if not self.expires_at:
            return False
        from datetime import datetime
        return datetime.utcnow() > self.expires_at
    
    @property
    def is_downloaded(self) -> bool:
        """Check if PDF has been downloaded"""
        return self.downloaded_at is not None
