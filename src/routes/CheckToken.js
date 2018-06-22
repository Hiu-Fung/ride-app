import React, { Component } from 'react';
import { AsyncStorage, Text } from 'react-native';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { TOKEN_KEY, USER_ID_KEY } from '../constants';

class CheckToken extends Component {
    async componentDidMount() {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        
        if (!token) {
            this.props.history.push('/login');
            return;
        }

        let response;

        try {
            response = await this.props.mutate();
        } catch (err) {
            console.log('err');
            console.log(err);
            this.props.history.push('/login');
            return;
        }

        const { refreshToken: { token: newToken, userId }} = response.data;

        await AsyncStorage.setItem(TOKEN_KEY, newToken);
        await AsyncStorage.setItem(USER_ID_KEY, userId)

        this.props.history.push('/products');
    }

    render() {
        return (
          <Text style={{ marginTop: 50 }}>Loading..</Text>
        );
    }
}

const refreshTokenMutation = gql`
    mutation {
        refreshToken {
            token
            userId
        }
    }    
`;

const addUserMutation = gql`
    mutation($userId: String!) {
        addUserId(userId: $userId) @client
    }
`;

export default compose(
    graphql(refreshTokenMutation),
    graphql(addUserMutation, { name: 'addUserId' })
)(CheckToken);