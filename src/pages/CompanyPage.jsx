import { useEffect, useState } from "react";
import { createService, getComunas } from "../api/catalogService";
import { getMyCompany, createCompany } from "../api/companyService"; // Importamos createCompany

export default function CompanyPage() {
  const [companyId, setCompanyId] = useState(null);
  const [comunas, setComunas] = useState([]);

  // Estado para registrar la Empresa
  const [companyData, setCompanyData] = useState({
    name: "",
    nit: "",
    phone: "",
    address: "",
  });

  // Estado para registrar el Servicio
  const [serviceData, setServiceData] = useState({
    name: "",
    description: "",
    recommendations: "",
    cost: "",
    durationMinutes: 30,
    modality: "PRESENCIAL",
    comunaId: "",
  });

  const [loadingCompany, setLoadingCompany] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Carga automática al montar el componente
  useEffect(() => {
    async function loadInitialData() {
      setLoadingCompany(true);
      setError(null);
      try {
        const [comunasRes, companyRes] = await Promise.all([
          getComunas().catch(() => ({ data: [] })),
          getMyCompany().catch(() => null),
        ]);

        if (comunasRes?.data) setComunas(comunasRes.data);

        // Extrae el ID adecuadamente del backend
        const fetchedCompanyId = companyRes?.data?.id || companyRes?.id;
        if (fetchedCompanyId) {
          setCompanyId(fetchedCompanyId);
        }
      } catch (err) {
        console.error("Error al cargar datos iniciales:", err);
      } finally {
        setLoadingCompany(false);
      }
    }
    loadInitialData();
  }, []);

  // Manejador para crear la Empresa
  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await createCompany(companyData);
      const createdCompanyId = res?.data?.id || res?.id;

      if (createdCompanyId) {
        setCompanyId(createdCompanyId);
        setSuccessMsg("¡Empresa registrada exitosamente! Ahora puedes agregar tus servicios.");
      } else {
        // En caso de que la respuesta sea un 200/201 simple, reconsultamos la empresa
        const companyRes = await getMyCompany();
        const refetchedId = companyRes?.data?.id || companyRes?.id;
        if (refetchedId) {
          setCompanyId(refetchedId);
          setSuccessMsg("¡Empresa registrada exitosamente!");
        } else {
          setError("Se creó la empresa pero no se pudo obtener su identificador.");
        }
      }
    } catch (err) {
      console.error("Error al crear la empresa:", err);
      setError(err?.friendlyMessage || "Error al intentar registrar la empresa.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Manejador para crear el Servicio
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

  if (loadingCompany) {
    return <p style={{ textAlign: "center", marginTop: "3rem" }}>Cargando información del negocio...</p>;
  }

  // VISTA 1: SI NO TIENE EMPRESA CREADA
  if (!companyId) {
    return (
      <div className="company-page" style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
        <h2>Registra tu Empresa / Negocio</h2>
        <p className="muted">Antes de agregar servicios al catálogo, debes ingresar los datos principales de tu empresa.</p>

        <hr style={{ margin: "2rem 0" }} />

        {error && <div className="alert alert--error" style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
        {successMsg && <div className="alert alert--success" style={{ color: "green", marginBottom: "1rem" }}>{successMsg}</div>}

        <form onSubmit={handleCompanySubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.3rem" }}>Nombre de la Empresa</label>
            <input
              type="text"
              required
              placeholder="Ej. Mi Negocio S.A.S."
              style={{ width: "100%", padding: "0.5rem" }}
              value={companyData.name}
              onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.3rem" }}>NIT / RUT</label>
            <input
              type="text"
              required
              placeholder="Ej. 900123456-1"
              style={{ width: "100%", padding: "0.5rem" }}
              value={companyData.nit}
              onChange={(e) => setCompanyData({ ...companyData, nit: e.target.value })}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.3rem" }}>Teléfono de contacto</label>
            <input
              type="text"
              placeholder="Ej. 3001234567"
              style={{ width: "100%", padding: "0.5rem" }}
              value={companyData.phone}
              onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.3rem" }}>Dirección</label>
            <input
              type="text"
              placeholder="Ej. Calle 10 # 40-20"
              style={{ width: "100%", padding: "0.5rem" }}
              value={companyData.address}
              onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary"
            disabled={loadingSubmit}
            style={{ padding: "0.75rem", marginTop: "1rem", cursor: "pointer" }}
          >
            {loadingSubmit ? "Registrando..." : "Registrar Empresa"}
          </button>
        </form>
      </div>
    );
  }

  // VISTA 2: SI YA TIENE EMPRESA CREADA
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
}