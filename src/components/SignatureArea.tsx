import { Button, Card, Col, Form, Row } from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";
import useDelayLogStore from "../stores/useDelayLog";
import { useCallback, useEffect, useRef } from "react";
import { useSignatureStore } from "../stores/useSignatureStore";

type Props = {};

function SignatureArea({}: Props) {
  const { delayLogData, setDelayLogData } = useDelayLogStore();
  const subcontractorSignRef = useRef<SignatureCanvas>(null!);
  const contractorSignRef = useRef<SignatureCanvas>(null!);

  const {
    subcontractorData,
    contractorData,
    setSubcontractorData,
    setContractorData,
  } = useSignatureStore();

  const restoreSignatures = useCallback(() => {
    const configs = [
      { data: subcontractorData, ref: subcontractorSignRef },
      { data: contractorData, ref: contractorSignRef },
    ];

    setTimeout(() => {
      configs.forEach(({ data, ref }) => {
        if (data && ref.current) {
          ref.current.fromDataURL(data, {
            ratio: window.devicePixelRatio || 1,
          });
        }
      });
    }, 150); // Un pelín más de delay para asegurar el layout del iPad
  }, [subcontractorData, contractorData]);

  useEffect(() => {
    restoreSignatures();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", restoreSignatures);
    return () => window.removeEventListener("resize", restoreSignatures);
  }, [restoreSignatures]);

  const handleEnd = (ref: any, setter: (data: string | null) => void) => {
    if (ref.current && !ref.current.isEmpty()) {
      try {
        // Intentamos obtener el canvas recortado
        const dataUrl = ref.current.getTrimmedCanvas().toDataURL("image/png");
        setter(dataUrl);
      } catch (e) {
        // Fallback al canvas completo si falla el trim
        const dataUrl = ref.current.getCanvas().toDataURL("image/png");
        setter(dataUrl);
      }
    }
  };

  const clear = (ref: any, setter: (data: string | null) => void) => {
    ref.current.clear();
    setter(null); // Limpiamos el store también
  };

  return (
    <>
      {/* ==========================================
          TARJETA 4: NOTAS Y ÁREA DE FIRMAS
          ========================================== */}
      <Card
        className="shadow-sm border-0 bg-white mb-4"
        style={{ borderRadius: "12px" }}
      >
        <Card.Body className="p-4">
          <h5 className="fw-bold text-dark mb-3" style={{ fontSize: "16px" }}>
            4. Review & Signatures
          </h5>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold text-secondary small mb-1">
              Additional Notes / Remarks
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Any external factors, instructions, or future follow-ups..."
              className="border-secondary-subtle py-2"
              style={{
                fontSize: "14px",
                borderRadius: "8px",
                resize: "none",
              }}
              value={delayLogData.summary}
              onChange={(e) => setDelayLogData("summary", e.target.value)}
            />
          </Form.Group>

          <Row className="g-4">
            {/* Firma Subcontratista */}
            <Col md={6} xs={12}>
              <div className="mb-2">
                <span className="d-block fw-semibold text-dark small mb-1">
                  Subcontractor Validation
                </span>
                <p
                  className="text-muted fst-italic mb-0"
                  style={{ fontSize: "11px", lineHeight: "1.3" }}
                >
                  "We agree to furnish labor & materials complete in accordance
                  with the above specification."
                </p>
              </div>
              <div
                style={{
                  position: "relative",
                  border: "1px solid #dee2e6",
                  borderRadius: "8px",
                  backgroundColor: "#fafafa",
                  height: "150px",
                }}
              >
                <Button
                  onClick={() =>
                    clear(subcontractorSignRef, setSubcontractorData)
                  }
                  variant="light"
                  size="sm"
                  className="position-absolute border text-muted shadow-sm"
                  style={{
                    top: "8px",
                    right: "8px",
                    zIndex: 10,
                    fontSize: "11px",
                    borderRadius: "6px",
                  }}
                >
                  Clear
                </Button>
                <SignatureCanvas
                  ref={subcontractorSignRef as React.MutableRefObject<any>}
                  onEnd={() =>
                    handleEnd(subcontractorSignRef, setSubcontractorData)
                  }
                  penColor="black"
                  canvasProps={{ style: { width: "100%", height: "100%" } }}
                />
              </div>
              <div className="text-center mt-2">
                <span
                  className="text-secondary border-top d-inline-block pt-1 px-4 small"
                  style={{ fontSize: "12px" }}
                >
                  Authorized Representative
                </span>
              </div>
            </Col>

            {/* Firma Contratista General */}
            <Col md={6} xs={12}>
              <div className="mb-2">
                <span className="d-block fw-semibold text-dark small mb-1">
                  General Contractor Verification
                </span>
                <p
                  className="text-muted fst-italic mb-0"
                  style={{ fontSize: "11px", lineHeight: "1.3" }}
                >
                  "Above additional work to be performed under the same
                  conditions as specified in original contract."
                </p>
              </div>
              <div
                style={{
                  position: "relative",
                  border: "1px solid #dee2e6",
                  borderRadius: "8px",
                  backgroundColor: "#fafafa",
                  height: "150px",
                }}
              >
                <Button
                  onClick={() => clear(contractorSignRef, setContractorData)}
                  variant="light"
                  size="sm"
                  className="position-absolute border text-muted shadow-sm"
                  style={{
                    top: "8px",
                    right: "8px",
                    zIndex: 10,
                    fontSize: "11px",
                    borderRadius: "6px",
                  }}
                >
                  Clear
                </Button>
                <SignatureCanvas
                  ref={contractorSignRef as React.MutableRefObject<any>}
                  onEnd={() => handleEnd(contractorSignRef, setContractorData)}
                  penColor="black"
                  canvasProps={{ style: { width: "100%", height: "100%" } }}
                />
              </div>
              <div className="text-center mt-2">
                <span
                  className="text-secondary border-top d-inline-block pt-1 px-4 small"
                  style={{ fontSize: "12px" }}
                >
                  Site Superintendent Sign
                </span>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

export default SignatureArea;
