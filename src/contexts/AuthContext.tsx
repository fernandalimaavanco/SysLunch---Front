import { ReactNode, useState } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';
import { AlertContext } from './AlertContext';
import { HttpError } from '../components/Alert';
import { api } from '../lib/axios';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, password: string) => void;
    logout: () => void;
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        return storedAuth === 'true'; 
    });

    const configAlert = useContextSelector(AlertContext, (context) => {
        return context.configAlert
    })

    async function login(email: string, password: string) {
        try {
            const response = await api.post(`/login`, { email, password });

            if (response.status === 200) {
                setIsAuthenticated(true);
                localStorage.setItem('isAuthenticated', 'true')
                configAlert({ message: 'Bem-vindo ao SysLunch!', type: 'success' });
        
            }
        } catch (error: unknown) {
            localStorage.setItem('isAuthenticated', 'false')
            setIsAuthenticated(false);
            const httpError = error as HttpError;

            if (httpError.response?.data?.message) {
                configAlert({ message: httpError.response.data.message, type: 'danger' });
            } else {
                configAlert({ message: 'Erro ao fazer o login. Tente novamente mais tarde.', type: 'danger' });
            }
        }
    }

    function logout() {
        localStorage.setItem('isAuthenticated ', 'false')
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}


