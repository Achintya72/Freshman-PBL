import styles from "./dashboard.module.css";
import UserContext from "../userContext";
import { useContext, useEffect, useState } from "react"
import { Timestamp } from "firebase/firestore";
import CloseIcon from "../Assets/Close.svg"
function Dashboard({ callBack }) {
    const { user } = useContext(UserContext);
    let newTasks = false;
    let lastCompleted = user.tasksCompleted ?? Timestamp.fromDate(new Date(0));
    lastCompleted = lastCompleted.toDate()
    if (lastCompleted.getDate() != new Date().getDate()) {
        newTasks = true
    }
    else if (lastCompleted.getMonth() != new Date().getMonth()) {
        newTasks = true
    }
    else if (lastCompleted.getFullYear() != new Date().getFullYear()) {
        newTasks = true
    }
    return (
        <>
            <h2>Welcome, {user.name}</h2>
            <p>{newTasks && (
                <div className={styles.tasks}>
                    <h3>You've Got New Tasks</h3>
                    <a className="button" onClick={() => callBack(1)}>View Tasks</a>
                </div>
            )}</p>
        </>
    )
}
function Tasks({ callBack }) {
    const { user, fetchUserTasks } = useContext(UserContext);
    useEffect(() => {
        fetchUserTasks()
    }, []);
    let tasks = user?.tasks ?? [{
        Name: 'Loading',
        Description: "Loading..."
    }]
    console.log(tasks);
    return (
        <div>
            <img src={CloseIcon} onClick={() => callBack(0)} style={{ marginBottom: '10px' }} />
            {tasks.map(task => (
                <div className={styles.task}>
                    <div className={styles.details}>
                        <h3>{task.Name}</h3>
                        <p>{task.Description}</p>
                    </div>
                    <div className={styles.actions}>
                        <a className="button">Complete</a>
                        <a className="button">Switch</a>
                    </div>
                </div>
            ))}
        </div>
    )
}

const pages = [
    Dashboard,
    Tasks
]

export default function Home(props) {
    const { user } = useContext(UserContext);
    const [page, setPage] = useState(0);
    const Component = pages[page];

    return (
        <Component callBack={setPage} />
    )
}