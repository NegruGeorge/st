import Navbar from "../components/navigation/navbar";
import styles from "../styles/Home.module.css";
export default function MainLayout({ children }) {
	return (
		<div className={styles.silver_mint_pass}>
            <Navbar />
            {children}
		</div>
	);
}
