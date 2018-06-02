import React from 'react';
import { AsyncStorage } from 'react-native';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient, InMemoryCache, ApolloLink } from 'apollo-boost';
import { createUploadLink } from 'apollo-upload-client';
import { withClientState  } from 'apollo-link-state';
import { setContext } from 'apollo-link-context';
import { BASE_URL, TOKEN_KEY } from './constants';

import Routes from './routes';

const cache = new InMemoryCache();

const authLink = setContext(async (_, { headers }) => {
   const token = await AsyncStorage.getItem(TOKEN_KEY);
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        }
    }
});

const stateLink = withClientState({
    cache,
    resolvers: {
        Mutation: {
            addUserId: (_, { userId }, { cache }) => {
                console.log('userId');
                console.log(userId);
                const data = {
                    // getUserId: userId
                    getUserId: {
                        __typename: 'UserId',
                        userId,
                    },
                };
                cache.writeData({ data });
                console.log('got this far');
                console.log(cache);
                return null
            },
        },
    },
    defaults: {
        getUserId: {
            __typename: 'UserId',
            userId: 'testId'
        },
    }
});

const client = new ApolloClient({
    link: ApolloLink.from([
        stateLink,
        authLink.concat(createUploadLink({ uri: BASE_URL })),
        ]),
    cache
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