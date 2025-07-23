import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    Alert,
    Modal,
    useWindowDimensions
} from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { launchImageLibrary } from 'react-native-image-picker';
import RenderHTML from 'react-native-render-html';

const CreatePostScreen = () => {
    const [showPreview, setShowPreview] = useState(false);
    const richText = useRef<RichEditor>(null);
    const [title, setTitle] = useState('');
    const [contentHtml, setContentHtml] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const { width } = useWindowDimensions();

    const handleImagePick = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.assets && response.assets.length > 0) {
                const selectedImage = response.assets[0];
                setImageUri(selectedImage.uri || null);
            }
        });
    };

    const handleSubmit = () => {
        if (!title || !contentHtml) {
            Alert.alert('Validation', 'Title and content are required.');
            return;
        }

        const postPayload = {
            title,
            content: contentHtml,
            image: imageUri,
        };

        console.log('Post Submitted:', postPayload);
        Alert.alert('Post Created!', 'Your post has been submitted.');
        setShowPreview(false);
        setTitle('')
        setImageUri('')
        richText.current?.setContentHTML('');
        // Optionally, send to server via fetch or RTK mutation
    };
    const sanitizedHtml = contentHtml
        .replace(/<b>/g, '<strong>')
        .replace(/<\/b>/g, '</strong>')
        .replace(/<i>/g, '<em>')
        .replace(/<\/i>/g, '</em>')
    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                    placeholder="Enter title"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                />
                <Text style={styles.label}>Content</Text>
                <RichEditor
                    ref={richText}
                    style={styles.richEditor}
                    placeholder="Start writing..."
                    onChange={setContentHtml}
                    editorInitializedCallback={() => {
                        setTimeout(() => {
                            richText.current?.focusContentEditor();
                        }, 300); // delay until webview is ready
                    }}
                />
                <RichToolbar
                    editor={richText}
                    actions={[
                        actions.setBold,
                        actions.setItalic,
                        actions.insertBulletsList,
                    ]}
                />

                <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
                    <Text style={styles.imagePickerText}>Pick Image</Text>
                </TouchableOpacity>

                {imageUri && (
                    <Image source={{ uri: imageUri }} style={styles.previewImage} />
                )}

                <TouchableOpacity style={styles.previewButton} onPress={() => setShowPreview(true)}>
                    <Text style={styles.submitText}>Preview Post</Text>
                </TouchableOpacity>

            </ScrollView>
            <Modal visible={showPreview} animationType="slide">
                <View style={styles.previewContainer}>
                    <Text style={styles.previewTitle}>{title || 'No Title'}</Text>

                    {imageUri && (
                        <Image source={{ uri: imageUri }} style={styles.previewImagePost} />
                    )}
                    <RenderHTML
                        contentWidth={width}
                        source={{ html: sanitizedHtml }}
                        tagsStyles={{
                            strong: { fontWeight: 'bold' },
                            em: { fontStyle: 'italic' },
                            div: { marginBottom: 10 },
                        }}
                    />

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitText}>Submit Post</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setShowPreview(false)} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close Preview</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginBottom: 16,
    },
    richEditor: {
        minHeight: 150,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        marginBottom: 10,
    },
    imagePicker: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 6,
        marginTop: 16,
        alignItems: 'center',
    },
    imagePickerText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    previewImage: {
        width: '100%',
        height: 150,
        marginTop: 12,
        borderRadius: 6,
    },
    submitButton: {
        backgroundColor: '#28a745',
        padding: 14,
        borderRadius: 6,
        marginTop: 24,
        alignItems: 'center',
    },
    submitText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    previewButton: {
        backgroundColor: '#17a2b8',
        padding: 14,
        borderRadius: 6,
        marginTop: 24,
        alignItems: 'center',
    },
    previewContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    previewTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 30,
        backgroundColor: '#dc3545',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    previewImagePost: {
        width: '100%',
        height: 300,
        marginTop: 12,
        borderRadius: 6,
    }

});

export default CreatePostScreen;
