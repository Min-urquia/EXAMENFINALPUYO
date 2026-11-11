import {Link} from "react-router-dom";
import styles from './Navbar.module.css'

function Navbar(){
    return(
        <nav className={styles.navbar}>
            
                <Link className={styles.link} to="/">Home</Link>
                <Link className={styles.link} to="/products">Products</Link>
                <Link className={styles.link} to="/about">About</Link>
                <Link className={styles.link} to="/contact">Contact</Link>
            
            
        </nav>
    )
}
export default Navbar;