import { Button, Card, Form, Table } from "react-bootstrap";
import useDelayLogStore from "../stores/useDelayLog";
import type { DelayTime } from "../types";

type Props = {};

const calculateHours = (startTime: string, endTime: string | null): number => {
  if (!startTime || !endTime) return 0;

  // Creamos fechas ficticias idénticas para restar solo el tiempo
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const start = new Date(2000, 0, 1, startHours, startMinutes);
  const end = new Date(2000, 0, 1, endHours, endMinutes);

  // Si la hora de fin es menor, asumimos que pasó al día siguiente
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }

  const diffInMs = end.getTime() - start.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);

  return parseFloat(diffInHours.toFixed(2));
};

function TimesTracker({}: Props) {
  const delayLogData = useDelayLogStore((state) => state.delayLogData);
  const setDelayLogData = useDelayLogStore((state) => state.setDelayLogData);
  const currentTimes = delayLogData.times || [];

  // 2. Añadir una nueva fila vacía
  const handleAddRow = () => {
    // Tomamos por defecto la fecha principal del retraso o el día de hoy
    const defaultDate =
      delayLogData.delayDate || new Date().toISOString().split("T")[0];

    const newRow = {
      id: null, // Será numérico al guardar en BD, usamos null provisional
      logDate: defaultDate,
      startTime: "",
      endTime: null,
    };

    setDelayLogData("times", [...currentTimes, newRow]);
  };

  // 3. Eliminar una fila por su índice en el array
  const handleRemoveRow = (indexToRemove: number) => {
    const updatedTimes = currentTimes.filter(
      (_, index) => index !== indexToRemove,
    );
    setDelayLogData("times", updatedTimes);
  };

  // 4. Modificar cualquier campo (date, startTime, endTime) de una fila específica
  const handleFieldChange = (
    indexToUpdate: number,
    field: keyof DelayTime,
    value: any,
  ) => {
    const updatedTimes = currentTimes.map((timeRow, index) => {
      if (index === indexToUpdate) {
        return { ...timeRow, [field]: value === "" ? null : value };
      }
      return timeRow;
    });
    setDelayLogData("times", updatedTimes);
  };

  // 5. Calcular la sumatoria de todas las filas registradas
  const grandTotalHours = currentTimes.reduce((sum, row) => {
    return sum + calculateHours(row.startTime, row.endTime);
  }, 0);

  const isFinalized = delayLogData?.delayStatus === "FINALIZED";

  return (
    <>
      {/* ==========================================
          TARJETA 3: TRACKER DE TIEMPOS (Mismo flujo, diseño diferenciado)
          ========================================== */}
      <Card
        className="shadow-sm border-0 bg-white mb-4"
        style={{ borderRadius: "12px", borderLeft: "4px solid #0d6efd" }}
      >
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5
                className="fw-bold text-dark mb-1"
                style={{ fontSize: "16px" }}
              >
                3. Labor & Time Logs
              </h5>
              <p className="text-muted mb-0 small">
                Record hours affected or worked during this event.
              </p>
            </div>
            {!isFinalized && (
              <Button
                variant="primary"
                size="sm"
                className="fw-semibold px-3 py-2"
                style={{ borderRadius: "8px", fontSize: "13px" }}
                onClick={handleAddRow}
              >
                + Add Row
              </Button>
            )}
          </div>

          <div className="table-responsive">
            <Table
              bordered={false}
              className="align-middle mb-0"
              style={{ minWidth: "650px" }}
            >
              <thead
                className="table-light text-secondary"
                style={{ fontSize: "12px" }}
              >
                <tr>
                  <th
                    className="fw-semibold text-uppercase py-2.5 ps-3"
                    style={{ width: "30%" }}
                  >
                    Date
                  </th>
                  <th
                    className="fw-semibold text-uppercase py-2.5"
                    style={{ width: "25%" }}
                  >
                    Start Time
                  </th>
                  <th
                    className="fw-semibold text-uppercase py-2.5"
                    style={{ width: "25%" }}
                  >
                    End Time
                  </th>
                  <th
                    className="fw-semibold text-uppercase py-2.5 text-center"
                    style={{ width: "15%" }}
                  >
                    Total Hours
                  </th>
                  <th
                    className="py-2.5 text-center"
                    style={{ width: "5%" }}
                  ></th>
                </tr>
              </thead>
              <tbody>
                {currentTimes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-4 text-muted small"
                    >
                      No time logs recorded. Click "+ Add Row" to track hours.
                    </td>
                  </tr>
                ) : (
                  currentTimes.map((row, index) => {
                    const rowHours = calculateHours(row.startTime, row.endTime);

                    return (
                      <tr
                        key={index}
                        className="border-bottom border-light-subtle"
                      >
                        <td className="ps-3 py-2">
                          <Form.Control
                            type="date"
                            size="sm"
                            className="border-secondary-subtle py-2"
                            style={{ borderRadius: "6px" }}
                            value={row.logDate}
                            onChange={(e) =>
                              handleFieldChange(
                                index,
                                "logDate",
                                e.target.value,
                              )
                            }
                            disabled={isFinalized}
                          />
                        </td>
                        <td className="py-2">
                          <Form.Control
                            type="time"
                            size="sm"
                            className="border-secondary-subtle py-2"
                            style={{ borderRadius: "6px" }}
                            value={row.startTime}
                            onChange={(e) =>
                              handleFieldChange(
                                index,
                                "startTime",
                                e.target.value,
                              )
                            }
                            disabled={isFinalized}
                          />
                        </td>
                        <td className="py-2">
                          <Form.Control
                            type="time"
                            size="sm"
                            className="border-secondary-subtle py-2"
                            style={{ borderRadius: "6px" }}
                            value={row.endTime || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                index,
                                "endTime",
                                e.target.value,
                              )
                            }
                            disabled={isFinalized}
                          />
                        </td>
                        <td className="text-center py-2">
                          <span
                            className="fw-bold text-dark"
                            style={{ fontSize: "14px" }}
                          >
                            {rowHours.toFixed(2)}h
                          </span>
                        </td>
                        <td className="text-center py-2 pe-3">
                          <Button
                            variant="link"
                            className="text-danger p-0 border-0 text-decoration-none"
                            onClick={() => handleRemoveRow(index)}
                            disabled={isFinalized}
                          >
                            ✕
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </div>

          {/* Sumatoria global dinámica */}
          <div className="d-flex justify-content-end align-items-center mt-3 pt-2 pe-2">
            <span
              className="text-secondary fw-semibold small me-3 text-uppercase"
              style={{ letterSpacing: "0.05em", fontSize: "11px" }}
            >
              Total Logs Hours:
            </span>
            <span
              className="badge bg-dark px-3 py-2 fs-6 fw-bold rounded-2"
              style={{ fontFamily: "monospace" }}
            >
              {grandTotalHours.toFixed(2)} hrs
            </span>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}

export default TimesTracker;
