import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"

const UserContext = createContext(null);

function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate()
    function signInEmailPassword(email, password) {
        const auth = getAuth()
        signInWithEmailAndPassword(auth, email, password)
            .then(response => {
                const db = getFirestore();
                const userDocRef = doc(db, 'users', response.user.uid)
                getDoc(userDocRef)
                    .then(document => {
                        setUser(document.data())
                        navigate('/dashboard')
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

    function signOutUser() {
        const auth = getAuth();
        signOut(auth).then(response => {
            navigate("/")
            setUser(null);
        })
    }

    return (
        <UserContext.Provider value={{ user, signInEmailPassword, createUserEmailPassword, signOutUser }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext as default, UserContextProvider }