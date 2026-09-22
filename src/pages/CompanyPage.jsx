import { useState } from "react";
import { createCompany, validateLogoFile } from "../api/companyService";

const initialForm = {
  nit: "",
  name: "",
  description: "",
  address: "",
  social_media: "",
};

export default function CompanyPage() {
  const [form, setForm] = useState(initialForm);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleLogoChange(e) {
    const file = e.target.files?.[0] ?? null;
    setFormError(null);

    if (!file) {
      setLogo(null);
      setLogoPreview(null);
      return;
    }

    const validationError = validateLogoFile(file);
    if (validationError) {
      setFormError(validationError);
      e.target.value = "";
      return;
    }

    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function validate() {
    const errors = {};
    if (!form.nit.trim()) errors.nit = "El NIT es obligatorio.";
    if (!form.name.trim()) errors.name = "El nombre del negocio es obligatorio.";
    if (!form.address.trim()) errors.address = "La dirección es obligatoria.";
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await createCompany({ ...form, logo });
      setSuccess("El negocio fue registrado exitosamente.");
    } catch (err) {
      setFormError(err.friendlyMessage || "No se pudo guardar la información del negocio.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <form className="card form-card" onSubmit={handleSubmit} noValidate>
        <h1>Datos de mi negocio</h1>
        <p className="muted">
          Esta información se mostrará a tus clientes en el catálogo de servicios.
        </p>

        {formError && <div className="alert alert--error">{formError}</div>}
        {success && <div className="alert alert--success">{success}</div>}

        <div className="form-grid">
          <Field label="NIT" error={fieldErrors.nit}>
            <input name="nit" value={form.nit} onChange={handleChange} />
          </Field>

          <Field label="Nombre del negocio" error={fieldErrors.name}>
            <input name="name" value={form.name} onChange={handleChange} />
          </Field>

          <Field label="Dirección" error={fieldErrors.address} full>
            <input name="address" value={form.address} onChange={handleChange} />
          </Field>

          <Field label="Descripción (opcional)" full>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </Field>

          <Field label="Redes sociales (opcional)">
            <input
              name="social_media"
              value={form.social_media}
              onChange={handleChange}
              placeholder="@minegocio"
            />
          </Field>

          <Field label="Logo del negocio (opcional, PNG/JPG/WEBP, máx. 2MB)">
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleLogoChange} />
          </Field>
        </div>

        {logoPreview && (
          <div className="logo-preview">
            <img src={logoPreview} alt="Vista previa del logo" />
          </div>
        )}

        <button className="btn btn--primary" type="submit" disabled={submitting}>
          {submitting ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, error, children, full }) {
  return (
    <label className={`field ${full ? "field--full" : ""}`}>
      <span>{label}</span>
      {children}
      {error && <span className="field__error">{error}</span>}
    </label>
  );
}
