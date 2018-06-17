import React from 'react';
import { AsyncStorage } from 'react-native';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient, InMemoryCache, ApolloLink } from 'apollo-boost';
import { createUploadLink } from 'apollo-upload-client';
import { withClientState } from 'apollo-link-state';
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
    defaults: {
        userId: {
            __typename: 'userId',
            userId: 'defaultId'
        },
    },
    resolvers: {
        Queries: () => ({}),
        Mutation: {
            addUserId: (_, { userId }, { cache }) => {
                console.log('userId');
                console.log(userId);
                const data = {
                    // getUserId: userId
                    userId: {
                        __typename: 'userId',
                        userId,
                    },
                };
                cache.writeData({data});
                console.log('got this far');
                console.log(cache);
                return null;
            },
        },
    },
});

const client = new ApolloClient({
    link: ApolloLink.from([
        authLink,
        stateLink,
        createUploadLink({ uri: BASE_URL }),
        ]),
    cache
});


export default () => (
    <ApolloProvider client={client}>
        <Routes />
    </ApolloProvider>
);