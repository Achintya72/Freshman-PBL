import { useContext, useState } from "react"
import UserContext from "../userContext"
import { Timestamp } from "firebase/firestore";
import styles from "./dashboard.module.css";
import DashboardNav from "./dashboardNav";
import Home from "./home";
import Settings from "./settings";
import Leaderboard from "./leaderboard";
import Community from "./Community";


const pages = [
    Home,
    Community,
    Leaderboard,
    Settings
]
export default function Dashboard(props) {
    const [currentPage, setCurrentPage] = useState(0);
    let Component = pages[currentPage]

    return (
        <div>
            <DashboardNav callBack={setCurrentPage} />

            <Component />
        </div>
    )
}