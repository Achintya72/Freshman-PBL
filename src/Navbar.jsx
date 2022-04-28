import MenuIcon from "./Assets/Menu.svg"
import { useState } from "react";
import CloseIcon from "./Assets/Close.svg"
import { Link } from "react-router-dom"

const pages = [
    {
        name: 'Home',
        ref: '/'
    },
    {
        name: "Dashboard",
        ref: "/dashboard"
    },
    {
        name: "Sign In",
        ref: "/signin"
    }
]
export default function Navbar(props) {
    const [open, setOpen] = useState(false);

    function toggleOpen() {
        setOpen(prev => !prev);
    }

    return (
        <nav>
            <div className="banner">
                <a>Gaem</a>
                {open ? <img src={CloseIcon} onClick={toggleOpen} /> : <img src={MenuIcon} onClick={toggleOpen} />}
            </div>
            {open &&
                pages.map(page => (
                    <Link to={page.ref} key={page.ref} >
                        <p style={{ color: "#000000" }}>{page.name}</p>
                    </Link>
                ))
            }
        </nav >
    )
}