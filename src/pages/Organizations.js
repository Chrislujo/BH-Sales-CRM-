import React, { useState } from "react";
import "./Organizations.css";
import OrganizationForm from "../components/OrganizationForm";

const MOCK_ORGANIZATIONS = [
  {
    id: 1,
    name: "Mercy Hospital",
    type: "Hospital",
    address: "123 Healthcare Ave",
    city: "Springfield",
    state: "IL",
    phone: "(555) 123-4567",
    email: "contact@mercy.com",
    website: "www.mercy.com",
  },
  {
    id: 2,
    name: "Valley Primary Care",
    type: "Clinic",
    address: "456 Medical Dr",
    city: "Springfield",
    state: "IL",
    phone: "(555) 234-5678",
    email: "info@valleycare.com",
    website: "www.valleycare.com",
  },
];

const Organizations = () => {
  const [organizations, setOrganizations] = useState(MOCK_ORGANIZATIONS);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType ? org.type === filterType : true;
    return matchesSearch && matchesFilter;
  });

  const handleCreateOrg = (newOrg) => {
    setOrganizations([...organizations, { ...newOrg, id: Date.now() }]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="organizations-page">
      <div className="organizations-header">
        <div className="organizations-title">
          <h1>Organizations</h1>
          <span className="org-count">
            {organizations.length} organizations
          </span>
        </div>
        <button
          className="create-org-btn"
          onClick={() => setIsCreateModalOpen(true)}
        >
          + New Organization
        </button>
      </div>

      <div className="organizations-container">
        <div className="organizations-list">
          <div className="organizations-list-header">
            <div className="search-filter-container">
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="org-search"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="org-filter"
              >
                <option value="">All Types</option>
                <option value="Hospital">Hospital</option>
                <option value="Clinic">Clinic</option>
                <option value="Practice">Practice</option>
                <option value="Pharmacy">Pharmacy</option>
              </select>
            </div>
          </div>

          <div className="organizations-list-content">
            {filteredOrgs.map((org) => (
              <div
                key={org.id}
                className={`org-list-item ${
                  selectedOrg?.id === org.id ? "selected" : ""
                }`}
                onClick={() => setSelectedOrg(org)}
              >
                <div className="org-list-info">
                  <h3>{org.name}</h3>
                  <span className="org-type">{org.type}</span>
                </div>
                <div className="org-list-details">
                  <span>
                    {org.city}, {org.state}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="organization-details">
          {selectedOrg ? (
            <>
              <div className="org-details-header">
                <h2>{selectedOrg.name}</h2>
                <button className="edit-org-btn">Edit</button>
              </div>

              <div className="org-details-content">
                <div className="org-info-section">
                  <h3>Organization Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Type</label>
                      <p>{selectedOrg.type}</p>
                    </div>
                    <div className="info-item">
                      <label>Phone</label>
                      <p>{selectedOrg.phone}</p>
                    </div>
                    <div className="info-item">
                      <label>Email</label>
                      <p>{selectedOrg.email}</p>
                    </div>
                    <div className="info-item">
                      <label>Website</label>
                      <p>{selectedOrg.website}</p>
                    </div>
                  </div>
                </div>

                <div className="org-address-section">
                  <h3>Address</h3>
                  <p>{selectedOrg.address}</p>
                  <p>
                    {selectedOrg.city}, {selectedOrg.state}
                  </p>
                </div>

                <div className="org-contacts-section">
                  <h3>Associated Contacts</h3>
                  {/* We'll implement this in the next step */}
                  <p className="no-data">No contacts associated yet</p>
                </div>
              </div>
            </>
          ) : (
            <div className="no-org-selected">
              <p>Select an organization to view details</p>
            </div>
          )}
        </div>
      </div>

      {isCreateModalOpen && (
        <OrganizationForm
          onSubmit={handleCreateOrg}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Organizations;
