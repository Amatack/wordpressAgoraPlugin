import Humanize from 'humanize-plus';

export async function getTotalTxs(chronik, tokenId) {
    try {
    let tokenInfo = await chronik.tokenId(tokenId);
        let totalTokenTxsConfirmed = await tokenInfo.confirmedTxs()
        let totalTokenTxsUnconfirmed = await tokenInfo.unconfirmedTxs()

        let totalTxs = totalTokenTxsConfirmed.numTxs + totalTokenTxsUnconfirmed.numTxs
        let humanizeTotalTxs = Humanize.compactInteger(totalTxs, 2)

        if (humanizeTotalTxs.includes('.00')) {
            // If finish in ".00", we delete  the decimals
            return {
                complete: totalTxs,
                minimalist: humanizeTotalTxs.replace('.00', ''),
            }
        }
        return {
            complete: totalTxs,
            minimalist: humanizeTotalTxs
        }
    } catch (error) {
        console.error('error getting price: ', error)
        return {}
    }
}