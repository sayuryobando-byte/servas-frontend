import { useEffect, useMemo, useState } from "react";
import { getServices, getComunas } from "../api/catalogService";

const MODALITIES = [
  { value: "", label: "Todas" },
  { value: "VIRTUAL", label: "Virtual" },
  { value: "PRESENCIAL", label: "Presencial" },
];

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function CatalogPage() {
  const [services, setServices] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [comunaId, setComunaId] = useState("");
  const [modality, setModality] = useState("");

  const [selectedService, setSelectedService] = useState(null);

  // HU-008 · Carga inicial del catálogo y de comunas para el filtro.
  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [servicesRes, comunasRes] = await Promise.all([
          getServices({ query, comuna_id: comunaId, modality }),
          comunas.length ? Promise.resolve({ data: comunas }) : getComunas(),
        ]);
        if (!active) return;
        setServices(servicesRes.data);
        if (!comunas.length) setComunas(comunasRes.data);
        // Si aún no hay servicio seleccionado, mostramos el primero (como en el mockup).
        setSelectedService((prev) => prev ?? servicesRes.data[0] ?? null);
      } catch (err) {
        if (active) setError(err.friendlyMessage || "No se pudo cargar el catálogo.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, comunaId, modality]);
  const marcas = useMemo(
    () => {
      const marcasRaw = services.length > 0
        ? services.map((s) => s?.company?.name).filter(Boolean)
        : [];

      return Array.from(new Set(marcasRaw));
    },
    [services]
  );

  return (
    <div className="catalog">
      <section className="catalog__hero">
        <span className="eyebrow">Medellín y alrededores</span>
        <h1>Encuentra el servicio que necesitas.</h1>
        <p className="muted">Reserva espacios con profesionales locales, de forma simple y segura.</p>

        <div className="catalog__filters">
          <input
            className="catalog__search"
            placeholder="Busca por servicio o palabra clave"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select value={comunaId} onChange={(e) => setComunaId(e.target.value)}>
            <option value="">Todas las comunas</option>
            {comunas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select value={modality} onChange={(e) => setModality(e.target.value)}>
            {MODALITIES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <select disabled title="Filtro de marca (según catálogo actual)">
            <option>Todas las marcas ({marcas.length})</option>
          </select>
        </div>
      </section>

      {error && <div className="alert alert--error">{error}</div>}

      <section className="catalog__body">
        <div className="catalog__list">
          <p className="catalog__count">
            Servicios disponibles
            <br />
            <strong>{loading ? "Cargando..." : `${services.length} opciones para ti`}</strong>
          </p>

          {!loading && services.length === 0 && (
            <p className="muted">No hay reservas disponibles</p>
          )}

          {services.map((service) => (
            <ServiceListItem
              key={service.id}
              service={service}
              selected={service.id === selectedService?.id}
              onSelect={() => setSelectedService(service)}
            />
          ))}
        </div>

        <div className="catalog__detail">
          {selectedService ? (
            <ServiceDetail service={selectedService} />
          ) : (
            <p className="muted">Selecciona un servicio para ver el detalle.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function ServiceListItem({ service, selected, onSelect }) {
  return (
    <button
      className={`service-item ${selected ? "service-item--active" : ""}`}
      onClick={onSelect}
    >
      <span className="service-item__avatar">{service?.company?.name?.charAt(0)}</span>
      <span className="service-item__info">
        <span className="service-item__name">
          {service.name}{" "}
          <span className={`badge badge--${service?.modality?.toLowerCase()}`}>
            {service?.modality === "VIRTUAL" ? "Virtual" : "Presencial"}
          </span>
        </span>
        <span className="muted small">
          {service?.company?.name} · {service?.comuna?.name ?? "N/A"}
        </span>
        <span className="service-item__price">
          {currencyFormatter.format(service?.cost)} · {service?.duration_minutes} min
        </span>
      </span>
      <span aria-hidden>→</span>
    </button>
  );
}

// HU-009 · Detalle del servicio
function ServiceDetail({ service }) {
  function handleReservar() {
    // El flujo completo de reserva corresponde a la Épica 4 (fuera de este sprint).
    // Aquí solo se dispara la intención, según el criterio de aceptación de HU-008/HU-009.
    alert(`Iniciando proceso de reserva para "${service.name}"`);
  }

  return (
    <div className="service-detail">
      <span className="muted small">Detalle del servicio</span>
      <h2>{service?.name}</h2>

      <div className="service-detail__company">
        <span className="service-item__avatar">{service?.company?.name?.charAt(0)}</span>
        <div>
          <strong>{service?.company?.name}</strong>
          <p className="muted small">📍 {service?.comuna?.name ?? "Modalidad virtual"}</p>
        </div>
      </div>

      {service?.description && (
        <>
          <h3>Descripción</h3>
          <p>{service?.description}</p>
        </>
      )}

      {service?.recommendations && (
        <>
          <h3>Recomendaciones</h3>
          <p>{service?.recommendations}</p>
        </>
      )}

      {service?.company?.social_media && (
        <p className="muted small">@{service?.company?.social_media}</p>
      )}

      <div className="service-detail__footer">
        <div>
          <span className="muted small">Costo</span>
          <p className="service-detail__price">{currencyFormatter.format(service?.cost)}</p>
        </div>
        <button className="btn btn--primary" onClick={handleReservar}>
          Reservar
        </button>
      </div>
    </div>
  );
}
