import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All chat routes require authentication
router.use(authenticateToken);

router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "xyz",
      title: "testing new thread",
    });
    const response = await thread.save();
    res.send(response);
  } catch (e) {
    console.log("Error creating thread", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get all threads for the authenticated user
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({ userId: req.user._id }).sort({ updateAt: -1 });
    res.send(threads);
  } catch (e) {
    console.log("Error fetching threads", e);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId, userId: req.user._id });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread.messages);
  } catch (e) {
    console.log("Error fetching thread", e);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const deleteThread = await Thread.findOneAndDelete({ threadId, userId: req.user._id });
    if (!deleteThread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ message: "Thread deleted successfully" });
  } catch (e) {
    console.log("Error deleting thread", e);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;
  if (!threadId || !message) {
    return res.status(400).json({ error: "ThreadId and message are required" });
  }
  try {
    let thread = await Thread.findOne({ threadId, userId: req.user._id });
    if (!thread) {
      thread = new Thread({
        threadId,
        userId: req.user._id,
        title: message.length > 50 ? message.substring(0, 50) + "..." : message,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      });
    } else {
      thread.messages.push({
        role: "user",
        content: message,
      });
    }
    const assistantReply = await getOpenAIAPIResponse(message);

    thread.messages.push({
      role: "assistant",
      content: assistantReply,
    });
    thread.updateAt = new Date();
    await thread.save();
    res.json({ reply: assistantReply });
  } catch (err) {
    console.log("Error fetching thread", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
