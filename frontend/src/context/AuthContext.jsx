import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode'; // Fixed import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Validate token expiry if needed, or just fetch user profile
                    const decoded = jwtDecode(token);
                    if (decoded.exp * 1000 < Date.now()) {
                        logout();
                        return;
                    }

                    // Ideally fetch fresh user data from backend
                    const { data } = await api.get('/auth/me');
                    // Backend returns { res: userObject }
                    setUser(data.res || data);
                } catch (error) {
                    console.error("Auth check failed", error);
                    logout();
                }
            }
            setLoading(false);
        };

        checkUser();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        // Backend returns { res: userObject }
        localStorage.setItem('user', JSON.stringify(data.res));
        setUser(data.res);
        return data;
    };

    const register = async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        // Backend returns { userId: userObject, token }
        if (data.token) {
            localStorage.setItem('token', data.token);
            // Assuming userId holds the user object based on auth.js inspection
            const userObj = data.userId || data.res;
            setUser(userObj);
            localStorage.setItem('user', JSON.stringify(userObj));
        }
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
