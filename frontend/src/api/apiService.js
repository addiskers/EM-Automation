import api, { fetchCsrfToken } from "./axiosInstance";

const ensureToken = async () => {
  if (!api.defaults.headers.common["X-CSRF-Token"]) {
    await fetchCsrfToken();
  }
};

export const submitForm = async (formData) => {
  try {
    await ensureToken();
    const response = await api.post("/form/submit", formData);
    return response.data;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};

export const fetchContactId = async (email) => {
  const maxRetries = 3;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      await ensureToken();
      const response = await api.get(`/freshworks/lookup?email=${email}`);
      if (response.data && response.data.id) {
        return response.data.id;
      } else {
        throw new Error("No contact found");
      }
    } catch (error) {
      retryCount++;
      if (retryCount >= maxRetries) {
        console.error("Error fetching Freshworks contact ID after multiple attempts:", error);
        throw error;
      }
      console.log(`Retry attempt ${retryCount} for fetchContactId...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

export const updateContact = async (contactId, additionalData) => {
  try {
    if (!contactId) {
      throw new Error("Contact ID is required for updating");
    }
    console.log("Updating contact with ID:", contactId, "Data:", additionalData);
    const response = await api.put(`/freshworks/update/${contactId}`, additionalData);
    return response.data;
  } catch (error) {
    console.error("Error updating Freshworks contact:", error.response?.data || error.message);
    throw error;
  }
};