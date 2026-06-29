import { Badge, Button, Card, Col, Row, Spinner } from "react-bootstrap";
import useDelayLogStore from "../stores/useDelayLog";
import { useSignatureStore } from "../stores/useSignatureStore";
import { useAuthStore } from "../stores/useAuthStore";
import { useContextStore } from "../stores/useContextStore";
import useModalsStore from "../stores/ueModalStore";
import useOptions from "../hooks/useOptions";
import { useFinalize, useSaveDelayLog } from "../hooks/useDelayLog";

type Props = {};

const ActionButtons = (props: Props) => {
  const {
    delayLogData,
    setDelayLogData,
    setFullData,
    reset: resetDelayData,
  } = useDelayLogStore();
  const { data: optionsList } = useOptions();
  const jobId = useContextStore((s) => s.jobId);
  const { subcontractorData, contractorData, reset } = useSignatureStore(); // Traemos una acción para limpiar firmas si la tienes
  const { setModalConfig, setShowPopupModal } = useModalsStore();
  const { mutate, isPending: isSavingReport } = useSaveDelayLog();
  const { mutate: mutateFinalize, isPending: isFinalizing } = useFinalize();

  const isAuthorized = true; // Mantén tu lógica de roles aquí si la requieres
  const isLocked = delayLogData.delayStatus === "FINALIZED";
  const isDisabled = isLocked || isFinalizing || !isAuthorized;

  const buildCurrentPayload = () => {
    const signaturesPayload: any[] = [];
    if (subcontractorData) {
      signaturesPayload.push({
        signatureRole: "SUBCONTRACTOR",
        signatureData: subcontractorData,
      });
    }
    if (contractorData) {
      signaturesPayload.push({
        signatureRole: "CONTRACTOR",
        signatureData: contractorData,
      });
    }

    return {
      ...delayLogData,
      jobId: jobId,
      signatures: signaturesPayload,
    };
  };

  const handleSaveDraft = (
    callbackOnSuccess?: (savedOrder: any) => void,
    showNotification = true,
  ) => {
    if (!validateData()) return;

    const payload = buildCurrentPayload();
    console.log("Saving payload:", payload);

    mutate(
      { reportData: payload },
      {
        onSuccess: (response) => {
          const savedDelayLog = response.data;

          // CRÍTICO: Sincronizar el ID y datos generados por el servidor con Zustand
          if (setFullData) {
            setFullData(savedDelayLog);
          } else {
            // Alternativa si manejas setters por campo:
            setDelayLogData("id", savedDelayLog.id);
            setDelayLogData("delayStatus", savedDelayLog.delayStatus);
          }

          console.log("Delay log saved successfully.");

          if (showNotification) {
            setModalConfig({
              title: "Success!",
              body: "Your draft has been saved successfully.",
              variant: "success",
            });
            setShowPopupModal(true);
          }

          // Ejecutar el siguiente paso en la cadena (ej. Finalizar)
          if (callbackOnSuccess) {
            callbackOnSuccess(savedDelayLog);
          }
        },
        onError: (error) => {
          console.error("Error saving delay log", error);
          setModalConfig({
            title: "Save Failed",
            body: "An error occurred while saving the draft. Please try again.",
            variant: "danger",
          });
          setShowPopupModal(true);
        },
      },
    );
  };

  const validateData = () => {
    console.log("validateData");

    if (delayLogData.employeeId === null || delayLogData.employeeId === 0) {
      setModalConfig({
        title: "Action Required",
        body: "Foreman field missing.",
        variant: "warning",
      });

      setShowPopupModal(true);
      return false;
    }

    if (delayLogData.delayDate === null || delayLogData.delayDate === "") {
      setModalConfig({
        title: "Action Required",
        body: "Date field missing.",
        variant: "warning",
      });

      setShowPopupModal(true);

      return false;
    }

    if (delayLogData.location === null || delayLogData.location === "") {

      setModalConfig({
        title: "Action Required",
        body: "Area/Location field missing.",
        variant: "warning",
      });

      setShowPopupModal(true);

      return false;
    }

    if (delayLogData.location === null) {

      setModalConfig({
        title: "Action Required",
        body: "Area/Location field missing.",
        variant: "warning",
      });

      setShowPopupModal(true);
      return false;
    }

    // =========================================================

    // VALIDACIÓN DE GRUPOS INDEPENDIENTES (CAUSE E IMPACT)

    // =========================================================

    // Mapeamos las selecciones actuales con su catálogo para saber qué tipo son

    const selectionsWithDetails = delayLogData.options.map((sel) => {
      const matchedOption = optionsList?.find(
        (opt) => opt.id === sel.optionItemId,
      );

      return {
        ...sel,
        optionType: matchedOption ? matchedOption.optionType.toUpperCase() : "",
      };
    });

    // Separamos las selecciones del usuario por grupo

    const userCauses = selectionsWithDetails.filter(
      (sel) => sel.optionType === "CAUSE",
    );

    const userImpacts = selectionsWithDetails.filter(
      (sel) => sel.optionType === "IMPACT",
    );

    // --- VALIDACIÓN 1: Al menos uno seleccionado por grupo ---

    if (userCauses.length === 0) {
      setModalConfig({
        title: "Action Required",
        body: "Please select at least one Cause of Delay.",
        variant: "warning",
      });

      setShowPopupModal(true);

      return false;
    }

    if (userImpacts.length === 0) {
      setModalConfig({
        title: "Action Required",
        body: "Please select at least one Impact on Demolition Work.",
        variant: "warning",
      });

      setShowPopupModal(true);

      return false;
    }

    // --- VALIDACIÓN 2: Campos "Other" obligatorios para cada grupo ---

    // Encontrar los IDs específicos de "Other" en el catálogo para cada tipo

    const otherCauseOption = optionsList?.find(
      (opt) =>
        opt.optionType.toUpperCase() === "CAUSE" &&
        opt.optionName.toLowerCase() === "other",
    );

    const otherImpactOption = optionsList?.find(
      (opt) =>
        opt.optionType.toUpperCase() === "IMPACT" &&
        opt.optionName.toLowerCase() === "other",
    );

    // Verificar "Other" en Causes

    if (otherCauseOption) {
      const hasOtherCause = userCauses.find(
        (sel) => sel.optionItemId === otherCauseOption.id,
      );

      if (
        hasOtherCause &&
        (!hasOtherCause.other || !hasOtherCause.other.trim())
      ) {
        setModalConfig({
          title: "Action Required",
          body: "Please specify the details for the 'Other' Cause field.",
          variant: "warning",
        });

        setShowPopupModal(true);

        return false;
      }
    }

    // Verificar "Other" en Impacts

    if (otherImpactOption) {
      const hasOtherImpact = userImpacts.find(
        (sel) => sel.optionItemId === otherImpactOption.id,
      );

      if (
        hasOtherImpact &&
        (!hasOtherImpact.other || !hasOtherImpact.other.trim())
      ) {
        setModalConfig({
          title: "Action Required",
          body: "Please specify the details for the 'Other' Impact field.",
          variant: "warning",
        });

        setShowPopupModal(true);
        return false;
      }
    }

    const currentTimes = delayLogData.times || [];

    // Buscamos si existe alguna fila que no tenga logDate o que no tenga startTime
    const hasInvalidRow = currentTimes.some(
      (row) => !row.logDate || !row.startTime || row.startTime.trim() === "",
    );

    if (hasInvalidRow) {

      setModalConfig({
        title: "Action Required",
        body: "Each time log row must have at least a Date and a Start Time.",
        variant: "warning",
      });

      setShowPopupModal(true);
      return false;
    }

    return true;
  };

  const handleFinalize = () => {
    // 1. Validar presencia de firmas antes de hacer nada
    if (!subcontractorData && !contractorData) {
      setModalConfig({
        title: "Signature Required",
        body: "At least one signature (Contractor or Subcontractor) is required to finalize the order.",
        variant: "warning",
      });
      setShowPopupModal(true);
      return;
    }

    // 2. Encadenar el guardado del borrador actual (incluyendo las firmas en el payload)
    // Pasamos falses para que no muestre la alerta intermedia de "Draft Saved"
    handleSaveDraft((savedOrder) => {
      // 3. Ejecutar la mutación de finalizado con el ID asegurado
      mutateFinalize(
        { delayId: savedOrder.id },
        {
          onSuccess: (response) => {
            const status = response.data.orderStatus || "FINALIZED";
            setDelayLogData("delayStatus", status);
            console.log("DelayLog finalized successfully!");

            // Opcional: Limpiar las firmas globales si ya se archivaron en base de datos
            reset();

            setModalConfig({
              title: "Delay Log Finalized!",
              body: "The Delay Log has been successfully finalized and closed.",
              variant: "success",
            });
            setShowPopupModal(true);
          },
          onError: (error) => {
            console.error("Error finalizing delay log", error);
            setModalConfig({
              title: "Finalization Failed",
              body: "Could not finalize the delay log. Please check the information and try again.",
              variant: "danger",
            });
            setShowPopupModal(true);
          },
        },
      );
    }, false);
  };

  return (
    <>
      <Col>
        <Card className="mb-2 shadow-sm border-0 no-print">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={4} className="text-start d-none d-md-block">
                <Badge
                  bg={isDisabled ? "success" : "warning"}
                  className="px-3 py-2"
                >
                  STATUS: {isDisabled ? "FINALIZED" : "DRAFT"}
                </Badge>
              </Col>

              <Col md={8} className="text-end">
                {!isDisabled ? (
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="outline-primary"
                      style={{ width: "150px", fontWeight: "bold" }}
                      onClick={() => handleSaveDraft()}
                      disabled={
                        isSavingReport
                        // || !isAuthorized
                      }
                    >
                      {isSavingReport ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            style={{ marginRight: "10px" }}
                          />
                          Saving...
                        </>
                      ) : (
                        "Save Draft"
                      )}
                    </Button>

                    <Button
                      variant="success"
                      className="px-4 py-2 fw-bold shadow-sm"
                      onClick={handleFinalize}
                    >
                      Finalize
                    </Button>
                  </div>
                ) : (
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="primary"
                      className="px-4 py-2 fw-bold d-flex align-items-center no-print"
                      //   onClick={() => onPrint()}
                    >
                      Download PDF
                    </Button>
                  </div>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default ActionButtons;
