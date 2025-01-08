export async function getTotalTxs(chronik, tokenId) {
    let tokenInfo = await chronik.tokenId(tokenId);
    let totalTokenTxsConfirmed = await tokenInfo.confirmedTxs()
    let totalTokenTxsUnconfirmed = await tokenInfo.unconfirmedTxs()
    return totalTokenTxsConfirmed.numTxs + totalTokenTxsUnconfirmed.numTxs
}