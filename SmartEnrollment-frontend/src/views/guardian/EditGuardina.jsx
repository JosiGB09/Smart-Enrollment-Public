import { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import encargadoService from "../../services/Encargado.service";



const reglas = {
  soloLetras: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/,
  soloNumeros: /^[0-9]+$/,
};

const validarCampos = (guardian) => {
  const errores = {};

  if (!guardian.nombre.trim())
    errores.nombre = "El nombre es obligatorio.";
  else if (!reglas.soloLetras.test(guardian.nombre))
    errores.nombre = "El nombre solo puede contener letras.";

  if (!guardian.apellido.trim())
    errores.apellido = "El apellido es obligatorio.";
  else if (!reglas.soloLetras.test(guardian.apellido))
    errores.apellido = "El apellido solo puede contener letras.";

  if (!guardian.cedula.trim())
    errores.cedula = "La cédula es obligatoria.";
  else if (!reglas.soloNumeros.test(guardian.cedula))
    errores.cedula = "La cédula solo puede contener números.";

  if (!guardian.nacionalidad.trim())
    errores.nacionalidad = "La nacionalidad es obligatoria.";
  else if (!reglas.soloLetras.test(guardian.nacionalidad))
    errores.nacionalidad = "La nacionalidad solo puede contener letras.";

  if (!guardian.telefono.trim())
    errores.telefono = "El teléfono es obligatorio.";
  else if (!reglas.soloNumeros.test(guardian.telefono))
    errores.telefono = "El teléfono solo puede contener números.";

  if (!guardian.estadoCivil.trim())
    errores.estadoCivil = "El estado civil es obligatorio.";

  if (!guardian.ocupacion.trim())
    errores.ocupacion = "La ocupación es obligatoria.";

  if (!guardian.direccion.trim())
    errores.direccion = "La dirección es obligatoria.";

  return errores;
};

// form 

function EncargadoEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [guardian, setGuardian] = useState(null);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // carga inicial
  useEffect(() => {
    const cargarEncargado = async () => {
      try {
        const data = await encargadoService.getEncargadoById(id);
        if (!data) {
          Swal.fire({
            icon: "error",
            title: "No encontrado",
            text: "No se encontró el encargado.",
            confirmButtonColor: "#0d6efd",
          });
          navigate("/encargados/listar");
          return;
        }
        setGuardian(data);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error al cargar",
          text: err.message,
          confirmButtonColor: "#0d6efd",
        });
        navigate("/encargados/listar");
      } finally {
        setCargando(false);
      }
    };

    cargarEncargado();
  }, [id]);

  // handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuardian((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const erroresDetectados = validarCampos(guardian);
    if (Object.keys(erroresDetectados).length > 0) {
      setErrores(erroresDetectados);
      return;
    }

    setGuardando(true);
    try {
      await encargadoService.putEncargado(id, { ...guardian, id: parseInt(id) });

      await Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "El encargado fue actualizado correctamente.",
        confirmButtonColor: "#0d6efd",
        timer: 2000,
        timerProgressBar: true,
      });

      navigate("/encargados/listar");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: err.message,
        confirmButtonColor: "#0d6efd",
      });
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-2">Cargando datos del encargado...</p>
      </div>
    );
  }

  // render
  return (
    <Card>
      <Card.Header>
        <h5>Editar Encargado</h5>
      </Card.Header>

      <Card.Body>
        <Form onSubmit={handleSubmit} noValidate>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  name="nombre"
                  value={guardian.nombre}
                  onChange={handleChange}
                  isInvalid={!!errores.nombre}
                />
                <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  name="apellido"
                  value={guardian.apellido}
                  onChange={handleChange}
                  isInvalid={!!errores.apellido}
                />
                <Form.Control.Feedback type="invalid">{errores.apellido}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Cédula</Form.Label>
                <Form.Control
                  name="cedula"
                  value={guardian.cedula}
                  onChange={handleChange}
                  isInvalid={!!errores.cedula}
                />
                <Form.Control.Feedback type="invalid">{errores.cedula}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Nacionalidad</Form.Label>
                <Form.Control
                  name="nacionalidad"
                  value={guardian.nacionalidad}
                  onChange={handleChange}
                  isInvalid={!!errores.nacionalidad}
                />
                <Form.Control.Feedback type="invalid">{errores.nacionalidad}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  name="telefono"
                  value={guardian.telefono}
                  onChange={handleChange}
                  isInvalid={!!errores.telefono}
                />
                <Form.Control.Feedback type="invalid">{errores.telefono}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Estado Civil</Form.Label>
                <Form.Control
                  name="estadoCivil"
                  value={guardian.estadoCivil}
                  onChange={handleChange}
                  isInvalid={!!errores.estadoCivil}
                />
                <Form.Control.Feedback type="invalid">{errores.estadoCivil}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Ocupación</Form.Label>
                <Form.Control
                  name="ocupacion"
                  value={guardian.ocupacion}
                  onChange={handleChange}
                  isInvalid={!!errores.ocupacion}
                />
                <Form.Control.Feedback type="invalid">{errores.ocupacion}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group>
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="direccion"
                  value={guardian.direccion}
                  onChange={handleChange}
                  isInvalid={!!errores.direccion}
                />
                <Form.Control.Feedback type="invalid">{errores.direccion}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={() => navigate("/encargados/listar")}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default EncargadoEditForm;