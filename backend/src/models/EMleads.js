const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: String,
  lastname: String,
  email: { type: String, required: true, unique: true },
  phonecode: String,
  phone: String,
  company_name: String,
  designation: String,
  message: String,
  slug: String,
  productCode: String,
  company_linkedin: String,
  employee_size: String,
  research_requirement: String,
  company_domain: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EMleads", leadSchema, "EMleads");
