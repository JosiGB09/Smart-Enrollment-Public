import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

function ParentescoModal({ show, encargado, onConfirm, onHide }) {
  const [parentesco, setParentesco] = useState("");

  const handleConfirm = () => {
    if (!parentesco.trim()) return;
    onConfirm(encargado, parentesco.trim());
    setParentesco("");
  };

  const handleHide = () => {
    setParentesco("");
    onHide();
  };

  return (
    <Modal show={show} onHide={handleHide}>
      <Modal.Header closeButton>
        <Modal.Title>Indicar parentesco</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {encargado && (
          <p>
            <strong>{encargado.nombre} {encargado.apellido}</strong> — {encargado.cedula}
          </p>
        )}
        <Form.Group>
          <Form.Label>Parentesco</Form.Label>
          <Form.Control
            placeholder="Ej: Madre, Padre, Tío..."
            value={parentesco}
            onChange={(e) => setParentesco(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleHide}>Cancelar</Button>
        <Button onClick={handleConfirm} disabled={!parentesco.trim()}>Confirmar</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ParentescoModal;