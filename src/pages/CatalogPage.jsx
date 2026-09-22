import { useEffect, useState } from "react";
import { getServices, getComunas } from "../api/catalogService";

export default function CatalogPage() {
  const [services, setServices] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [selectedComuna, setSelectedComuna] = useState("");
  const [selectedModality, setSelectedModality] = useState("");

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const [servicesRes, comunasRes] = await Promise.all([
        getServices(filters),
        getComunas().catch(() => ({ data: [] })),
      ]);

      setServices(servicesRes?.data || []);
      if (comunasRes?.data) setComunas(comunasRes.data);
    } catch (err) {
      console.error("Error al cargar el catálogo:", err);
      setError("No se pudieron cargar los servicios en este momento.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (comunaId, modality) => {
    const filters = {};
    if (comunaId) filters.comunaId = comunaId;
    if (modality) filters.modality = modality;
    fetchCatalog(filters);
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "2rem auto", padding: "0 1rem" }}>
      <header style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>Catálogo de Servicios</h1>
        <p style={{ color: "#666" }}>Explora y encuentra los servicios disponibles para ti</p>
      </header>

      {/* Filtros de búsqueda */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          background: "#f8f9fa",
          padding: "1rem",
          borderRadius: "8px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
            Comuna
          </label>
          <select
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
            value={selectedComuna}
            onChange={(e) => {
              setSelectedComuna(e.target.value);
              handleFilterChange(e.target.value, selectedModality);
            }}
          >
            <option value="">Todas las comunas</option>
            {comunas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1, minWidth: "200px" }}>
          <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
            Modalidad
          </label>
          <select
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
            value={selectedModality}
            onChange={(e) => {
              setSelectedModality(e.target.value);
              handleFilterChange(selectedComuna, e.target.value);
            }}
          >
            <option value="">Todas las modalidades</option>
            <option value="PRESENCIAL">Presencial</option>
            <option value="VIRTUAL">Virtual</option>
          </select>
        </div>
      </div>

      {loading && <p style={{ textAlign: "center", marginTop: "3rem" }}>Cargando catálogo...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {!loading && !error && (
        <>
          {services.length === 0 ? (
            <p style={{ textAlign: "center", color: "#777", margin: "3rem 0" }}>
              No hay servicios disponibles con los filtros seleccionados.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {services.map((service) => (
                <div
                  key={service.id}
                  style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "1.25rem",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    background: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        background: service.modality === "VIRTUAL" ? "#e3f2fd" : "#e8f5e9",
                        color: service.modality === "VIRTUAL" ? "#1976d2" : "#2e7d32",
                      }}
                    >
                      {service.modality}
                    </span>

                    <h3 style={{ margin: "0.5rem 0 0.25rem 0" }}>{service.name}</h3>
                    <p style={{ fontSize: "0.85rem", color: "#666", margin: "0 0 0.75rem 0" }}>
                      Ofrecido por: <strong>{service.companyName}</strong>
                    </p>

                    {service.description && (
                      <p style={{ fontSize: "0.9rem", color: "#444", marginBottom: "1rem" }}>
                        {service.description}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justify: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid #eee",
                      paddingTop: "0.75rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#2c3e50" }}>
                      ${Number(service.cost).toLocaleString("es-CO")}
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "#888" }}>
                      ⏱ {service.durationMinutes} min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}