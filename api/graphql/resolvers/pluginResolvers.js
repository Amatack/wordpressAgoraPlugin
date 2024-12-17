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
        async tokenData(_, { tokenId }) {
            const genesisInfo = await getGenesisInfo(chronik, tokenId);
            const trades = await totalTrades(agora, tokenId);
            const currentOrder = await lastPrice(agora, tokenId);
        return {
            genesisInfo,
            totalTrades: trades,
            lastPrice: currentOrder,
            };
        },
        async genesisInfo(_, { tokenId }) {
        return await getGenesisInfo(chronik, tokenId);
        },
        async totalTrades(_, { tokenId }) {
        return await totalTrades(agora, tokenId);
        },
        async lastPrice(_, { tokenId }) {
        return await lastPrice(agora, tokenId);
        },
    },
};

export default pluginResolvers;
