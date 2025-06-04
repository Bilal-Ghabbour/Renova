import Message from '../models/messageModel.js';


// Nachricht senden
export const sendMessage = async (req, res) => {
  const { content, receiver, productId } = req.body;
  const sender = req.user._id; // Der Benutzer, der die Nachricht sendet (aus dem Token)

  if (!content || !receiver || !productId) {
    return res.status(400).json({ message: "❌ Nachricht, Empfänger und Produkt müssen angegeben werden!" });
  }

  try {
    // Erstelle eine neue Nachricht
    const newMessage = new Message({
      sender,
      receiver,
      productId,
      content,
      createdAt: new Date(),
    });

    await newMessage.save();  // Speichern der Nachricht in der Datenbank

    res.status(201).json({ message: "✅ Nachricht erfolgreich gesendet!" });
  } catch (error) {
    console.error("Fehler beim Senden der Nachricht:", error);
    res.status(500).json({ message: "❌ Fehler beim Senden der Nachricht" });
  }
};

// Alle Nachricht aufrufen
export const getMessages = async (req, res) => {
    const userId = req.user._id; // Der Benutzer, dessen Nachrichten abgerufen werden sollen
  
    try {
      // Suche nach allen Nachrichten, in denen der Benutzer entweder der Absender oder Empfänger ist
      const messages = await Message.find({
        $or: [
          { sender: userId },
          { receiver: userId }
        ]
      })
        .populate('sender', 'name') // Sender-Name hinzufügen
        .populate('receiver', 'name') // Empfänger-Name hinzufügen
        .sort({ createdAt: -1 }); // Nachrichten nach Zeitstempel absteigend sortieren
  
      res.status(200).json(messages);
    } catch (error) {
      console.error("Fehler beim Abrufen der Nachrichten:", error);
      res.status(500).json({ message: "❌ Fehler beim Abrufen der Nachrichten" });
    }
  };
  