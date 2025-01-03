import { addDecimalPointFromEnd } from "../utils/addDecimalPointFromEnd.js";


export async function getSupply(chronik, tokenId, decimals) {

    let tokenUtxos;

    tokenUtxos = await chronik.tokenId(tokenId).utxos();
    let undecimalizedBigIntCirculatingSupply = 0n;
    let mintBatons = 0;
    for (const utxo of tokenUtxos.utxos) {
        // getting utxos by tokenId returns only token utxos
        const { token } = utxo;
        const { amount, isMintBaton } = token;
        undecimalizedBigIntCirculatingSupply += BigInt(amount);
        if (isMintBaton) {
            mintBatons += 1;
        }
    }
    
    const circulatingSupply = undecimalizedBigIntCirculatingSupply.toString()
    if(decimals !== -1){
        //Apply when genesisInfo function executed into resolvers
        console.log('executed one')
        return addDecimalPointFromEnd(circulatingSupply, decimals)
    }else{
        //Apply when there is no genesisInfo executed into resolvers
        console.log('executed two')
        const tokenData = await chronik.token(tokenId)
        let genesisInfo = tokenData.genesisInfo
        return addDecimalPointFromEnd(circulatingSupply, genesisInfo.decimals)
    }
        
}