import { getFirestore, writeBatch, doc, collection } from "firebase/firestore";
import { getAuth, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { useContext, useEffect, useRef, useState } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import UserContext from "../../userContext";
import styles from "./styles.module.scss";
import BoyImg from "../../Assets/Boy.png";
import LadyImg from "../../Assets/Lady.png";
import GrandmaImg from "../../Assets/Grandma.png";
import dashboardStyles from "../dashboard.module.css";
export default function Settings(props) {
    const { user, setUser, userImg, setUserImg } = useContext(UserContext);
    const [message, setMessage] = useState("");
    const [tempImg, setTempImg] = useState();
    const auth = getAuth();
    const storage = getStorage();
    const handleChange = (name, val) => {
        setUser(prev => ({ ...prev, [name]: val }))
        const db = getFirestore();
        const groupsRef = collection(db, "groups");
        const batch = writeBatch(db);
        batch.update(doc(collection(db, "users"), user.id), { [name]: val })
        if (user?.groupId && name == "name") {
            const groupRef = doc(groupsRef, user.groupId)
            const messagesRef = collection(groupRef, "chat");
            const postsRef = collection(groupRef, "posts")
            let messages = (user?.messages ?? []);
            messages.forEach((id) => {
                batch.update(doc(messagesRef, id), { name: val })
            })
            let posts = (user?.posts ?? []);
            posts.forEach(id => {
                batch.update(doc(postsRef, id), { userName: val })
            })
        }
        batch.commit()
    }
    const changePassword = (val) => {
        sendPasswordResetEmail(auth, user.email).then(() => {
            setMessage("Sent Password Reset Email. Make sure to check your spam folder")
        });
    }
    useEffect(() => {
        if (message != "") {
            setTimeout(() => setMessage(""), 5000)
        }
    }, [message]);

    const handleImageChange = (e) => {
        setTempImg(e.target.files[0]);
    }
    const handleSubmit = () => {
        if (!tempImg) {
            alert("Add Picture First!")
        }
        else {
            const storageRef = ref(storage, `${user.id}/Avatar.png`);
            const uploadTask = uploadBytesResumable(storageRef, tempImg);

            uploadTask.on("state_changed", () => { }, (err) => {
                setMessage(err.message);
            },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((url) => {
                            setUserImg(url)
                            updateProfile(auth.currentUser, {
                                photoURL: url
                            }).then(() => { console.log("Done"); }).catch((err) => setMessage(err.message));
                        })
                })
        }
    }
    return (
        <div className={dashboardStyles.bottom}>
            <p><strong>Avatar: </strong></p>
            <form style={{ display: "flex", alignItems: "flex-start" }}>
                {tempImg ? <img src={URL.createObjectURL(tempImg)} /> : <img src={userImg} />}
                <input type="file" accept=".png" multiple={false} onChange={handleImageChange} />
                <a className="button" onClick={handleSubmit}>Submit</a>
            </form>
            <TextField name="name" value={user.name} label="Name:" handleChange={handleChange} />
            <AgePicker name="group" value={user.group} handleChange={handleChange} />
            <a onClick={changePassword}>Change Password</a>
            {message != "" && <p className={styles.message}>{message}</p>}
        </div >
    )
}


function TextField({ value, name, label, handleChange }) {
    const [val, setVal] = useState(value);
    const [active, setActive] = useState(false);
    const { user, setUser } = useContext(UserContext)
    function submit() {
        handleChange(name, val);
        setActive(false)
    }
    return (
        <div>
            <p><strong>{label}</strong></p>
            <div className={styles.container}>
                <input
                    className={styles.input}
                    value={val}
                    name={name}
                    onChange={(e) => setVal(e.target.value)}
                    onFocus={() => setActive(true)}
                />
                {active &&
                    <>
                        <div className={styles.close} onClick={() => {
                            setActive(false)
                            setVal(value)
                        }} />
                        <div className={styles.confirm} onClick={submit} />
                    </>
                }
            </div>
        </div>
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
function AgePicker({ value, name, handleChange }) {
    const [val, setVal] = useState(value);
    const [active, setActive] = useState(false)
    function submit() {
        handleChange(name, val);
        setActive(false);
    }

    return (
        <div>
            <div className={styles.container}>
                <p><strong>Age Group:</strong></p>
                {(val !== value) &&
                    <>
                        <div className={styles.close} onClick={() => {
                            setActive(false)
                            setVal(value)
                        }} />
                        <div className={styles.confirm} onClick={submit} />
                    </>
                }
            </div>
            <div className={styles.container}>
                {groups.map(g => (
                    <div
                        className={`${styles.groupCard} ${val == g.val && styles.selected}`}
                        key={g.val}
                        onClick={() => setVal(g.val)}
                    >
                        <img src={g.image} />
                        <p>{g.val}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}