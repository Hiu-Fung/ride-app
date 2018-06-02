import React from 'react';
import { AsyncStorage, Text, Button, View, TextInput, Image, StyleSheet } from 'react-native';
// import Permissions from 'react-native-permissions';
import { ImagePicker, Permissions } from 'expo';
import { graphql } from 'react-apollo';
import { ReactNativeFile } from 'apollo-upload-client';
import gql from 'graphql-tag';
import { productsQuery } from './Products';

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

    pickImage = async () => {
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
        await this.askPermissionsAsync();

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

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        // you would probably do something to verify that permissions
        // are actually granted, but I'm skipping that for brevity
    };

    submit = async () => {
        if (this.state.isSubmitting) {
            return;
        }

        this.setState({ isSubmitting: true });
        const { pictureUrl, name, price } = this.state.values;

        const picture = new ReactNativeFile({
            uri: pictureUrl,
            type: 'image/png',
            name: 'default-name'
        });

        let response;

        try {
            response = await this.props.mutate({
                variables: {
                    name,
                    price,
                    picture
                },
                update: (store, { data: { createProduct } }) => {
                    // Read the data from our cache for this query.
                    const data = store.readQuery({ query: productsQuery });
                    // Add our comment from the mutation to the end.
                    data.products.push(createProduct);
                    // Write our data back to the cache.
                    store.writeQuery({ query: productsQuery, data });
                },

            });
        } catch (err) {
            console.log('err');
            console.log(err);
            // this.setState({
            //   errors: {
            //     email: 'Already taken',
            //   },
            //   isSubmitting: false,
            // });
            // return;
        }
        console.log('response');
        console.log(response);
        // await AsyncStorage.setItem(TOKEN_KEY, response.data.signup.token);
        this.setState(defaultState);
        this.setState({ isSubmitting: false });
        this.props.history.push('/products');
    };

    onChangeText = (key, value) => {
        this.setState(state => ({
            values: {
                ...state.values,
                [key]: value,
            },
        }));
    };

    render() {
        const { values: { name, pictureUrl, price }, errors } = this.state;

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
                    onChangeText={this.onChangeText.bind(this, 'name')}
                    value={name}
                    style={styles.field}
                    placeholder="name"
                />
                {errors.email.includes('Price') && <Text style={{ color: 'red' }}>{errors.Price}</Text>}
                <TextInput
                    onChangeText={this.onChangeText.bind(this, 'price')}
                    value={price}
                    style={styles.field}
                    placeholder="price"
                />
            <Button title="Pick an image from camera roll" onPress={this.pickImage} />
            {pictureUrl ? (
            <Image source={{ uri: pictureUrl }} style={{ width: 200, height: 200 }} />
            ) : null}
            <Button title="Add Product" onPress={this.submit} />
            </View>
          </View>
        );
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