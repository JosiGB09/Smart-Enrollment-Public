// src/views/sections/AddSection.jsx

import React, { useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AddSection = () => {
  const { gradoId } = useParams();
  const navigate = useNavigate();

  const [section, setSection] = useState({
    nombre: "",
    capacidad: 0,
    gradoId: parseInt(gradoId)
  });

  const [gradoNombre, setGradoNombre] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`https://localhost:7221/api/GradoEscolar/${gradoId}`)
      .then(res => setGradoNombre(res.data.nombre))
      .catch(() => setError("Error al obtener grado"));
  }, [gradoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSection(prev => ({
      ...prev,
      [name]: name === "capacidad" ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("https://localhost:7221/api/Seccion", section);
      fetchSections(); // <-- recarga las secciones del modal
      setSection({ nombre: "", capacidad: 0, gradoId: parseInt(gradoId) }); // limpia formulario
    } catch (err) {
      console.error(err);
      setError("Error al guardar sección");
    }
  };


  return (
    <Card className="shadow-sm mt-4">
      <Card.Body>
        <Card.Title>
          Agregar sección al grado "{gradoNombre}"
        </Card.Title>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              name="nombre"
              value={section.nombre}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Capacidad</Form.Label>
            <Form.Control
              type="number"
              name="capacidad"
              value={section.capacidad}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="d-flex gap-2 justify-content-end">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddSection;
