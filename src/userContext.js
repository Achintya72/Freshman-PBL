import { createContext, useEffect, useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const UserContext = createContext(null);

function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);

    function signInEmailPassword(email, password) {
        const auth = getAuth()
        signInWithEmailAndPassword(auth, email, password)
            .then(response => {
                const db = getFirestore();
                const userDocRef = doc(db, 'users', response.user.uid)
                getDoc(userDocRef)
                    .then(document => {
                        setUser(document.data())
                    })
            })
    }

    return (
        <UserContext.Provider value={{ user, signInEmailPassword }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext as default, UserContextProvider }