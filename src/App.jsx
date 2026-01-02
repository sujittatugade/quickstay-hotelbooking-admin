import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import AddRooms from "./components/AddRooms/AddRooms";
import Login from "./components/Login/Login";
import Layout from "./components/Layouts/Layout";
import Signup from "./components/Signup/Signup";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";
import { useState } from "react";
import RoomList from "./components/RoomList/RoomList";
import ChangePassword from "./components/ChangePassword/ChangePassword";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ChangePassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoutes>
          }
        />

        <Route
          path="/add_rooms"
          element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <Layout>
                <AddRooms />
              </Layout>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/list"
          element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <Layout>
                <RoomList />
              </Layout>
            </ProtectedRoutes>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
