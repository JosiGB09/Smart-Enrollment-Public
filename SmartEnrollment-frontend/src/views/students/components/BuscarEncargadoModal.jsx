import { useState } from "react";
import { Modal, Row, Col, Form, Button, ListGroup, Spinner } from "react-bootstrap";
import encargadoService from "../../../services/Encargado.service";

function BuscarEncargadoModal({ show, onHide, onSelect, excluirId = null, seleccionados = [] }) {
  const [cedula, setCedula] = useState("");
  const [resultado, setResultado] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleHide = () => {
    setCedula("");
    setResultado(undefined);
    setError(null);
    onHide();
  };

  const buscar = async () => {
    if (!cedula.trim()) return;
    setLoading(true);
    setError(null);
    setResultado(undefined);
    try {
      const data = await encargadoService.buscarPorCedula(cedula.trim());
      setResultado(data?.id === excluirId ? null : data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buscar();
    }
  };

  const yaSeleccionado = resultado && seleccionados.includes(resultado.id);

  return (
    <Modal show={show} onHide={handleHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Buscar encargado por cédula</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col>
            <Form.Control
              placeholder="Digite la cédula..."
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </Col>
          <Col xs="auto">
            <Button onClick={buscar} disabled={loading || !cedula.trim()}>
              {loading ? <Spinner animation="border" size="sm" /> : "Buscar"}
            </Button>
          </Col>
        </Row>

        {error && <p className="text-danger">{error}</p>}

        {resultado === undefined && !loading && !error && (
          <p className="text-muted text-center">Ingrese una cédula y presione Buscar o Enter.</p>
        )}

        {resultado === null && !loading && (
          <p className="text-warning text-center">No se encontró ningún encargado con esa cédula.</p>
        )}

        {resultado && !loading && (
          <ListGroup>
            <ListGroup.Item
              action
              active={yaSeleccionado}
              onClick={() => onSelect(resultado)}
            >
              {resultado.nombre} {resultado.apellido} — {resultado.cedula}
            </ListGroup.Item>
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BuscarEncargadoModal;