import styles from "./home.module.css";
import EarthImg from "../Assets/Earth.svg";
import { Link } from "react-router-dom";
export default function Home(props) {
    return (
        <div className={styles.home}>
            <h1>Welcome to Gaem</h1>
            <p>A game designed to help you help the environment, without the boredom.</p>
            <img src={EarthImg} />
            <Link to="/signin" style={{
                width: '100%',
                display: 'flex',
                justifyContent: "center"
            }}>
                <a className={"button " + styles.button} >Get Started</a>
            </Link>
        </div>
    )

}