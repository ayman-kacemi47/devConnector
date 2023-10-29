import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getPostById } from '../../actions/post';
import { Link, useParams } from 'react-router-dom';
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const Post = ({ getPostById, post: { post, loading } }) => {
  const { id } = useParams();
  console.log('id ', id);
  useEffect(() => {
    getPostById(id);
  }, [getPostById]);
  return loading || post === null ? (
    <Spinner />
  ) : (
    <div className='container'>
      <Link to='/posts' className='btn'>
        Back to posts
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={post._id} />
      <div className='commments'>
        {post.comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </div>
  );
};

Post.propTypes = {
  getPostById: PropTypes.func.isRequired,
};

const matStateToProps = (state) => ({
  post: state.post,
});

export default connect(matStateToProps, { getPostById })(Post);
