import React, { useState, useEffect } from "react";
import Select from "react-select";
import { submitForm, fetchContactId, updateContact } from "../api/apiService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchCsrfToken } from "../api/axiosInstance";
import countryData from "../data/countries.json";

const Form = () => {
  const initialFormState = {
    name: "",
    lastname: "",
    email: "",
    phonecode: "",
    countryName: "", // Added country name field
    phone: "",
    company_name: "",
    designation: "",
    message: "",
    slug: "",
    productCode: "",
    company_linkedin: "",
    employee_size: "",
    research_requirement: "",
    company_domain: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [csrfTokenFetched, setCsrfTokenFetched] = useState(false);

  useEffect(() => {
    // Fetch CSRF token when component mounts
    const fetchToken = async () => {
      try {
        await fetchCsrfToken();
        setCsrfTokenFetched(true);
        console.log("CSRF token fetched successfully");
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
        toast.error("Failed to initialize form security. Please refresh the page.");
      }
    };
    
    fetchToken();
  }, []);

  const countryOptions = countryData.map((country) => ({
    value: country.phonecode,
    label: `${country.name} (${country.phonecode})`,
    name: country.name // Store the country name for later use
  }));

  const employeeSizeOptions = [
    { value: "1-10", label: "1-10 employees" },
    { value: "11-50", label: "11-50 employees" },
    { value: "51-200", label: "51-200 employees" },
    { value: "201-500", label: "201-500 employees" },
    { value: "501-1000", label: "501-1000 employees" },
    { value: "1001-5000", label: "1001-5000 employees" },
    { value: "5001-10000", label: "5001-10000 employees" },
    { value: "10000+", label: "10000+ employees" },
  ];

  const defaultCountryOption = countryOptions.find(
    (option) => option.value === formData.phonecode
  ) || null;

  const defaultEmployeeSizeOption = employeeSizeOptions.find(
    (option) => option.value === formData.employee_size
  ) || null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "research_requirement" ? { message: value } : {}), 
    }));
  };
  
  const handlePhoneCodeChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      phonecode: selectedOption ? selectedOption.value : "",
      countryName: selectedOption ? selectedOption.name : "", 
    }));
  };

  const handleEmployeeSizeChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      employee_size: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!csrfTokenFetched) {
      try {
        await fetchCsrfToken();
        setCsrfTokenFetched(true);
      } catch (error) {
        toast.error("Failed to secure the form submission. Please try again.");
        setLoading(false);
        return;
      }
    }

    // Validate required fields
    if (!formData.phonecode || !formData.countryName) {
      toast.error("Please select a country code", {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    const trimmedFormData = Object.entries(formData).reduce(
      (acc, [key, value]) => {
        acc[key] = typeof value === "string" ? value.trim() : value;
        return acc;
      },
      {}
    );

    console.log("Submitting form data:", trimmedFormData);

    try {
      await submitForm(trimmedFormData);
      toast.success("Form submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });

      try {
        const contactId = await fetchContactId(trimmedFormData.email);
        toast.success(`Fetched Contact ID: ${contactId}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });

        await updateContact(contactId, {
          company_linkedin: trimmedFormData.company_linkedin,
          employee_size: trimmedFormData.employee_size,
          research_requirement: trimmedFormData.research_requirement,
          company_domain: trimmedFormData.company_domain,
          productCode: trimmedFormData.productCode,
        });
        toast.success("Freshworks contact updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      } catch (contactError) {
        console.error("Error with Freshworks operations:", contactError);
        toast.warning("Form submitted, but contact update failed.");
      }

      setFormData(initialFormState);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectStyles = {
    control: (styles) => ({
      ...styles,
      borderRadius: "4px",
      borderColor: "#ddd",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#aaa",
      },
    }),
  };

  return (
    <div style={styles.container}>
      {/* Add ToastContainer component */}
      <ToastContainer />
      
      <div style={styles.formCard}>
        <h1 style={styles.title}>EM LEADS</h1>
        <p style={styles.subtitle}>
          Please fill out the form below to submit your request
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Personal Information</label>
              <div style={styles.inputRow}>
                <div style={styles.inputGroup}>
                  <input
                    style={styles.input}
                    name="name"
                    placeholder="First Name *"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <input
                    style={styles.input}
                    name="lastname"
                    placeholder="Last Name"
                    value={formData.lastname}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div style={styles.inputGroup}>
                <input
                  style={styles.input}
                  name="email"
                  type="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={styles.inputRow}>
                <div style={styles.inputGroup}>
                  <Select
                    styles={selectStyles}
                    options={countryOptions}
                    onChange={handlePhoneCodeChange}
                    placeholder="Country Code *"
                    value={defaultCountryOption}
                    isClearable
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <input
                    style={styles.input}
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Company Information</label>
              <div style={styles.inputGroup}>
                <input
                  style={styles.input}
                  name="company_name"
                  placeholder="Company Name"
                  value={formData.company_name}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.inputGroup}>
                <input
                  style={styles.input}
                  name="designation"
                  placeholder="Designation"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.inputGroup}>
                <Select
                  styles={selectStyles}
                  options={employeeSizeOptions}
                  onChange={handleEmployeeSizeChange}
                  placeholder="Employee Size"
                  value={defaultEmployeeSizeOption}
                  isClearable
                />
              </div>
              <div style={styles.inputGroup}>
                <input
                  style={styles.input}
                  name="company_domain"
                  placeholder="Company Domain"
                  value={formData.company_domain}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.inputGroup}>
                <input
                  style={styles.input}
                  name="company_linkedin"
                  placeholder="Company LinkedIn"
                  value={formData.company_linkedin}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Request Details</label>
              <div style={styles.inputGroup}>
                <textarea
                  style={{...styles.input, ...styles.textarea}}
                  name="research_requirement"
                  placeholder="Research Requirements"
                  value={formData.research_requirement}
                  onChange={handleChange}
                />
              </div>
             
            </div>  

            <div style={styles.formGroup}>
              <label style={styles.label}>Reference Information</label>
              <div style={styles.inputRow}>
                <div style={styles.inputGroup}>
                  <input
                    style={styles.input}
                    name="slug"
                    placeholder="Slug"
                    value={formData.slug}
                    onChange={handleChange}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <input
                    style={styles.input}
                    name="productCode"
                    placeholder="SQ Code"
                    value={formData.productCode}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={styles.submitContainer}>
            <button 
              style={styles.submitButton} 
              type="submit" 
              disabled={loading || !csrfTokenFetched}
            >
              {loading ? "Processing..." : !csrfTokenFetched ? "Initializing..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "2rem auto",
    padding: "0 20px",
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    padding: "30px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    margin: "0 0 10px 0",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "30px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#444",
    borderBottom: "1px solid #eee",
    paddingBottom: "8px",
    marginBottom: "5px",
  },
  inputGroup: {
    width: "100%",
  },
  inputRow: {
    display: "flex",
    gap: "10px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s",
    backgroundColor: "#fcfcfc",
    "&:focus": {
      borderColor: "#0066ff",
      backgroundColor: "#fff",
    },
  },
  textarea: {
    minHeight: "80px",
    resize: "vertical",
  },
  submitContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
  },
  submitButton: {
    backgroundColor: "#0066ff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "12px 30px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#0052cc",
    },
    "&:disabled": {
      backgroundColor: "#cccccc",
      cursor: "not-allowed",
    },
  },
};

export default Form;