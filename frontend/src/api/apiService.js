import api from "./axiosInstance";

export const submitForm = async (formData) => {
  try {
    const response = await api.post("/form/submit", formData);
    return response.data;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};

export const fetchContactId = async (email) => {
  try {
    const response = await api.get(`/freshworks/lookup?email=${email}`);
    const contacts = response.data.contacts.contacts;
    if (contacts.length > 0) {
      return contacts[0].id;
    } else {
      throw new Error("No contact found");
    }
  } catch (error) {
    console.error("Error fetching Freshworks contact ID:", error);
    throw error;
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