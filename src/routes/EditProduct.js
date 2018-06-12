import React from 'react';
import { AsyncStorage, Text, Button, View, TextInput, Image, StyleSheet } from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import { graphql } from 'react-apollo';
import { ReactNativeFile } from 'apollo-upload-client';
import gql from 'graphql-tag';
import { productsQuery } from './Products';
import { BASE_URL, USER_ID_KEY } from '../constants';
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

class EditProduct extends React.Component {
    state = defaultState;
    
    constructor(props) {
        super(props);
    }

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

    submit = async (values) => {
        const { id, pictureUrl, name, price } = values;
        let picture = null;

        const { state } = this.props.location;

        if (state.pictureUrl !== pictureUrl) {
            picture = new ReactNativeFile({
                uri: pictureUrl,
                type: 'image/png',
                name: 'default-name'
            });

        }

        let response;

        try {
            response = await this.props.mutate({
                variables: {
                    id: state.id,
                    name,
                    price,
                    picture
                },
                update: (store, { data: { updateProduct } }) => {
                    // Read the data from our cache for this query.
                    const data = store.readQuery({ query: productsQuery });
                    // Add our comment from the mutation to the end.
                    data.products = data.products.map(x => (x.id === updateProduct.id ? updateProduct : x));
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

        this.props.history.push('/products');
    };

    // submit = async () => {
    //     if (this.state.isSubmitting) {
    //         return;
    //     }
    //
    //     this.setState({ isSubmitting: true });
    //     const { id, pictureUrl, name, price } = this.state.values;
    //
    //     const picture = new ReactNativeFile({
    //         uri: pictureUrl,
    //         type: 'image/png',
    //         name: 'default-name'
    //     });
    //
    //     let response;
    //
    //     try {
    //         response = await this.props.mutate({
    //             variables: {
    //                 id,
    //                 name,
    //                 price,
    //                 picture
    //             },
    //             update: (store, { data: { createProduct } }) => {
    //                 // Read the data from our cache for this query.
    //                 const data = store.readQuery({ query: productsQuery });
    //                 // Add our comment from the mutation to the end.
    //                 data.products.push(createProduct);
    //                 // Write our data back to the cache.
    //                 store.writeQuery({ query: productsQuery, data });
    //             },
    //
    //         });
    //     } catch (err) {
    //         console.log('err');
    //         console.log(err);
    //         // this.setState({
    //         //   errors: {
    //         //     email: 'Already taken',
    //         //   },
    //         //   isSubmitting: false,
    //         // });
    //         // return;
    //     }
    //     console.log('response');
    //     console.log(response);
    //
    //     this.props.history.push('/products');
    // };

    onChangeText = (key, value) => {
        this.setState(state => ({
            values: {
                ...state.values,
                [key]: value,
            },
        }));
    };

    render() {
        // const { state: { name, pictureUrl, price } } = this.props.location;
        const { state } = this.props.location;
        const { errors } = this.state;


        return (
            <Form
                values={{
                    ...state,
                    pictureUrl: `${BASE_URL}/${state.pictureUrl}`,
                    price: `${state.price}`
                }}
                buttonTitle='Edit Product'
                submit={this.submit}
            />
        );
        // return (
        //     <View
        //         style={{
        //             flex: 1,
        //             display: 'flex',
        //             justifyContent: 'center',
        //             alignItems: 'center',
        //         }}
        //     >
        //         <View style={{ width: 200 }}>
        //             {errors.name.includes('Name') && <Text style={{ color: 'red' }}>{errors.name}</Text>}
        //             <TextInput
        //                 onChangeText={this.onChangeText.bind(this, 'name')}
        //                 value={name}
        //                 style={styles.field}
        //                 placeholder="name"
        //             />
        //             {errors.email.includes('Price') && <Text style={{ color: 'red' }}>{errors.Price}</Text>}
        //             <TextInput
        //                 onChangeText={this.onChangeText.bind(this, 'price')}
        //                 value={price.toString()}
        //                 style={styles.field}
        //                 placeholder="price"
        //             />
        //             <Button title="Pick an image from camera roll" onPress={this.pickImage} />
        //             {pictureUrl ? (
        //                 <Image source={{ uri: pictureUrl }} style={{ width: 200, height: 200 }} />
        //             ) : null}
        //             <Button title="Add Product" onPress={this.submit} />
        //         </View>
        //     </View>
        // );
    }
}

const editProductMutation = gql`
    mutation($id: ID!, $name: String, $price: Float, $picture: Upload) {
        updateProduct(id: $id, name: $name, price: $price, picture: $picture) {
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

export default graphql(editProductMutation)(EditProduct);