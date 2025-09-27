import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { user, register } = useAuth();
    const navigate = useNavigate();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            navigate("/dashboard");
        } catch {
            alert("Erro ao registrar");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Registrar</h2>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" />
            <button type="submit">Criar Conta</button>
        </form>
    );
}
