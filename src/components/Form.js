import React from 'react';
import { View, Image, Button } from 'react-native';
import { ImagePicker } from 'expo';

export default class From extends React.component {
    constructor(props) {
        super(props);
        const { intitialValues = {} } = props;

        this.state = {
            ...defaultState,
            values: {
                ...defaultState.values,
                ...initialValues
            }
        }
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

        const errors = this.props.submit(this.state.values);
        if (errors) {
            this.setState({
                errors,
            });
        }
    };

    pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        if (!result.cancelled) {
            this.onChangeText('pictureUrl', result.uri);
        }
    };

    render() {
        const { values: { name, pictureUrl, price, errors } } = this.state;

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
