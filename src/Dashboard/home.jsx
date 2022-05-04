import styles from "./dashboard.module.css";
import UserContext from "../userContext";
import { useContext, useEffect, useState } from "react"
import { Timestamp } from "firebase/firestore";
import CloseIcon from "../Assets/Close.svg"
function Dashboard({ shift, tasks }) {
    const { user } = useContext(UserContext);
    let tasksExist = false;
    tasks.forEach(task => {
        if (task) {
            tasksExist = true;
            return;
        }
    })
    return (
        <>
            <p>Points: {user.points ?? 0}</p>
            <h2>Welcome, {user.name}</h2>
            <p>{tasksExist && (
                <div className={styles.tasks}>
                    <h3>You've Got New Tasks</h3>
                    <a className="button" onClick={() => shift(1)}>View Tasks</a>
                </div>
            )}</p>
        </>
    )
}
function Tasks({ shift, tasks }) {
    const { user, fetchUserTasks, userTasks, completeTask } = useContext(UserContext);
    useEffect(() => {
        fetchUserTasks()
    }, []);
    let displayTasks = (userTasks ?? []).filter((item, index) => {
        return tasks[index]
    })

    function complete(task) {
        let index = userTasks.indexOf(task);
        completeTask(index);
    }
    return (
        <div>
            <img src={CloseIcon} onClick={() => shift(0)} style={{ marginBottom: '10px' }} />
            {displayTasks.map(task => (
                <Task task={task} complete={complete} />
            ))}
        </div>
    )
}

const Task = ({ task, complete }) => (
    <div className={styles.task}>
        <div className={styles.details}>
            <h3>{task.Name}</h3>
            <p>{task.Description}</p>
        </div>
        <div className={styles.actions}>
            <a className="button" onClick={() => complete(task)}>Complete</a>
            <a className="button">Switch</a>
        </div>
    </div>
)

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