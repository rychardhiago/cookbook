import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import RecipeForm from "./pages/RecipeForm";

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <div>Carregando...</div>;
    return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

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

                    <Route
                        path="/recipes/new"
                        element={
                            <PrivateRoute>
                                <RecipeForm />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/recipes/:id"
                        element={
                            <PrivateRoute>
                                <RecipeDetail />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/recipes/:id/edit"
                        element={
                            <PrivateRoute>
                                <RecipeForm />
                            </PrivateRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}
