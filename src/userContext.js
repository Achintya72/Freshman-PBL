import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
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

    function createUserEmailPassword(email, password, data) {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then(response => {
                const db = getFirestore();
                const userDocRef = doc(db, 'users', response.user.uid)
                setDoc(userDocRef, { ...data }, { merge: true, mergeFields: true })
                    .then(document => {
                        setUser(prev => ({ ...prev, ...data }))
                        navigate('/dashboard')
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

    function fetchUserTasks() {
        const db = getFirestore();
        const tasksCollection = collection(db, "tasks");
        const levelDocRef = doc(tasksCollection, user.level)
        const userLevelCollection = collection(levelDocRef, user.group)
        getDocs(userLevelCollection)
            .then((snapshot) => {
                let data = [];
                snapshot.docs.forEach(doc => {
                    data.push(doc.data());
                });
                setUser(prev => ({ ...prev, tasks: data }))
            })
    }

    const value = {
        user,
        signInEmailPassword,
        createUserEmailPassword,
        signOutUser,
        fetchUserTasks
    }
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext as default, UserContextProvider }