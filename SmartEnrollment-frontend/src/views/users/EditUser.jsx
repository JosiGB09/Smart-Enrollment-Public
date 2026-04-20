import { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col, Spinner, InputGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import usuarioService from "../../services/Usuario.service";



const reglas = {
  soloLetras: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/,
  correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

const validarCampos = (usuario) => {
  const errores = {};

  if (!usuario.nombre.trim())
    errores.nombre = "El nombre es obligatorio.";
  else if (!reglas.soloLetras.test(usuario.nombre))
    errores.nombre = "El nombre solo puede contener letras.";

  if (!usuario.apellido.trim())
    errores.apellido = "El apellido es obligatorio.";
  else if (!reglas.soloLetras.test(usuario.apellido))
    errores.apellido = "El apellido solo puede contener letras.";

  if (!usuario.username.trim())
    errores.username = "El nombre de usuario es obligatorio.";

  if (!usuario.rol)
    errores.rol = "Debe seleccionar un rol.";

  if (!usuario.correo.trim())
    errores.correo = "El correo es obligatorio.";
  else if (!reglas.correo.test(usuario.correo))
    errores.correo = "El correo no tiene un formato válido.";

  return errores;
};



function UsuarioEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [original, setOriginal] = useState(null); 
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  
  const [verificandoUsername, setVerificandoUsername] = useState(false);
  const [usernameVerificado, setUsernameVerificado] = useState(null);


  const [verificandoCorreo, setVerificandoCorreo] = useState(false);
  const [correoVerificado, setCorreoVerificado] = useState(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const data = await usuarioService.getUsuarioById(id);
        if (!data) {
          Swal.fire({ icon: "error", title: "No encontrado", text: "No se encontró el usuario.", confirmButtonColor: "#0d6efd" });
          navigate("/usuarios");
          return;
        }
        setUsuario(data);
        setOriginal(data); // guardar snapshot
      } catch (err) {
        Swal.fire({ icon: "error", title: "Error al cargar", text: err.message, confirmButtonColor: "#0d6efd" });
        navigate("/usuarios");
      } finally {
        setCargando(false);
      }
    };
    cargarUsuario();
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: undefined }));
    }
    // Resetear verificación solo si el valor cambia respecto al original
    if (name === "username") {
      setUsernameVerificado(value === original.username ? true : null);
    }
    if (name === "correo") {
      setCorreoVerificado(value === original.correo ? true : null);
    }
  };

  // Verificar usernam
  const handleVerificarUsername = async () => {
    if (!usuario.username.trim()) {
      setErrores((prev) => ({ ...prev, username: "Ingrese un nombre de usuario antes de verificar." }));
      return;
    }
    setVerificandoUsername(true);
    setUsernameVerificado(null);
    try {
      const disponible = await usuarioService.verificarUsername(usuario.username);
      setUsernameVerificado(disponible);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error al verificar", text: err.message, confirmButtonColor: "#0d6efd" });
    } finally {
      setVerificandoUsername(false);
    }
  };

  // Verificar correo
  const handleVerificarCorreo = async () => {
    if (!usuario.correo.trim() || !reglas.correo.test(usuario.correo)) {
      setErrores((prev) => ({ ...prev, correo: "Ingrese un correo válido antes de verificar." }));
      return;
    }
    setVerificandoCorreo(true);
    setCorreoVerificado(null);
    try {
      const disponible = await usuarioService.verificarCorreo(usuario.correo);
      setCorreoVerificado(disponible);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error al verificar", text: err.message, confirmButtonColor: "#0d6efd" });
    } finally {
      setVerificandoCorreo(false);
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const erroresDetectados = validarCampos(usuario);
    if (Object.keys(erroresDetectados).length > 0) {
      setErrores(erroresDetectados);
      return;
    }

    // Validar username si se cambia
    if (usuario.username !== original.username) {
      if (usernameVerificado === null) {
        setErrores((prev) => ({ ...prev, username: "Debe verificar el nombre de usuario antes de guardar." }));
        return;
      }
      if (usernameVerificado === false) {
        setErrores((prev) => ({ ...prev, username: "Este nombre de usuario ya está en uso." }));
        return;
      }
    }

    // Validar correo si se cambia
    if (usuario.correo !== original.correo) {
      if (correoVerificado === null) {
        setErrores((prev) => ({ ...prev, correo: "Debe verificar el correo antes de guardar." }));
        return;
      }
      if (correoVerificado === false) {
        setErrores((prev) => ({ ...prev, correo: "Este correo ya está en uso." }));
        return;
      }
    }

    setGuardando(true);
    try {
      await usuarioService.putUsuario(id, { ...usuario, id: parseInt(id) });

      await Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "El usuario fue actualizado correctamente.",
        confirmButtonColor: "#0d6efd",
        timer: 2000,
        timerProgressBar: true,
      });

      navigate("/usuarios");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error al actualizar", text: err.message, confirmButtonColor: "#0d6efd" });
    } finally {
      setGuardando(false);
    }
  };

 
  if (cargando) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-2">Cargando datos del usuario...</p>
      </div>
    );
  }

  
  return (
    <Card className="shadow-sm">
      <Card.Header>
        <h5 className="mb-0">Editar Usuario</h5>
      </Card.Header>

      <Card.Body>
        <Form onSubmit={handleSubmit} noValidate>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  name="nombre"
                  value={usuario.nombre}
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
                  value={usuario.apellido}
                  onChange={handleChange}
                  isInvalid={!!errores.apellido}
                />
                <Form.Control.Feedback type="invalid">{errores.apellido}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nombre de usuario</Form.Label>
                <InputGroup>
                  <Form.Control
                    name="username"
                    value={usuario.username}
                    onChange={handleChange}
                    isInvalid={!!errores.username}
                  />
                  {usuario.username !== original.username && (
                    <Button
                      variant="outline-secondary"
                      onClick={handleVerificarUsername}
                      disabled={verificandoUsername || !usuario.username.trim()}
                    >
                      {verificandoUsername ? <Spinner animation="border" size="sm" /> : "Verificar"}
                    </Button>
                  )}
                  <Form.Control.Feedback type="invalid">{errores.username}</Form.Control.Feedback>
                </InputGroup>
                {!errores.username && usuario.username !== original.username && usernameVerificado === true && (
                  <small className="text-success">✅ Nombre de usuario disponible</small>
                )}
                {!errores.username && usernameVerificado === false && (
                  <small className="text-danger">❌ Este nombre de usuario ya está en uso</small>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Rol</Form.Label>
                <Form.Select
                  name="rol"
                  value={usuario.rol}
                  onChange={handleChange}
                  isInvalid={!!errores.rol}
                >
                  <option value="">Seleccione un rol...</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                  <option value="DIRECCION">Dirección</option>
                  <option value="PROFESOR">Profesor</option>
                  <option value="USUARIO">Usuario</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errores.rol}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Correo</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="email"
                    name="correo"
                    value={usuario.correo}
                    onChange={handleChange}
                    isInvalid={!!errores.correo}
                  />
                  {usuario.correo !== original.correo && (
                    <Button
                      variant="outline-secondary"
                      onClick={handleVerificarCorreo}
                      disabled={verificandoCorreo || !usuario.correo.trim()}
                    >
                      {verificandoCorreo ? <Spinner animation="border" size="sm" /> : "Verificar"}
                    </Button>
                  )}
                  <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
                </InputGroup>
                {!errores.correo && usuario.correo !== original.correo && correoVerificado === true && (
                  <small className="text-success">✅ Correo disponible</small>
                )}
                {!errores.correo && correoVerificado === false && (
                  <small className="text-danger">❌ Este correo ya está en uso</small>
                )}
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" type="button" onClick={() => navigate("/usuarios")}>
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

export default UsuarioEditForm;