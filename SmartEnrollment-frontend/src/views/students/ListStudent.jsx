import { useState, useEffect } from "react";
import { Table, Button, Card, Modal, Badge, Form, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import estudianteService from "../../services/Estudiante.service";
import encargadoService from "../../services/Encargado.service";

function EstudiantesList() {
  const navigate = useNavigate();

  const [estudiantes, setEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroNombre, setFiltroNombre] = useState("");

  // Modal detalle
  const [showDetalle, setShowDetalle] = useState(false);
  const [estudianteDetalle, setEstudianteDetalle] = useState(null);
  const [encargadosDetalle, setEncargadosDetalle] = useState([]);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  // ── Carga lista al montar 
  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    setCargando(true);
    try {
      const data = await estudianteService.getAllEstudiantes();
      setEstudiantes(data);
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

  const abrirDetalle = async (estudiante) => {
    setEstudianteDetalle(estudiante);
    setEncargadosDetalle([]);
    setShowDetalle(true);
    setCargandoDetalle(true);
    try {
      const relaciones = await encargadoService.getEncargadosByEstudiante(estudiante.id);
      setEncargadosDetalle(relaciones);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al cargar encargados",
        text: err.message,
        confirmButtonColor: "#0d6efd",
      });
    } finally {
      setCargandoDetalle(false);
    }
  };


  const eliminarEstudiante = async (id) => {
    const confirmacion = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar estudiante?",
      text: "Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await estudianteService.deleteEstudiante(id);
      setEstudiantes((prev) => prev.filter((e) => e.id !== id));
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "El estudiante fue eliminado correctamente.",
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

  const estudiantesFiltrados = estudiantes.filter((e) =>
    e.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
  );


  const encargadoLegal = encargadosDetalle.find((r) => r.esEncargadoLegal);
  const encargadosAdicionales = encargadosDetalle.filter((r) => !r.esEncargadoLegal);

  
  return (
    <>
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col md={6}>
              <strong>Listado de Estudiantes</strong>
            </Col>
            <Col md={6} className="text-end">
              <Button onClick={() => navigate("/estudiantes/agregar")}>
                Agregar estudiante
              </Button>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          <Form.Control
            placeholder="Filtrar por nombre..."
            className="mb-3"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />

          {cargando ? (
            <div className="text-center my-4">
              <Spinner animation="border" />
              <p className="mt-2">Cargando estudiantes...</p>
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Cédula</th>
                  <th>Beca</th>
                  <th>Repitente</th>
                  <th>Vacunas</th>
                  <th>Detalle</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {estudiantesFiltrados.map((e) => (
                  <tr key={e.id}>
                    <td>{e.nombre}</td>
                    <td>{e.apellido}</td>
                    <td>{e.cedula}</td>
                    <td>
                      <Badge bg={e.beca ? "success" : "secondary"}>
                        {e.beca ? "Sí" : "No"}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={e.repitente ? "warning" : "secondary"}>
                        {e.repitente ? "Sí" : "No"}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={e.vacunasCompletas ? "success" : "danger"}>
                        {e.vacunasCompletas ? "Completas" : "Incompletas"}
                      </Badge>
                    </td>
                    <td>
                      <Button size="sm" variant="info" onClick={() => abrirDetalle(e)}>
                        Ver
                      </Button>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="warning"
                        className="me-2"
                        onClick={() => navigate(`/estudiantes/editar/${e.id}`)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => eliminarEstudiante(e.id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}

                {estudiantesFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center">
                      No hay estudiantes para mostrar
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* MODAL DETALLE */}
      <Modal show={showDetalle} onHide={() => setShowDetalle(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Estudiante</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {estudianteDetalle && (
            <>
              <h5>Datos personales</h5>
              <p><strong>Nombre:</strong> {estudianteDetalle.nombre} {estudianteDetalle.apellido}</p>
              <p><strong>Cédula:</strong> {estudianteDetalle.cedula}</p>
              <p><strong>Nacionalidad:</strong> {estudianteDetalle.nacionalidad}</p>
              <p><strong>Sexo:</strong> {estudianteDetalle.sexo === "M" ? "Masculino" : estudianteDetalle.sexo === "F" ? "Femenino" : "—"}</p>
              <p><strong>Fecha de nacimiento:</strong> {estudianteDetalle.fechaNacimiento?.split("T")[0]}</p>

              <hr />

              <h5>Información general</h5>
              <ul>
                <li>Beca: {estudianteDetalle.beca ? "Sí" : "No"}</li>
                <li>Repitente: {estudianteDetalle.repitente ? "Sí" : "No"}</li>
                <li>Vacunas completas: {estudianteDetalle.vacunasCompletas ? "Sí" : "No"}</li>
                <li>Hermanos en la institución: {estudianteDetalle.hermanosEstudiantes ? "Sí" : "No"}</li>
                <li>Traslado: {estudianteDetalle.traslado ? "Sí" : "No"}</li>
              </ul>

              {estudianteDetalle.padecimientos && (
                <>
                  <hr />
                  <h5>Padecimientos</h5>
                  <p>{estudianteDetalle.padecimientos}</p>
                </>
              )}

              <hr />

              <h5>Encargados</h5>
              {cargandoDetalle ? (
                <div className="text-center my-2">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Cargando encargados...
                </div>
              ) : (
                <>
                  <p><strong>Encargado legal:</strong>{" "}
                    {encargadoLegal
                      ? `${encargadoLegal.encargado.nombre} ${encargadoLegal.encargado.apellido} — ${encargadoLegal.encargado.cedula} (${encargadoLegal.parentesco})`
                      : "No asignado"}
                  </p>

                  <strong>Encargados adicionales:</strong>
                  {encargadosAdicionales.length === 0 ? (
                    <p className="text-muted">No tiene encargados adicionales</p>
                  ) : (
                    <ul>
                      {encargadosAdicionales.map((r) => (
                        <li key={r.encargadoId}>
                          {r.encargado.nombre} {r.encargado.apellido} — {r.encargado.cedula} ({r.parentesco})
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetalle(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EstudiantesList;