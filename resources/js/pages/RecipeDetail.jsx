import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    ArrowLeftIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import api from "../services/api";

export default function RecipeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchRecipe = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/recipes/${id}`);
            setRecipe(data);
        } catch (err) {
            console.error("Erro ao buscar receita", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipe();
    }, [id]);

    const deleteRecipe = async () => {
        if (!confirm("Tem certeza que deseja excluir esta receita?")) return;
        try {
            await api.delete(`/recipes/${id}`);
            navigate("/recipes");
        } catch (err) {
            console.error("Erro ao deletar receita", err);
        }
    };

    if (loading) {
        return <p className="p-6">Carregando...</p>;
    }

    if (!recipe) {
        return (
            <div className="p-6">
                <p className="text-red-600">Receita não encontrada.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                    Voltar
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-8">
                {/* Nome da receita */}
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    {recipe.name}
                </h1>

                {/* Descrição */}
                <p className="text-gray-700 mb-6">{recipe.description}</p>

                {/* Ingredientes */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    Ingredientes
                </h2>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    {recipe.ingredients && recipe.ingredients.length > 0 ? (
                        recipe.ingredients.map((ingredient, idx) => (
                            <li key={idx} className="text-gray-700">
                                <span className="font-medium">{ingredient.name}</span>
                                {ingredient.quantity && (
                                    <span className="text-gray-600">
                    {" "}
                                        - {ingredient.quantity}
                  </span>
                                )}
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500">Nenhum ingrediente cadastrado.</p>
                    )}
                </ul>

                {/* Ações */}
                <div className="flex justify-between">
                    <Link
                        to="/recipes"
                        className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        Voltar
                    </Link>

                    <div className="flex gap-2">
                        <Link
                            to={`/recipes/${recipe.id}/edit`}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            <PencilSquareIcon className="h-5 w-5" />
                            Editar
                        </Link>
                        <button
                            onClick={deleteRecipe}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            <TrashIcon className="h-5 w-5" />
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
