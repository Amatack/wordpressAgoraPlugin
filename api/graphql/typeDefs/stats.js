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
        minPrice: String
    }

    type TokenData {
        genesisInfo: GenesisInfo
        totalTrades: Float
        lastPrice: LastPrice
        supply: String
        marketCap: String
    }

    input TokenDataIncludeInput {
        genesisInfo: Boolean
        totalTrades: Boolean
        lastPrice: Boolean
        supply: Boolean
        marketCap: Boolean
    }

    type Query {
         tokenData(tokenId: String!, include: TokenDataIncludeInput!): TokenData
    }
`;

export default tokenTypeDefs;
