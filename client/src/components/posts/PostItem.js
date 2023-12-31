import React from 'react';
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
  const AuthUserLiked = likes.some((like) => like.user === auth.user._id);

  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${user}`}>
          <img className='round-img' src={avatar} alt='' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        <p className='post-date'>
          Posted on <Moment format='DD/MM/YYYY'>{date}</Moment>
        </p>

        {showActions && (
          <div>
            <button
              type='button'
              style={AuthUserLiked ? { color: '#28a745' } : {}}
              className='btn btn-light'
              onClick={() => {
                addLike(_id);
              }}
            >
              <i className='fas fa-thumbs-up'></i>
              {likes.length > 0 && <span> {likes.length} </span>}
            </button>
            <button
              type='button'
              className='btn btn-light'
              onClick={() => {
                removeLike(_id);
              }}
            >
              <i className='fas fa-thumbs-down'></i>
            </button>
            <Link to={`/posts/${_id}`} className='btn btn-primary'>
              Discussion{' '}
              {comments.length > 0 && (
                <span className='comment-count'>{comments.length}</span>
              )}
            </Link>
            {!auth.loading && auth.user._id === user && (
              <button
                type='button'
                className='btn btn-danger'
                onClick={(e) => deletePost(_id)}
              >
                <i className='fas fa-times'></i>
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
