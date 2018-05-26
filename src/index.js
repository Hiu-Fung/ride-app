import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';

import Routes from './routes';

const client = new ApolloClient({
    link: new HttpLink({ uri: 'http://192.168.2.50:4000' }),
    cache: new InMemoryCache()
});


export default () => (
    <ApolloProvider client={client}>
        <Routes />
    </ApolloProvider>
);

// import gql from "graphql-tag";
//
// client
// .query({
//     query: gql`
//         {
//             rates(currency: "USD") {
//                 currency
//             }
//         }
//     `
// })
// .then(result => console.log(result));