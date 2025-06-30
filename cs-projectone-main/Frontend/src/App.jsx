import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Signup } from "./Pages/Auth/Register/Signup";
import { Login } from "./Pages/Auth/Login";
import LostItemsPage from "./Pages/Item/Search";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "./Pages/Sidebar";
import ClaimPage from "./Pages/Item/Claimpage";
import FinderDashboard from "./Pages/Item/Finderdashboard/Finderdashboard";
import ItemDetailsPage from "./Pages/Item/ItemDetails";
import MyClaimsPage from "./Pages/Item/Myclaims";
import ProfilePage from "./Pages/Auth/Profile";
import NotificationPage from "./Pages/Notifications";
import { useLoginStore } from "./Stores/useLoginStore";
import "./App.css";
function App() {
  const authuser = useLoginStore((state) => state.authuser);
  return (
    <div className="app">
      {authuser && <Sidebar />}

      {/*  my frontend routes */}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<LostItemsPage />} />
        <Route path="/claimpage/:itemId" element={<ClaimPage />} />
        <Route path="/finderdashboard" element={<FinderDashboard />} />
        <Route path="/finder/item/:itemId" element={<ItemDetailsPage />} />
        <Route path="/myclaims" element={<MyClaimsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationPage />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
