import UserContext from "../userContext";
import { useLoginDetails } from ".";
import { useContext, useState } from "react";
import styles from "./signin.module.css";
import BoyImg from "../Assets/Boy.svg";
import LadyImg from "../Assets/Lady.svg";
import GrandmaImg from "../Assets/Grandma.svg"
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
        val: 'Youth',
        image: BoyImg
    },
    {
        val: 'Adult',
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
    console.log(group)
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
        group: ''
    })
    const { createUserEmailPassword } = useContext(UserContext);
    const [stage, setStage] = useState(0);
    const Component = stages[stage];
    console.log(data)
    const nextStage = () => {
        if (stage < stages.length - 1) {
            if (!(!data.email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email))) {
                if (data.password) {
                    setStage(prev => prev + 1)
                }
            }
        }
        else {
            let vals = {
                email: data.email,
                group: data.group,
                name: data.name
            }
            console.log(vals)
            createUserEmailPassword(data.email, data.password, vals)
        }
    }
    return (
        <div className={styles.container}>
            <h1>Sign Up</h1>
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
        </div>
    )
}


export default SignUp