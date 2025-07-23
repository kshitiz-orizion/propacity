import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { Posts, useGetCommentsByPostQuery, useAddCommentMutation, Comment, useAddlikesMutation } from '../store/apiSlice';

import Ionicons from 'react-native-vector-icons/Ionicons';

interface PostItemProps {
    post: Posts;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {

    const [postItem, setPostItem] = useState(post);

    const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [addComment, { isLoading: isPosting }] = useAddCommentMutation();
    const [localComments, setLocalComments] = useState<Comment[]>([]);
    const [liked, setLiked] = useState(false);

    const {
        data: commentData,
        isLoading: isLoadingComments,
        isError,
    } = useGetCommentsByPostQuery(postItem.id, {
        skip: !isCommentBoxOpen,
    });

    const increaseLikes = () => {
        let likes = liked ? postItem.reactions.likes - 1 :  postItem.reactions.likes + 1;
        setPostItem({ ...postItem, reactions: { likes: likes, dislikes: postItem.reactions.dislikes } })
        setLiked(!liked);
    }

    const handleSubmitComment = async () => {
        if (!commentText.trim()) return;

        try {
            const response = await addComment({
                body: commentText,
                postId: postItem.id,
                userId: 5, // static user for now
            }).unwrap();

            setLocalComments((prev) => [
                ...prev,
                {
                    ...response,
                    user: {
                        id: 5,
                        username: 'You',
                    },
                },
            ]);
            setCommentText('');
        } catch (err) {
            console.error('Failed to post comment:', err);
        }
    };

    const allComments = [
        ...(commentData?.comments ?? []),
        ...localComments,
    ];

    return (
        <View style={styles.postContainer}>
            <Text style={styles.username}>{postItem.title}</Text>
            <Text style={styles.content}>{postItem.body}</Text>

            <View style={styles.actions}>
                <TouchableOpacity onPress={() => increaseLikes()} style={styles.likesContainer}>
                    <Ionicons name={liked ?'heart': 'heart-outline'} size={20} color={liked ? '#f00' : '#333'}/>
                    <Text style={styles.actionText}>
                        {postItem.reactions.likes} Like</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsCommentBoxOpen((prev) => !prev)}>
                    <Text style={styles.actionText}>💬 Comment</Text>
                </TouchableOpacity>
            </View>

            {isCommentBoxOpen && (
                <>
                    {isLoadingComments && <ActivityIndicator size="small" />}
                    {isError && <Text style={{ color: 'red' }}>Failed to load comments</Text>}

                    {allComments.length > 0 ? (
                        allComments.map((c) => (
                            <View key={c.id} style={styles.commentContainer}>
                                <Text style={styles.commentUser}>{c.user.username}:</Text>
                                <Text style={styles.commentBody}>{c.body}</Text>
                            </View>
                        ))
                    ) : (
                        !isLoadingComments && <Text style={styles.commentEmpty}>No comments yet.</Text>
                    )}
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Write a comment..."
                        value={commentText}
                        onChangeText={setCommentText}
                        multiline
                    />
                    <TouchableOpacity style={styles.commentButton} onPress={handleSubmitComment} disabled={isPosting}>
                        <Text style={styles.commentButtonText}>{isPosting ? 'Posting...' : 'Post Comment'}</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: '#fff',
        margin: 10,
        padding: 12,
        borderRadius: 8,
        elevation: 2,
    },
    username: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    content: {
        fontSize: 15,
        marginBottom: 8,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 8,
    },
    actionText: {
        fontSize: 16,
        color: '#333',
    },
    commentInput: {
        marginTop: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        padding: 8,
        fontSize: 14,
        backgroundColor: '#f9f9f9',
    },
    commentButton: {
        marginTop: 10,
        paddingVertical: 10,
        backgroundColor: '#007bff',
        borderRadius: 6,
        alignItems: 'center',
    },
    commentButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    commentContainer: {
        marginTop: 8,
        backgroundColor: '#f1f1f1',
        padding: 8,
        borderRadius: 6,
    },
    commentUser: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    commentBody: {
        fontSize: 14,
        color: '#333',
    },
    commentEmpty: {
        marginTop: 8,
        fontStyle: 'italic',
        color: '#888',
    },
    likesContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    }
});

export default PostItem;
