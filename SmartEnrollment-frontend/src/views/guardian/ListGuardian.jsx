import { useState, useEffect } from "react";
import { Table, Button, Card, Form, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import encargadoService from "../../services/Encargado.service";

function EncargadosList() {
  const navigate = useNavigate();

  const [encargados, setEncargados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroNombre, setFiltroNombre] = useState("");

  useEffect(() => {
    cargarEncargados();
  }, []);

  const cargarEncargados = async () => {
    setCargando(true);
    try {
      const data = await encargadoService.getAllEncargados();
      setEncargados(data);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al cargar",
        text: err.message,
        confirmButtonColor: "#0d6efd",
      });
    } finally {
      setCargando(false);
    }
  };

  const eliminarEncargado = async (id) => {
    const confirmacion = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar encargado?",
      text: "Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await encargadoService.deleteEncargado(id);
      setEncargados((prev) => prev.filter((e) => e.id !== id));
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "El encargado fue eliminado correctamente.",
        confirmButtonColor: "#0d6efd",
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: err.message,
        confirmButtonColor: "#0d6efd",
      });
    }
  };

  const encargadosFiltrados = encargados.filter(
    (e) =>
      e.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) ||
      e.apellido.toLowerCase().includes(filtroNombre.toLowerCase())
  );

  return (
    <Card>
      <Card.Header>
        <Row className="align-items-center">
          <Col md={6}>
            <strong>Listado de Encargados</strong>
          </Col>
          <Col md={6} className="text-end">
            <Button onClick={() => navigate("/encargados/agregar")}>
              Agregar encargado
            </Button>
          </Col>
        </Row>
      </Card.Header>

      <Card.Body>
        <Form.Control
          placeholder="Filtrar por nombre o apellido..."
          className="mb-3"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
        />

        {cargando ? (
          <div className="text-center my-4">
            <Spinner animation="border" />
            <p className="mt-2">Cargando encargados...</p>
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Cédula</th>
                <th>Nacionalidad</th>
                <th>Teléfono</th>
                <th>Estado civil</th>
                <th>Ocupación</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {encargadosFiltrados.map((e) => (
                <tr key={e.id}>
                  <td>{e.nombre}</td>
                  <td>{e.apellido}</td>
                  <td>{e.cedula}</td>
                  <td>{e.nacionalidad}</td>
                  <td>{e.telefono}</td>
                  <td>{e.estadoCivil}</td>
                  <td>{e.ocupacion}</td>
                  <td>{e.direccion}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="warning"
                      className="me-2"
                      onClick={() => navigate(`/encargados/editar/${e.id}`)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => eliminarEncargado(e.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}

              {encargadosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center">
                    No hay encargados para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}

export default EncargadosList;