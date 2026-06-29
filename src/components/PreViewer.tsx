import { Card, Col, Row } from "react-bootstrap";
import SignatureViewer from "./SignatureViewer";
import useDelayLogStore from "../stores/useDelayLog";

type Props = {};

function PreViewer({}: Props) {
  const { delayLogData } = useDelayLogStore();
  const subcontractorSig = delayLogData.signatures?.find(
    (s) => s.signatureRole === "SUBCONTRACTOR",
  );
  const contractorSig = delayLogData.signatures?.find(
    (s) => s.signatureRole === "CONTRACTOR",
  );

  return (
    <>
      <Col>
        <Card className="mb-3 shadow-sm border-0 w-100 mt-3">
          <Card.Body className="p-4">
            <Row className="text-center">
              {/* Columna de la Firma del Subcontratista */}
              <Col md={6} className="mb-3 mb-md-0">
                <div
                  className="signature-container"
                  style={{
                    border: "1px solid #dee2e6",
                    borderRadius: "8px",
                    backgroundColor: "#f8f9fa",
                    height: "200px", // 👈 Controla la altura del recuadro
                    padding: "15px", // Espacio interno para que respire la firma
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <SignatureViewer signature={subcontractorSig} />
                </div>
                <div className="mt-2 text-muted fw-bold small">
                  Subcontractor
                </div>
              </Col>

              {/* Columna de la Firma del Contratista General */}
              <Col md={6}>
                <div
                  className="signature-container"
                  style={{
                    border: "1px solid #dee2e6",
                    borderRadius: "8px",
                    backgroundColor: "#f8f9fa",
                    height: "200px", // 👈 Misma altura proporcional
                    padding: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <SignatureViewer signature={contractorSig} />
                </div>
                <div className="mt-2 text-muted fw-bold small">
                  General Contractor
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default PreViewer;
