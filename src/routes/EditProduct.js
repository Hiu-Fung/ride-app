import React from 'react';
import { AsyncStorage, Text, Button, View, TextInput, Image, StyleSheet } from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import { graphql } from 'react-apollo';
import { ReactNativeFile } from 'apollo-upload-client';
import gql from 'graphql-tag';
import { productsQuery } from './Products';
import { BASE_URL } from '../constants';
import Form from '../components/Form';

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
        this.submit = this.submit.bind(this);
    }

    async submit(values) {
        const { pictureUrl, name, price } = values;
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
                // update: (store, { data: { updateProduct } }) => {
                //     // Read the data from our cache for this query.
                //     const data = store.readQuery({ query: productsQuery });
                //     // Add our comment from the mutation to the end.
                //     data.products = data.products.map(x => (x.id === updateProduct.id ? updateProduct : x));
                //     // Write our data back to the cache.
                //     store.writeQuery({ query: productsQuery, data });
                // },

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