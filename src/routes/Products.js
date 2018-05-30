import React from 'react';
import { Text, View, Button } from 'react-native';

export default ({ history }) => (
    <View>
        <Text style={{ marginTop: 50 }}>Products</Text>
        <Button title="Create Product" onPress={()=> history.push('/new-product')}></Button>
    </View>
);
