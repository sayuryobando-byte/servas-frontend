import { httpClient } from "./httpClient";
import { mockServices, mockComunas, findMockServiceById } from "../mocks/servicesMock";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

function wait(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * HU-005 · Crear un nuevo servicio
 * POST /services
 */
export async function createService(serviceData) {
  if (USE_MOCKS) {
    await wait(300);
    const newService = {
      id: Date.now(),
      ...serviceData,
      rating: 5.0,
      reviewsCount: 0,
    };
    mockServices.push(newService);
    return { status: 201, data: newService };
  }

  const { data } = await httpClient.post("/services", serviceData);
  return { status: 201, data };
}

/**
 * HU-008 · Selección de servicio (catálogo)
 * GET /services?comuna_id=&modality=&company_id=
 */
export async function getServices(filters = {}) {
  if (USE_MOCKS) {
    await wait();
    let results = [...mockServices];
    if (filters.comuna_id) {
      results = results.filter((s) => s.comuna.id === Number(filters.comuna_id));
    }
    if (filters.modality) {
      results = results.filter((s) => s.modality === filters.modality);
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      results = results.filter(
        (s) =>
          s.name.toLowerCase().includes(q) || s.company.name.toLowerCase().includes(q)
      );
    }
    return { status: 200, data: results };
  }

  const { data } = await httpClient.get("/services", { params: filters });
  return { status: 200, data };
}

/**
 * HU-009 · Detalle del servicio
 * GET /services/{id}
 */
export async function getServiceById(id) {
  if (USE_MOCKS) {
    await wait(250);
    const service = findMockServiceById(id);
    if (!service) throw { friendlyMessage: "El servicio solicitado no existe." };
    return { status: 200, data: service };
  }

  const { data } = await httpClient.get(`/services/${id}`);
  return { status: 200, data };
}

/**
 * Listado maestro de comunas de Medellín, usado como filtro del catálogo.
 * GET /comunas
 */
export async function getComunas() {
  if (USE_MOCKS) {
    await wait(150);
    return { status: 200, data: mockComunas };
  }

  const { data } = await httpClient.get("/comunas");
  return { status: 200, data };
}