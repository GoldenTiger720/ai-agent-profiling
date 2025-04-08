import api from "./index";

const opportunitiesApi = {
  /**
   * Get all opportunities with optional filtering
   * @param {Object} params - Query parameters
   * @param {number} params.skip - Number of records to skip
   * @param {number} params.limit - Maximum number of records to return
   * @param {number} params.client_id - Filter by client ID
   * @param {string} params.status - Filter by status
   * @returns {Promise} - API response
   */
  getOpportunities: (params = {}) => {
    return api.get("/opportunities", { params });
  },

  /**
   * Get a specific opportunity by ID
   * @param {number} id - Opportunity ID
   * @returns {Promise} - API response
   */
  getOpportunity: (id) => {
    return api.get(`/opportunities/${id}`);
  },

  /**
   * Create a new opportunity
   * @param {Object} opportunityData - Opportunity data
   * @returns {Promise} - API response
   */
  createOpportunity: (opportunityData) => {
    return api.post("/opportunities", opportunityData);
  },

  /**
   * Update an existing opportunity
   * @param {number} id - Opportunity ID
   * @param {Object} opportunityData - Updated opportunity data
   * @returns {Promise} - API response
   */
  updateOpportunity: (id, opportunityData) => {
    return api.put(`/opportunities/${id}`, opportunityData);
  },

  /**
   * Delete an opportunity
   * @param {number} id - Opportunity ID
   * @returns {Promise} - API response
   */
  deleteOpportunity: (id) => {
    return api.delete(`/opportunities/${id}`);
  },

  /**
   * Generate AI-identified opportunities for a client
   * @param {number} clientId - Client ID
   * @returns {Promise} - API response
   */
  generateOpportunities: (clientId) => {
    return api.post("/opportunities/generate", { client_id: clientId });
  },
};

export default opportunitiesApi;
