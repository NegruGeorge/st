// import fs from 'fs';
// import path from 'path';

// export default async function handler(req,res){
//     if (req.method !== 'GET') {
//         res.status(405).end();
//         return;
//       }
//     const { pass } = req.query;
    
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader("Access-Control-Allow-Methods", "GET");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type");

//     if(pass === "DeviantsFireChain"){
//         const filePath = path.join(process.cwd(), "/data/totalChecked.json");
//         const addressesCheked = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

//         res.status(200).json({counter: addressesCheked.length})
//     }else{
//         res.status(405).end();
//     }

// }