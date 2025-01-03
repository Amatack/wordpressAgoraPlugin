import { addDecimalPointFromEnd } from "../utils/addDecimalPointFromEnd.js";

export async function getLastPrice(agora, tokenId){
    let currentOrder = {}
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
            let minPrice = Math.round((Number(priceOfMinOrder) / takeTokenSatoshis))
            
            return currentOrder = {
                minXecOrder: priceOfMinOrder + " XEC",
                minTokenOrder: takeTokenSatoshis.toString(),
                minPrice: minPrice.toString() + " XEC"
            }
    } catch (error) {
        return currentOrder 
    }
}   