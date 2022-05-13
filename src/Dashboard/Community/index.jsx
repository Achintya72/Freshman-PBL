import { collection, getFirestore, doc, getDoc, setDoc, onSnapshot, addDoc, Timestamp, arrayRemove, arrayUnion } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../userContext";
import styles from "./styles.module.css";
import NewIcon from "../../Assets/New.svg"
const Chat = ({ group }) => {
    const [chat, setChat] = useState(null);
    const { user } = useContext(UserContext);
    useEffect(() => {
        let unsub = () => { };
        if (group?.id) {
            const firestore = getFirestore();
            const groupRef = doc(collection(firestore, 'groups'), group?.id);
            const messagesRef = collection(groupRef, 'chat')
            unsub = onSnapshot(messagesRef, response => {
                const data = [];
                response.forEach(doc => {
                    data.push({ ...doc.data(), id: doc.id })
                });
                data.sort((a, b) => b.timeSent.toDate() < a.timeSent.toDate() ? 1 : -1)
                setChat(data);
            })
        }
        return unsub;
    }, [])

    const newMessage = (e) => {
        let response = window.prompt('What is your message?');
        if (response) {
            const firestore = getFirestore();
            const groupRef = doc(collection(firestore, 'groups'), group?.id);
            const messagesRef = collection(groupRef, 'chat')
            addDoc(messagesRef, {
                message: response,
                name: user.name,
                timeSent: Timestamp.fromDate(new Date()),
                uid: user.id
            })
        }
    }
    return (
        <div className={styles.chat}>
            <div className={styles.scroll}>
                {
                    chat?.map(message => {
                        let timestamp = message.timeSent.toDate();
                        return (
                            <div className={message.uid == user.id ? styles.self : styles.other}>
                                <p className={styles.message}>{message.message}</p>
                                <div className={styles.metadata}>
                                    <p className={styles.details}>{message.name}</p>
                                    <p className={styles.details}>{timestamp.getHours()}:{timestamp.getMinutes()}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className={styles.new} onClick={newMessage}>
                <div />
            </div>
        </div>
    )
}


const Post = ({ post, setPosts, index, group }) => {
    const { user } = useContext(UserContext);
    const [fav, setFav] = useState(post?.likedBy?.includes(user.id));
    const like = () => {
        const firestore = getFirestore();
        const groupRef = doc(collection(firestore, 'groups'), group.id)
        const postsRef = doc(collection(groupRef, 'posts'), post.id);
        if (fav) {
            setDoc(postsRef, {
                likedBy: arrayRemove(user.id)
            }, { merge: true, mergeFields: true })
            setFav(false)
        }
        else {
            setDoc(postsRef, {
                likedBy: arrayUnion(user.id)
            }, { merge: true, mergeFields: true });
            setFav(true)
        }
    }
    return (
        <div className={styles.post}>
            <img src={post.pictureUrl} />
            <div className={styles.details}>
                <h3>{post.title}</h3>
                <div className={styles.actions}>
                    <p>{post.userName}</p>
                    <div className={styles.favorites}>
                        <p>{post?.likedBy.length}</p>
                        <div
                            onClick={like}
                            className={`${styles.heart} ${fav ? styles.activeHeart : ''}`} />

                    </div>
                </div>
            </div>
        </div>
    )
}

const Posts = ({ group }) => {
    const [posts, setPosts] = useState(null);
    useEffect(() => {
        let unsub = () => { }
        if (group?.id) {
            const firestore = getFirestore();
            const groupsCollection = collection(firestore, 'groups')
            const groupRef = doc(groupsCollection, group?.id);
            const postsRef = collection(groupRef, 'posts')

            unsub = onSnapshot(postsRef, response => {
                const data = [];
                response.forEach(doc => {
                    data.push({ ...doc.data(), id: doc.id })
                })
                setPosts(data);
            })
        }
        return () => {
            if (group?.id) {
                unsub();
            }
        }
    }, [])
    return (
        <div style={{ marginTop: '1rem' }}>
            {posts?.map((post, index) => (
                <Post index={index} post={post} group={group} key={post.id} setPosts={setPosts} />
            ))}
        </div>
    )
}

const pages = [
    Chat,
    Posts
]
function unsub() { }

export default function Community(props) {
    const [page, setPages] = useState(0);
    const [group, setGroup] = useState(null);
    const [groups, setGroups] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, setUser } = useContext(UserContext);
    const Component = pages[page];
    useEffect(() => {
        const firestore = getFirestore();
        const groupsCollection = collection(firestore, 'groups');
        if (user.groupId) {
            const groupRef = doc(groupsCollection, user.groupId)
            getDoc(groupRef).then(response => {
                setGroup({ ...response.data(), id: response.id })
                setLoading(false);
            })
        }
        else {
            unsub = onSnapshot(groupsCollection, response => {
                let data = [];
                response.forEach(doc => {
                    data.push({ ...doc.data(), id: doc.id })
                });
                setGroups(data);
                setLoading(false)
            })
        }
    }, [user.groupId])

    useEffect(unsub, [])

    const joinGroup = (id) => {
        const firestore = getFirestore();
        const userDoc = doc(collection(firestore, "users"), user.id);
        setDoc(userDoc, { groupId: id }, { merge: true }).then(() => {
            setUser(prev => ({ ...prev, groupId: id }))
        });
    }

    const newGroup = () => {
        let response = prompt("Name your group: ")
        const firestore = getFirestore();
        const groupCollection = collection(firestore, "groups");
        addDoc(groupCollection, {
            name: response
        }).then(snapshot => {
            joinGroup(snapshot.id);
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.nav}>
                <a className={page == 0 ? styles.active : ''} onClick={() => setPages(0)}>Chat</a>
                <a className={page == 1 ? styles.active : ''} onClick={() => setPages(1)}>Posts</a>
            </div>
            {loading ? <h3>Loading...</h3> : user?.groupId ?
                <Component group={group} />
                :
                <div>
                    {groups.map(group => (
                        <>
                            <div key={group.id} className={styles.groupCard}>
                                <h3>{group.name}</h3>
                                <a className="button" onClick={() => joinGroup(group.id)}>Join</a>
                            </div>

                        </>
                    ))}
                    <div className={styles.new} onClick={newGroup}>
                        <div />
                    </div>
                </div>
            }
        </div>
    )
}
