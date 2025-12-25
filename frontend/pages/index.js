import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Navbar,
  Nav,
  Form,
  Alert,
  Row,
  Col,
  Spinner,
  Badge
} from "react-bootstrap";
import PropertyCard from "../components/PropertyCard";
import {
  fetchProperties,
  fetchFavorites,
  favoriteProperty,
  unfavoriteProperty,
  fetchUsers
} from "../services/api";

export default function HomePage() {
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [properties, setProperties] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loadingProps, setLoadingProps] = useState(true);
  const [loadingFavs, setLoadingFavs] = useState(false);
  const [busyPropertyId, setBusyPropertyId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("userId") || "";
    if (saved) setUserId(saved);
  }, []);

  useEffect(() => {
    setLoadingUsers(true);
    setError("");

    fetchUsers()
      .then((data) => setUsers(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoadingUsers(false));
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoadingProps(true);
    setError("");

    fetchProperties()
      .then((data) => mounted && setProperties(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoadingProps(false));

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!userId) {
      setFavoriteIds(new Set());
      return;
    }

    localStorage.setItem("userId", userId);
    setLoadingFavs(true);
    setError("");

    fetchFavorites(userId)
      .then((data) => setFavoriteIds(new Set(data.favorites)))
      .catch((e) => setError(e.message))
      .finally(() => setLoadingFavs(false));
  }, [userId]);

  const favoriteCount = useMemo(() => favoriteIds.size, [favoriteIds]);

  async function toggleFavorite(propertyId, currentlyFav) {
    if (!userId) return;

    setBusyPropertyId(propertyId);

    const prev = favoriteIds;
    const next = new Set(prev);
    if (currentlyFav) next.delete(propertyId);
    else next.add(propertyId);
    setFavoriteIds(next);

    try {
      const data = currentlyFav
        ? await unfavoriteProperty(userId, propertyId)
        : await favoriteProperty(userId, propertyId);

      setFavoriteIds(new Set(data.favorites));
    } catch (e) {
      setFavoriteIds(new Set(prev));
      setError(e.message);
    } finally {
      setBusyPropertyId(null);
    }
  }

  return (
    <div style={{ background: "#f6f7fb", minHeight: "100vh" }}>
      <Navbar bg="white" className="border-bottom sticky-top" expand="lg">
        <Container>
          <Navbar.Brand className="d-flex align-items-center gap-2">
            <img
              src="https://residence.centralpattana.co.th/frontend.site.cpn/assets.images/img.logo/logo.svg"
              alt="Central Pattana"
              height="28"
              style={{ display: "block" }}
            />
            <span className="text-muted fw-normal" style={{ fontSize: 16 }}>
              บ้านเดี่ยว โดยเซ็นทรัลพัฒนา
            </span>
          </Navbar.Brand>
          <Nav className="ms-auto align-items-center gap-2">
            <span className="text-muted" style={{ fontSize: 13 }}>
              Browsing as:
            </span>

            <Form.Select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              style={{ width: 220 }}
              disabled={loadingUsers}
            >
              <option value="">
                {loadingUsers ? "Loading users..." : "Select a user"}
              </option>

              {users.map((u) => (
                <option key={u.username} value={u.username}>
                  {u.username}
                </option>
              ))}
            </Form.Select>
          </Nav>
        </Container>
      </Navbar>

      <Container className="py-4">
        {!userId && (
          <Alert variant="warning" className="d-flex align-items-center gap-2">
            <span>ℹ️</span>
            <div>
              Select a user from the dropdown above to start saving your favorite
              properties.
            </div>
          </Alert>
        )}

        {error && (
          <Alert variant="danger">
            <b>Error:</b> {error}
          </Alert>
        )}

        <div className="d-flex align-items-end justify-content-between mb-3">
          <div>
            <h3 className="mb-1">เลือกแบรนด์ บ้านเดี่ยว ที่คุณสนใจ</h3>
            <div className="text-muted" style={{ fontSize: 13 }}>
              {loadingProps ? "Loading..." : `ผลการค้นหาพบ ${properties.length} ผลลัพธ์`}
              {userId && (
                <>
                  {" "}
                  •{" "}
                  {loadingFavs ? (
                    <>
                      Loading favorites... <Spinner size="sm" />
                    </>
                  ) : (
                    <>
                      <Badge bg="secondary">{favoriteCount}</Badge> โครงการที่คุณถูกใจ
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {loadingProps ? (
          <div className="py-5 d-flex align-items-center gap-2 text-muted">
            <Spinner animation="border" size="sm" />
            Loading properties...
          </div>
        ) : (
          <Row className="g-4">
            {properties.map((p) => (
              <Col key={p.id} xs={12} md={6} lg={4}>
                <PropertyCard
                  property={p}
                  isFav={favoriteIds.has(p.id)}
                  isBusy={busyPropertyId === p.id}
                  onToggle={toggleFavorite}
                  disabled={!userId}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}