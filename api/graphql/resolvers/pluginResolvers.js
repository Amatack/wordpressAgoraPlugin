import { ChronikClient } from "chronik-client";
import { Agora } from "ecash-agora";
import { getGenesisInfo } from '../../helpers/getGenesisInfo.js';
import { totalTrades } from '../../helpers/totalTrades.js';
import { getLastPrice } from '../../helpers/getLastPrice.js';
import { chronikInstances } from '../../constants.js';
import { getSupply } from "../../helpers/getSupply.js";
import { marketCap } from "../../helpers/marketCap.js";

let chronikInstancesArray = chronikInstances.split(' ');
const chronik = new ChronikClient(chronikInstancesArray);
const agora = new Agora(chronik);

const pluginResolvers = {
    Query: {
        async tokenData(_, { tokenId, include }) {
            const result = {}
            if (include.genesisInfo) {
                result.genesisInfo = await getGenesisInfo(chronik, tokenId);
            }
            if (include.totalTrades) {
                result.totalTrades = await totalTrades(agora, tokenId);
            }
            if (include.lastPrice) {
                result.lastPrice = await getLastPrice(agora, tokenId);
            }
            let decimals = -1
            if('genesisInfo' in result) {
                decimals = result.genesisInfo.decimals
            }
            if (include.supply){
                result.supply = await getSupply(chronik, tokenId, decimals)
            }
            //Calculate Market Cap of specified etoken
            if (include.marketCap){
                let supply
                let currentPrice
                let minTokenOrder
                if(include.supply){
                    console.log("Here")
                    supply=result.supply
                }else{
                    console.log("Here2")
                    supply=await getSupply(chronik, tokenId, decimals)
                }
                if(include.lastPrice){
                    currentPrice = result.lastPrice.minXecOrder
                    minTokenOrder = result.lastPrice.minTokenOrder
                }else{
                    let lastPrice = await getLastPrice(agora, tokenId);
                    currentPrice = lastPrice.minXecOrder
                    minTokenOrder = lastPrice.minTokenOrder
                }
                result.marketCap = await marketCap(supply, currentPrice, minTokenOrder)
            }
            return result;
        }
    }
};

export default pluginResolvers;
