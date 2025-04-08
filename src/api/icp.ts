import api from "./index";

const icpApi = {
  /**
   * Get all ICP analyses with optional filtering
   * @param {Object} params - Query parameters
   * @param {number} params.skip - Number of records to skip
   * @param {number} params.limit - Maximum number of records to return
   * @param {number} params.client_id - Filter by client ID
   * @returns {Promise} - API response
   */
  getICPs: (params = {}) => {
    return api.get("/icp", { params });
  },

  /**
   * Get a specific ICP analysis by ID
   * @param {number} id - ICP analysis ID
   * @returns {Promise} - API response
   */
  getICP: (id) => {
    return api.get(`/icp/${id}`);
  },

  /**
   * Get ICP analysis for a specific client
   * @param {number} clientId - Client ID
   * @returns {Promise} - API response
   */
  getClientICP: (clientId) => {
    return api.get(`/icp/client/${clientId}`);
  },

  /**
   * Create a new ICP analysis
   * @param {Object} icpData - ICP analysis data
   * @returns {Promise} - API response
   */
  createICP: (icpData) => {
    return api.post("/icp", icpData);
  },

  /**
   * Update an existing ICP analysis
   * @param {number} id - ICP analysis ID
   * @param {Object} icpData - Updated ICP analysis data
   * @returns {Promise} - API response
   */
  updateICP: (id, icpData) => {
    return api.put(`/icp/${id}`, icpData);
  },

  /**
   * Delete an ICP analysis
   * @param {number} id - ICP analysis ID
   * @returns {Promise} - API response
   */
  deleteICP: (id) => {
    return api.delete(`/icp/${id}`);
  },

  /**
   * Generate AI-enhanced ICP analysis for a client
   * @param {number} clientId - Client ID
   * @returns {Promise} - API response
   */
  generateICP: (clientId) => {
    return api.post("/icp/generate", { client_id: clientId });
  },
};

export default icpApi;
