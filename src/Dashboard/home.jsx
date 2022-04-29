import styles from "./dashboard.module.css";
import UserContext from "../userContext";
import { useContext, useState } from "react"
import { Timestamp } from "firebase/firestore";
export default function Home(props) {
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
                    <a className="button">View Tasks</a>
                </div>
            )}</p>
        </>
    )
}