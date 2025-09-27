import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    TrashIcon,
    PlusCircleIcon,
    EyeIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";
import api from "../services/api";

export default function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [perPage, setPerPage] = useState(6);
    const [search, setSearch] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const fetchRecipes = async (
        pageNumber = 1,
        perPageNumber = perPage,
        ingredient = searchTerm
    ) => {
        try {
            setLoading(true);
            const { data } = await api.get(
                `/recipes?page=${pageNumber}&per_page=${perPageNumber}&ingredient=${ingredient}`
            );
            setRecipes(data.data);
            setPage(data.current_page);
            setLastPage(data.last_page);
        } catch (err) {
            console.error("Erro ao buscar receitas", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes(page, perPage, searchTerm);
    }, [perPage, searchTerm]);

    const deleteRecipe = async (id) => {
        if (!confirm("Tem certeza que deseja excluir esta receita?")) return;
        try {
            await api.delete(`/recipes/${id}`);
            fetchRecipes(page, perPage, searchTerm);
        } catch (err) {
            console.error("Erro ao deletar receita", err);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchTerm(search);
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Receitas</h1>

                <Link
                    to="/recipes/new"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <PlusCircleIcon className="h-5 w-5" />
                    Nova Receita
                </Link>
            </div>

            {/* Filtros */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                    Dashboard
                </button>
                <form
                    onSubmit={handleSearch}
                    className="flex items-center gap-2 w-full md:w-auto"
                >
                    <input
                        type="text"
                        placeholder="Buscar por ingrediente..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-full md:w-64"
                    />
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Buscar
                    </button>
                </form>

                <label className="flex items-center gap-2">
                    <span className="text-gray-700 text-sm">Registros por página:</span>
                    <select
                        value={perPage}
                        onChange={(e) => setPerPage(Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                        <option value={3}>3</option>
                        <option value={6}>6</option>
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                    </select>
                </label>
            </div>

            {/* Lista de receitas */}
            {loading ? (
                <p>Carregando...</p>
            ) : (
                <>
                    {recipes.length === 0 ? (
                        <p className="text-gray-600">Nenhuma receita encontrada.</p>
                    ) : (
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {recipes.map((recipe) => (
                                <div
                                    key={recipe.id}
                                    className="bg-white shadow rounded-xl p-4 relative group"
                                >
                                    <h2 className="text-xl font-semibold mb-2">{recipe.name}</h2>
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {recipe.description}
                                    </p>

                                    <div className="flex justify-between items-center">
                                        <Link
                                            to={`/recipes/${recipe.id}`}
                                            className="flex items-center gap-1 text-blue-600 hover:underline"
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                            Ver detalhes
                                        </Link>

                                        <button
                                            onClick={() => deleteRecipe(recipe.id)}
                                            className="p-2 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Paginação */}
                    {recipes.length > 0 && (
                        <div className="flex justify-center mt-8 space-x-2">
                            <button
                                onClick={() => fetchRecipes(page - 1, perPage, searchTerm)}
                                disabled={page === 1}
                                className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                                Anterior
                            </button>
                            <span className="px-3 py-1">
                Página {page} de {lastPage}
              </span>
                            <button
                                onClick={() => fetchRecipes(page + 1, perPage, searchTerm)}
                                disabled={page === lastPage}
                                className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                            >
                                Próxima
                                <ArrowRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
