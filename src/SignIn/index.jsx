import styles from "./signin.module.css";
import { useContext, useEffect, useState } from "react";
import UserContext from "../userContext";
import SignUp from "./signUp";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
const useLoginDetails = (initialState) => {
    const [details, setDetails] = useState(initialState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails(prev => ({ ...prev, [name]: value }))
    }

    return [details, handleChange];
}
function Authentication() {
    const [signIn, setSignIn] = useState(true);
    return (
        <>
            {signIn ? <SignIn callBack={setSignIn} /> : <SignUp callBack={setSignIn} />}
        </>
    )
}
function SignIn({ callBack }) {
    const [{ email, password }, handleChange] = useLoginDetails({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const auth = getAuth();
    const [loading, setLoading] = useState(false)
    const { createUserEmailPassword } = useContext(UserContext);
    function signIn() {
        setLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .then(response => {
                setLoading(false);
                navigate("/dashboard");
            })
            .catch(error => {
                setMessage(error.message);
                setLoading(false);
            })
    }

    useEffect(() => {
        if (message !== "") {
            setTimeout(() => setMessage(""), 5000)
        }

    }, [message])
    return (
        <div className={styles.container}>
            {!loading ? (
                <>
                    <h1>Sign In</h1>
                    {message != "" && <p className={styles.message}>{message}</p>}
                    <input
                        name="email"
                        className={styles.input}
                        type=" email"
                        placeholder="Email"
                        onChange={handleChange}
                        value={email}
                    />
                    <input
                        name="password"
                        className={styles.input}
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={password}
                    />
                    <a className="button" onClick={signIn}>Sign In</a>
                    <p>Don't Have and Account? <a onClick={() => callBack(false)}>Sign Up</a></p>
                </>
            ) :
                (
                    <h2 style={{ textAlign: 'center' }}>Loading...</h2>
                )}
        </div>
    )
}

export { Authentication as default, useLoginDetails }