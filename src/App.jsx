import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyAds from "./pages/MyAds";
import Favorites from "./pages/Favorites";
import CreateAd from "./pages/CreateAd";
import Header from "./components/Header";
import ProductDetails from "./pages/ProductDetails";
import Settings from "./pages/Settings";
import VerifyEmail from "./pages/VerifyEmail"; // 🆕 Import der Komponente
import EditProduct from "./pages/EditProduct";
import Messages from "./components/Messages";
import MessageForm from "./components/MessageForm";
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/message/:id" element={<MessageForm />} />
        <Route path="/nachrichten" element={<Messages />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/meins" element={<MyAds />} />
        <Route path="/product/:id" element={<ProductDetails />} />{" "}
        {/* Stelle sicher, dass path /product/:id ist */}
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/create-ad" element={<CreateAd />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/verify-email" element={<VerifyEmail />} />{" "}
        {/* 🆕 Neue Route */}
        <Route path="/edit/:id" element={<EditProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
