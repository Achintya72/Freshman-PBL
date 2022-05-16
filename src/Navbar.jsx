import MenuIcon from "./Assets/Menu.svg"
import { useState, useContext } from "react";
import CloseIcon from "./Assets/Close.svg"
import { Link } from "react-router-dom";
import UserContext from "./userContext";
import "./App.css"
const pages = [
    {
        name: 'Home',
        ref: '/'
    },
]
export default function Navbar(props) {
    const [open, setOpen] = useState(false);
    const { user, signOutUser } = useContext(UserContext);
    function toggleOpen() {
        setOpen(prev => !prev);
    }

    return (
        <nav>
            <div className="banner">
                <a>Gaem</a>
                {open ? <a src={CloseIcon} className="closeIcon" onClick={toggleOpen} /> : <img src={MenuIcon} onClick={toggleOpen} />}
            </div>
            {open &&
                <>
                    {
                        pages.map(page => (
                            <Link to={page.ref} key={page.ref} >
                                <p style={{ color: "#000000" }}>{page.name}</p>
                            </Link>
                        ))
                    }
                    {
                        user ? (
                            <>
                                <Link to="/dashboard">
                                    <p style={{ color: "#000000" }}>Dashboard</p>
                                </Link>
                                <a><p onClick={signOutUser}>SIGN OUT</p></a>
                            </>) : <Link to="/signin">
                            <p style={{ color: '#000000' }}>Sign In</p>
                        </Link>
                    }
                </>
            }

        </nav >
    )
}