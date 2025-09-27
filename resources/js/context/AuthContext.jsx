import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            api.get("/user")
                .then((res) => setUser(res.data.data))
                .catch(() => {
                    localStorage.removeItem("token");
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post("/login", { email, password });
        localStorage.setItem("token", data.access_token);

        const me = await api.get("/user");
        setUser(me.data.data);
    };

    const register = async (name, email, password) => {
        await api.post("/register", { name, email, password });
        return login(email, password); // já loga após registrar
    };

    const logout = async () => {
        try {
            await api.post("/logout");
        } catch {}
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading  }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook customizado para usar AuthContext
export function useAuth() {
    return useContext(AuthContext);
}
