// import fs from 'fs';
// import path from 'path';

// let data = require("data/totalChecked.json")

// export default async function handler(req,res){
//     if (req.method !== 'GET') {
//         res.status(405).end();
//         return;
//       }
    


//     const { address } = req.query;
//     const filePath = path.join(process.cwd(), "/data/totalChecked.json");
//     const addressesCheked = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader("Access-Control-Allow-Methods", "GET");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type");

//     let verified =  await addressesCheked.find(item => item.account == address);
    

//     if(verified){

//     console.log("already in")
//     console.log(addressesCheked)
//     console.log(".........")
//     res.status(200).json(addressesCheked)

//     }else{
    
//     addressesCheked.push({"account":address})
//     console.log("added to list")
//     console.log(addressesCheked)
//     console.log(".........")
    
//     fs.writeFileSync(filePath,JSON.stringify(addressesCheked));

   

//     res.status(200).json(addressesCheked);
//     }

// }