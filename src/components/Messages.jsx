import { useState, useEffect } from "react";
import Footer from "../components/Footer";

function Messages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/messages", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setMessages(data);
        } else {
          alert(`Fehler: ${data.message}`);
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Nachrichten:", error);
      }
    }

    fetchMessages();
  }, []);

  return (
    <>
    <div className="flex flex-col items-center justify-center p-6 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">Deine Nachrichten</h2>
      {messages.length > 0 ? (
        <div className="flex flex-col items-center gap-4 w-full max-w-4xl">
          {messages.map((message) => (
            <div
              key={message._id}
              className="bg-gray-100 rounded-lg p-4 w-full max-w-xl shadow-lg"
            >
              <p className="font-semibold">Von: {message.sender.name}</p>
              <p className="mt-2">
                <strong>Nachricht:</strong> {message.content}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                <strong>Gesendet am:</strong>{" "}
                {new Date(message.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Keine Nachrichten gefunden.</p>
      )}
    </div>
    <Footer/>
    </>
  );
 
}

export default Messages;
