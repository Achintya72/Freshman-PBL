import styles from "./signin.module.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useContext, useState } from "react";
import UserContext from "../userContext";


export default function SignIn(props) {
    const [details, setDetails] = useState({
        email: '',
        password: ''
    })
    const { signInEmailPassword } = useContext(UserContext);
    function signIn() {
        signInEmailPassword(details.email, details.password)
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setDetails(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className={styles.container}>
            <h1>Sign In</h1>
            <input
                name="email"
                className={styles.input}
                type=" email"
                placeholder="Email"
                onChange={handleChange}
                value={details.email}
            />
            <input
                name="password"
                className={styles.input}
                type="password"
                placeholder="Password"
                onChange={handleChange}
                value={details.password}
            />
            <a className="button" onClick={signIn}>Sign In</a>
        </div>
    )
}