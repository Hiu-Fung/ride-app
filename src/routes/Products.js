import React from 'react';
import { AsyncStorage, Text, TextInput, View, Button, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { BASE_URL, USER_ID_KEY } from '../constants';

const styles = StyleSheet.create({
    images: {
        height: 100,
        width: 100,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        margin: 10,
    },
    right: {
        marginLeft: 10,
        marginRight: 20,
        flex: 1,
        display: 'flex',
        alignItems: 'flex-end',
    },
    name: {
        fontSize: 30,
    },
    price: {
        fontSize: 40,
    },
    editSection: {
        display: 'flex',
        flexDirection: 'row',
    },
    searchBar: {
        margin: 10,
    },
    sortRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    sortButton: {
        flex: 1,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 20,
        color: 'gray',
    }
});

class Products extends React.Component {
    state = {
        userId: null
    };

    async componentDidMount() {
        const token = await AsyncStorage.getItem(USER_ID_KEY)

        this.setState({
            userId: await AsyncStorage.getItem(USER_ID_KEY)
        })
    }

    deleteProduct(id) {
        this.props.mutate({
            variables: {
                id: id
            },
            update: (store) => {
                const data = store.readQuery({ query: productsQuery });
                data.products = data.products.filter(x => x.id !== id);
                store.writeQuery({ query: productsQuery, data });
            },
        });
    }

    render() {
        const { data: { products }, history } = this.props;
        const { userId } = this.state;

        return (
            <View style={{ marginBottom: 200 }}>
                <View style={{ marginTop: 30 }}>
                    <View style={styles.searchBar}>
                        <TextInput placeholder="search"/>
                    </View>
                    <View style={styles.sortRow}>
                        <TouchableOpacity style={styles.sortButton} title="Name" onPress={() => 5}><Text style={styles.buttonText}>Name</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.sortButton} title="Price" onPress={() => 5}><Text style={styles.buttonText}>Price</Text></TouchableOpacity>
                    </View>
                </View>
                <Text style={{ marginTop: 20 }}>Products</Text>
                <Button title="Create Product" onPress={()=> history.push('/new-product')}/>
                <FlatList
                    data={products}
                    extraData={this.state}
                    keyExtractor={item => item.id}
                    renderItem=
                        {({ item }, i) =>
                        <View style={styles.row}>
                            <Image
                                style={styles.images}
                                source={{ uri: `${BASE_URL}/${item.pictureUrl}` }}
                            />
                            <View style={styles.right}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.price}>{`$ ${item.price}`}</Text>
                                <Text>{`${item.seller.id}`}</Text>
                              {userId === item.seller.id ? (
                                <View style={styles.editSection}>
                                    <Button 
                                        title="Edit" 
                                        onPress={() =>
                                            this.props.history.push({
                                                pathname: '/edit-product',
                                                    state: item,
                                            })
                                        }
                                        />
                                    <Button
                                        title="Delete"
                                        onPress={this.deleteProduct.bind(this, item.id)}
                                    />
                                </View>
                              ) : null}
                            </View>
                        </View>
                        }
                />
            </View>
        );
    }
}

export const productsQuery = gql`
    {
        products {
            id
            name
            price
            pictureUrl
            seller {
                id
            }
        }
        userId @client
    }
`;

export const deleteProductMutation = gql`
    mutation ($id: ID!) {
        deleteProduct(where: {id: $id}) {
            id
        }
    }
`;

export default compose(
    graphql(productsQuery),
    graphql(deleteProductMutation)
)(Products);
