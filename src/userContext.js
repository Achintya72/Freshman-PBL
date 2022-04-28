import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

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

    function createUserEmailPassword(email, password, name) {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then(response => {
                const db = getFirestore();
                const userDocRef = doc(db, 'users', response.user.uid)
                setDoc(userDocRef, { name }, { merge: true, mergeFields: true })
                    .then(document => {
                        setUser(prev => ({ ...prev, name }))
                    })
            })
    }

    return (
        <UserContext.Provider value={{ user, signInEmailPassword, createUserEmailPassword }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext as default, UserContextProvider }