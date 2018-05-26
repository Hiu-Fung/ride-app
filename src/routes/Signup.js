import React from 'react';
import { AsyncStorage, Text, Button, View, TextInput, StyleSheet } from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

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
        name: '',
        email: '',
        password: '',
    },
    errors: {
        name: '',
        email: ''
    },
    isSubmitting: false,
}

class Signup extends React.Component {
    state = defaultState;

    onChangeText = (key, value) => {
        this.setState(state => ({
            values: {
                ...state.values,
                [key]: value,
            },
        }));
    };

    submit = async () => {
        if (this.state.isSubmitting) {
            return;
        }

        this.setState({ isSubmitting: true });
        let response, email = '', name = '';
        try {
            response = await this.props.mutate({
                variables: this.state.values,
            });
        } catch (err) {

            console.log(err);
            if (err.message.includes('unique constraint would be violated on User. Details: Field name = name')) {
                name = 'Name already taken';
            }

            if (err.message.includes('unique constraint would be violated on User. Details: Field name = email')) {
                email = 'Email already taken';
            }

            this.setState({
                errors: {
                    name,
                    email
                },
                isSubmitting: false
            });

            return;
        }

        AsyncStorage.setItem('@ecommerce:token', response.data.signup.token);
        this.setState(defaultState);

        console.log('created');
        const token = await AsyncStorage.getItem('@ecommerce:token');

        console.log('token from asyncStorage');
        console.log(token);
    };

    render() {
        const { errors, values: { name, email, password } } = this.state;

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
                    {errors.name.includes('Name') && <Text style={{ color: 'red' }}>{errors.name}</Text>}
                    <TextInput
                        onChangeText={text => this.onChangeText('name', text)}
                        value={name}
                        style={styles.field}
                        placeholder="name"
                    />
                    {errors.email.includes('Email') && <Text style={{ color: 'red' }}>{errors.email}</Text>}
                    <TextInput
                        onChangeText={text => this.onChangeText('email', text)}
                        value={email}
                        style={styles.field}
                        placeholder="email"
                    />
                    <TextInput
                        onChangeText={text => this.onChangeText('password', text)}
                        value={password}
                        style={styles.field}
                        placeholder="password"
                        secureTextEntry
                    />
                    <Button title="Create account" onPress={this.submit} />
                </View>
            </View>
        );
    }
}

const signUpMutation = gql`
    mutation($name: String!, $email: String!, $password: String!) {
        signup(name: $name, email: $email, password: $password) {
            token,
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

export default graphql(signUpMutation)(Signup);