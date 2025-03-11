const axios = require("axios");

exports.getFreshworksContact = async (req, res) => {
  const { email } = req.query;
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const response = await axios.get(
      `${process.env.FRESHWORKS_BASE_URL}/lookup?q=${email}&f=email&entities=contact`,
      {
        headers: {
          Authorization: `Token token=${process.env.FRESHWORKS_API_KEY}`,
        },
      }
    );
    const contacts = response.data.contacts.contacts;
    if (contacts.length > 0) {
      const safeContact = {
        id: contacts[0].id,
        first_name: contacts[0].first_name,
        last_name: contacts[0].last_name,
      };
      return res.status(200).json(safeContact);
    } else {
      return res.status(404).json({ message: "No contact found" });
    }
  } catch (error) {
    console.error("Error fetching Freshworks contact:", error);
    res.status(500).json({ message: "Failed to retrieve contact" });
  }
};

exports.updateFreshworksContact = async (req, res) => {
  const { id } = req.params;
  const { company_linkedin, employee_size, research_requirement, company_domain, productCode } = req.body;

  try {
    await axios.put(
      `${process.env.FRESHWORKS_BASE_URL}/contacts/${id}`,
      {
        custom_field: {
          cf_custom_tags: "MARKETING LEAD",
          cf_company_linkedin: company_linkedin || "null",
          cf_employee_size: employee_size || null,
          cf_research_requirement: research_requirement || null,
          cf_company_domain: company_domain || "null",
          cf_product_id: productCode || null,
        },
      },
      {
        headers: {
          Authorization: `Token token=${process.env.FRESHWORKS_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
   
    const safeResponse = {
      id,
      updatedFields: {
        company_linkedin,
        employee_size,
        research_requirement,
        company_domain,
        productCode,
      },
      message: "Contact updated successfully",
    };
    res.status(200).json(safeResponse);
  } catch (error) {
    console.error("Error updating Freshworks contact:", error);
    res.status(500).json({ message: "Failed to update contact" });
  }
};

