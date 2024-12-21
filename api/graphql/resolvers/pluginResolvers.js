import { ChronikClient } from "chronik-client";
import { Agora } from "ecash-agora";
import { getGenesisInfo } from '../../helpers/getGenesisInfo.js';
import { totalTrades } from '../../helpers/totalTrades.js';
import { lastPrice } from '../../helpers/lastPrice.js';
import { chronikInstances } from '../../constants.js';
import { supply } from "../../helpers/supply.js";
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
                result.lastPrice = await lastPrice(agora, tokenId);
            }
            let decimals = -1
            if('genesisInfo' in result) {
                decimals = result.genesisInfo.decimals
            }
            if (include.supply){
                result.supply = await supply(chronik, tokenId, decimals)
            }
            //Calculate Market Cap of specified etoken
            if (include.marketCap){
                let supply
                let currentPrice
                let minAmount
                if(include.supply){
                    supply=result.supply
                }else{
                    supply=await supply(chronik, tokenId, decimals)
                }
                if(include.lastPrice){
                    currentPrice = result.lastPrice.price
                    minAmount = result.lastPrice.minAmount
                }else{
                    let lastPrice = await lastPrice(agora, tokenId);
                    currentPrice = lastPrice.price
                    minAmount = lastPrice.minAmount
                }
                result.marketCap = await marketCap(supply, currentPrice, minAmount)
            }
            return result;
        }
    }
};

export default pluginResolvers;
