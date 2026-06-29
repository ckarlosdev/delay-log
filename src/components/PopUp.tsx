import { Button, Modal } from "react-bootstrap";
import useModalsStore from "../stores/ueModalStore";

type Props = {};

function PopUp({}: Props) {
  const { showPopupModal, setShowPopupModal, modalConfig } = useModalsStore();
  
  return (
    <Modal
      show={showPopupModal}
      onHide={() => setShowPopupModal(false)}
      centered
    >
      <Modal.Header
        closeButton
        className={`bg-${modalConfig.variant} text-white`}
      >
        <Modal.Title>{modalConfig.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span style={{ fontWeight: "bold" }}>{modalConfig.body}</span>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowPopupModal(false)}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PopUp;
