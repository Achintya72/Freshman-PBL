import styles from "./dashboard.module.css";
import UserContext from "../userContext";
import { useContext, useEffect, useState } from "react"
import { Timestamp } from "firebase/firestore";
import CloseIcon from "../Assets/Close.svg"
function Dashboard({ shift, tasks }) {
    const { user } = useContext(UserContext);
    return (
        <>
            <h2>Welcome, {user.name}</h2>
            <p>{tasks.length !== [false, false, false] && (
                <div className={styles.tasks}>
                    <h3>You've Got New Tasks</h3>
                    <a className="button" onClick={() => shift(1)}>View Tasks</a>
                </div>
            )}</p>
        </>
    )
}
function Tasks({ shift, tasks }) {
    const { user, fetchUserTasks } = useContext(UserContext);
    useEffect(() => {
        fetchUserTasks()
    }, []);
    let displayTasks = (user?.tasks ?? []).filter((item, index) => {
        return tasks[index]
    })
    console.log(tasks);
    return (
        <div>
            <img src={CloseIcon} onClick={() => shift(0)} style={{ marginBottom: '10px' }} />
            {displayTasks.map(task => (
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
    const [page, setPage] = useState(0);
    const Component = pages[page];
    const { user } = useContext(UserContext);
    let updatedTasks = (user?.tasksComplete ?? [0, 0, 0]).map(date => {
        if (Timestamp.fromDate(new Date()) - date > (24 * 3600)) {
            return true;
        }
        return false;
    })
    return (
        <Component shift={setPage} tasks={updatedTasks} />
    )
}