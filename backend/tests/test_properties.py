from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_list_properties_returns_items():
    res = client.get("/api/properties")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert "title" in data[0]
