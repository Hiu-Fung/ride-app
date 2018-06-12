import React from 'react';
import { Text, Button, View, TextInput, Image, StyleSheet } from 'react-native';
import { ImagePicker, Permissions } from 'expo';

const styles = StyleSheet.create({
    field: {
        borderBottomWidth: 1,
        fontSize: 20,
        marginBottom: 15,
        height: 35,
    },
});

// const defaultState = {
//     buttonTitle: 'Add Product',
//     values: {
//         name: '',
//         price: '',
//         pictureUrl: '',
//     },
//     errors: [],
//     isSubmitting: false
// };

export default class Form extends React.Component {
    static defaultProps = {
        buttonTitle: 'Add Product',
        values: {
            name: '',
            price: '',
            pictureUrl: '',
        },
        errors: [],
        isSubmitting: false
    };

    constructor(props) {
        super(props);
        // const { initialValues = {} } = props;

        // this.state = {
        //     ...defaultState,
        //     values: {
        //         ...defaultState.values,
        //         ...initialValues
        //     },
        //     errors: defaultState.errors
        // };

        this.state = {
            ...props,
            values: {
                ...props.values
            }
        };
    }

    onChangeText = (key, value) => {
        this.setState(state => ({
            values: {
                ...state.values,
                [key]: value
            }
        }));
    }

    submit = async () => {
        if (this.state.isSubmitting) {
            return;
        }

        const errors = await this.props.submit(this.state.values);

        if (errors) {
            console.log('if');
            this.setState({
                errors,
            });
        }
    };

    // pickImage = async () => {
    //     const result = await ImagePicker.launchImageLibraryAsync({
    //         allowsEditing: true,
    //         aspect: [4, 3],
    //     });
    //
    //     if (!result.cancelled) {
    //         this.onChangeText('pictureUrl', result.uri);
    //     }
    // };
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

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        // you would probably do something to verify that permissions
        // are actually granted, but I'm skipping that for brevity
    };

    render() {
        const { buttonTitle, values: { name, pictureUrl, price }, errors } = this.state;
        // const { buttonTitle } = this.props;

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
                    {errors.find(err => err.field === 'name') && <Text style={{ color: 'red' }}>{errors.find(err => err.field === 'name')}</Text>}
                    <TextInput
                        onChangeText={this.onChangeText.bind(this, 'name')}
                        value={name}
                        style={styles.field}
                        placeholder="name"
                    />
                    {errors.find(err => err.field === 'price') && <Text style={{ color: 'red' }}>{errors.find(err => err.field === 'price').message}</Text>}
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
                    <Button title={buttonTitle} onPress={this.submit} />
                </View>
            </View>
        );
    }
}
