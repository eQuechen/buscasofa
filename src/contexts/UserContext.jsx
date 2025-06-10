import { createContext, useContext, useState } from 'react';


const UserContext = createContext();

export function useUser() {
    return useContext(UserContext);
}

/**
 * Provee un contexto para el usuario que cualquier componente puede leer/modificar
 *
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
