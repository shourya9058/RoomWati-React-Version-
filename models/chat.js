const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  id: { type: String },
  senderId: { type: String, required: true },
  senderName: { type: String, default: "User" },
  text: { type: String, required: true },
  timestamp: { type: String, default: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  createdAt: { type: Number, default: Date.now }
});

const chatThreadSchema = new Schema({
  id: { type: String, required: true, unique: true },
  listingId: { type: String },
  listingTitle: { type: String, default: "Property Inquiry" },
  listingPrice: { type: Number, default: 0 },
  listingLocation: { type: String, default: "India" },
  listingImage: { type: String, default: "" },
  tenant: {
    id: { type: String },
    name: { type: String, default: "Tenant" },
    email: { type: String },
    phone: { type: String },
    avatar: { type: String }
  },
  host: {
    id: { type: String },
    name: { type: String, default: "Host" },
    email: { type: String },
    phone: { type: String },
    avatar: { type: String }
  },
  lastMessage: { type: String, default: "" },
  lastMessageTime: { type: String, default: "" },
  lastSenderId: { type: String, default: "" },
  unreadBy: [{ type: String }],
  messages: [messageSchema]
}, { timestamps: true, strict: false });

module.exports = mongoose.model("ChatThread", chatThreadSchema);
