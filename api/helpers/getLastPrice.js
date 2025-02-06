import { addDecimalPointFromEnd } from "../utils/addDecimalPointFromEnd.js";
import axios from "axios";

export async function getLastPrice(agora, tokenId){
    try {
        const activeOffers = await agora.activeOffersByTokenId(tokenId)
        let deepestActiveOfferedTokens = 0n;
        //console.log('here 3')
        for (const activeOffer of activeOffers) {
            const maxOfferTokens = BigInt(activeOffer.token.amount);
            if (maxOfferTokens > deepestActiveOfferedTokens) {
                deepestActiveOfferedTokens = maxOfferTokens;
            }

            const askedSats = activeOffer.askedSats(maxOfferTokens);

            // We convert to askedNanoSats before calculating the spot price,
            
            const askedNanoSats = askedSats * BigInt(1e9);

            // Note this price is nanosatoshis per token satoshi
            const spotPriceNanoSatsPerTokenSat =
                askedNanoSats / maxOfferTokens;

            activeOffer.spotPriceNanoSatsPerTokenSat =
                spotPriceNanoSatsPerTokenSat;
            
        }
            //console.log('aqui ')
            activeOffers.sort(
                (a, b) =>
                    Number(a.spotPriceNanoSatsPerTokenSat) -
                    Number(b.spotPriceNanoSatsPerTokenSat),
            );
            //console.log('aqui 2')
            // This variable sorts offers by spot price; so this is the spot offer
            let selectedIndex = 0
            let selectedOffer = activeOffers[selectedIndex];

            //console.log('selectedOffer: ', selectedOffer)

            let takeTokenSatoshis = selectedOffer.variant.params.minAcceptedTokens().toString()

            //console.log('takeTokenSatoshis: ', takeTokenSatoshis)
            const priceOfMinOrderWithoutDecimal = activeOffers[selectedIndex].askedSats(BigInt(takeTokenSatoshis));
            const priceOfMinOrder = addDecimalPointFromEnd(priceOfMinOrderWithoutDecimal, 2)
            let minPriceInXec = Math.round((Number(priceOfMinOrder) / takeTokenSatoshis))
            let xecValue = 0
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ecash&vs_currencies=usd')
                    console.log('new status: ', response.status)
                    if(response.status >= 200 && response.status < 300){
                        xecValue = response.data.ecash.usd
                    }else{
                        console.error('error getting price, HTTP error: ', response.status)
                    }
            } catch (error) {
                console.error('error getting price from coingecko: ', error)
            }
            let minPriceInUsd = minPriceInXec * xecValue 
            return {
                minXecOrder: priceOfMinOrder + " XEC",
                minTokenOrder: takeTokenSatoshis.toString(),
                minPriceInXec: minPriceInXec.toString()+ " XEC",
                minPriceInUsd: !xecValue ? 'Error' : minPriceInUsd.toFixed(5) + " USD"
            }
    } catch (error) {
        console.error('error getting price: ', error)
        return {}
    }
}   