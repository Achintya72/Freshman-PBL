import { collection, getFirestore, doc, getDoc, setDoc, onSnapshot, addDoc, Timestamp } from "firebase/firestore";
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
        setPosts(prev => {
            let i = prev[index].likedBy.indexOf(user.id);
            if (fav && i != -1) {
                prev[index].likedBy.splice(i, 1);
            }
            else if (!fav && i == -1) {
                prev[index].likedBy.push(user.id)
            }
            return prev;
        })
        setFav(prev => !prev);
        const firestore = getFirestore();
        const groupsCollection = collection(firestore, 'groups')
        const groupRef = doc(groupsCollection, group?.id);
        const postsRef = collection(groupRef, 'posts')
        const postRef = doc(postsRef, post.id);
        setDoc(postRef, post);
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
export default function Community(props) {
    const [page, setPages] = useState(0);
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);
    const Component = pages[page];
    useEffect(() => {
        if (user.groupId) {
            const firestore = getFirestore();
            const groupsCollection = collection(firestore, 'groups')
            const groupRef = doc(groupsCollection, user.groupId)
            getDoc(groupRef).then(response => {
                setGroup({ ...response.data(), id: response.id })
                setLoading(false);
            })
        }
    }, [])
    return (
        <div>
            <div className={styles.nav}>
                <a className={page == 0 ? styles.active : ''} onClick={() => setPages(0)}>Chat</a>
                <a className={page == 1 ? styles.active : ''} onClick={() => setPages(1)}>Posts</a>
            </div>
            {loading ? <h3>Loading...</h3> :
                <Component group={group} />
            }
        </div>
    )
}
