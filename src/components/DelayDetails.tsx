import { Card, Col, Form, Row } from "react-bootstrap";
import useDelayLogStore from "../stores/useDelayLog";
import useOptions from "../hooks/useOptions";

type Props = {};

function DelayDetails({}: Props) {
  const { delayLogData, setDelayLogData } = useDelayLogStore();
  const { data: options } = useOptions();

  const currentOptions = delayLogData.options || [];

  const handleCheckboxChange = (optionItemId: number, isChecked: boolean) => {
    let updatedOptions = [...currentOptions];

    if (isChecked) {
      // Si se marca, lo agregamos al array si no existe ya
      if (!updatedOptions.some((opt) => opt.optionItemId === optionItemId)) {
        updatedOptions.push({
          id: null, // Como es nuevo, el ID de base de datos es null hasta que se guarde
          optionItemId: optionItemId,
          other: null, // Puedes cambiar esto si es una opción tipo "Other" y requiere texto
        });
      }
    } else {
      // Si se desmarca, lo filtramos para removerlo
      updatedOptions = updatedOptions.filter(
        (opt) => opt.optionItemId !== optionItemId,
      );
    }

    // Guardamos el array actualizado en Zustand bajo la clave 'options'
    setDelayLogData("options", updatedOptions);
  };

  const handleOtherTextChange = (optionItemId: number, text: string) => {
    const updatedOptions = currentOptions.map((opt) => {
      if (opt.optionItemId === optionItemId) {
        return { ...opt, other: text }; // Actualizamos solo la propiedad 'other' de este ID
      }
      return opt;
    });

    setDelayLogData("options", updatedOptions);
  };

  const causes = options?.filter((item) => item.optionType === "Cause");
  const impacts = options?.filter((item) => item.optionType === "Impact");

  const causeOtherItem = causes?.find(
    (c) => c.optionName.toLowerCase() === "other",
  );
  const impactOtherItem = impacts?.find(
    (i) => i.optionName.toLowerCase() === "other",
  );

  const isCauseOtherSelected = causeOtherItem
    ? currentOptions.some((opt) => opt.optionItemId === causeOtherItem.id)
    : false;
  const isImpactOtherSelected = impactOtherItem
    ? currentOptions.some((opt) => opt.optionItemId === impactOtherItem.id)
    : false;

  const baseLabelClasses = "btn w-100 py-2.5 px-2 text-truncate text-center";
  const baseLabelStyle = {
    fontSize: "13px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out", // Agrega una transición suave
  };

  const isFinalized = delayLogData?.delayStatus === "FINALIZED";

  return (
    <>
      {/* ==========================================
          TARJETA 2: EL INCIDENTE (CAUSAS E IMPACTOS)
          ========================================== */}
      <Card
        className="shadow-sm border-0 bg-white mb-4"
        style={{ borderRadius: "12px" }}
      >
        <Card.Body className="p-4">
          <h5 className="fw-bold text-dark mb-3" style={{ fontSize: "16px" }}>
            2. Incident & Delay Details
          </h5>

          {/* CUADRÍCULA SIMÉTRICA DE CAUSAS (3 columnas fijas en iPad) */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold text-secondary small mb-2 d-block">
              Primary Cause of Delay{" "}
              <span className="text-muted fw-normal">
                (Select all that apply)
              </span>
            </Form.Label>
            <Row className="row-cols-md-4 row-cols-2 g-2">
              {causes?.map((cause) => {
                const isChecked = currentOptions.some(
                  (opt) => opt.optionItemId === cause.id,
                );

                return (
                  <Col key={cause.id}>
                    <input
                      type="checkbox"
                      className="btn-check" // Bootstrap oculta el input real
                      id={`cause-${cause.id}`}
                      checked={isChecked}
                      onChange={(e) =>
                        handleCheckboxChange(cause.id, e.target.checked)
                      }
                      disabled={isFinalized}
                    />
                    <label
                      className={baseLabelClasses} // Clases base sin 'btn-outline-secondary'
                      htmlFor={`cause-${cause.id}`}
                      style={{
                        ...baseLabelStyle,
                        // *** AQUÍ ESTÁ EL CAMBIO IMPORTANTE DE ÉNFASIS ***
                        // ESTILO CUANDO ESTÁ SELECCIONADO (Azul Sólido)
                        backgroundColor: isChecked ? "#0d6efd" : "#ffffff", // Azul primario vs Blanco
                        color: isChecked ? "#ffffff" : "#212529", // Texto blanco vs Texto oscuro
                        borderColor: isChecked ? "#0d6efd" : "#dee2e6", // Borde azul vs Gris suave
                        borderStyle: "solid",
                        borderWidth: "1px",
                        fontWeight: isChecked ? "600" : "400", // Negrita opcional al seleccionar
                        boxShadow: isChecked
                          ? "0 2px 4px rgba(13, 110, 253, 0.3)"
                          : "none", // Sombra suave al seleccionar
                      }}
                    >
                      {cause.optionName}
                    </label>
                  </Col>
                );
              })}
            </Row>
            {isCauseOtherSelected && causeOtherItem && (
              <div className="mt-2 animate__animated animate__fadeIn">
                <Form.Control
                  type="text"
                  placeholder="Please specify other cause..."
                  size="sm"
                  style={{ borderRadius: "8px" }}
                  value={
                    currentOptions.find(
                      (opt) => opt.optionItemId === causeOtherItem.id,
                    )?.other || ""
                  }
                  onChange={(e) =>
                    handleOtherTextChange(causeOtherItem.id, e.target.value)
                  }
                  disabled={isFinalized}
                />
              </div>
            )}
          </Form.Group>

          {/* CUADRÍCULA SIMÉTRICA DE IMPACTOS */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold text-secondary small mb-2 d-block">
              Impact on Demolition Work
            </Form.Label>
            <Row className="row-cols-md-4 row-cols-2 g-2">
              {impacts?.map((impact) => {
                const isChecked = currentOptions.some(
                  (opt) => opt.optionItemId === impact.id,
                );

                return (
                  <Col key={impact.id}>
                    <input
                      type="checkbox"
                      className="btn-check"
                      id={`impact-${impact.id}`}
                      checked={isChecked}
                      onChange={(e) =>
                        handleCheckboxChange(impact.id, e.target.checked)
                      }
                      disabled={isFinalized}
                    />
                    <label
                      className={baseLabelClasses}
                      htmlFor={`impact-${impact.id}`}
                      style={{
                        ...baseLabelStyle,
                        // *** AQUÍ ESTÁ EL CAMBIO IMPORTANTE DE ÉNFASIS ***
                        // ESTILO CUANDO ESTÁ SELECCIONADO (Azul Sólido)
                        backgroundColor: isChecked ? "#0d6efd" : "#ffffff",
                        color: isChecked ? "#ffffff" : "#212529",
                        borderColor: isChecked ? "#0d6efd" : "#dee2e6",
                        borderStyle: "solid",
                        borderWidth: "1px",
                        fontWeight: isChecked ? "600" : "400",
                        boxShadow: isChecked
                          ? "0 2px 4px rgba(13, 110, 253, 0.3)"
                          : "none",
                      }}
                    >
                      {impact.optionName}
                    </label>
                  </Col>
                );
              })}
            </Row>
            {isImpactOtherSelected && impactOtherItem && (
              <div className="mt-2 animate__animated animate__fadeIn">
                <Form.Control
                  type="text"
                  placeholder="Please specify other impact..."
                  size="sm"
                  style={{ borderRadius: "8px" }}
                  value={
                    currentOptions.find(
                      (opt) => opt.optionItemId === impactOtherItem.id,
                    )?.other || ""
                  }
                  onChange={(e) =>
                    handleOtherTextChange(impactOtherItem.id, e.target.value)
                  }
                  disabled={isFinalized}
                />
              </div>
            )}
          </Form.Group>

          {/* ÁREAS DE TEXTO AMPLIADAS PARA NO COLAPSAR EL TECLADO DEL IPAD */}
          <Row className="g-3">
            <Col xs={12}>
              <Form.Group>
                <Form.Label className="fw-semibold text-secondary small mb-1">
                  Detailed Description of Delay
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Clearly describe what happened and why work was disrupted..."
                  className="border-secondary-subtle py-2"
                  style={{
                    fontSize: "14px",
                    borderRadius: "8px",
                    resize: "none",
                  }}
                  value={delayLogData.delayDescription ?? ""}
                  onChange={(e) =>
                    setDelayLogData("delayDescription", e.target.value)
                  }
                  disabled={isFinalized}
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group>
                <Form.Label className="fw-semibold text-secondary small mb-1">
                  Corrective Actions Taken
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="What actions were taken to mitigate the delay? (e.g., reallocated crew to Sector 2)"
                  className="border-secondary-subtle py-2"
                  style={{
                    fontSize: "14px",
                    borderRadius: "8px",
                    resize: "none",
                  }}
                  value={delayLogData.resolution ?? ""}
                  onChange={(e) =>
                    setDelayLogData("resolution", e.target.value)
                  }
                  disabled={isFinalized}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

export default DelayDetails;
