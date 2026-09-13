const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const visitSchema = new Schema({
  id: { type: String, required: true, unique: true },
  listingId: { type: String },
  listingTitle: { type: String, default: "Property Visit" },
  listingPrice: { type: Number, default: 0 },
  listingLocation: { type: String, default: "India" },
  listingImage: { type: String, default: "" },
  host: {
    id: { type: String },
    name: { type: String, default: "Property Owner" },
    email: { type: String },
    phone: { type: String }
  },
  hostId: { type: String },
  hostName: { type: String },
  hostPhone: { type: String },
  hostEmail: { type: String },
  visitor: {
    id: { type: String },
    name: { type: String, default: "Visitor" },
    email: { type: String },
    phone: { type: String }
  },
  tenant: {
    id: { type: String },
    name: { type: String, default: "Visitor" },
    email: { type: String },
    phone: { type: String }
  },
  tenantId: { type: String },
  tenantName: { type: String },
  tenantPhone: { type: String },
  tenantEmail: { type: String },
  visitDate: { type: String },
  visitTime: { type: String },
  visitSlot: { type: String },
  status: {
    type: String,
    enum: ["confirmed", "pending", "cancelled", "completed"],
    default: "confirmed"
  },
  notes: { type: String, default: "" },
  timeSlot: { type: String, default: "" },
  meetupInstructions: { type: String, default: "" }
}, { timestamps: true, strict: false });

module.exports = mongoose.model("Visit", visitSchema);
