import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    PlusCircleIcon,
    TrashIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";
import api from "../services/api";

export default function RecipeForm() {
    const { id } = useParams(); // se existir = edição
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
    const [loading, setLoading] = useState(false);

    // Se for edição, buscar dados
    useEffect(() => {
        if (id) {
            api.get(`/recipes/${id}`).then((res) => {
                const recipe = res.data;
                setName(recipe.name || "");
                setDescription(recipe.description || "");
                setIngredients(
                    recipe.ingredients && recipe.ingredients.length > 0
                        ? recipe.ingredients
                        : [{ name: "", quantity: "" }]
                );
            });
        }
    }, [id]);

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index][field] = value;
        setIngredients(newIngredients);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { name: "", quantity: "" }]);
    };

    const removeIngredient = (index) => {
        if (ingredients.length === 1) return;
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { name, description, ingredients };
            if (id) {
                await api.put(`/recipes/${id}`, payload);
            } else {
                await api.post("/recipes", payload);
            }
            navigate("/recipes");
        } catch (err) {
            console.error("Erro ao salvar receita", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-8">
                <h1 className="text-3xl font-bold mb-6">
                    {id ? "Editar Receita" : "Nova Receita"}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nome */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Nome
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        />
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Descrição
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            rows="4"
                        />
                    </div>

                    {/* Ingredientes */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-4">
                            Ingredientes
                        </label>
                        <div className="space-y-4">
                            {ingredients.map((ingredient, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 border-b border-gray-200 pb-2"
                                >
                                    <input
                                        type="text"
                                        placeholder="Nome do ingrediente"
                                        value={ingredient.name}
                                        onChange={(e) =>
                                            handleIngredientChange(index, "name", e.target.value)
                                        }
                                        className="flex-1 border border-gray-300 rounded px-3 py-2"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Quantidade"
                                        value={ingredient.quantity}
                                        onChange={(e) =>
                                            handleIngredientChange(index, "quantity", e.target.value)
                                        }
                                        className="w-32 border border-gray-300 rounded px-3 py-2"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeIngredient(index)}
                                        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addIngredient}
                            className="mt-4 flex items-center gap-2 text-green-600 hover:text-green-700"
                        >
                            <PlusCircleIcon className="h-5 w-5" />
                            Adicionar ingrediente
                        </button>
                    </div>

                    {/* Ações */}
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() => navigate("/recipes")}
                            className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            <CheckCircleIcon className="h-5 w-5" />
                            {loading ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
