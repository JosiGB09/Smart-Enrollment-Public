import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Form, Button, Card, Row, Col, Spinner } from "react-bootstrap";

import estudianteInitial from "../../models/Estudiante.model";
import estudianteService from "../../services/Estudiante.service";
import BuscarEncargadoModal from "./components/BuscarEncargadoModal";
import ParentescoModal from "./components/ParentescoModal";

//validaciones 
const reglas = {
  soloLetras: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/,
  soloNumeros: /^[0-9]+$/,
};

const fechaMaxima = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 3);
  return d.toISOString().split("T")[0];
};

const validarCampos = (estudiante) => {
  const errores = {};

  if (!estudiante.nombre.trim())
    errores.nombre = "El nombre es obligatorio.";
  else if (!reglas.soloLetras.test(estudiante.nombre))
    errores.nombre = "El nombre solo puede contener letras.";

  if (!estudiante.apellido.trim())
    errores.apellido = "El apellido es obligatorio.";
  else if (!reglas.soloLetras.test(estudiante.apellido))
    errores.apellido = "El apellido solo puede contener letras.";

  if (!estudiante.nacionalidad.trim())
    errores.nacionalidad = "La nacionalidad es obligatoria";
  else if (estudiante.nacionalidad && !reglas.soloLetras.test(estudiante.nacionalidad))
    errores.nacionalidad = "La nacionalidad solo puede contener letras.";

  if (!estudiante.padecimientos.trim())
    errores.padecimientos = "Padecimientos es obligatorio";

  if (!estudiante.cedula.trim())
    errores.cedula = "La cédula es obligatoria.";
  else if (!reglas.soloNumeros.test(estudiante.cedula))
    errores.cedula = "La cédula solo puede contener números.";

  if (!estudiante.fechaNacimiento)
    errores.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
  else if (estudiante.fechaNacimiento > fechaMaxima())
    errores.fechaNacimiento = "El estudiante debe tener al menos 3 años de edad.";
  if (!estudiante.sexo)
  errores.sexo = "El sexo es obligatorio.";

  return errores;
};

//form

