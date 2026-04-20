import React, { useState, useEffect } from "react";
import { Table, Button, Alert, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ListSections from "../sections/ListSections";


const ListGrades = () => {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Para modal de secciones
  const [showSections, setShowSections] = useState(false);
  const [selectedGradeId, setSelectedGradeId] = useState(null);

  // Cargar grados desde API
  const fetchGrades = async () => {
    try {
      const res = await axios.get("https://localhost:7221/api/GradoEscolar");
      setGrades(res.data);
    } catch (error) {
      console.error("Error al cargar los grados:", error);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const onAddGrade = () => navigate("/grades/add");
  const onEditGrade = (id) => navigate(`/grades/edit/${id}`);

  const onDeleteGrade = async (id) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este grado?")) return;
    try {
      await axios.delete(`https://localhost:7221/api/GradoEscolar/${id}`);
      fetchGrades(); // recarga tabla
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const openSections = (gradeId) => {
    setSelectedGradeId(gradeId);
    setShowSections(true);
  };

  const closeSections = () => {
    setSelectedGradeId(null);
    setShowSections(false);
  };

  const gradesFiltrados = grades.filter(g =>
    g.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Grados</h4>
        <Button variant="primary" onClick={onAddGrade}>Agregar grado</Button>
      </div>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar por grado..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {gradesFiltrados.length === 0 ? (
        <Alert variant="warning" className="text-center">
          No hay grados que coincidan con la búsqueda
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Grado</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {gradesFiltrados.map((g) => (
              <tr key={g.id}>
                <td>{g.nombre}</td>
                <td>{g.activo ? "Activo" : "Inactivo"}</td>
                <td className="d-flex gap-2">
                  <Button variant="info" size="sm" onClick={() => openSections(g.id)}>
                    Ver secciones
                  </Button>

                  <Button variant="warning" size="sm" onClick={() => onEditGrade(g.id)}>Editar</Button>
                  <Button variant="danger" size="sm" onClick={() => onDeleteGrade(g.id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal para mostrar secciones */}
      <Modal show={showSections} onHide={closeSections} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Secciones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedGradeId && (
            <ListSections
              gradoId={selectedGradeId}
              closeModal={closeSections}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ListGrades;
