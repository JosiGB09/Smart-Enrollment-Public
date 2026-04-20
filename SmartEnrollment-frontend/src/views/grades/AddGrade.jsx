import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddGrade = () => {
  const navigate = useNavigate();
  const [grade, setGrade] = useState({ nombre: "", activo: true });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGrade(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!grade.nombre) {
      setError("El nombre es obligatorio");
      return;
    }

    try {
      await axios.post("https://localhost:7221/api/GradoEscolar", grade);
      navigate("/grades");
    } catch (err) {
      console.error(err);
      setError("Error al guardar el grado");
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title className="mb-3">Agregar Grado</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Grado</Form.Label>
            <Form.Control
              name="nombre"
              value={grade.nombre}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="activo"
              checked={grade.activo}
              onChange={handleChange}
              label={grade.activo ? "Activo" : "Inactivo"}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="secondary" onClick={() => navigate("/grades")}>Cancelar</Button>
            <Button type="submit" variant="primary">Guardar</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddGrade;
