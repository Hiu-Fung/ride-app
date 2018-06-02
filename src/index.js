import React from 'react';
import { AsyncStorage } from 'react-native';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient, InMemoryCache } from 'apollo-boost';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from 'apollo-link-context';
import { BASE_URL, TOKEN_KEY } from './constants';

import Routes from './routes';

const authLink = setContext(async (_, { headers }) => {
   const token = await AsyncStorage.getItem(TOKEN_KEY);
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(createUploadLink({ uri: BASE_URL })),
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