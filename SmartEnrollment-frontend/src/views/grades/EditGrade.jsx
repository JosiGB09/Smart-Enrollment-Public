import React, { useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditGrade = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [grade, setGrade] = useState({ nombre: "", activo: true });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGrade = async () => {
      try {
        const res = await axios.get(`https://localhost:7221/api/GradoEscolar/${id}`);
        setGrade(res.data);
      } catch (err) {
        console.error(err);
        navigate("/grades");
      }
    };
    fetchGrade();
  }, [id, navigate]);

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
      await axios.put(`https://localhost:7221/api/GradoEscolar/${id}`, grade);
      navigate("/grades");
    } catch (err) {
      console.error(err);
      setError("Error al actualizar el grado");
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title className="mb-3">Editar Grado</Card.Title>
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
            <Button type="submit" variant="primary">Guardar cambios</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EditGrade;
