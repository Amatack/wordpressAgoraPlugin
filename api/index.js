import express from 'express'
import { ApolloServer } from 'apollo-server-express';


import tokenTypeDefs from './graphql/typeDefs/stats.js';
import pluginResolvers from './graphql/resolvers/pluginResolvers.js';
const app = express()


const server = new ApolloServer({
    
    resolvers: pluginResolvers,
    typeDefs: tokenTypeDefs
})

await server.start();

server.applyMiddleware({app, path: '/graphql'})

// Iniciar el servidor
app.listen(4500, () => {
    console.log(`Server running on http://localhost:${4500}`);
});