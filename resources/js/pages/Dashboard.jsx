import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const { user, logout } = useAuth();
    console.log(user);
    return (
        <div>
            <h2>Bem-vindo, {user?.name}</h2>
            <p>Email: {user?.email}</p>

            <Link to="/recipes">Ver receitas</Link>
            <button onClick={logout}>Sair</button>
        </div>
    );
}
