from dataclasses import dataclass

@dataclass(frozen=True)
class ToggleResult:
    favorites: set[int]
    changed: bool

def toggle_favorite(current_favorites: set[int], property_id: int) -> ToggleResult:
    if property_id <= 0:
        raise ValueError("property_id must be positive")

    new_set = set(current_favorites)
    if property_id in new_set:
        new_set.remove(property_id)
        return ToggleResult(favorites=new_set, changed=True)
    else:
        new_set.add(property_id)
        return ToggleResult(favorites=new_set, changed=True)
