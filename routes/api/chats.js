const express = require("express");
const router = express.Router();
const ChatThread = require("../../models/chat.js");

// GET /api/chats - Get all chat threads
router.get("/", async (req, res) => {
  try {
    const threads = await ChatThread.find({}).sort({ updatedAt: -1 });
    res.json({ success: true, threads });
  } catch (err) {
    console.error("Error fetching chat threads:", err);
    res.status(500).json({ success: false, message: "Failed to fetch chat threads", error: err.message });
  }
});

// POST /api/chats - Create a new chat thread or update existing
router.post("/", async (req, res) => {
  try {
    const threadData = req.body;
    if (!threadData.id) {
      threadData.id = `thread-${Date.now()}`;
    }

    let thread = await ChatThread.findOne({ id: threadData.id });
    if (thread) {
      Object.assign(thread, threadData);
      await thread.save();
    } else {
      thread = new ChatThread(threadData);
      await thread.save();
    }

    res.json({ success: true, thread });
  } catch (err) {
    console.error("Error saving chat thread:", err);
    res.status(500).json({ success: false, message: "Failed to save chat thread", error: err.message });
  }
});

// POST /api/chats/:id/message - Send a message to a chat thread
router.post("/:id/message", async (req, res) => {
  try {
    const { id } = req.params;
    const { message, unreadBy, lastSenderId } = req.body;

    let thread = await ChatThread.findOne({ id });
    if (!thread) {
      return res.status(404).json({ success: false, message: "Thread not found" });
    }

    if (message) {
      if (!message.id) {
        message.id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      }
      thread.messages.push(message);
      thread.lastMessage = message.text;
      thread.lastMessageTime = message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    if (lastSenderId) thread.lastSenderId = lastSenderId;
    if (unreadBy && Array.isArray(unreadBy)) {
      thread.unreadBy = Array.from(new Set([...thread.unreadBy, ...unreadBy]));
    }

    await thread.save();
    res.json({ success: true, thread });
  } catch (err) {
    console.error("Error adding message:", err);
    res.status(500).json({ success: false, message: "Failed to add message", error: err.message });
  }
});

// POST /api/chats/:id/read - Mark thread as read
router.post("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, username, userEmail } = req.body;

    let thread = await ChatThread.findOne({ id });
    if (!thread) {
      return res.status(404).json({ success: false, message: "Thread not found" });
    }

    const identifiersToRemove = [userId, username, userEmail]
      .filter(Boolean)
      .map((s) => s.toString().toLowerCase().trim());

    thread.unreadBy = thread.unreadBy.filter((item) => {
      const it = item.toLowerCase().trim();
      const itFirst = it.split(/[\s._-]+/)[0];
      return !identifiersToRemove.some((idStr) => {
        const idFirst = idStr.split(/[\s._-]+/)[0];
        return (
          idStr === it ||
          it.includes(idStr) ||
          idStr.includes(it) ||
          (itFirst.length >= 3 && itFirst === idFirst)
        );
      });
    });

    await thread.save();
    res.json({ success: true, thread });
  } catch (err) {
    console.error("Error marking thread as read:", err);
    res.status(500).json({ success: false, message: "Failed to mark read", error: err.message });
  }
});

// DELETE /api/chats/:id - Delete a chat thread
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ChatThread.deleteOne({ id });
    res.json({ success: true, message: "Thread deleted" });
  } catch (err) {
    console.error("Error deleting thread:", err);
    res.status(500).json({ success: false, message: "Failed to delete thread", error: err.message });
  }
});

module.exports = router;
