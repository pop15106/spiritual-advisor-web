"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: number;
    email: string;
    name: string;
    avatar: string;
}

interface TrialDetails {
    total: number;
    initial: number;
    daily: number;
    next_reset?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (credential: string) => Promise<boolean>;
    logout: () => void;
    isLoggedIn: boolean;
    freeTrials: number;
    trialDetails: TrialDetails | null;
    fetchTrials: () => Promise<void>;
    useTrial: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [freeTrials, setFreeTrials] = useState(0);
    const [trialDetails, setTrialDetails] = useState<TrialDetails | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    // Fetch free trials from backend
    const fetchTrials = async () => {
        if (!token) return;

        try {
            const response = await fetch(`${apiUrl}/api/user/trials`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setFreeTrials(data.freeTrials);
                if (data.details) {
                    setTrialDetails(data.details);
                }
            }
        } catch (error) {
            console.error('Error fetching trials:', error);
        }
    };

    // Use one free trial
    const useTrial = async (): Promise<boolean> => {
        if (!token) return false;

        try {
            const response = await fetch(`${apiUrl}/api/user/trials/use`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setFreeTrials(data.remaining);
                // Refresh details to get accurate counts
                fetchTrials();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error using trial:', error);
            return false;
        }
    };

    // Load saved session on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('user_token');
        const savedUser = localStorage.getItem('user_data');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    // Fetch trials when token changes
    useEffect(() => {
        if (token) {
            fetchTrials();
        }
    }, [token]);

    const login = async (credential: string): Promise<boolean> => {
        try {
            const response = await fetch(`${apiUrl}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential }),
            });

            const data = await response.json();

            if (data.success) {
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem('user_token', data.token);
                localStorage.setItem('user_data', JSON.stringify(data.user));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setFreeTrials(0);
        setTrialDetails(null);
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_data');
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isLoading,
            login,
            logout,
            isLoggedIn: !!user,
            freeTrials,
            trialDetails,
            fetchTrials,
            useTrial,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

