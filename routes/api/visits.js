const express = require("express");
const router = express.Router();
const Visit = require("../../models/visit.js");

// GET /api/visits - Get all visits
router.get("/", async (req, res) => {
  try {
    const visits = await Visit.find({}).sort({ createdAt: -1 });
    res.json({ success: true, visits });
  } catch (err) {
    console.error("Error fetching visits:", err);
    res.status(500).json({ success: false, message: "Failed to fetch visits", error: err.message });
  }
});

// POST /api/visits - Schedule a new visit
router.post("/", async (req, res) => {
  try {
    const visitData = req.body;
    if (!visitData.id) {
      visitData.id = `visit-${Date.now()}`;
    }
    visitData.visitTime = visitData.visitTime || visitData.visitSlot || '11:00 AM';
    visitData.visitSlot = visitData.visitSlot || visitData.visitTime || '11:00 AM';

    let visit = await Visit.findOne({ id: visitData.id });
    if (visit) {
      Object.assign(visit, visitData);
      await visit.save();
    } else {
      visit = new Visit(visitData);
      await visit.save();
    }

    res.json({ success: true, visit });
  } catch (err) {
    console.error("Error saving visit:", err);
    res.status(500).json({ success: false, message: "Failed to save visit", error: err.message });
  }
});

// PATCH /api/visits/:id/status - Update visit status
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, date, time } = req.body;

    let visit = await Visit.findOne({ id });
    if (!visit) {
      return res.status(404).json({ success: false, message: "Visit not found" });
    }

    if (status) visit.status = status;
    if (date) visit.visitDate = date;
    if (time) visit.visitTime = time;

    await visit.save();
    res.json({ success: true, visit });
  } catch (err) {
    console.error("Error updating visit status:", err);
    res.status(500).json({ success: false, message: "Failed to update visit status", error: err.message });
  }
});

// DELETE /api/visits/:id - Delete a visit
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Visit.deleteOne({ id });
    res.json({ success: true, message: "Visit deleted" });
  } catch (err) {
    console.error("Error deleting visit:", err);
    res.status(500).json({ success: false, message: "Failed to delete visit", error: err.message });
  }
});

module.exports = router;
