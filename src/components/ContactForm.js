import React, { useState, useEffect } from "react";
import "./ContactForm.css";

const ContactForm = ({
  onSubmit,
  onClose,
  initialData,
  mode = "create",
  organizations = [],
}) => {
  const [formData, setFormData] = useState({
    name: "",
    organizationId: "",
    type: "",
    phone: "",
    email: "",
    notes: "",
  });

  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData(initialData);
    }
  }, [initialData, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting contact form with data:", formData);

    // Validate required fields
    if (!formData.name) {
      alert("Name is required");
      return;
    }

    if (!formData.organizationId) {
      alert("Organization is required");
      return;
    }

    onSubmit(formData);
  };

  // Find the organization name for display
  const selectedOrganization = organizations.find(
    (org) => org.id.toString() === formData.organizationId?.toString()
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{mode === "create" ? "Add New Contact" : "Edit Contact"}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="organizationId">Organization *</label>
            <select
              id="organizationId"
              name="organizationId"
              required
              value={formData.organizationId}
              onChange={handleChange}
            >
              <option value="">Select an organization</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="type">Contact Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="">Select type</option>
              <option value="Wound Care">Wound Care</option>
              <option value="PCP">PCP</option>
              <option value="Pain Management">Pain Management</option>
              <option value="Urgent Care">Urgent Care</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              {mode === "create" ? "Create Contact" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
