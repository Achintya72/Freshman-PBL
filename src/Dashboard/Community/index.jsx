import { collection, getFirestore, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../userContext";
import styles from "./styles.module.css";

const Chat = (props) => {
    return (
        <div>Chat</div>
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
        if (group?.id) {
            const firestore = getFirestore();
            const groupsCollection = collection(firestore, 'groups')
            const groupRef = doc(groupsCollection, group?.id);
            const postsRef = collection(groupRef, 'posts')

            getDocs(postsRef).then(response => {
                const data = [];
                response.forEach(doc => {
                    data.push({ ...doc.data(), id: doc.id })
                })
                setPosts(data);
            })
        }
        return () => {
            if (group?.id) {

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
