import { addressesArray } from "../../data/data";

export default async function handler(req,res){
    if (req.method !== 'GET') {
        res.status(405).end();
        return;
      }
    

    const { address } = req.query;
    

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    let verified =  await addressesArray.find(item => item.toLowerCase() == address.toLowerCase());
    //console.log(verified);

    if(verified){
    res.status(200).json({stats: address})
    }else{
    res.status(200).json({stats: false})
    }

}