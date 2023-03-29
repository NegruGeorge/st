import { useEffect, useState } from "react";
import { useContract, useAccount, useSigner } from "wagmi";
import { ethers, BigNumber } from "ethers";
import Navbar from "../components/navigation/navbar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import abi from "../utils/abi.json";
import { PremintAddr } from "../utils/addr";
import { SilverAddr } from "../utils/addr";
import { GoldAddr } from "../utils/addr";
import { DiamondAddr } from "../utils/addr";
import { CrimsonAddr } from "../utils/addr";
import abiSilver from "../utils/abiSilver.json"
import abiGold from "../utils/abiGold.json"
import abiDiamond from "../utils/abiDiamond.json"
import abiCrimson from "../utils/abiCrimson.json"
import Background from "../components/navigation/background";
import Router from 'next/router'

import {useEvmWalletNFTs} from "@moralisweb3/next"


export default function Home() {
	const { fetch } = useEvmWalletNFTs();

	const [selectedAmount, setSelectedAmount] = useState(1);
	const [balance, setBalance] = useState(0);
	const [amountSold, setAmountSold] = useState(0);
	const [userAddr, setUserAddr] = useState("");
	const [price, setPrice] = useState(0);
	const [isHidden, setIsHidden] = useState(true);
	const [ethPrice, setEthPrice] = useState();
	const [mintSpinner,setMintSpinner] = useState(false);
	const [approveSilverSpinner,setApproveSilverSpinner] = useState(false);
	const [approveGoldSpinner, setApproveGoldSpinner] = useState(false);
	const [approveDiamondSpinner,setApproveDiamondSpinner] = useState(false);
	const [approveCrimsonSpinner,setApproveCrimsonSpinner] = useState(false);

	const [approvedSilver,setApprovedSilver] = useState(false);
	const [approvedGold,setApprovedGold] = useState(false);
	const [approvedCrimson,setApprovedCrimson] = useState(false);
	const [approvedDiamond,setApprovedDiamond]  = useState(false);


	const [silverOwned,setSilverOwned] = useState([]);
	const [goldOwned,setGoldOwned] = useState([]);
	const [diamondOwned,setDiamondOwned] = useState([]);
	const [crimsonOwned,setCrimsonOwned] = useState([]);

	const [silverBalance,setSilverBalance] = useState([]);
	const [goldBalance,setGoldBalance] = useState([]);
	const [diamondBalance,setDiamondBalance] = useState([]);
	const [crimsonBalance,setCrimsonBalance] = useState([]);

	const [holderBalance,setHolderBalance] = useState(0);
	const [saleON,setSaleON] = useState(false);
	const [hash, setHash] = useState("0x");
	const { data: signer } = useSigner();
	const account = useAccount();

	const contractInstance = useContract({
		address: PremintAddr,
		abi: abi,
		signerOrProvider: signer,
	});

	const silverInstance = useContract({
		address: SilverAddr,
		abi: abiSilver,
		signerOrProvider: signer,
	})

	const goldInstance = useContract({
		address: GoldAddr,
		abi:abiGold,
		signerOrProvider: signer,
	})

	const diamondInstance = useContract({
		address: DiamondAddr,
		abi: abiDiamond,
		signerOrProvider: signer,
	})
	
	const crimsonInstance = useContract({
		address: CrimsonAddr,
		abi: abiCrimson,
		signerOrProvider:signer,
	})

	const domain = {
		name: "Deviants",
		version: "1",
		chainId: 80001,
		verifyingContract: PremintAddr,
	};

	const types = {
		NFT: [
			{
				name: "account",
				type: "address",
			},
		],
	};

	const socials = [
		{
			name: "DeviantsTwitter",
			href: "https://twitter.com/TheDeviantsNFT",
			icon: "/twitterAstra.svg",
		},
		{
			name: "AstraNovaTwitter",
			href: "https://twitter.com/Astra__Nova",
			icon: "/twitter.svg",
		},
		{
			name: "Medium",
			href: "https://astranovaofficial.medium.com/",
			icon: "/mediumSvg.svg",
		},
		{
			name: "Discord",
			href: "https://discord.gg/astranova",
			icon: "/discordSvg.svg",
		},
	];
	async function getBal(){
		try {
			// let balSDK = await contractInstance.balanceOf(
			// 	account.address
			// );
			// setBalance(balSDK.toNumber());
			let tokenIds = await contractInstance.totalSupply();
			setAmountSold(tokenIds.toNumber());
			
			let holderB = await contractInstance.getUserStatus(account.address);
			setHolderBalance(holderB.toNumber());
			
			// let saleStats = await contractInstance.pauseMint();
			// setSaleON(!saleStats);
			//console.log("ss")

		} catch (e) {}
	};

	async function checkApprovalStatus(){
		try{
			let silverApproval
			let goldApproval
			let diamondApproval
			let crimsonApproval

			// console.log("................")
			// console.log(silverBalance)
			// console.log(goldBalance)
			// console.log(diamondBalance)
			// console.log(crimsonBalance)

			// console.log("..............")

			await getUserBalances();
			if(silverBalance ===0){
				setApprovedSilver(true);
			}else{
				silverApproval = await silverInstance.isApprovedForAll(account.address,PremintAddr);
				setApprovedSilver(silverApproval);
			}

			if(goldBalance ===0){
				setApprovedGold(true);
			}else{
				goldApproval = await goldInstance.isApprovedForAll(account.address,PremintAddr);
				setApprovedGold(goldApproval);
			}

			if(diamondBalance ===0){
				setApprovedDiamond(true);
			}else{
				diamondApproval = await diamondInstance.isApprovedForAll(account.address,PremintAddr);
				setApprovedDiamond(diamondApproval);
			}

			if(crimsonBalance ===0){
				setApprovedCrimson(true);
			}else{
				crimsonApproval = await crimsonInstance.isApprovedForAll(account.address,PremintAddr);
				setApprovedCrimson(crimsonApproval);
			}
			

			// console.log(silverApproval)
			// console.log(goldApproval)
			// console.log(diamondApproval)
			// console.log(crimsonApproval);

			
		}catch(e){
			// console.log(e)
		}
	}


	async function checkApprovalStatus2(){
		try{
			let silverApproval
			let goldApproval
			let diamondApproval
			let crimsonApproval
		
				silverApproval = await silverInstance.isApprovedForAll(account.address,PremintAddr);
				setApprovedSilver(silverApproval);

				goldApproval = await goldInstance.isApprovedForAll(account.address,PremintAddr);
				setApprovedGold(goldApproval);

				diamondApproval = await diamondInstance.isApprovedForAll(account.address,PremintAddr);
				setApprovedDiamond(diamondApproval);

				crimsonApproval = await crimsonInstance.isApprovedForAll(account.address,PremintAddr);
				setApprovedCrimson(crimsonApproval);			

			// console.log(silverApproval)
			// console.log(goldApproval)
			// console.log(diamondApproval)
			// console.log(crimsonApproval);

		}catch(e){
			// console.log("ssss")
			// console.log(e)
		}
	}


	async function getUserBalances(){
		try{
			let bal = await silverInstance.balanceOf(account.address)
			//console.log(parseInt(bal));
			setSilverBalance(parseInt(bal));
			bal = await goldInstance.balanceOf(account.address)
			setGoldBalance(parseInt(bal));
			bal = await diamondInstance.balanceOf(account.address)
			setDiamondBalance(parseInt(bal));
			bal = await crimsonInstance.balanceOf(account.address)
			setCrimsonBalance(parseInt(bal));

		}catch(e){
			console.log(e)
		}
	}

	async function openWindow() {
		await new Promise(resolve => setTimeout(resolve, 1000));
		window.open("https://opensea.io/account", "_blank");
	  }


	async function approveSilver(e){
		e.stopPropagation();
		e.preventDefault();
		setApproveSilverSpinner(true);
		try{

			// let res = await crimsonInstance.balanceOf(account.address)
			// if(res>0){
				let tx = await silverInstance.setApprovalForAll(PremintAddr,true);
				await tx.wait()
			// }

			setApprovedSilver(true);
			setApproveSilverSpinner(false);

		}catch(e){
			//console.log(e)
			window.alert("please try again silver")
			setApproveSilverSpinner(false);

		}
		setApproveSilverSpinner(false);		
	}

	async function approveCrimson(e){
		e.stopPropagation();
		e.preventDefault();
		setApproveCrimsonSpinner(true);
		try{
			// let res  = await crimsonInstance.balanceOf(account.address);
			// if(res >0){
				let tx = await crimsonInstance.setApprovalForAll(PremintAddr,true);
				await tx.wait()
			// } 
			setApprovedCrimson(true);
			setApproveCrimsonSpinner(false);

		}catch(e){
			window.alert("please try again")
			setApproveCrimsonSpinner(false);
		}
	}


	async function approveGold(e){
		e.stopPropagation();
		e.preventDefault();
		setApproveGoldSpinner(true);
		try{
			// let res = await goldInstance.balanceOf(account.address);
			// if(res>0){
				let tx = await goldInstance.setApprovalForAll(PremintAddr,true);
				await tx.wait()
			// }

			setApprovedGold(true);
			setApproveGoldSpinner(false);

		}catch(e){
			window.alert("please try again")
			setApproveGoldSpinner(false);
		}
	}
	
	async function approveDiamond(e){
		e.stopPropagation();
		e.preventDefault();
		setApproveDiamondSpinner(true);
		try{
			// let res = await diamondInstance.balanceOf(account.address);
			// if(res>0){
				let tx = await diamondInstance.setApprovalForAll(PremintAddr,true);
				await tx.wait()
			// }

			setApprovedDiamond(true);
			setApproveDiamondSpinner(false);

		}catch(e){
			window.alert("please try again")
			setApproveDiamondSpinner(false);
		}
	}

	async function handleClaim(e){
		e.stopPropagation();
		e.preventDefault();
		let silverIds = [];
		let goldIds = [];
		let crimsonIds = [];
		let diamondIds = [];
		setMintSpinner(true);
		try{

			const responseSilver = await fetch({
				"chain": 1,
				"format": "decimal",
				"tokenAddresses": [
					SilverAddr
				],
				"address": account.address,

			});
			// console.log(responseSilver);

			let tokenIds = responseSilver.data;
			for (let i = 0; i < tokenIds.length; i++) {
				silverIds.push(Number(tokenIds[i].tokenId));
			}
			//console.log(silverIds);


			const responseCrimson = await fetch({
				"chain": 1,
				"format": "decimal",
				"tokenAddresses": [
					CrimsonAddr
				],
				"address": account.address,

			});
			//console.log(responseCrimson);

			tokenIds = responseCrimson.data;
			for (let i = 0; i < tokenIds.length; i++) {
				crimsonIds.push(Number(tokenIds[i].tokenId));
			}
			//console.log(crimsonIds);

			
			const responseDiamond = await fetch({
				"chain": 1,
				"format": "decimal",
				"tokenAddresses": [
					DiamondAddr
				],
				"address": account.address,

			});
			//console.log(responseDiamond);

			tokenIds = responseDiamond.data;
			for (let i = 0; i < tokenIds.length; i++) {
				diamondIds.push(Number(tokenIds[i].tokenId));
			}
			//console.log(diamondIds);


			const responseGold = await fetch({
				"chain": 1,
				"format": "decimal",
				"tokenAddresses": [
					GoldAddr
				],
				"address": account.address,

			});
			//console.log(responseGold);

			tokenIds = responseGold.data;
			for (let i = 0; i < tokenIds.length; i++) {
				goldIds.push(Number(tokenIds[i].tokenId));
			}
			//console.log(goldIds);


			let receipt = await contractInstance.mintDeviants(silverIds,diamondIds,goldIds,crimsonIds);
			await receipt.wait();
			await openWindow();
			setMintSpinner(false)
			Router.reload(window.location.pathname);

		}catch(err){
			//console.log(err);
			window.alert(err.reason)
			setMintSpinner(false)
		}

		setMintSpinner(false);
	}


	async function handlePhase1Mint(e){
		e.stopPropagation();
		e.preventDefault();

		let saleState = await contractInstance.getPhase1Status();

		if(saleState === true){
			setMintSpinner(true);
			if(!ethers.utils.isAddress(account.address)){
				window.alert("PLEASE CONNECT YOUR WALLET");
				setMintSpinner(false);
				return ;
			}

			let proofData;
			let proof;
			try {
				proofData = await fetch(
					`https://mint.deviantsnft.com/api/getProof?address=${account.address}`,
					{method: "GET"}
				)
				proof = await proofData.json();
				if(proof.addProof === "wrongProof"){
					proof.addProof = ['0x1f811a9cb7518df10a6deee74e18069228ae27c810d0627034493587d372a40b','0xcece9763d5bb42a1ebe081dcba4536550695bd4122e39d9e4d62274f71c53c2c','0x11149e463b1deab444438df416c41236ec6b4c088661d45c8c941908e218a534']
				}else if (proof.addProof === null) {
					window.alert("something went wrong with the mint");
					setMintSpinner(false);
					return
				}
				
			} catch (err) {
				if (err) {
					setMintSpinner(false);
					return;
				}
			}
	
			try{
				let receipt = await contractInstance.mintPhase1(
					selectedAmount,
					proof.addProof,
					{value:  ethers.utils.parseEther((0.004 * selectedAmount).toPrecision(4).toString())}
				);
				await receipt.wait();
				await getBal();
				await openWindow();
				Router.reload(window.location.pathname);
			}catch(err){

				if(err.reason)
					window.alert(err.reason)
				else
					window.alert("please try again")
				setMintSpinner(false);

			}
		}		
		setMintSpinner(false);
	};

	async function handlePhase2Mint(e){
		e.stopPropagation();
		e.preventDefault();

		const saleState = await contractInstance.getPhase2Status();

		if(saleState === true){
			setMintSpinner(true);

			let wlStatus ;

			if(wlStatus == 1){
				window.alert("YOU ARE NOT WHITELISTED");
				setMintSpinner(false);
				return;
			}else if(wlStatus ==2){
				window.alert("PLEASE CONNECT YOUR WALLET");
				setMintSpinner(false);
				return
			}
			let proofData;
			let proof;
			try {
				proofData = await fetch(
					`https://mint.deviantsnft.com/api/getProof?address=${account.address}`,
					{method: "GET"}
				)
	
				proof = await proofData.json();
				if(proof.addProof === "wrongProof"){
					window.alert("YOU ARE NOT WHITELISTED");
					setMintSpinner(false);
					return;
				}else if (proof.addProof === null) {
					window.alert("something went wrong with the mint");
					setMintSpinner(false);
					return
				}
				
			} catch (err) {
				if (err) {
					setMintSpinner(false);
					return;
				}
			}
	
			try{
				const bal = await contractInstance.balanceOf(account.address);
				
				try{
					let receipt = await contractInstance.mintPhase2(
						selectedAmount,
						proof.addProof,
						{value:  ethers.utils.parseEther((0.004 * selectedAmount).toPrecision(4).toString())}
					);
					await receipt.wait();
					await getBal();
					await openWindow();
					Router.reload(window.location.pathname);
				}catch(err){
					if(err.reason)
						window.alert(err.reason)
					else
						window.alert("please try again")

					setMintSpinner(false);
				}

			}catch(err){
				//console.log(err);
			}

		}		

		setMintSpinner(false);

	};

	useEffect(() => {
		//console.log("hereeee");
		try {
			checkApprovalStatus();
			getBal();

		} catch (e) {
			console.log("ssss Useeff")
		}
		return () => {};
	}, [account, amountSold]);

	// useEffect(()=>{
	// 	console.log("useEffffff")
	// 	checkApprovalStatus2();
	// },[])

	// useEffect(()=>{
	// 	try{
	// 		let getData = async()=>{
	// 			await checkApprovalStatus();
	// 			await getUserBalances();
	// 		}
	// 		getData();
	
	// 	}catch(e){
	// 		window.alert("show")
	// 	}
	// 	return () => {};

	// },[account])

	function handleAddr(e) {
		e.stopPropagation();
		e.preventDefault();
		setUserAddr(e.target.value.toLowerCase());
	}

	return (
		<>
		<head>
			<title>Deviants Crimson Pass</title>
		</head>
			<Background style={{ minHeight: "100vh",  objectFit: "cover"}}>
				<Navbar />

				<div className="flex mt-40 h-full relative float-right mr-2 align-middle md:justify-end">
					<ul>
						{socials?.map((item) => (
							<li key={item.name}>
								<a href={item.href} target="_blank">
									<img
										className="w-8 m-2"
										src={item.icon}
										alt={item.name}
									/>
								</a>
							</li>
						))}
					</ul>
				</div>

				<div className="w-full h-full flex flex-col justify-center bottom-0 text-center items-center">

					  {/* <div className="w-full relative flex justify-center text-center items-center">
						<div className="bg-black w-96 border rounded-2xl  border-black">
							<div className="text-white w-auto mt-8 h-auto whitespace-pre font-bold text-2xl">
								Whitelist Checker
							</div>

							<div className="text-gray-500 text-sm w-auto text-center mt-6 h-auto whitespace-pre font-bol">
								Please enter your wallet address to check your
								status
							</div>
							<div className="text-center mt-4 mb-2 p-5 ">
								<input
									type="text"
									placeholder="Wallet Address"
									className="bg-gray-800 w-full text-white hover:bg-gray-900 px-2 py-2 rounded-lg font-thin mb-2"
									onChange={(e) => handleAddr(e)}
								/>

								{isHidden ? (
									<div className="text-gray-300 text-sm w-auto text-center mt-4 h-auto whitespace-pre font-bol"></div>
								) : whitelisted ? (
									<>
										<div
											id="wlStatus"
											className="ml-2 mt-2"
											style={{ color: "#3DDBA9" }}
										>
											✅ Congratulations, you are
											whitelisted!
										</div>
									</>
								) : (
									<>
										<div
											id="wlStatus"
											style={{ color: "#FE3301" }}
											className="ml-2 mt-2 mb-2"
										>
											❌ Sorry, you are not on the
											whitelist.
										</div>
									</>
								)}

								<button
									onClick={() => verify()}
									style={{ backgroundColor: "#FE3301" }}
									className="text-black mb-1 w-36 py-2 px-1 border-red-500 rounded-3xl text-base hover:bg-red-400"
								>
									Check Address
								</button>
							</div>
						</div>
					</div>  */}

					<div className="w-full h-full flex justify-center text-center items-center">
						<div
							className="bottom-10 w-full fixed inline-flex items-center justify-center text-center"
							style={{ width: "494px", height: "439px" }}
						>
							<div className="bg-black w-96 border rounded-2xl bottom-5 border-black">
								<div className="text-white w-auto mt-8 h-auto whitespace-pre font-bolb text-2xl">
									 Deviants Collection
								</div>
								<div className="text-white mt-3 p-5 grid grid-cols-1 ">
									<CircularProgressbar
										styles={buildStyles({
											pathColor: "#FE3301",
											trailColor: "#132135",
											textColor: "#FE3301",
										})}
										className="h-28 w-28"
										value={amountSold}
										maxValue={9700}
										text={`${(
											(amountSold / 9700) *
											100
										).toPrecision(3)}%`}
									></CircularProgressbar>
									<p className="text-md mt-1 text-slate-500">
										{amountSold}/9700 already claimed
									</p>
									<p className="text-md mt-2 text-slate-500">
										Available to claim: {holderBalance} 
									</p>
								</div>
								<div className="justify-between flex "></div>
								<div className="">
									<div className="flex flex-col h-full justify-between">
										<div className="flex flex-row items-center justify-center">

										<div className="flex flex-col items-center justify-center mr-5">
										{
									approveSilverSpinner === true ?
										<button disabled type="button" className="text-black mb-2 mt-2 w-36 py-2 px-1 bg-red rounded-3xl text-base hover:bg-red disabled:bg-slate-800 ">
											<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-black animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
											<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
											</svg>
										Approving...
										</button>	:

									<button
										className="text-black mb-2 mt-2 w-36 py-2 px-1 bg-red rounded-3xl text-sm hover:bg-red-400 disabled:bg-slate-800 disabled:cursor-not-allowed"
										onClick={(e) => approveSilver(e)}
										disabled={ approvedSilver }
										>
										Approve Silver
									</button> 

									}
									
									{
									approveGoldSpinner === true ?
										<button disabled type="button" className="text-black mb-8 mt-2 w-36 py-2 px-1 bg-red rounded-3xl text-base hover:bg-red disabled:bg-slate-800 ">
											<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-black animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
											<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
											</svg>
											Approving...
										</button>	:

									<button
										className="text-black mb-8 mt-2 w-36 py-2 px-1 bg-red rounded-3xl text-sm hover:bg-red-400 disabled:bg-slate-800 disabled:cursor-not-allowed"
										onClick={(e) => approveGold(e)}
										disabled={  approvedGold }
										>
										Approve Gold
									</button> 

									}
									</div>

								<div className="flex flex-col items-center justify-center">

									{
									approveDiamondSpinner === true ?
										<button disabled type="button" className="text-black mb-2 mt-2 w-36 py-2 px-1 bg-red rounded-3xl text-base hover:bg-red disabled:bg-slate-800 ">
											<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-black animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
											<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
											</svg>
										Approving...
										</button>	:

									<button
										className="text-black mb-2 mt-2 w-36 py-2 px-1 bg-red rounded-3xl text-sm hover:bg-red-400 disabled:bg-slate-800 disabled:cursor-not-allowed"
										onClick={(e) => approveDiamond(e)}
										disabled={  approvedDiamond }
										>
										Approve Diamond
									</button> 

									}

									{
									approveCrimsonSpinner === true ?
										<button disabled type="button" className="text-black mb-8 mt-2 w-36 py-2 px-1 bg-red rounded-3xl text-base hover:bg-red disabled:bg-slate-800 ">
											<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-black animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
											<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
											</svg>
										Approving...
										</button>	:

									<button
										className="text-black mb-8 mt-2 w-36 py-2 px-1 bg-red rounded-3xl text-sm hover:bg-red-400 disabled:bg-slate-800 disabled:cursor-not-allowed"
										onClick={(e) => approveCrimson(e)}
										disabled={  approvedCrimson }
										>
										Approve Crimson
									</button> 

									}
									</div>

									
										</div>
									</div>
									{/* {balance === 1 ? (
										<div className="text-xl my-1 text-white text-center">
											Total Cost: {0.0035}Ξ{" "}
											<div className="inline-flex text-slate-500">
												(
												{`$${(
													ethPrice * 0.0035
												).toPrecision(3)} USD`}
												)
											</div>
										</div>
									) : (
										<div className="text-xl my-1 text-white text-center">
											Total Cost: {price ? price : 0}Ξ{" "}
											<div className="inline-flex text-slate-500">
												(
												{`$${(
													ethPrice * price
												).toPrecision(3)} USD`}
												)
											</div>
										</div>
									)} */}

										{/* <div className="text-xl my-1 text-white text-center">
											Total Cost: {(0.004 * selectedAmount).toPrecision(3) }Ξ{" "}
											<div className="inline-flex text-slate-500">
												(
												{`$${(
													ethPrice * 0.004 * selectedAmount
												).toPrecision(3)} USD`}
												)
											</div>
										</div> */}

									{
									mintSpinner === true ?
										<button disabled type="button" className="text-black mb-8 mt-2 w-36 py-2 px-1 bg-red rounded-3xl text-base hover:bg-red disabled:bg-slate-800 ">
											<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-black animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
											<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
											</svg>
										Claiming...
										</button>	:

									<button
										className="text-black mb-8 mt-2 w-36 py-2 px-1 bg-red rounded-3xl text-base hover:bg-red-400 disabled:bg-slate-800 disabled:cursor-not-allowed"
										onClick={(e) => handleClaim(e)}
										disabled={  !(approvedSilver && approvedGold && approvedDiamond && approvedCrimson) }
										>
										Claim Now
									</button> 

									}								
								</div>
							</div>
						</div>
					</div>
				</div>
			</Background>
		</>
	);
}
