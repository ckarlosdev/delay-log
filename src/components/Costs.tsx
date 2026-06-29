import { Card, Col, Form, Row } from "react-bootstrap";
import useDelayLogStore from "../stores/useDelayLog";

type Props = {};

function Costs({}: Props) {
  const { delayLogData, setDelayLogData } = useDelayLogStore();
  const isFinalized = delayLogData?.delayStatus === "FINALIZED";

  return (
    <>
      {/* <Form className="pb-3 mx-auto"> */}
      <Card
        className="shadow-sm border-0 bg-white mb-2"
        style={{ borderRadius: "12px" }}
      >
        <Card.Body className="p-4">
          <h5 className="fw-bold text-dark mb-3" style={{ fontSize: "16px" }}>
            Resources Impact
          </h5>
          <Row className="g-3">
            <Col md={6} xs={12}>
              <Form.Group>
                <Form.Label className="fw-semibold text-secondary small mb-1">
                  Number of Workers Affected
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Please specify the number of workers affected..."
                  className="border-secondary-subtle py-2.5 text-muted"
                  style={{ fontSize: "14px", borderRadius: "8px" }}
                  value={delayLogData.workers}
                  onChange={(e) => setDelayLogData("workers", e.target.value)}
                  disabled={isFinalized}
                />
              </Form.Group>
            </Col>
            <Col md={6} xs={12}>
              <Form.Group>
                <Form.Label className="fw-semibold text-secondary small mb-1">
                  Cost Impact
                </Form.Label>
                <Form.Control
                  type="text"
                  className="border-secondary-subtle py-2.5 text-muted"
                  style={{ fontSize: "14px", borderRadius: "8px" }}
                  placeholder="Estimmated labor cost impact..."
                  value={delayLogData.cost}
                  onChange={(e) => setDelayLogData("cost", e.target.value)}
                  disabled={isFinalized}
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group>
                <Form.Label className="fw-semibold text-secondary small mb-1">
                  Equipments
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., Sector 4, North Building, 3rd Floor Demolition Zone"
                  className="border-secondary-subtle py-2.5"
                  style={{ fontSize: "14px", borderRadius: "8px" }}
                  value={delayLogData.impactEquipment}
                  onChange={(e) =>
                    setDelayLogData("impactEquipment", e.target.value)
                  }
                  disabled={isFinalized}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {/* </Form> */}
    </>
  );
}

export default Costs;
