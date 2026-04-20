const estudianteInitial = {
  nombre: "",
  apellido: "",
  cedula: "",
  nacionalidad: "",
  fechaNacimiento: "",
  sexo: "",
  padecimientos: "",
  hermanosEstudiantes: false,
  vacunasCompletas: false,
  beca: "",
  traslado: false,
  repitente: false,
  // Relaciones (no se envian al POST de estudiante, esto se asigna en matricula)
  encargadoLegal: null,   //  { id, nombre, apellido, cedula, parentesco }
  encargados: [],         //  [{ id, nombre, apellido, cedula, parentesco }]
};

export default estudianteInitial;