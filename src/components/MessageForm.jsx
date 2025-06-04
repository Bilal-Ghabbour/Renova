import { useState } from "react";

function MessageForm({ recipientId, productId }) {
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");

  const handleSendMessage = async () => {
    if (!message.trim()) {
      alert("Bitte eine Nachricht eingeben!");
      return;
    }

    const payload = {
      content: message,
      recipientId: recipientId, // Empfänger-ID wird als Prop übergeben
      productId: productId, // Produkt-ID wird als Prop übergeben
      phone: phone.trim() || "Nicht angegeben",
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Nachricht erfolgreich gesendet!");
        setMessage("");
        setPhone("");
      } else {
        alert(`Fehler beim Senden: ${data.message}`);
      }
    } catch (error) {
      console.error("Fehler beim Senden der Nachricht:", error);
    }
  };

  return (
    <div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Nachricht schreiben..."
      ></textarea>
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Telefonnummer (optional)"
      />
      <button onClick={handleSendMessage}>Nachricht senden</button>
    </div>
  );
}

export default MessageForm;
