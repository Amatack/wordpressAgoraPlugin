import { ChronikClient } from "chronik-client";
import { Agora } from "ecash-agora";
import { getGenesisInfo } from '../../helpers/getGenesisInfo.js';
import { totalTrades } from '../../helpers/totalTrades.js';
import { lastPrice } from '../../helpers/lastPrice.js';
import { chronikInstances } from '../../constants.js';

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
            return result;
        }
    }
};

export default pluginResolvers;
