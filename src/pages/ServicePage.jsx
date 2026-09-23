import { useState } from "react";
import { createService } from "../api/catalogService";

const ServicePage = ({
  companyId,
  comunas,
  error,
  loadingSubmit,
  setError,
  setLoadingSubmit,
  setSuccessMsg,
  successMsg
}) => {
  const [serviceData, setServiceData] = useState({
    name: "",
    description: "",
    recommendations: "",
    cost: "",
    durationMinutes: 30,
    modality: "PRESENCIAL",
    comunaId: "",
  });

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setError(null);
    setSuccessMsg(null);

    let currentCompanyId = companyId;
    if (!currentCompanyId) {
      try {
        const companyRes = await getMyCompany();
        currentCompanyId = companyRes?.data?.id || companyRes?.id;
        if (currentCompanyId) setCompanyId(currentCompanyId);
      } catch (err) {
        console.error("Fallo al reobtener la empresa:", err);
      }
    }

    if (!currentCompanyId) {
      setError("Tu usuario no tiene una empresa asociada válida para crear el servicio.");
      setLoadingSubmit(false);
      return;
    }

    try {
      const todayStr = new Date().toISOString().split("T")[0];

      const payload = {
        company_id: currentCompanyId,
        comuna_id: serviceData.comunaId ? Number(serviceData.comunaId) : null,
        name: serviceData.name,
        modality: serviceData.modality,
        cost: Number(serviceData.cost),
        duration_minutes: Number(serviceData.durationMinutes),
        description: serviceData.description || null,
        recommendations: serviceData.recommendations || null,
        start_date: todayStr,
        end_date: null,
      };

      console.log();

      const res = await createService(payload);

      if (res.status === 201 || res.status === 200) {
        setSuccessMsg("¡Servicio creado exitosamente en tu catálogo!");
        setServiceData({
          name: "",
          description: "",
          recommendations: "",
          cost: "",
          durationMinutes: 30,
          modality: "PRESENCIAL",
          comunaId: "",
        });
      }
    } catch (err) {
      console.error("Error al enviar el servicio:", err);
      setError(err.friendlyMessage || "Error al intentar crear el servicio en el servidor.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="company-page" style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h2>Configuración del Negocio y Catálogo</h2>
      <p className="muted">Administra la información de tu empresa y agrega los servicios que ofrecerás a tus clientes.</p>

      <hr style={{ margin: "2rem 0" }} />

      <h3>+ Registrar Nuevo Servicio</h3>

      {error && <div className="alert alert--error" style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
      {successMsg && <div className="alert alert--success" style={{ color: "green", marginBottom: "1rem" }}>{successMsg}</div>}

      <form onSubmit={handleServiceSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.3rem" }}>Nombre del servicio</label>
          <input
            type="text"
            required
            placeholder="Ej. Peluquería Canina, Asesoría Legal"
            style={{ width: "100%", padding: "0.5rem" }}
            value={serviceData.name}
            onChange={(e) => setServiceData({ ...serviceData, name: e.target.value })}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.3rem" }}>Descripción</label>
          <textarea
            rows="3"
            placeholder="Describe qué incluye este servicio..."
            style={{ width: "100%", padding: "0.5rem" }}
            value={serviceData.description}
            onChange={(e) => setServiceData({ ...serviceData, description: e.target.value })}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.3rem" }}>Recomendaciones (Opcional)</label>
          <input
            type="text"
            placeholder="Ej. Llegar 10 minutos antes..."
            style={{ width: "100%", padding: "0.5rem" }}
            value={serviceData.recommendations}
            onChange={(e) => setServiceData({ ...serviceData, recommendations: e.target.value })}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "0.3rem" }}>Precio (COP)</label>
            <input
              type="number"
              required
              placeholder="70000"
              style={{ width: "100%", padding: "0.5rem" }}
              value={serviceData.cost}
              onChange={(e) => setServiceData({ ...serviceData, cost: e.target.value })}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "0.3rem" }}>Duración (minutos)</label>
            <input
              type="number"
              required
              style={{ width: "100%", padding: "0.5rem" }}
              value={serviceData.durationMinutes}
              onChange={(e) => setServiceData({ ...serviceData, durationMinutes: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "0.3rem" }}>Modalidad</label>
            <select
              style={{ width: "100%", padding: "0.5rem" }}
              value={serviceData.modality}
              onChange={(e) => setServiceData({ ...serviceData, modality: e.target.value })}
            >
              <option value="PRESENCIAL">Presencial</option>
              <option value="VIRTUAL">Virtual</option>
            </select>
          </div>

          {serviceData.modality === "PRESENCIAL" && (
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "0.3rem" }}>Comuna</label>
              <select
                style={{ width: "100%", padding: "0.5rem" }}
                value={serviceData.comunaId}
                onChange={(e) => setServiceData({ ...serviceData, comunaId: e.target.value })}
              >
                <option value="">Selecciona comuna...</option>
                {comunas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn--primary"
          disabled={loadingSubmit}
          style={{ padding: "0.75rem", marginTop: "1rem", cursor: "pointer" }}
        >
          {loadingSubmit ? "Guardando Servicio..." : "Guardar Servicio en Catálogo"}
        </button>
      </form>
    </div>
  );
};

export default ServicePage;
