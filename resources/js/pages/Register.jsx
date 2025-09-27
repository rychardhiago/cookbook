import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

export default function Register() {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState("");

    // Redireciona se já estiver logado
    useEffect(() => {
        if (user) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoadingSubmit(true);

        if (password !== passwordConfirmation) {
            setError("As senhas não coincidem");
            setLoadingSubmit(false);
            return;
        }

        try {
            await api.post("/register", {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            await login(email, password); // o useEffect cuida do redirect
        } catch (err) {
            console.error("Erro ao registrar:", err);
            setError("Erro ao registrar. Verifique os dados.");
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
                <h1 className="text-2xl font-bold mb-6 text-center">Registrar</h1>

                {error && <div className="mb-4 text-red-600">{error}</div>}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Nome
                    </label>
                    <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

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

                <div className="mb-4">
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

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Confirmar Senha
                    </label>
                    <input
                        type="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loadingSubmit}
                    className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
                >
                    {loadingSubmit ? "Registrando..." : "Criar conta"}
                </button>

                {/* 🔗 Link para voltar ao login */}
                <p className="mt-4 text-center text-sm text-gray-600">
                    Já tem conta?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Voltar ao login
                    </Link>
                </p>
            </form>
        </div>
    );
}
