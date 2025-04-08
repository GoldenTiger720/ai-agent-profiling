import api from "./index";

const clientsApi = {
  /**
   * Get all clients with optional filtering
   * @param {Object} params - Query parameters
   * @param {number} params.skip - Number of records to skip
   * @param {number} params.limit - Maximum number of records to return
   * @param {string} params.industry - Filter by industry
   * @returns {Promise} - API response
   */
  getClients: (params = {}) => {
    return api.get("/clients", { params });
  },

  /**
   * Get a specific client by ID
   * @param {number} id - Client ID
   * @returns {Promise} - API response
   */
  getClient: (id) => {
    return api.get(`/clients/${id}`);
  },

  /**
   * Create a new client
   * @param {Object} clientData - Client data
   * @returns {Promise} - API response
   */
  createClient: (clientData) => {
    return api.post("/clients", clientData);
  },

  /**
   * Update an existing client
   * @param {number} id - Client ID
   * @param {Object} clientData - Updated client data
   * @returns {Promise} - API response
   */
  updateClient: (id, clientData) => {
    return api.put(`/clients/${id}`, clientData);
  },

  /**
   * Delete a client
   * @param {number} id - Client ID
   * @returns {Promise} - API response
   */
  deleteClient: (id) => {
    return api.delete(`/clients/${id}`);
  },

  /**
   * Generate an AI-enhanced profile
   * @param {number} clientId - Client ID
   * @returns {Promise} - API response
   */
  generateProfile: (clientId) => {
    return api.post("/clients/generate-profile", { client_id: clientId });
  },
};
