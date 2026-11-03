import { Button, Card, Col, Form, Row } from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";
import useDelayLogStore from "../stores/useDelayLog";
import { useCallback, useEffect, useRef } from "react";
import { useSignatureStore } from "../stores/useSignatureStore";
import SignatureViewer from "./SignatureViewer";

type Props = {};

function SignatureArea({}: Props) {
  const { delayLogData, setDelayLogData } = useDelayLogStore();
  const subcontractorSignRef = useRef<SignatureCanvas>(null!);
  const contractorSignRef = useRef<SignatureCanvas>(null!);

  const {
    subcontractorData,
    contractorData,
    contractorName,
    subcontractorName,
    setContractorName,
    setSubcontractorName,
    setSubcontractorData,
    setContractorData,
  } = useSignatureStore();

  // 1. Extraemos las firmas que ya han sido guardadas en el backend (vienen en el delayLogData)
  const savedSubcontractorSig = delayLogData.signatures?.find(
    (s) => s.signatureRole === "SUBCONTRACTOR",
  );
  const savedContractorSig = delayLogData.signatures?.find(
    (s) => s.signatureRole === "CONTRACTOR",
  );

  // Determinar si ya hay una firma guardada en base de datos para cada rol
  const hasSavedSubcontractor = !!savedSubcontractorSig?.filePath;
  const hasSavedContractor = !!savedContractorSig?.filePath;

  const restoreSignatures = useCallback(() => {
    const configs = [
      {
        data: subcontractorData,
        ref: subcontractorSignRef,
        hasSaved: hasSavedSubcontractor,
      },
      {
        data: contractorData,
        ref: contractorSignRef,
        hasSaved: hasSavedContractor,
      },
    ];

    setTimeout(() => {
      configs.forEach(({ data, ref, hasSaved }) => {
        // Solo restauramos trazos locales si NO estamos mostrando la firma del backend
        if (!hasSaved && data && ref.current) {
          ref.current.fromDataURL(data, {
            ratio: window.devicePixelRatio || 1,
          });
        }
      });
    }, 150);
  }, [
    subcontractorData,
    contractorData,
    hasSavedSubcontractor,
    hasSavedContractor,
  ]);

  useEffect(() => {
    restoreSignatures();
  }, [restoreSignatures]);

  useEffect(() => {
    window.addEventListener("resize", restoreSignatures);
    return () => window.removeEventListener("resize", restoreSignatures);
  }, [restoreSignatures]);

  const handleEnd = (ref: any, setter: (data: string | null) => void) => {
    if (ref.current && !ref.current.isEmpty()) {
      try {
        const dataUrl = ref.current.getTrimmedCanvas().toDataURL("image/png");
        setter(dataUrl);
      } catch (e) {
        const dataUrl = ref.current.getCanvas().toDataURL("image/png");
        setter(dataUrl);
      }
    }
  };

  const clear = (ref: any, setter: (data: string | null) => void) => {
    if (ref.current) {
      ref.current.clear();
    }
    setter(null);
  };

  // Función para borrar firmas del backend en modo DRAFT
  const handleDeleteSavedSignature = (role: "SUBCONTRACTOR" | "CONTRACTOR") => {
    // Eliminamos la firma específica del listado en el Store de Zustand del reporte
    const updatedSignatures = (delayLogData.signatures || []).filter(
      (s) => s.signatureRole !== role,
    );
    setDelayLogData("signatures", updatedSignatures);

    // Limpiamos también cualquier residuo local de dibujo
    if (role === "SUBCONTRACTOR") {
      setSubcontractorData(null);
      setSubcontractorName("");
    } else {
      setContractorData(null);
      setContractorName("");
    }
  };

  return (
    <>
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
              value={delayLogData.summary || ""}
              onChange={(e) => setDelayLogData("summary", e.target.value)}
            />
          </Form.Group>

          <Row className="g-4">
            {/* =========================================================
                SECCIÓN SUBCONTRATISTA
               ========================================================= */}
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

              {/* Si ya está guardada en la base de datos como Borrador, la mostramos estática */}
              {hasSavedSubcontractor ? (
                <div className="d-flex flex-column gap-2 align-items-center">
                  <div className="w-100" style={{ height: "170px" }}>
                    <SignatureViewer signature={savedSubcontractorSig} />
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="w-50 mt-1"
                    onClick={() => handleDeleteSavedSignature("SUBCONTRACTOR")}
                  >
                    🗑️ Remove & Sign Again
                  </Button>
                </div>
              ) : (
                /* Si no está guardada, se muestra el editor e Input tradicionales */
                <>
                  <Form.Group className="mb-2">
                    <Form.Control
                      type="text"
                      placeholder="Signature Name"
                      className="form-control-sm border-secondary-subtle"
                      style={{ fontSize: "13px", borderRadius: "6px" }}
                      value={subcontractorName}
                      onChange={(e) => setSubcontractorName(e.target.value)}
                    />
                  </Form.Group>
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
                </>
              )}
              <div className="text-center mt-2">
                <span
                  className="text-secondary border-top d-inline-block pt-1 px-4 small"
                  style={{ fontSize: "12px" }}
                >
                  Authorized Representative
                </span>
              </div>
            </Col>

            {/* =========================================================
                SECCIÓN CONTRATISTA GENERAL
               ========================================================= */}
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

              {/* Si ya está guardada en la base de datos como Borrador, la mostramos estática */}
              {hasSavedContractor ? (
                <div className="d-flex flex-column gap-2 align-items-center">
                  <div className="w-100" style={{ height: "170px" }}>
                    <SignatureViewer signature={savedContractorSig} />
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="w-50 mt-1"
                    onClick={() => handleDeleteSavedSignature("CONTRACTOR")}
                  >
                    🗑️ Remove & Sign Again
                  </Button>
                </div>
              ) : (
                /* Si no está guardada, se muestra el editor e Input tradicionales */
                <>
                  <Form.Group className="mb-2">
                    <Form.Control
                      type="text"
                      placeholder="Signature Name"
                      className="form-control-sm border-secondary-subtle"
                      style={{ fontSize: "13px", borderRadius: "6px" }}
                      value={contractorName}
                      onChange={(e) => setContractorName(e.target.value)}
                    />
                  </Form.Group>
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
                        clear(contractorSignRef, setContractorData)
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
                      ref={contractorSignRef as React.MutableRefObject<any>}
                      onEnd={() =>
                        handleEnd(contractorSignRef, setContractorData)
                      }
                      penColor="black"
                      canvasProps={{ style: { width: "100%", height: "100%" } }}
                    />
                  </div>
                </>
              )}
              <div className="text-center mt-2">
                <span
                  className="text-secondary border-top d-inline-block pt-1 px-4 small"
                  style={{ fontSize: "12px" }}
                >
                  Authorized Representative
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
