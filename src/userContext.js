import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, Timestamp, increment } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const UserContext = createContext(null);

function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userTasks, setUserTasks] = useState(null);
    const [userImg, setUserImg] = useState("");
    const navigate = useNavigate()
    const a = getAuth();
    const [loading, setLoading] = useState(false);
    const db = getFirestore();
    const auth = getAuth();

    async function fetchUserTasks(userData) {
        const tasksCollection = collection(db, "tasks");
        const levelDocRef = doc(tasksCollection, (userData?.level ?? "1"))
        const userLevelCollection = collection(levelDocRef, userData?.group)
        try {
            const snapshot = await getDocs(userLevelCollection);
            let data = [];
            snapshot.docs.forEach(document => {
                data.push(document.data())
            });
            data.sort((a, b) => a.index - b.index);
            setUserTasks(data);
            return Promise.resolve();
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoading(true);
                setUserImg((user.photoURL ?? ""));
                const userRef = doc(collection(db, "users"), user.uid);
                getDoc(userRef).then((document) => {
                    setUser(document.data());
                    fetchUserTasks(document.data())
                        .then(() => {
                            setLoading(false);
                        });
                });


            }
            else {
                setUserTasks(null);
                setUser(null);
                setUserImg("");
            }
        })
        return unsubscribe;
    }, []);
    async function createUserEmailPassword(email, password, data) {
        const auth = getAuth();
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password)
            const userDocRef = doc(db, "users", response.user.uid);
            const doc = await setDoc(userDocRef, { ...data }, { merge: true, mergeFields: true });
            setUser(prev => ({ ...prev, ...data, id: response.user.uid }));
            return Promise.resolve();
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    function signOutUser() {
        signOut(auth).then(response => {
            navigate("/")
            setUser(null);
        })
    }
    function completeTask(index) {
        const userRef = doc(collection(db, 'users'), user.id)
        let newUserTasks = (user?.tasksComplete ?? [0, 0, 0])
        newUserTasks[index] = Timestamp.fromDate(new Date());
        let points = (user?.points ?? 0) + userTasks[index].points
        setDoc(userRef, { tasksComplete: newUserTasks, points }, { merge: true, mergeFields: true })
            .then(response => {
                setUser(prev => ({ ...prev, tasksComplete: newUserTasks, points }));
                if (user?.groupId) {
                    const groupRef = doc(collection(db, 'groups'), user.groupId);
                    setDoc(groupRef, {
                        points: increment(userTasks[index].points)
                    }, { merge: true, mergeFields: true })
                }
            })
    }
    const value = {
        user,
        createUserEmailPassword,
        signOutUser,
        fetchUserTasks,
        userTasks,
        setUserTasks,
        completeTask,
        setUser,
        userImg,
        setUserImg
    }
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext as default, UserContextProvider }