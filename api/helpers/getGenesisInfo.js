import { addDecimalPointFromEnd } from "../utils/addDecimalPointFromEnd.js"

export async function getGenesisInfo(chronik, tokenId){
    let genesisInfo = {}
    let genesisQty = 0
    const tokenData = await chronik.token(tokenId)
    genesisInfo = tokenData.genesisInfo
    const tokenGenesisTxData = await chronik.tx(tokenId)
    genesisQty = tokenGenesisTxData.outputs[1].token.amount
    genesisInfo.genesisQty = addDecimalPointFromEnd(genesisQty, tokenData.genesisInfo.decimals)
    return genesisInfo
}