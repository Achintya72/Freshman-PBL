import { useContext } from "react"
import UserContext from "../userContext"
export default function Dashboard(props) {
    const { user } = useContext(UserContext);
    return (
        <div>
            Dashboard
        </div>
    )
}