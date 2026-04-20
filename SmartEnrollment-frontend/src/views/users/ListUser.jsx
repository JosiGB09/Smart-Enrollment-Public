import { useState, useEffect, useCallback } from "react";
import { Table, Button, Card, Form, Row, Col, Spinner, Badge, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import usuarioService from "../../services/Usuario.service";

// ─── PAGINACIÓN ───────────────────────────────────────────────────────────────
const getPaginasVisibles = (paginaActual, totalPaginas) => {
  const paginas = new Set();

  // Siempre primera y última
  paginas.add(1);
  paginas.add(totalPaginas);

  // Anterior, actual y siguiente
  if (paginaActual - 1 > 1) paginas.add(paginaActual - 1);
  paginas.add(paginaActual);
  if (paginaActual + 1 < totalPaginas) paginas.add(paginaActual + 1);

  return Array.from(paginas).sort((a, b) => a - b);
};

function UsuariosList() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Filtros
  const [rol, setRol] = useState("");
  const [estado, setEstado] = useState("true");
  const [tipoBusqueda, setTipoBusqueda] = useState("username");
  const [busqueda, setBusqueda] = useState("");
  const [busquedaInput, setBusquedaInput] = useState("");

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const TAMANO = 10;

  // ── Carga paginada ─────────────────────────────────────────────────────────
  const cargarUsuarios = useCallback(async (pagina = 1) => {
    setCargando(true);
    try {
      const data = await usuarioService.getUsuariosPaginados({
        pagina,
        tamano: TAMANO,
        rol: rol || null,
        estado: estado !== "" ? estado : null,
        busqueda: busqueda || null,
        tipoBusqueda: busqueda ? tipoBusqueda : null,
      });
      setUsuarios(data.data);
      setPaginaActual(data.paginaActual);
      setTotalPaginas(data.totalPaginas);
      setTotalRegistros(data.totalRegistros);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error al cargar", text: err.message, confirmButtonColor: "#0d6efd" });
    } finally {
      setCargando(false);
    }
  }, [rol, estado, busqueda, tipoBusqueda]);

  useEffect(() => {
    cargarUsuarios(1);
    setPaginaActual(1);
  }, [rol, estado, busqueda, tipoBusqueda]);

  // ── Búsqueda ───────────────────────────────────────────────────────────────
  const handleBuscar = () => setBusqueda(busquedaInput);
  const handleKeyDown = (e) => { if (e.key === "Enter") handleBuscar(); };

  // ── Cambiar página ─────────────────────────────────────────────────────────
  const cambiarPagina = (pagina) => {
    if (pagina < 1 || pagina > totalPaginas) return;
    cargarUsuarios(pagina);
  };

  // ── Borrado lógico ─────────────────────────────────────────────────────────
  const cambiarEstado = async (usuario) => {
    const nuevoEstado = !usuario.estado;
    const accion = nuevoEstado ? "habilitar" : "deshabilitar";

    const confirmacion = await Swal.fire({
      icon: "warning",
      title: `¿${nuevoEstado ? "Habilitar" : "Deshabilitar"} usuario?`,
      text: `¿Desea ${accion} la cuenta de ${usuario.nombre} ${usuario.apellido}?`,
      showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
      confirmButtonColor: nuevoEstado ? "#198754" : "#dc3545",
      cancelButtonColor: "#6c757d",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await usuarioService.cambiarEstado(usuario.id, nuevoEstado);
      Swal.fire({
        icon: "success",
        title: nuevoEstado ? "Cuenta habilitada" : "Cuenta deshabilitada",
        confirmButtonColor: "#0d6efd",
        timer: 2000,
        timerProgressBar: true,
      });
      cargarUsuarios(paginaActual);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message, confirmButtonColor: "#0d6efd" });
    }
  };

  // ── Borrado físico ─────────────────────────────────────────────────────────
  const eliminarUsuario = async (id) => {
    const confirmacion = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await usuarioService.deleteUsuario(id);
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        confirmButtonColor: "#0d6efd",
        timer: 2000,
        timerProgressBar: true,
      });
      cargarUsuarios(paginaActual);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error al eliminar", text: err.message, confirmButtonColor: "#0d6efd" });
    }
  };

  const paginasVisibles = getPaginasVisibles(paginaActual, totalPaginas);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Card>
      <Card.Header>
        <Row className="align-items-center">
          <Col md={6}><strong>Listado de Usuarios</strong></Col>
          <Col md={6} className="text-end">
            <Button onClick={() => navigate("/usuarios/agregar")}>Agregar usuario</Button>
          </Col>
        </Row>
      </Card.Header>

      <Card.Body>
        {/* FILTROS */}
        <Row className="mb-3 g-2">
          <Col md={5}>
            <InputGroup>
              <Form.Control
                placeholder={`Buscar por ${tipoBusqueda === "username" ? "usuario" : "correo"}...`}
                value={busquedaInput}
                onChange={(e) => setBusquedaInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button variant="outline-secondary" onClick={handleBuscar}>Buscar</Button>
            </InputGroup>
            <Form.Check
              type="switch"
              className="mt-1"
              label={`Buscar por: ${tipoBusqueda === "username" ? "Usuario" : "Correo"}`}
              checked={tipoBusqueda === "correo"}
              onChange={(e) => {
                setTipoBusqueda(e.target.checked ? "correo" : "username");
                setBusqueda("");
                setBusquedaInput("");
              }}
            />
          </Col>
          <Col md={3}>
            <Form.Select value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="">Todos los roles</option>
              <option value="ADMINISTRADOR">Administrador</option>
              <option value="DIRECCION">Dirección</option>
              <option value="PROFESOR">Profesor</option>
              <option value="USUARIO">Usuario</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
              <option value="">Todos</option>
            </Form.Select>
          </Col>
        </Row>

        {/* TABLA */}
        {cargando ? (
          <div className="text-center my-4">
            <Spinner animation="border" />
            <p className="mt-2">Cargando usuarios...</p>
          </div>
        ) : (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.nombre}</td>
                    <td>{u.apellido}</td>
                    <td>{u.username}</td>
                    <td>{u.correo}</td>
                    <td><Badge bg="secondary">{u.rol}</Badge></td>
                    <td>
                      <Badge bg={u.estado ? "success" : "danger"}>
                        {u.estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td>
                      <Button size="sm" variant="warning" className="me-1"
                        onClick={() => navigate(`/usuarios/editar/${u.id}`)}>
                        Editar
                      </Button>
                      <Button size="sm" variant={u.estado ? "secondary" : "success"} className="me-1"
                        onClick={() => cambiarEstado(u)}>
                        {u.estado ? "Deshabilitar" : "Habilitar"}
                      </Button>
                      <Button size="sm" variant="danger"
                        onClick={() => eliminarUsuario(u.id)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
                {usuarios.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center">No hay usuarios para mostrar</td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* PAGINACIÓN */}
            <Row className="align-items-center mt-2">
              <Col>
                <small className="text-muted">
                  Mostrando {usuarios.length} de {totalRegistros} usuarios — Página {paginaActual} de {totalPaginas}
                </small>
              </Col>
              <Col className="d-flex justify-content-end gap-1 flex-wrap">
                <Button size="sm" variant="outline-secondary"
                  disabled={paginaActual === 1}
                  onClick={() => cambiarPagina(paginaActual - 1)}>
                  ‹ Anterior
                </Button>

                {paginasVisibles.map((p, i) => {
                  const anterior = paginasVisibles[i - 1];
                  const hayGap = anterior && p - anterior > 1;
                  return (
                    <span key={p} className="d-flex gap-1">
                      {hayGap && (
                        <Button size="sm" variant="outline-secondary" disabled>...</Button>
                      )}
                      <Button size="sm"
                        variant={paginaActual === p ? "primary" : "outline-secondary"}
                        onClick={() => cambiarPagina(p)}>
                        {p}
                      </Button>
                    </span>
                  );
                })}

                <Button size="sm" variant="outline-secondary"
                  disabled={paginaActual === totalPaginas}
                  onClick={() => cambiarPagina(paginaActual + 1)}>
                  Siguiente ›
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default UsuariosList;