import { addDecimalPointFromEnd } from "../utils/addDecimalPointFromEnd.js"

export async function genesisQty(chronik, tokenId){
    let genesisQty = 0
    const tokenData = await chronik.token(tokenId)
    const tokenGenesisTxData = await chronik.tx(tokenId)
    genesisQty = tokenGenesisTxData.outputs[1].token.amount
    return genesisQty = addDecimalPointFromEnd(genesisQty, tokenData.genesisInfo.decimals)
}