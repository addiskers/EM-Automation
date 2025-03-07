const axios = require("axios");

exports.getFreshworksContact = async (req, res) => {
  const { email } = req.query;
  try {
    const response = await axios.get(
      `${process.env.FRESHWORKS_BASE_URL}/lookup?q=${email}&f=email&entities=contact`,
      {
        headers: {
          Authorization: `Token token=${process.env.FRESHWORKS_API_KEY}`,
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching Freshworks contact:", error);
    res.status(500).json({ message: "Failed to retrieve contact" });
  }
};

exports.updateFreshworksContact = async (req, res) => {
  const { id } = req.params;
  const { company_linkedin, employee_size, research_requirement, company_domain , productCode} = req.body;

  try {
    const response = await axios.put(
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

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error updating Freshworks contact:", error);
    res.status(500).json({ message: "Failed to update contact" });
  }
};

