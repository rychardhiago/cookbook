import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Recipes() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        api.get("recipes").then((res) => setRecipes(res.data));
    }, []);

    return (
        <div>
            <h2>Receitas</h2>
            <ul>

                {recipes.data?.map((r) => (
                    <li key={r.id}>
                        {r.name} - {r.ingredients?.map((i) => i.name).join(", ")}
                    </li>
                ))}
            </ul>
        </div>
    );
}
