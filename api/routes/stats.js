import express from 'express';
import { ChronikClient } from "chronik-client"

import { genesisQty } from '../helpers/genesisQty.js';
import {chronikInstances} from '../constants.js'

let chronikInstancesArray = chronikInstances.split(' ')
const chronik = new ChronikClient(chronikInstancesArray)
let tokenId = '7b15aa573ecda8c8737123e0e84589806480025f5cd80b26457ba5168daf6f84'
const router = express.Router();


router.get('/', async (req, res) => {
    

    let Qty = await genesisQty(chronik, tokenId)
    res.status(200).send({'genesisQty':  Qty});
});

export default router;
