import { addDecimalPointFromEnd } from "../utils/addDecimalPointFromEnd.js";

export async function lastPrice(agora, tokenId){
    let currentOrder = {}
    try {
        const activeOffers = await agora.activeOffersByTokenId(tokenId)
        let deepestActiveOfferedTokens = 0n;
        console.log('aqui 3')
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
            activeOffer.maxOfferTokens = maxOfferTokens
            activeOffer.totalAskedSats = askedSats;
            
        }
            console.log('aqui ')
            activeOffers.sort(
                (a, b) =>
                    Number(a.spotPriceNanoSatsPerTokenSat) -
                    Number(b.spotPriceNanoSatsPerTokenSat),
            );
            console.log('aqui 2')
            // This variable sorts offers by spot price; so this is the spot offer
            let selectedIndex = 0
            let selectedOffer = activeOffers[selectedIndex];

            console.log('selectedOffer: ', selectedOffer)

            let takeTokenSatoshis = activeOffers[selectedIndex].variant.params.minAcceptedTokens().toString()

            console.log('takeTokenSatoshis: ', takeTokenSatoshis)
            const priceInSatsOfMinOrder = (activeOffers[selectedIndex].totalAskedSats * BigInt(takeTokenSatoshis)) / activeOffers[selectedIndex].maxOfferTokens 
            const priceInXecOfMinOrder = addDecimalPointFromEnd(priceInSatsOfMinOrder, 2)
            return currentOrder = {
                price: priceInXecOfMinOrder + " XEC",
                minAmount: takeTokenSatoshis.toString()
            }
    } catch (error) {
        return currentOrder 
    }
}   