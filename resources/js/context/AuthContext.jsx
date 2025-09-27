// resources/js/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ao montar: tenta restaurar sessão a partir do token
    useEffect(() => {
        let mounted = true;

        const init = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                if (mounted) setLoading(false);
                return;
            }

            // aplica token no axios
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            try {
                const { data } = await api.get("/auth/me"); // /api/auth/me
                if (mounted) setUser(data);
            } catch (err) {
                console.error("Auth init failed:", err);
                localStorage.removeItem("token");
                delete api.defaults.headers.common["Authorization"];
                if (mounted) setUser(null);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        init();

        return () => {
            mounted = false;
        };
    }, []);

    // login: retorna o usuário carregado
    const login = async (email, password) => {
        const { data } = await api.post("/login", { email, password });
        // adapta para possíveis formatos de resposta
        const token = data.access_token ?? data.token ?? data;
        if (!token) throw new Error("Token não encontrado na resposta de login");

        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // buscar /auth/me para popular o user (mais seguro)
        const { data: me } = await api.get("/user");
        setUser(me.data);
        return me;
    };

    const register = async (name, email, password) => {
        await api.post("/register", { name, email, password });
        // Ao terminar registro, já loga automaticamente
        return login(email, password);
    };

    const logout = async () => {
        try {
            await api.post("/logout");
        } catch (err) {
            // ignore
        }
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
