/* import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(` Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB; */

import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("⏳ Verbinde mit MongoDB...");
        
        const conn = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
           
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Fehler bei MongoDB-Verbindung: ${error.message}`);
        process.exit(1);
    }
};

// Ereignis-Listener für Fehler hinzufügen
mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB Verbindungsfehler:", err);
});

export default connectDB;
