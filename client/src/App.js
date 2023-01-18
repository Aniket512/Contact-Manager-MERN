import React, { useState } from "react";
import Register from "./pages/Register";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [userId, setUserId] = useState('');

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/register" element={<Register setUserId={setUserId}/>} />
        <Route exact path="/login" element={<Login setUserId={setUserId}/>} />
        <Route exact path="/" element={<Home userId={userId} />} />
      </Routes>
    </BrowserRouter>
  );
}
