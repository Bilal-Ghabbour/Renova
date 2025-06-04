import express from 'express';
import { sendMessage, getMessages } from '../controllers/messageController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Nachricht senden
router.post("/messages", authMiddleware, sendMessage);

// Alle Nachrichten des Benutzers abrufen
router.get("/messages", authMiddleware, getMessages);

export default router;
