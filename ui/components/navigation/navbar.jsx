import { ConnectButton } from "@rainbow-me/rainbowkit";

import styles from "../../styles/Navbar.module.css";
import Image from 'next/image'



export default function Navbar() {

	return (
		
		<nav className={styles.navbar}>
			<div className=" flex ">
			<a href="https://deviantsnft.com/" target="_blank">
			<div className="w-36 h-36">
	                      <Image
                            src='/logo.svg'
                            alt="deviantLogo Logo"
							width={120}
							height={120}
                            style={{  display: 'flex', objectFit: "contain", width: '100%', height: 'auto', position: 'relative'}}
							/>
							
            </div>
			</a>

			<a href="https://deviantsnft.com/" className={styles.checkMore} target="_blank">
				<div style={{padding:"10px"}}>
					<button  type="button"
					className=" border rounded-3xl w-100 h-auto relative contain flex text-white font-bold "
					style={{padding:"10px", paddingLeft:"25px",paddingRight:"25px"}}
					>
  						Check Out More
					</button>
							
            	</div>
			</a>
			</div>

			<ConnectButton/>
		</nav>
	);
}
