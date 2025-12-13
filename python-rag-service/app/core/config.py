from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # AI Provider
    DEEPSEEK_API_KEY: str
    DEEPSEEK_BASE_URL: str = "https://api.deepseek.com"
    DEEPSEEK_MODEL: str = "deepseek-chat"

    # Database
    POSTGRES_URL: str

    # GitHub
    GITHUB_TOKEN: str = ""

    # ChromaDB
    CHROMA_PERSIST_DIR: str = "./embeddings/chroma_db"
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"

    # API
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    CORS_ORIGINS: str = "http://localhost:3000"

    # Security
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_FILE_TYPES: str = ".pdf,.md,.txt,.json"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    @property
    def allowed_file_types_list(self) -> List[str]:
        return [ext.strip() for ext in self.ALLOWED_FILE_TYPES.split(",")]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
