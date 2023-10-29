//0:20 61  redux flow

import {
  ADD_POST,
  DELETE_POST,
  GET_POSTS,
  GET_POST,
  POST_ERROR,
  UPDATE_LIKES,
  ADD_COMMENT,
  REMOVE_COMMENT,
} from '../actions/types';

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false,
      };
    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false,
      };

    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case UPDATE_LIKES:
      return {
        ...state,
        //map the posts , check if the post id === id from the payload , if yes update the lieks array
        posts: state.posts.map((post) =>
          post._id === payload.postId
            ? { ...post, likes: payload.likes }
            : { ...post }
        ),
        loading: false,
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== payload),
        loading: false,
      };

    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts], // posts: [...state.posts, payload],  we switch it so the last post will be first when we add it , from the server is always is gonna be first
        loading: false,
      };
    case ADD_COMMENT:
      return {
        ...state,
        post: { ...state.post, comments: payload },
        loading: false,
      };
    case REMOVE_COMMENT:
      return {
        ...state,
        post: { ...state.post, comments: payload },
        loading: false,
      };

    default:
      return state;
  }
}
