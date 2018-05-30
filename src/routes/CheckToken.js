import React from 'react';
import { AsyncStorage, Text } from 'react-native';
import { graphql } from 'react-apollo';
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

        const { refreshToken } = response.data;
        console.log('response');
        console.log(response);
        await AsyncStorage.setItem(TOKEN_KEY, refreshToken);
        this.props.history.push('/products');
    }

    render() {
        return (
          <Text>Loading..</Text>
        );
    }
}

const refreshTokenMutation = gql`
    mutation {
        refreshToken
    }    
`;

export default graphql(refreshTokenMutation)(CheckToken);