import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState("");

    // redireciona quando o user for populado no contexto
    useEffect(() => {
        if (user) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoadingSubmit(true);
        try {
            await login(email, password); // useEffect cuida do redirect
        } catch (err) {
            console.error("Login error:", err);
            setError("Credenciais inválidas");
        } finally {
            setLoadingSubmit(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-96"
            >
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

                {error && <div className="mb-4 text-red-600">{error}</div>}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Senha
                    </label>
                    <input
                        type="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loadingSubmit}
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loadingSubmit ? "Entrando..." : "Entrar"}
                </button>

                {/* 🔗 Link para página de registro */}
                <p className="mt-4 text-center text-sm text-gray-600">
                    Não tem conta?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Registre-se
                    </Link>
                </p>
            </form>
        </div>
    );
}
