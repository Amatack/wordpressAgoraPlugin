import Humanize from 'humanize-plus'; 

export async function marketCap(supply, currentPrice, minAmount) {
    try{
        let currentPriceSplited = currentPrice.split('XEC')
        const currentPriceIntegerPartSplited = currentPriceSplited[0].split('.');
        const currentPriceIntegerPart = currentPriceIntegerPartSplited[0] + currentPriceIntegerPartSplited[1]
        
        const SatsPerToken = Number(currentPriceIntegerPart) / minAmount
        
        const supplyIntegerPart = supply.complete.split('.')[0];
        
        const floatMarketCap = supplyIntegerPart * SatsPerToken
        const completeMarketCap = floatMarketCap.toFixed(2) + " XEC";
        
        return {
            complete: completeMarketCap,
            minimalist: Humanize.compactInteger(floatMarketCap, 2) + " XEC"
        }
    }catch(error){
        console.error('error getting price: ', error)
        return {}
    }

}