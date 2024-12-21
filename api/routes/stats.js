import express from 'express';
import { ChronikClient } from "chronik-client"
import { Agora } from "ecash-agora";

import { getGenesisInfo } from '../helpers/getGenesisInfo.js';
import { totalTrades } from '../helpers/totalTrades.js';
import {chronikInstances} from '../constants.js'
import { lastPrice } from '../helpers/lastPrice.js';

let chronikInstancesArray = chronikInstances.split(' ')
const chronik = new ChronikClient(chronikInstancesArray)
const agora = new Agora(chronik);
let tokenId = 'aed861a31b96934b88c0252ede135cb9700d7649f69191235087a3030e553cb1'
const router = express.Router();


router.get('/', async (req, res) => {
    let genesisInfo = await getGenesisInfo(chronik, tokenId)
    let trades = await totalTrades(agora, tokenId)
    let currentOrder = await lastPrice(agora, tokenId)
    res.status(200).send({genesisInfo, 'totalTrades': trades, 'lastPrice': currentOrder});
});

export default router;
