import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [metrics, setMetrics] = useState({ recipes: 0, ingredients: 0, users: 0 });

    useEffect(() => {
        const fetchMetrics = async () => {
            const { data } = await api.get("/metrics");
            setMetrics(data);
        };
        fetchMetrics();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600">Olá, {user?.name}</span>
                    <Link to="/recipes" className="text-blue-600 hover:underline">
                        Receitas
                    </Link>
                    <button
                        onClick={logout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                        Sair
                    </button>
                </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700">Receitas</h2>
                    <p className="text-3xl font-bold text-blue-600">{metrics.recipes}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700">Ingredientes</h2>
                    <p className="text-3xl font-bold text-green-600">{metrics.ingredients}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700">Usuários</h2>
                    <p className="text-3xl font-bold text-purple-600">{metrics.users}</p>
                </div>
            </section>
        </div>
    );
}
