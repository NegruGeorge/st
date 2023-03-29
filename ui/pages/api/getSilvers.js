import Moralis from 'moralis';

export default async function handler(req,res){
    if (req.method !== 'GET') {
        res.status(405).end();
        return;
      }

    const { address } = req.query;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    let silverIds = [];
    console.log(address);
    try {
        try{
            await Moralis.start({
                apiKey: "T99IPQGoWcbGtW7LYf3XMQ7thXVlt4nU1pT2pYwYYL8g4KXNQ3pj0bobjiMfynPn"
            });
        }
        catch(e){
            console.log('error start');
        }

console.log("here")
        const responseSilver = await Moralis.EvmApi.nft.getWalletNFTs({
            "chain": 137,
            "format": "decimal",
            "tokenAddresses": [
                "0x19349508563fd05d2367408fC6517824fFDc738f"
            ],
            "address": address,
            
        });
        console.log("here1s")

        let tokenIds = responseSilver.result;
        for (let i = 0; i < tokenIds.length; i++) {
            silverIds.push(Number(tokenIds[i].tokenId));
        }
        console.log("her3")

        console.log(silverIds);
        res.status(200).json({tokenIds: silverIds})

    } catch (e) {
        console.error(e);
        res.status(200).json({tokenIds: false})
    }


    // let verified =  await addressesArray.find(item => item.toLowerCase() == address.toLowerCase());
    //console.log(verified);
    // if(verified){
    // res.status(200).json({stats: address})
    // }else{
    // res.status(200).json({stats: false})
    // }

}