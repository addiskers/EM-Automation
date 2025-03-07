const axios = require("axios");
const EMleads = require("../models/EMleads");
exports.submitForm = async (req, res) => {
  try {
    const response = await axios.post(
      "https://www.skyquestt.com/api/send-sample-request",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const newLead = new EMleads(req.body);
    await newLead.save();
    console.log("✅ Lead saved to MongoDB:", newLead);

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error submitting form:", error.response?.data || error);
    res.status(500).json({ message: "Form submission failed" });
  }
};