function EstudianteForm() {
  const navigate = useNavigate();

  const [estudiante, setEstudiante] = useState(estudianteInitial);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showEncargadosModal, setShowEncargadosModal] = useState(false);
  const [pendienteParentescoLegal, setPendienteParentescoLegal] = useState(null);
  const [pendienteParentescoAdicional, setPendienteParentescoAdicional] = useState(null);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEstudiante((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Limpiar error del campo al modificarlo
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectLegal = (encargado) => {
    setShowLegalModal(false);
    setPendienteParentescoLegal(encargado);
  };

  const confirmarParentescoLegal = (encargado, parentesco) => {
    setEstudiante((prev) => ({
      ...prev,
      encargadoLegal: { ...encargado, parentesco },
      encargados: prev.encargados.filter((e) => e.id !== encargado.id),
    }));
    setPendienteParentescoLegal(null);
  };

  const handleSelectAdicional = (encargado) => {
    const yaExiste = estudiante.encargados.some((e) => e.id === encargado.id);
    if (yaExiste) {
      setEstudiante((prev) => ({
        ...prev,
        encargados: prev.encargados.filter((e) => e.id !== encargado.id),
      }));
    } else {
      setShowEncargadosModal(false);
      setPendienteParentescoAdicional(encargado);
    }
  };

  const confirmarParentescoAdicional = (encargado, parentesco) => {
    setEstudiante((prev) => ({
      ...prev,
      encargados: [...prev.encargados, { ...encargado, parentesco }],
    }));
    setPendienteParentescoAdicional(null);
  };


  const handleSubmit = async (ev) => {
    ev.preventDefault();

    // vvalidar antes de enviar
    const erroresDetectados = validarCampos(estudiante);
    if (Object.keys(erroresDetectados).length > 0) {
      setErrores(erroresDetectados);
      return;
    }

    // validacion del encargado
    if (!estudiante.encargadoLegal) {
      Swal.fire({
        icon: "warning",
        title: "Encargado requerido",
        text: "Debe seleccionar un encargado legal antes de guardar.",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }

    setGuardando(true);
    try {
      const { id: estudianteId } = await estudianteService.postEstudiante({
        nombre: estudiante.nombre,
        apellido: estudiante.apellido,
        cedula: estudiante.cedula,
        nacionalidad: estudiante.nacionalidad,
        fechaNacimiento: estudiante.fechaNacimiento,
        sexo: estudiante.sexo,
        padecimientos: estudiante.padecimientos,
        hermanosEstudiantes: estudiante.hermanosEstudiantes,
        vacunasCompletas: estudiante.vacunasCompletas,
        beca: estudiante.beca || null,
        traslado: estudiante.traslado,
        repitente: estudiante.repitente,
        gradoEscolarId: null,
      });

      await estudianteService.postEncargadoEstudiante({
        estudianteId,
        encargadoId: estudiante.encargadoLegal.id,
        parentesco: estudiante.encargadoLegal.parentesco,
        esEncargadoLegal: true,
      });

      for (const enc of estudiante.encargados) {
        await estudianteService.postEncargadoEstudiante({
          estudianteId,
          encargadoId: enc.id,
          parentesco: enc.parentesco,
          esEncargadoLegal: false,
        });
      }

      await Swal.fire({
        icon: "success",
        title: "¡Guardado!",
        text: "El estudiante fue registrado correctamente.",
        confirmButtonColor: "#0d6efd",
        timer: 2000,
        timerProgressBar: true,
      });

      navigate("/estudiantes");

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: err.message,
        confirmButtonColor: "#0d6efd",
      });
    } finally {
      setGuardando(false);
    }
  };

  // render
  return (
    <>
      <Form onSubmit={handleSubmit} noValidate>
        {/* DATOS DEL ESTUDIANTE */}
        <Card className="mb-3">
          <Card.Header>Datos del Estudiante</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    name="nombre"
                    value={estudiante.nombre}
                    onChange={handleChange}
                    isInvalid={!!errores.nombre}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.nombre}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    name="apellido"
                    value={estudiante.apellido}
                    onChange={handleChange}
                    isInvalid={!!errores.apellido}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.apellido}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Cédula</Form.Label>
                  <Form.Control
                    name="cedula"
                    value={estudiante.cedula}
                    onChange={handleChange}
                    isInvalid={!!errores.cedula}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.cedula}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Nacionalidad</Form.Label>
                  <Form.Control
                    name="nacionalidad"
                    value={estudiante.nacionalidad}
                    onChange={handleChange}
                    isInvalid={!!errores.nacionalidad}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.nacionalidad}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Fecha de nacimiento</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaNacimiento"
                    value={estudiante.fechaNacimiento}
                    onChange={handleChange}
                    max={fechaMaxima()}
                    isInvalid={!!errores.fechaNacimiento}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.fechaNacimiento}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Sexo</Form.Label>
                  <Form.Select name="sexo" value={estudiante.sexo} onChange={handleChange} isInvalid={!!errores.sexo}>
                    <option value="">Seleccione...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errores.sexo}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-2">
                  <Form.Label>Padecimientos</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="padecimientos"
                    value={estudiante.padecimientos}
                    onChange={handleChange}
                    isInvalid={!!errores.padecimientos}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.padecimientos}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* INFORMACIÓN GENERAL */}
        <Card className="mb-3">
          <Card.Header>Información General</Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Check
                  label="Hermanos en la institución"
                  name="hermanosEstudiantes"
                  checked={estudiante.hermanosEstudiantes}
                  onChange={handleChange}
                />
              </Col>
              <Col md={4}>
                <Form.Check
                  label="Vacunas completas"
                  name="vacunasCompletas"
                  checked={estudiante.vacunasCompletas}
                  onChange={handleChange}
                />
              </Col>
              <Col md={4}>
                <Form.Check
                  label="Beca"
                  checked={!!estudiante.beca}
                  onChange={(e) =>
                    setEstudiante((prev) => ({ ...prev, beca: e.target.checked ? "Sí" : "" }))
                  }
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={4}>
                <Form.Check
                  label="Traslado"
                  name="traslado"
                  checked={estudiante.traslado}
                  onChange={handleChange}
                />
              </Col>
              <Col md={4}>
                <Form.Check
                  label="Repitente"
                  name="repitente"
                  checked={estudiante.repitente}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* ENCARGADO LEGAL */}
        <Card className="mb-3 border-primary">
          <Card.Header className="text-primary">Encargado Legal</Card.Header>
          <Card.Body>
            <Row>
              <Col md={9}>
                <Form.Control
                  readOnly
                  placeholder="No seleccionado"
                  value={
                    estudiante.encargadoLegal
                      ? `${estudiante.encargadoLegal.nombre} ${estudiante.encargadoLegal.apellido} — ${estudiante.encargadoLegal.cedula} (${estudiante.encargadoLegal.parentesco})`
                      : ""
                  }
                />
              </Col>
              <Col md={3}>
                <Button onClick={() => setShowLegalModal(true)}>Buscar</Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* ENCARGADOS ADICIONALES */}
        <Card className="mb-3">
          <Card.Header>Encargados adicionales</Card.Header>
          <Card.Body>
            {estudiante.encargados.length === 0 && (
              <p className="text-muted">No hay encargados adicionales seleccionados</p>
            )}
            <ul>
              {estudiante.encargados.map((e) => (
                <li key={e.id}>
                  {e.nombre} {e.apellido} — {e.cedula} ({e.parentesco})
                  <Button
                    variant="link"
                    size="sm"
                    className="text-danger ms-2 p-0"
                    onClick={() =>
                      setEstudiante((prev) => ({
                        ...prev,
                        encargados: prev.encargados.filter((enc) => enc.id !== e.id),
                      }))
                    }
                  >
                    Quitar
                  </Button>
                </li>
              ))}
            </ul>
            <Button onClick={() => setShowEncargadosModal(true)}>Agregar encargado</Button>
          </Card.Body>
        </Card>

        <Button type="submit" disabled={guardando}>
          {guardando ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Guardando...
            </>
          ) : (
            "Guardar Estudiante"
          )}
        </Button>
      </Form>

      {/* MODALES */}
      <BuscarEncargadoModal
        show={showLegalModal}
        onHide={() => setShowLegalModal(false)}
        onSelect={handleSelectLegal}
      />

      <BuscarEncargadoModal
        show={showEncargadosModal}
        onHide={() => setShowEncargadosModal(false)}
        onSelect={handleSelectAdicional}
        seleccionados={estudiante.encargados.map((e) => e.id)}
        excluirId={estudiante.encargadoLegal?.id ?? null}
      />

      <ParentescoModal
        show={!!pendienteParentescoLegal}
        encargado={pendienteParentescoLegal}
        onConfirm={confirmarParentescoLegal}
        onHide={() => setPendienteParentescoLegal(null)}
      />

      <ParentescoModal
        show={!!pendienteParentescoAdicional}
        encargado={pendienteParentescoAdicional}
        onConfirm={confirmarParentescoAdicional}
        onHide={() => setPendienteParentescoAdicional(null)}
      />
    </>
  );
}

export default EstudianteForm;