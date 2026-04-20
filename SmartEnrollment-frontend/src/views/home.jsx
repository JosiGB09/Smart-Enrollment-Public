import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  //console pa ver si lo renderiza
    console.log("HOME RENDER");
  return (

    
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: "80vh" }}
    >
      <h1 className="fw-bold mb-3">Smart Enrollment</h1>

      <p className="fs-5 text-muted mb-4">
        El sitio web para matricular de forma rápida y sencilla
      </p>

      <button
        className="btn btn-primary btn-lg rounded-pill px-5 py-3"
        onClick={() => navigate("/matricula")}
      >
        Ir a Matrícula
      </button>
    </div>
  );
}

export default Home;

