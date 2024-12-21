export async function marketCap(supply, currentPrice, minAmount) {
    let currentPriceSplited = currentPrice.split('XEC')
    const currentPriceIntegerPartSplited = currentPriceSplited[0].split('.');
    const currentPriceIntegerPart = currentPriceIntegerPartSplited[0] + currentPriceIntegerPartSplited[1]
    
    const SatsPerToken = Number(currentPriceIntegerPart) / minAmount
   
    const supplyIntegerPart = supply.split('.')[0];
    
    const floatMarketCap = supplyIntegerPart * SatsPerToken
    return floatMarketCap.toFixed(2);

}