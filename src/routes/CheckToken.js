import React from 'react';
import { AsyncStorage, Text } from 'react-native';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { TOKEN_KEY } from '../constants';

class CheckToken extends React.Component {

    componentDidMount = async () => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        console.log('token');
        console.log(token);

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
        console.log('response');
        console.log(response);
        await AsyncStorage.setItem(TOKEN_KEY, newToken);
        console.log('userId');
        console.log(userId);
        try {
            await this.props.addUserId({ variables: { userId } });
        } catch(err) {
            console.log('err');
            console.log(err);
        }
        console.log('redirect to products');
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