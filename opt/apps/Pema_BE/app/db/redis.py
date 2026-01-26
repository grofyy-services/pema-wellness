"""
Redis configuration and connection management
"""

import redis.asyncio as redis
from typing import Optional
import json
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

# Redis connection pool
_redis_pool: Optional[redis.ConnectionPool] = None
_redis_client: Optional[redis.Redis] = None

async def init_redis():
    """Initialize Redis connection pool"""
    global _redis_pool, _redis_client
    
    try:
        _redis_pool = redis.ConnectionPool.from_url(
            settings.REDIS_URL,
            max_connections=20,
            retry_on_timeout=True,
            decode_responses=True
        )
        
        _redis_client = redis.Redis(connection_pool=_redis_pool)
        
        # Test connection
        await _redis_client.ping()
        logger.info("Redis connection initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize Redis: {e}")
        raise

async def get_redis_client() -> redis.Redis:
    """Get Redis client instance"""
    if _redis_client is None:
        await init_redis()
    return _redis_client

async def close_redis():
    """Close Redis connections"""
    global _redis_client, _redis_pool
    
    if _redis_client:
        await _redis_client.close()
    if _redis_pool:
        await _redis_pool.disconnect()
    
    _redis_client = None
    _redis_pool = None
    logger.info("Redis connections closed")

class CacheManager:
    """Redis cache management utilities"""
    
    def __init__(self):
        self.client = None
    
    async def _get_client(self):
        if self.client is None:
            self.client = await get_redis_client()
        return self.client
    
    async def get(self, key: str, default=None):
        """Get value from cache"""
        try:
            client = await self._get_client()
            value = await client.get(key)
            if value is not None:
                return json.loads(value)
            return default
        except Exception as e:
            logger.error(f"Cache get error for key {key}: {e}")
            return default
    
    async def set(self, key: str, value, ttl: int = 3600):
        """Set value in cache with TTL"""
        try:
            client = await self._get_client()
            await client.setex(key, ttl, json.dumps(value, default=str))
            return True
        except Exception as e:
            logger.error(f"Cache set error for key {key}: {e}")
            return False
    
    async def delete(self, key: str):
        """Delete key from cache"""
        try:
            client = await self._get_client()
            await client.delete(key)
            return True
        except Exception as e:
            logger.error(f"Cache delete error for key {key}: {e}")
            return False
    
    async def exists(self, key: str) -> bool:
        """Check if key exists in cache"""
        try:
            client = await self._get_client()
            return await client.exists(key) > 0
        except Exception as e:
            logger.error(f"Cache exists error for key {key}: {e}")
            return False
    
    async def increment(self, key: str, amount: int = 1, ttl: int = 3600) -> int:
        """Increment counter with TTL"""
        try:
            client = await self._get_client()
            pipe = client.pipeline()
            pipe.incr(key, amount)
            pipe.expire(key, ttl)
            result = await pipe.execute()
            return result[0]
        except Exception as e:
            logger.error(f"Cache increment error for key {key}: {e}")
            return 0
    
    async def get_or_set(self, key: str, func, ttl: int = 3600, *args, **kwargs):
        """Get from cache or set using function result"""
        value = await self.get(key)
        if value is None:
            value = await func(*args, **kwargs) if callable(func) else func
            await self.set(key, value, ttl)
        return value
    
    async def invalidate_pattern(self, pattern: str):
        """Invalidate all keys matching pattern"""
        try:
            client = await self._get_client()
            keys = await client.keys(pattern)
            if keys:
                await client.delete(*keys)
            return len(keys)
        except Exception as e:
            logger.error(f"Cache pattern invalidation error for {pattern}: {e}")
            return 0

# Global cache manager instance
cache = CacheManager()

# Cache key generators
def user_cache_key(user_id: int) -> str:
    return f"user:{user_id}"

def program_cache_key(program_id: int) -> str:
    return f"program:{program_id}"

def room_cache_key(room_id: int) -> str:
    return f"room:{room_id}"

def booking_cache_key(booking_id: int) -> str:
    return f"booking:{booking_id}"

def pricing_cache_key(program_id: int, room_id: int, nights: int) -> str:
    return f"pricing:{program_id}:{room_id}:{nights}"

def availability_cache_key(room_id: int, date: str) -> str:
    return f"availability:{room_id}:{date}"
