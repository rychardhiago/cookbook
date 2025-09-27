import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Recipes from "./pages/Recipes";
import PrivateRoute from "./components/PrivateRoute";

// 👇 Wrapper para lidar com rota inicial dinâmica
function RootRedirect() {
    const { user } = useAuth();
    return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<RootRedirect />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/recipes"
                        element={
                            <PrivateRoute>
                                <Recipes />
                            </PrivateRoute>
                        }
                    />

                    {/* 👇 qualquer rota inválida redireciona de acordo com login */}
                    <Route path="*" element={<RootRedirect />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
