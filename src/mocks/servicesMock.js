// Datos de ejemplo alineados al contrato de /services y /services/{id}.
// Sirven para maquetar el catálogo (HU-008) y el detalle (HU-009)
// mientras el backend expone los endpoints reales.

export const mockServices = [
  {
    id: "b1a1c2d3-0001-0000-0000-000000000001",
    name: "Consulta psicológica",
    modality: "VIRTUAL",
    comuna: { id: 11, name: "Laureles" },
    company: { id: "c-001", name: "Mente Clara", social_media: "menteclara" },
    cost: 85000,
    duration_minutes: 50,
    description:
      "Espacio de escucha profesional para trabajar ansiedad, estrés y bienestar emocional.",
    recommendations: "Ideal para mayores de 18 años. No necesitas experiencia previa.",
    is_active: true,
  },
  {
    id: "b1a1c2d3-0002-0000-0000-000000000002",
    name: "Asesoría legal laboral",
    modality: "PRESENCIAL",
    comuna: { id: 12, name: "El Poblado" },
    company: { id: "c-002", name: "Estudio Norte", social_media: "estudionorte" },
    cost: 120000,
    duration_minutes: 60,
    description:
      "Orientación legal personalizada sobre contratos, liquidaciones y derechos laborales.",
    recommendations: "Trae contigo el contrato o documento relacionado con tu caso.",
    is_active: true,
  },
  {
    id: "b1a1c2d3-0003-0000-0000-000000000003",
    name: "Clase de yoga personalizada",
    modality: "PRESENCIAL",
    comuna: { id: 13, name: "Envigado" },
    company: { id: "c-003", name: "Casa Respira", social_media: "casarespira" },
    cost: 65000,
    duration_minutes: 60,
    description: "Sesión individual adaptada a tu nivel y objetivos de bienestar físico.",
    recommendations: "Usa ropa cómoda. Trae tu propio tapete si tienes uno.",
    is_active: true,
  },
  {
    id: "b1a1c2d3-0004-0000-0000-000000000004",
    name: "Diseño de identidad visual",
    modality: "VIRTUAL",
    comuna: { id: 14, name: "Belén" },
    company: { id: "c-004", name: "Taller Croma", social_media: "tallercroma" },
    cost: 250000,
    duration_minutes: 90,
    description:
      "Sesión de trabajo para definir logo, paleta de color y lineamientos básicos de marca.",
    recommendations: null,
    is_active: true,
  },
];

export const mockComunas = [
  { id: 11, name: "Laureles" },
  { id: 12, name: "El Poblado" },
  { id: 13, name: "Envigado" },
  { id: 14, name: "Belén" },
];

export function findMockServiceById(id) {
  return mockServices.find((service) => service.id === id) || null;
}
