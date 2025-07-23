import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Post {
    limit: number;
    skip: number;
    total: number;
    posts: Posts[] | any,
}

export interface Posts {
    body: string,
    id: 1,
    reactions: { likes: number, dislikes: number }
    tags: String[],
    title: string,
    userId: number,
    views: number
}

export interface Comment {
    id: number;
    body: string;
    postId: number;
    user: {
        id: number;
        username: string;
    };
}

export interface NewCommentPayload {
    body: string;
    postId: number;
    userId: number;
}

export interface NewCommentResponse {
    id: number;
    body: string;
    postId: number;
    userId: number;
}

export interface NewLikesPayload {
    body: string;
    postId: number;
    userId: number;
}

export interface NewLikesResponse {
    id: number;
    body: string;
    postId: number;
    userId: number;
}


export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/' }),
    endpoints: (builder) => ({
        getPosts: builder.query<Post, { limit: number; skip: number }>({
            query: ({ limit, skip }) => `posts?limit=${limit}&skip=${skip}`,
        }),
        searchPosts: builder.query<{ posts: Posts[]; total: number }, string>({
            query: (searchTerm) => `posts/search?q=${searchTerm}`,
        }),
        getCommentsByPost: builder.query<{ comments: Comment[] }, number>({
            query: (postId) => `/post/${postId}/comments`,
        }),
        addComment: builder.mutation<NewCommentResponse, NewCommentPayload>({
            query: (comment) => ({
                url: 'comments/add',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: comment,
            }),
        }),
        addlikes: builder.mutation<NewLikesResponse, NewLikesPayload>({
            query: () => ({
                url: 'http/200',
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            })
        })
    }),
});

export const { useGetPostsQuery, useSearchPostsQuery, useGetCommentsByPostQuery, useAddCommentMutation, useAddlikesMutation } = apiSlice;
