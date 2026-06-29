import { Col, Container, Row } from "react-bootstrap";
import Title from "./components/Title";
import Jobdata from "./components/Jobdata";
import MainData from "./components/MainData";
import { useSearchParams } from "react-router-dom";
import { useContextStore } from "./stores/useContextStore";
import { useEffect } from "react";
import PopUp from "./components/PopUp";
import useDelayLogStore from "./stores/useDelayLog";
import { useSignatureStore } from "./stores/useSignatureStore";
import { useGetDelayLog } from "./hooks/useDelayLog";

function App() {
  const [searchParams] = useSearchParams();
  const isLoaded = useContextStore((s) => s.isLoaded);
  const setIsLoaded = useContextStore((s) => s.setIsLoaded);
  const setIds = useContextStore((s) => s.setIds);
  const { delayLogId, jobId: jobIdStored } = useContextStore();
  const { reset: resetDelayLog, setFullData } = useDelayLogStore();
  const { reset: resetSignatures } = useSignatureStore();
  const { data: delayLogData } = useGetDelayLog(delayLogId!);

  //http://localhost:5173/?jobId=7&delayLogId=1
  useEffect(() => {
    const action = searchParams.get("action");
    const jobIdParam = searchParams.get("jobId");
    const delayLogIdParam = searchParams.get("delayLogId");

    const isNewAction = action === "new";
    const jobId = jobIdParam ? parseInt(jobIdParam, 10) : null;
    const delayLogId =
      isNewAction || !delayLogIdParam ? null : parseInt(delayLogIdParam, 10);

    // console.log("Params detectados:", { jobId, delayLogId, action });

    const hasJobChanged = jobId !== null && jobId !== jobIdStored;
    const isNewReportWithoutOrder = hasJobChanged && !delayLogId;

    if (isNewAction || isNewReportWithoutOrder) {
      handleReset();
      console.log("It's new");
    }

    console.log(jobId, delayLogId);
    setIds(jobId, delayLogId);
    setIsLoaded(true);
  }, []);

  const handleReset = () => {
    resetDelayLog();
    resetSignatures();
  };

  useEffect(() => {
    if (delayLogData) {
      setFullData(delayLogData);
    }
  }, [delayLogData]);

  if (!isLoaded) return <div>Loading data...</div>;

  return (
    <>
      <Container>
        <Row className="justify-content-md-center">
          <Col>
            <Title children={"Delay Log"} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Jobdata />
          </Col>
        </Row>
        <Row>
          <Col>
            <MainData />
          </Col>
        </Row>
      </Container>
      <PopUp />
    </>
  );
}

export default App;
