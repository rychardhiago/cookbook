import { useState, useEffect } from "react";
import api from "../services/api";

export function useAuth() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setUser({ token });
        }
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post("/login", { email, password });
        localStorage.setItem("token", data.access_token);
        setUser({ token: data.access_token });
    };

    const register = async (name, email, password) => {
        await api.post("/register", { name, email, password });
        return login(email, password); //
    };

    const logout = async () => {
        try {
            await api.post("/logout");
        } catch {}
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/login";
    };

    return { user, login, register, logout };
}
