import pytest
from backend.tests.favorites_service import toggle_favorite

def test_toggle_adds_when_missing():
    result = toggle_favorite(set([1, 2]), 3)
    assert result.changed is True
    assert result.favorites == set([1, 2, 3])

def test_toggle_invalid_property_id():
    with pytest.raises(ValueError):
        toggle_favorite(set([1]), 0)
