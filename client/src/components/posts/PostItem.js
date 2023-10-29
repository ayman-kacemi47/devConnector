import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux'; //because we will have a lot of actions like like,unlike , comment
import { addLike, removeLike, deletePost } from '../../actions/post';

const PostItem = ({
  showActions, //so we can reuse the component
  deletePost,
  addLike,
  removeLike,
  auth,
  post: { _id, text, name, avatar, user, likes, comments, date },
}) => {
  const [authIsLikePost, SetAuthIsLikePost] = useState(false);

  const abah = likes.some((like) => like.user === auth.user._id);
  console.log('abah ', abah);

  return (
    <div class='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${user}`}>
          <img class='round-img' src={avatar} alt='' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p class='my-1'>{text}</p>
        <p class='post-date'>
          Posted on <Moment format='DD/MM/YYYY'>{date}</Moment>
        </p>

        {showActions && (
          <div>
            <button
              type='button'
              style={abah ? { color: '#28a745' } : {}}
              class='btn btn-light'
              onClick={() => {
                addLike(_id);
              }}
            >
              <i class='fas fa-thumbs-up'></i>
              {likes.length > 0 && <span> {likes.length} </span>}
            </button>
            <button
              type='button'
              class='btn btn-light'
              onClick={() => {
                removeLike(_id);
              }}
            >
              <i class='fas fa-thumbs-down'></i>
            </button>
            <Link to={`/posts/${_id}`} class='btn btn-primary'>
              Discussion{' '}
              {comments.length > 0 && (
                <span class='comment-count'>{comments.length}</span>
              )}
            </Link>
            {!auth.loading && auth.user._id === user && (
              <button
                type='button'
                class='btn btn-danger'
                onClick={(e) => deletePost(_id)}
              >
                <i class='fas fa-times'></i>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
PostItem.defaultProps = {
  showActions: true,
};
PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
); //need the map state for the auth , to check how os connected
