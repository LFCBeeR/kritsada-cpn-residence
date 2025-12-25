import { Card, Button, Badge } from "react-bootstrap";

export default function PropertyCard({ property, isFav, isBusy, onToggle, disabled }) {
  const title = property.title || "Untitled";
  const location = property.location || "—";
  const category = property.category || "-";
  const projectTag = property.project_tag || "-";

  return (
    <Card className="bs-card h-100">
      <div className="bs-media">
        <img src={property.image} alt={title} />
        <div className="bs-overlay">
          <div className="bs-overlay__kicker">
            {category} <span className="mx-1">|</span> {projectTag}
          </div>
          <div className="bs-overlay__title">{title}</div>
          {property.highlight && (
            <div className="mt-auto">
              <Badge bg="dark" style={{ opacity: 0.85 }}>
                {property.highlight}
              </Badge>
            </div>
          )}
        </div>
        <Button
          variant={isFav ? "danger" : "light"}
          disabled={isBusy || disabled}
          onClick={() => onToggle(property.id, isFav)}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            borderRadius: 999,
            width: 42,
            height: 42,
            padding: 0
          }}
          title={disabled ? "Select a user first" : isFav ? "Unfavorite" : "Favorite"}
        >
          {isFav ? "♥" : "♡"}
        </Button>
      </div>
      <Card.Body className="d-flex flex-column">
        {property.description && (
          <Card.Text className="text-muted mt-2" style={{ fontSize: 16 }}>
            {String(property.description).slice(0, 90)}
            {String(property.description).length > 90 ? "..." : ""}
          </Card.Text>
        )}
        <div className="d-flex align-items-center gap-2 mb-2">
          <span className="chip">📍 {location}</span>
        </div>
      </Card.Body>
      <Card.Footer className="bs-footer card-actions">
        <div className="d-flex align-items-center">
          {disabled ? (
            <div className="text-muted" style={{ fontSize: 12 }}>
              เลือกผู้ใช้ก่อน ถึงจะกด Favorite ได้
            </div>
          ) : (
            <div className="text-muted invisible" style={{ fontSize: 12 }}>
              placeholder
            </div>
          )}
          <div className="ms-auto d-flex gap-2">
            <Button
              variant={isFav ? "outline-danger" : "outline-primary"}
              size="sm"
              disabled={isBusy || disabled}
              onClick={() => onToggle(property.id, isFav)}
            >
              {isBusy ? "Saving..." : isFav ? "Unfavorite" : "Favorite"}
            </Button>
          </div>
        </div>
      </Card.Footer>

    </Card>
  );
}