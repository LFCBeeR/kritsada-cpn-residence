from pydantic import BaseModel, Field

class UserOut(BaseModel):
    username: str

class PropertyOut(BaseModel):
    id: int
    title: str
    image: str
    location: str
    description: str | None = None
    price: int
    category: str | None = None
    project_tag: str | None = None
    highlight: str | None = None
    nearby: str | None = None

class FavoritesOut(BaseModel):
    user_id: str
    favorites: list[int] = Field(default_factory=list)