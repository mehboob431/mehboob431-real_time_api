// context/AuthContext.js
import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Use react-router for navigation
import cookie from 'js-cookie';

// Create the AuthContext
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(null); // Store user details and token
    const navigate = useNavigate();

    // Function to handle login (store data)
    const login = (data) => {
        setAuthState(data);
        // Optionally store token in cookies (if needed for SSR)
        cookie.set('access_token', data.token);
        navigate('/');
    };

    // Function to handle logout (clear data)
    const logout = () => {
        console.log('logout call :>> ');
        setAuthState(null);
        cookie.remove('access_token');
        navigate('/login');; // Redirect to login page
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
