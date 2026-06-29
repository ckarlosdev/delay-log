import { Card, Col, Form, Row } from "react-bootstrap";
import SignatureArea from "./SignatureArea";
import TimesTracker from "./TimesTracker";
import DelayDetails from "./DelayDetails";
import useEmployees from "../hooks/useEmployees";
import useDelayLogStore from "../stores/useDelayLog";
import Costs from "./Costs";
import ActionButtons from "./ActionButtons";
import PreViewer from "./PreViewer";

type Props = {};

function MainData({}: Props) {
  const { data: employees } = useEmployees();
  const { delayLogData, setDelayLogData } = useDelayLogStore();

  const employeesFiltered = employees?.filter(
    (emp) =>
      emp.status.toLowerCase() === "active" &&
      emp.title.toLowerCase() === "supervisor",
  );

  const employeesOrdered = employeesFiltered?.sort((a, b) =>
    a.firstName.localeCompare(b.firstName),
  );

  const isFinalized = delayLogData?.delayStatus === "FINALIZED";

  return (
    <>
      <Form className="pb-5 mx-auto" >
        <Card
          className="shadow-sm border-0 bg-white mb-4"
          style={{ borderRadius: "12px" }}
        >
          <Card.Body className="p-4">
            <h5 className="fw-bold text-dark mb-3" style={{ fontSize: "16px" }}>
              1. General Information
            </h5>
            <Row className="g-3">
              {/* Fila 1: 50% y 50% en pantallas medianas/iPad */}
              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-secondary small mb-1">
                    Foreman / Supervisor
                  </Form.Label>
                  <Form.Select
                    aria-label="Select Foreman"
                    className="border-secondary-subtle py-2.5"
                    style={{
                      fontSize: "15px",
                      borderRadius: "8px",
                      fontWeight: "600",
                      color: "#495057",
                      backgroundColor: "#fff",
                    }}
                    value={delayLogData.employeeId ?? ""}
                    onChange={(e) =>
                      setDelayLogData("employeeId", Number(e.target.value))
                    }
                    disabled={isFinalized}
                  >
                    <option value="" className="text-muted fw-normal">
                      Select foreman...
                    </option>

                    {employeesOrdered?.map((employee) => {
                      const fullName = `${employee.firstName} ${employee.lastName}`;
                      return (
                        <option
                          key={employee.employeesId}
                          value={employee.employeesId}
                          style={{ fontWeight: "500" }}
                        >
                          {fullName}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-secondary small mb-1">
                    Date of Event
                  </Form.Label>
                  <Form.Control
                    type="date"
                    className="border-secondary-subtle py-2.5 text-muted"
                    style={{ fontSize: "14px", borderRadius: "8px" }}
                    value={delayLogData.delayDate}
                    onChange={(e) =>
                      setDelayLogData("delayDate", e.target.value)
                    }
                    disabled={isFinalized}
                  />
                </Form.Group>
              </Col>

              {/* Fila 2: 100% de ancho para descripciones largas de lugar */}
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-secondary small mb-1">
                    Area / Location Description
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Sector 4, North Building, 3rd Floor Demolition Zone"
                    className="border-secondary-subtle py-2.5"
                    style={{ fontSize: "14px", borderRadius: "8px" }}
                    value={delayLogData.location}
                    onChange={(e) =>
                      setDelayLogData("location", e.target.value)
                    }
                    disabled={isFinalized}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Costs />
        <DelayDetails />
        <TimesTracker />
        {delayLogData?.delayStatus === "FINALIZED" ||
        delayLogData?.delayStatus === "VOIDED" ? (
          <PreViewer />
        ) : (
          <SignatureArea />
        )}
        <ActionButtons />
      </Form>
    </>
  );
}

export default MainData;
