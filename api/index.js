import express from 'express'
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors'

import tokenTypeDefs from './graphql/typeDefs/stats.js';
import pluginResolvers from './graphql/resolvers/pluginResolvers.js';
const app = express()

app.use(cors())

const server = new ApolloServer({
    
    resolvers: pluginResolvers,
    typeDefs: tokenTypeDefs,
    persistedQueries: {
        cache: "bounded", // Configure a limited caché 
    },
    introspection: true, // Habilita la introspección
    playground: true,
})

await server.start();

server.applyMiddleware({app, path: '/graphql'})

// Iniciar el servidor
app.listen(4500, () => {
    console.log(`Server running on http://localhost:${4500}`);
});