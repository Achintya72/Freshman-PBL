import styles from "../dashboard.module.scss";
import myStyles from "./styles.module.css"
import { useContext, useEffect, useState } from "react"
import { getDocs, getFirestore, orderBy, query, collection } from "firebase/firestore";
import UserContext from "../../userContext";
const Individual = (props) => {
    const [positions, setPositions] = useState({});
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext)
    useEffect(() => {
        const db = getFirestore();
        const usersRef = collection(db, "users")
        const q = query(usersRef, orderBy("points", "desc"));
        getDocs(q).then(response => {
            let obj = {};
            let index = 0;
            response.forEach((doc) => {
                if (index < 3 || doc.id == user.id) {
                    obj[index + 1] = { name: doc.data().name, points: doc.data().points, id: doc.id }
                }
                index += 1;
            })
            setPositions(obj);
            setLoading(false);
        })
    }, []);
    return (
        <div>
            {loading ? <h3>Loading...</h3> :
                <>
                    {Object.keys(positions).map(key => (
                        <div className={myStyles.pos} key={key}>
                            <div className={myStyles.info}>
                                <div className={myStyles.placeContainer}>
                                    <p className={`${myStyles.place} ${myStyles['place' + (key < 4 ? key : 4)]}`}>{key}</p>
                                </div>
                                <p className={`${user.id == positions[key].id ? myStyles.self : ''}`}>{positions[key].name}</p>
                            </div>
                            <p>{positions[key].points}</p>
                        </div>
                    ))}

                </>
            }
        </div >
    )
}

const Group = (props) => {
    const [positions, setPositions] = useState({});
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext)
    useEffect(() => {
        if (user?.groupId) {
            const db = getFirestore();
            const usersRef = collection(db, "groups")
            const q = query(usersRef, orderBy("points", "desc"));
            getDocs(q).then(response => {
                let obj = {};
                let index = 0;
                response.forEach((doc) => {
                    if (index < 3 || doc.id == user?.groupId) {
                        obj[index + 1] = { name: doc.data().name, points: doc.data().points, id: doc.id }
                    }
                    index += 1;
                })
                setPositions(obj);
                setLoading(false);
            })
        }
        else {
            setLoading(false);
        }
    }, []);
    return (
        <div>
            {loading ? <h3>Loading...</h3> :
                user?.groupId ?
                    <>
                        {Object.keys(positions).map(key => (
                            <div className={myStyles.pos} key={key}>
                                <div className={myStyles.info}>
                                    <div className={myStyles.placeContainer}>
                                        <p className={`${myStyles.place} ${myStyles['place' + (key < 4 ? key : 4)]}`}>{key}</p>
                                    </div>
                                    <p className={`${user.groupId == positions[key].id ? myStyles.self : ''}`}>{positions[key].name}</p>
                                </div>
                                <p>{positions[key].points}</p>
                            </div>
                        ))}

                    </> :
                    <h3>Join Group First</h3>
            }
        </div >
    )
}


const pages = [
    Individual,
    Group
]


export default function Leaderboard(props) {
    const [page, setPages] = useState(0);

    const Component = pages[page];
    return (
        <div className={styles.bottom}>
            <div className={myStyles.nav}>
                <a className={page == 0 ? myStyles.active : ''} onClick={() => setPages(0)}>Individual</a>
                <a className={page == 1 ? myStyles.active : ''} onClick={() => setPages(1)}>Group</a>
            </div>
            <Component />
        </div>

    )
}