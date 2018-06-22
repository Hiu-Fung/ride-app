import React, { Component } from 'react';
import { 
    AsyncStorage, 
    Text, 
    Button, 
    View, 
    TextInput, 
    StyleSheet 
} from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { TOKEN_KEY } from '../constants';

const styles = StyleSheet.create({
    field: {
        borderBottomWidth: 1,
        fontSize: 20,
        marginBottom: 15,
        height: 35,
    },
});

const defaultState = {
    values: {
        email: '',
        password: '',
    },
    errors: {
        name: '',
        email: ''
    },
    isSubmitting: false,
}

class Login extends Component {
    state = defaultState;

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
    }

    onChangeText (field, value) {
        this.setState(state => ({
            values: {
                ...state.values,
                [field]: value,
            },
        }));
    };

    async submit() {
        if (this.state.isSubmitting) {
            return;
        }

        this.setState({ isSubmitting: true });
        let response, emailOrPassword = '';

        try {
            response = await this.props.mutate({
                variables: this.state.values,
            });
        } catch (err) {

            console.log('err');
            console.log(err.message);
            emailOrPassword = 'Incorrect email or password';

            this.setState({
                errors: {
                    emailOrPassword
                },
                isSubmitting: false
            });

            return;
        }

        await AsyncStorage.setItem(TOKEN_KEY, response.data.login.token);
        this.setState(defaultState);
        this.props.history.push('/products');
    };

    goToSignup() {
        this.props.history.push('/signup');
    }

    render() {
        const { errors, values: { email, password } } = this.state;

        return (
            <View
                style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
            >
                <View style={{ width: 200 }}>
                    {errors.emailOrPassword !== '' && <Text style={{ color: 'red' }}>{errors.emailOrPassword}</Text>}
                    <TextInput
                        onChangeText={this.onChangeText.bind(this, 'email')}
                        value={email}
                        style={styles.field}
                        placeholder="email"
                    />
                    <TextInput
                        onChangeText={this.onChangeText.bind(this, 'password')}
                        value={password}
                        style={styles.field}
                        placeholder="password"
                        secureTextEntry
                    />
                    <Button title="Login" onPress={this.submit} />
                    <Text style={{ textAlign: 'center' }}>or</Text>
                    <Button title="Signup" onPress={this.goToSignup.bind(this)} />
                </View>
            </View>
        );
    }
}

const loginMutation = gql`
    mutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                name,
                email,
                posts {
                    title,
                    text
                }
            }
        }
    }
`;

export default graphql(loginMutation)(Login);