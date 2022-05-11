import styles from "./dashboard.module.css";
import UserContext from "../userContext";
import { useContext, useEffect, useRef, useState } from "react"
import { Timestamp } from "firebase/firestore";
import CloseIcon from "../Assets/Close.svg";
import { WebcamCapture } from "../Webcam";
import { getStorage, ref, uploadBytes, uploadBytesResumable, uploadString } from "firebase/storage";
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
        <div className={styles.bottom}>
            <p>Points: {user.points ?? 0}</p>
            <h2>Welcome, {user.name}</h2>
            <p>{tasksExist && (
                <div className={styles.tasks}>
                    <h3>You've Got New Tasks</h3>
                    <a className="button" onClick={() => shift(1)}>View Tasks</a>
                </div>
            )}</p>
        </div>
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
        <div className={styles.bottom}>
            <img src={CloseIcon} onClick={() => shift(0)} style={{ marginBottom: '10px' }} />
            {displayTasks.map(task => (
                <Task task={task} complete={complete} />
            ))}
        </div>
    )
}

const Task = ({ task, complete }) => {
    const [capturing, changeCapturing] = useState(false);
    const [image, setImage] = useState('');
    const { user } = useContext(UserContext);
    const finishPic = (img) => {
        changeCapturing(false);
        setImage(img);

        fetch(img)
            .then(response => {
                response.arrayBuffer()
                    .then(buffer => {
                        const metadata = {
                            contentType: "image/jpeg"
                        }
                        const store = getStorage();
                        const picRef = ref(store, `${user.id}/${task.Name}.jpg`);
                        const uploadTask = uploadBytes(picRef, buffer, metadata);
                        uploadTask.then(response => {
                            complete(task);
                        })
                    })
            })
    }

    return (
        <div className={styles.task}>
            <div className={styles.details}>
                <h3>{task.Name}</h3>
                <p>{task.Description}</p>
            </div>
            <div className={styles.actions}>
                <a className="button" onClick={() => changeCapturing(true)}>Complete</a>
                <a className="button">Switch</a>
            </div>
            {capturing && <WebcamCapture closeSelf={() => changeCapturing(false)} finishPic={finishPic} />}
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