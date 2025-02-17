import Humanize from 'humanize-plus';
import { addDecimalPointFromEnd } from "../utils/addDecimalPointFromEnd.js";

export async function getSupply(chronik, tokenId, decimals) {
    try {
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
            let circulatingSupplyWithDecimals = addDecimalPointFromEnd(circulatingSupply, decimals)
            let humanizeCirculatingSupply = Humanize.compactInteger(circulatingSupplyWithDecimals, 2)
            if (humanizeCirculatingSupply.includes('.00')) {
                // If finish in ".00", we delete  the decimals
                return {
                    complete: String(circulatingSupplyWithDecimals),
                    minimalist: humanizeCirculatingSupply.replace('.00', ''),
                }
                
            }
            return {
                complete: String(circulatingSupplyWithDecimals),
                minimalist: humanizeCirculatingSupply
            }
        }else{
            //Apply when there is no genesisInfo executed into resolvers
            console.log('executed two')
            const tokenData = await chronik.token(tokenId)
            let genesisInfo = tokenData.genesisInfo
            let circulatingSupplyWithDecimals = addDecimalPointFromEnd(circulatingSupply, genesisInfo.decimals)
            let humanizeCirculatingSupply = Humanize.compactInteger(circulatingSupplyWithDecimals, 2)
            if (humanizeCirculatingSupply.includes('.00')) {
                // If finish in ".00", we delete  the decimals
                return {
                    complete: String(circulatingSupplyWithDecimals),
                    minimalist: humanizeCirculatingSupply.replace('.00', ''),
                }
                
            }
            return {
                complete: String(circulatingSupplyWithDecimals),
                minimalist: humanizeCirculatingSupply
            }
        }
    } catch (error) {
        console.error('error getting price: ', error)
        return {}
    }
}