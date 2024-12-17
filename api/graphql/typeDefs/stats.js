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
        price: String
        minAmount: String
    }

    type TokenData {
        genesisInfo: String
        totalTrades: Float
        lastPrice: LastPrice
    }

    type Query {
        tokenData(tokenId: String!): TokenData
        genesisInfo(tokenId: String!): GenesisInfo
        totalTrades(tokenId: String!): Float
        lastPrice(tokenId: String!): LastPrice
    }
`;

export default tokenTypeDefs;
