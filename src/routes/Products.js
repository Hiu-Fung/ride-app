import React from 'react';
import { Text, View, Button, FlatList, Image, StyleSheet } from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { BASE_URL } from '../constants';

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
});

const Products = ({ data: { products, userId, loading }, history }) => {
console.log('data')
console.log(userId)
    return ((loading) ? null : (
        <View>
            <Text style={{ marginTop: 50 }}>Products</Text>
            <Button title="Create Product" onPress={()=> history.push('/new-product')}/>
            <FlatList
                data={products}
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
                        </View>
                    </View>
                    }
            />
        </View>
    ));
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
`

export default graphql(productsQuery)(Products);