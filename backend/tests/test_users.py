from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_list_users_returns_items():
    res = client.get("/api/users")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert "username" in data[0]
