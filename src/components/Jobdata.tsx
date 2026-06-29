import { Card, Col, Form, Row } from "react-bootstrap";
import { useContextStore } from "../stores/useContextStore";
import useJob from "../hooks/useJob";

const Jobdata = () => {
  const { jobId } = useContextStore();
  const { data: job, isLoading, isError } = useJob(jobId ? Number(jobId) : 0);

  if (isLoading) return <div>Loading Job data {jobId}...</div>;
  if (isError) return <div>Error loading Job data.</div>;

  return (
    <>
      <Card className="shadow-sm border-0 mb-2 bg-light">
        <Card.Body className="p-3">
          {/* Encabezado del Bloque - Unificado */}
          <div className="d-flex align-items-center mb-2 pb-1 border-bottom border-light-subtle">
            <span
              className="badge bg-success-subtle text-success border border-success-subtle rounded-circle me-2"
              style={{ padding: "4px" }}
            >
              {/* Un punto verde minimalista de "seleccionado" */}
            </span>
            <span
              className="fw-bold text-secondary text-uppercase"
              style={{ fontSize: "11px", letterSpacing: "0.05em" }}
            >
              Job Selected
            </span>
          </div>

          {/* Grilla 2x2 perfecta para iPad */}
          <Row className="g-2">
            {/* 1. No. de Trabajo */}
            <Col sm={6} xs={12}>
              <div className="input-group input-group-sm">
                <span
                  className="input-group-text bg-white border-secondary-subtle text-muted fw-semibold"
                  style={{ fontSize: "12px", width: "85px" }}
                >
                  No.
                </span>
                <Form.Control
                  type="text"
                  className="bg-white fw-bold border-secondary-subtle text-dark"
                  value={job?.number}
                  readOnly
                  disabled
                />
              </div>
            </Col>

            {/* 2. Nombre del Trabajo */}
            <Col sm={6} xs={12}>
              <div className="input-group input-group-sm">
                <span
                  className="input-group-text bg-white border-secondary-subtle text-muted fw-semibold"
                  style={{ fontSize: "12px", width: "85px" }}
                >
                  Name
                </span>
                <Form.Control
                  type="text"
                  className="bg-white fw-semibold border-secondary-subtle text-dark"
                  value={job?.name}
                  readOnly
                  disabled
                />
              </div>
            </Col>

            {/* 3. Dirección */}
            <Col sm={6} xs={12}>
              <div className="input-group input-group-sm">
                <span
                  className="input-group-text bg-white border-secondary-subtle text-muted fw-semibold"
                  style={{ fontSize: "12px", width: "85px" }}
                >
                  Address
                </span>
                <Form.Control
                  type="text"
                  className="bg-white fw-semibold border-secondary-subtle text-dark"
                  value={job?.address}
                  readOnly
                  disabled
                />
              </div>
            </Col>

            {/* 4. Contratista */}
            <Col sm={6} xs={12}>
              <div className="input-group input-group-sm">
                <span
                  className="input-group-text bg-white border-secondary-subtle text-muted fw-semibold"
                  style={{ fontSize: "12px", width: "85px" }}
                >
                  Contractor
                </span>
                <Form.Control
                  type="text"
                  className="bg-white fw-semibold border-secondary-subtle text-dark"
                  value={job?.contractor}
                  readOnly
                  disabled
                />
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default Jobdata;
