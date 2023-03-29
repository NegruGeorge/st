import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { addressesArray } from "../../data/data2";

// import fs from "fs";


export default async function handler(req,res){
    if (req.method !== 'GET') {
        res.status(405).end();
        return;
      }
    

    const { address } = req.query;
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const tree = StandardMerkleTree.of(addressesArray,["address"]);

    //console.log("Merkle Root:",tree.root);
    try{
        const proof = tree.getProof([address]);
        //console.log(`Proof for ${address}: ` + proof)
        res.status(200).json({addProof: proof})


    }catch(e)
    {
        //console.log("wrong")
        res.status(200).json({addProof: "wrongProof"})

    }


    

}