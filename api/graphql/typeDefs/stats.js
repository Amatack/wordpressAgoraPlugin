import { gql } from 'apollo-server-express';

const tokenTypeDefs = gql`
    type GenesisInfo {
        tokenTicker: String
        tokenName: String
        url: String
        decimals: Int
        hash: String
        genesisQty: String
    }

    type LastPrice {
        minXecOrder: String
        minTokenOrder: String
        minPriceInXec: String
        minPriceInUsd: String
    }

    type TotalTxs {
        complete: String
        minimalist: String
    }

    type MarketCap {
        complete: String
        minimalist: String
    }

    type Supply {
        complete: String
        minimalist: String
    }

    type TokenData {
        genesisInfo: GenesisInfo
        totalTrades: Float
        lastPrice: LastPrice
        supply: Supply
        marketCap: MarketCap
        totalTxs: TotalTxs
    }

    input TokenDataIncludeInput {
        genesisInfo: Boolean
        totalTrades: Boolean
        lastPrice: Boolean
        supply: Boolean
        marketCap: Boolean
        totalTxs: Boolean
    }

    type Query {
         tokenData(tokenId: String!, include: TokenDataIncludeInput!): TokenData
    }
`;

export default tokenTypeDefs;
