import React from 'react';
import { AsyncStorage, Text, Button, View, TextInput, Image, StyleSheet } from 'react-native';
// import Permissions from 'react-native-permissions';
import { ImagePicker, Permissions } from 'expo';
import { graphql } from 'react-apollo';
import { ReactNativeFile } from 'apollo-upload-client';
import gql from 'graphql-tag';
import { productsQuery } from './Products';
import Form from '../components/Form';

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
        price: '',
        pictureUrl: '',
  },
	errors: {
		name: '',
		email: ''
	},
	isSubmitting: false,
};

class NewProduct extends React.Component {
    state = defaultState;

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
    }
    
    async pickImage() {
        const { photoPermission } = this.state;
        // if ( photoPermission !== 'authorized' ) {
        //     try {
        //         const permissionResp = await Permissions.request('photo');
        //
        //         // Returns once the user has chosen to 'allow' or to 'not allow' access
        //         // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
        //         console.log('permissionResp');
        //         console.log(permissionResp);
        //         this.setState({photoPermission: permissionResp});
        //     } catch (err) {
        //         console.log('permission err');
        //         console.log(err);
        //     }
        // }
        try {
            await this.askPermissionsAsync();
        } catch(err) {
            console.log('err1');
            console.log(err);
            return;
        }

        let result;
        try {
            result = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: false,
              aspect: [4, 3],
            });
        } catch(err) {
            console.log('err');
            console.log(err);
            return;
        }

        if (!result.cancelled) {
            console.log('result.uri');
            console.log(result.uri);
            this.onChangeText('pictureUrl', result.uri);
        }
    };

    async askPermissionsAsync() {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        // you would probably do something to verify that permissions
        // are actually granted, but I'm skipping that for brevity
    };

    async submit(values) {
        const { pictureUrl, name, price } = values;
        console.log('1');
        console.log(name);
        console.log(price);
        console.log(pictureUrl);
        const picture = new ReactNativeFile({
            uri: pictureUrl,
            type: 'image/png',
            name: 'default-name'
        });
        console.log('2');
        console.log(picture);
        let response;

        try {
            response = await this.props.mutate({
                variables: {
                    name,
                    price,
                    picture
                },
                // update: (store, { data: { createProduct } }) => {
                //     // Read the data from our cache for this query.
                //     console.log('before update readQuery');
                //     const data = store.readQuery({ query: productsQuery });
                //     console.log('after update readQuery');
                //     // Add our comment from the mutation to the end.
                //     data.products.push(createProduct);
                //     // Write our data back to the cache.
                //     store.writeQuery({ query: productsQuery, data });
                // },

            });
        } catch (err) {
            console.log('err from NewProduct.submit');
            console.log(err);
            // this.setState({
            //   errors: {
            //     email: 'Already taken',
            //   },
            //   isSubmitting: false,
            // });
            return;
        }
        // console.log('response');
        // console.log(response);
        // // await AsyncStorage.setItem(TOKEN_KEY, response.data.signup.token);
        // this.setState(defaultState);
        // this.setState({ isSubmitting: false });
        this.props.history.push('/products');
    };

    onChangeText (key, value) {
        this.setState(state => ({
            values: {
                ...state.values,
                [key]: value,
            },
        }));
    };

    render() {
        return <Form submit={this.submit} />;
    }
}

const createProductMutation = gql`
    mutation($name: String!, $price: Float!, $picture: Upload!) {
        createProduct(name: $name, price: $price, picture: $picture) {
            __typename
            id
            name
            price
            pictureUrl
            seller {
                id
            }
        }
    }
`;

export default graphql(createProductMutation)(NewProduct);