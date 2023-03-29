import fs from 'fs';
import path from 'path';
import { initializeApp } from "firebase/app";
import { getFirestore ,collection,addDoc, getDocs,query,where, QuerySnapshot,setDoc,doc} from "firebase/firestore";
import { ethers } from "ethers";

export default async function handler(req,res){
    if (req.method !== 'GET') {
        res.status(405).end();
        return;
      }
console.log(process.env.APIKEY)
      const firebaseConfig = {
        apiKey: "AIzaSyAFXKl7e7oif_wf2oTOapyKKgKooyXvrZc",
        authDomain: "deviantssilver.firebaseapp.com",
        projectId: "deviantssilver",
        storageBucket: "deviantssilver.appspot.com",
        messagingSenderId: "948626590621",
        appId: "1:948626590621:web:d2155383b3309ff202fd74",
        measurementId: "G-8G5QWY56JF"
      };
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
       
    
    const { address } = req.query;
    console.log(address)
    // const filePath = path.join(process.cwd(), "/data/totalChecked.json");
    // const addressesCheked = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if(ethers.utils.isAddress(address)){
      try {
        const docRef = await setDoc(doc(db, 'accounts',address), {
         state:true
        });
        console.log("Document written with ID: ", address);    
        res.status(200).json("sent")
      
      } catch (e) {
        console.error("Error adding document: ", e);
        res.status(200).json("error")
      
      }
    }else{
      res.status(200).json("wrong eth address")
    }



}