import React, { createContext, useContext, useState, useMemo } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const value = useMemo(() => ({ user, setUser }), [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook
export const useAuth = () => useContext(AuthContext);
