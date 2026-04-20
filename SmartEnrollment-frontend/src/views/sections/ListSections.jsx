import React, { useState, useEffect } from "react";
import { Table, Button, Alert, Modal, Form } from "react-bootstrap";
import axios from "axios";

const ListSections = ({ gradoId }) => {
  const [sections, setSections] = useState([]);
  const [gradoNombre, setGradoNombre] = useState("");
  const [error, setError] = useState("");
  
  const [showAdd, setShowAdd] = useState(false);
  const [sectionForm, setSectionForm] = useState({ nombre: "", capacidad: 0 });
  const [editId, setEditId] = useState(null);

  // Traer secciones y nombre del grado
  const fetchSections = async () => {
    if (!gradoId) return;
    try {
      const resGrado = await axios.get(`https://localhost:7221/api/GradoEscolar/${gradoId}`);
      setGradoNombre(resGrado.data.nombre);

      const resSections = await axios.get(`https://localhost:7221/api/Seccion/byGrado?gradoId=${gradoId}`);
      setSections(resSections.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error al cargar las secciones");
    }
  };

  useEffect(() => {
    fetchSections();
  }, [gradoId]);

  // Abrir modal para agregar sección
  const openAdd = () => {
    setEditId(null);
    setSectionForm({ nombre: "", capacidad: 0 });
    setShowAdd(true);
  };

  // Abrir modal para editar sección
  const openEdit = (section) => {
    setEditId(section.id);
    setSectionForm({ nombre: section.nombre, capacidad: section.capacidad });
    setShowAdd(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSectionForm(prev => ({ ...prev, [name]: name === "capacidad" ? parseInt(value) : value }));
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`https://localhost:7221/api/Seccion/${editId}`, {
          id: editId,
          nombre: sectionForm.nombre,
          capacidad: sectionForm.capacidad,
          gradoId             
        });
      } else {
        // Agregar
        await axios.post(`https://localhost:7221/api/Seccion`, {
          nombre: sectionForm.nombre,
          capacidad: sectionForm.capacidad,
          gradoId
        });
      }

      setShowAdd(false);  // cerrar modal
      fetchSections();    // recargar lista
    } catch (err) {
      console.error(err);
      setError("Error al guardar la sección");
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("¿Desea eliminar esta sección?")) return;
    try {
      await axios.delete(`https://localhost:7221/api/Seccion/${id}`);
      fetchSections();
    } catch (err) {
      console.error(err);
      setError("Error al eliminar sección");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Secciones del grado "{gradoNombre}"</h5>
        <Button variant="primary" onClick={openAdd}>Agregar sección</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {sections.length === 0 && !error ? (
        <Alert variant="info">No hay secciones para este grado</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Capacidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sections.map(s => (
              <tr key={s.id}>
                <td>{s.nombre}</td>
                <td>{s.capacidad}</td>
                <td className="d-flex gap-2">
                  <Button size="sm" variant="warning" onClick={() => openEdit(s)}>Editar</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(s.id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal para agregar/editar */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Editar" : "Agregar"} sección</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                name="nombre"
                value={sectionForm.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Capacidad</Form.Label>
              <Form.Control
                name="capacidad"
                type="number"
                value={sectionForm.capacidad}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <div className="d-flex gap-2 justify-content-end">
              <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancelar</Button>
              <Button type="submit" variant="primary">Guardar</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ListSections;
