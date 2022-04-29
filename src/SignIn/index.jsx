import styles from "./signin.module.css";
import { useContext, useState } from "react";
import UserContext from "../userContext";
import SignUp from "./signUp";

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
    const [loading, setLoading] = useState(false)
    const { signInEmailPassword } = useContext(UserContext);
    function signIn() {
        setLoading(true);
        signInEmailPassword(email, password);
    }

    return (
        <div className={styles.container}>
            {!loading ? (
                <>
                    <h1>Sign In</h1>
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