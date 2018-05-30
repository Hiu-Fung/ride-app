import React from 'react';
import { AsyncStorage, Text, Button, View, TextInput, Image, StyleSheet } from 'react-native';
// import Permissions from 'react-native-permissions';
import { ImagePicker, Permissions } from 'expo';

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
        let response;
        try {
            response = await this.props.mutate({
            variables: this.state.values,
            });
        } catch (err) {
          // this.setState({
          //   errors: {
          //     email: 'Already taken',
          //   },
          //   isSubmitting: false,
          // });
          // return;
        }

        // await AsyncStorage.setItem(TOKEN_KEY, response.data.signup.token);
        // this.setState(defaultState);
        this.props.history.push('/products');
    };

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
                    placeholder="email"
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

export default NewProduct;