import React from 'react';
import { Text, View, Button, FlatList, Image } from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { BASE_URL } from '../constants';

const Products = ({ data: { products }, loading, history }) =>
    ((loading || !products) ? null : (
        <View>
            <Text style={{ marginTop: 50 }}>Products</Text>
            <Button title="Create Product" onPress={()=> history.push('/new-product')}/>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem=
                    {({ item }, i) =>
                    <View>
                    <Text>{item.name}</Text>
                    <Text>{item.price}</Text>
                    <Text>{item.pictureUrl}</Text>
                    <Image style={{ height:50, width: 50 }} source={{ uri: `${BASE_URL}/${item.pictureUrl}` }}/>
                    </View>
                    }
            />
        </View>
    ));

const productsQuery = gql`
    {
        products {
            id
            name
            price
            pictureUrl
        }
    }
`

export default graphql(productsQuery)(Products);