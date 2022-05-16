import UserContext from "../userContext";
import { useLoginDetails } from ".";
import { useContext, useEffect, useState } from "react";
import styles from "./signin.module.css";
import BoyImg from "../Assets/Boy.png";
import LadyImg from "../Assets/Lady.png";
import GrandmaImg from "../Assets/Grandma.png"
function LoginDetails({ callBack, setState, initialState }) {
    const [{ email, password, name }, handleChange] = useLoginDetails({
        email: initialState.email,
        password: initialState.password,
        name: initialState.name
    });

    const addDetails = () => {
        setState(prev => ({ ...prev, email, password, name }));
        callBack();
    }
    return (
        <div className={styles.container}>
            <input
                name="name"
                className={styles.input}
                type="text"
                placeholder="Name"
                onChange={handleChange}
                value={name}
            />
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

            <a className="button" onClick={addDetails}>Next</a>
        </div >
    )
}
const groups = [
    {
        val: 'Juniors',
        image: BoyImg
    },
    {
        val: 'Adults',
        image: LadyImg
    },
    {
        val: 'Seniors',
        image: GrandmaImg
    }
]
function RolePicker({ callBack, setState, initialState }) {
    const [group, setGroup] = useState(initialState.group);

    function handleClick() {
        setState(prev => ({ ...prev, group }));
        callBack();
    }
    return (
        <div className={styles.container}>
            <h3>Choose your Age Group</h3>
            <div className={styles.groups}>
                {
                    groups.map(g => (
                        <div
                            className={`${styles.groupCard} ${group == g.val && styles.selected}`}
                            key={g.val}
                            onClick={() => setGroup(g.val)}
                        >
                            <img src={g.image} />
                            <p>{g.val}</p>
                        </div>
                    ))
                }
            </div>
            {group != "" && <a onClick={handleClick} className="button">Sign Up</a>}
        </div>
    )
}
const stages = [
    LoginDetails,
    RolePicker
]

function SignUp({ callBack }) {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        group: 'Juniors'
    })
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const { createUserEmailPassword } = useContext(UserContext);
    const [stage, setStage] = useState(0);
    const Component = stages[stage];
    const nextStage = () => {
        if (stage < stages.length - 1) {
            if (!(!data.email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email))) {
                if (data.password) {
                    setStage(prev => prev + 1)
                }
            }
        }
        else {
            setLoading(true);
            let vals = {
                email: data.email,
                group: data.group,
                name: data.name
            }
            createUserEmailPassword(data.email, data.password, vals)
                .then(() => {
                    setLoading(false);
                })
                .catch(err => {
                    setMessage(err.message);
                    setLoading(false);
                })
        }
    }

    useEffect(() => {
        if (message != "") {
            setTimeout(() => setMessage(""), 5000)
        }
    }, [message])
    return (
        <div className={styles.container}>
            {loading ?
                <h2 style={{ textAlign: 'center' }}>Loading...</h2>
                :
                <>
                    <h1>Sign Up</h1>
                    {message != "" && <p className={styles.message}>{message}</p>}
                    <div className={styles.status}>
                        {
                            stages.map((s, index) => (
                                <p
                                    onClick={() => setStage(index)}
                                    key={index}
                                    className={
                                        `${styles.location} ${stage == index ? styles.active : styles.inactive}`
                                    }
                                >
                                    {index + 1}
                                </p>
                            ))
                        }
                    </div>
                    <Component callBack={nextStage} setState={setData} initialState={data} />

                    <p>Already Have an Account? <a onClick={() => callBack(true)}>Sign In</a></p>
                </>
            }
        </div>
    )
}


export default SignUp