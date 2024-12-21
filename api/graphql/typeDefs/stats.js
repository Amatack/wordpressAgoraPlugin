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
        genesisInfo: GenesisInfo
        totalTrades: Float
        lastPrice: LastPrice
    }

    input TokenDataIncludeInput {
        genesisInfo: Boolean
        totalTrades: Boolean
        lastPrice: Boolean
    }

    type Query {
         tokenData(tokenId: String!, include: TokenDataIncludeInput!): TokenData
    }
`;

export default tokenTypeDefs;
