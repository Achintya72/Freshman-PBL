import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom"

const UserContext = createContext(null);

function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userTasks, setUserTasks] = useState(null);
    const navigate = useNavigate()
    function signInEmailPassword(email, password) {
        const auth = getAuth()
        signInWithEmailAndPassword(auth, email, password)
            .then(response => {
                const db = getFirestore();
                const userDocRef = doc(db, 'users', response.user.uid)
                getDoc(userDocRef)
                    .then(document => {
                        setUser({ ...document.data(), id: response.user.uid })
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
                        setUser(prev => ({ ...prev, ...data, id: response.user.uid }))
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
                data.sort((a, b) => a.index - b.index)
                setUserTasks(data)
            })
    }
    function completeTask(index) {
        const db = getFirestore();
        const userRef = doc(collection(db, 'users'), user.id)
        let newUserTasks = user.tasksComplete
        newUserTasks[index] = Timestamp.fromDate(new Date());
        let points = (user?.points ?? 0) + userTasks[index].points
        setDoc(userRef, { tasksComplete: newUserTasks, points }, { merge: true, mergeFields: true })
            .then(response => {
                setUser(prev => ({ ...prev, tasksComplete: newUserTasks, points }));
            })
    }
    const value = {
        user,
        signInEmailPassword,
        createUserEmailPassword,
        signOutUser,
        fetchUserTasks,
        userTasks,
        setUserTasks,
        completeTask
    }
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext as default, UserContextProvider }