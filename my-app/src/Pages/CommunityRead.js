import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useParams, useNavigate } from 'react-router-dom';
import Comment from '../Component/Comment';
import {Icon} from '@iconify/react';
import { formattedDateAndTime } from "../Util/utils";
import '../Styles/CommunityRead.css'

const CommunityRead = ({loggedIn, userid, baseURL}) => {                                                // 게시글 상세와 댓글을 출력하는 컴포넌트
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(0);


  useEffect(() => {
    const fetchPostAndIncrementViews = async () => {
      try {
        await axios.put(`${baseURL}/Community/Read/${id}/IncrementViews`);           // 서버의 다음 엔드포인트로 게시글 조회수 증가를 위한 PUT 요청
        const response = await axios.get(`${baseURL}/Community/Read/${id}`);         // 서버의 다음 엔드포인트로 상세 게시글 데이터를 불러오기 위한 GET요청
        console.log(response.data);
        setPost(response.data);
      } catch (error) {
        console.error('게시물을 불러오는 중 에러 발생:', error);
      }
    };

    fetchPostAndIncrementViews();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {                                                         // 서버의 다음 엔드포인트로 댓글 데이터를 불러오기 위한 GET요청
      try {
        const response = await axios.get(`${baseURL}/Community/Read/${id}/GetComments`);    
        setComments(response.data);
        setCommentCount(response.data.length);
      } catch (error) {
        console.error('댓글을 불러오는 중 에러 발생:', error);
      }
    };
    fetchComments();
    const checkLiked = async () => {                                                             // 서버의 다음 엔드포인트로 유저의 게시글 좋아요 여부를 확인하기 위한 GET요청
      try {
        const response = await axios.get(`${baseURL}/Community/Read/${id}/CheckLiked?userid=${userid}`);    
        console.log(userid)
        setIsLiked(response.data.isLiked);
      } catch (error) {
        console.error('좋아요 여부 확인 중 에러 발생:', error);
      }
    };
    checkLiked();
  }, [id, userid]);
  
  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const response = await axios.get(`${baseURL}/Community/Read/${id}/GetLikeCount`);
        setLikeCount(response.data.likeCount);
      } catch (error) {
        console.error('좋아요 수를 불러오는 중 에러 발생:', error);
      }
    };
    fetchLikeCount();
  }, [id]);

  

  const refreshFunction = (newComment) => {                                                      // 등록한 댓글이 전에 있던 댓글 다음으로 바로 출력되어 나오도록 하는 함수 생성
    setComments(comments.concat(newComment));
    setCommentCount(commentCount + 1);
}

    const updateComment = (updatedComment) => {                                                  // 댓글 수정 시 댓글목록 업데이트
      const updatedComments = comments.map(comment => {
        if (comment.commentid === updatedComment.commentid) {
          return updatedComment;                                                                 // 수정된 댓글일 경우 해당 댓글로 대체
        } else {
          return comment;                                                                        // 그렇지 않은 경우 기존의 댓글 유지
        }
      });
      setComments(updatedComments);
    }

  const deleteComment = (deletedCommentId) => {                                                  // 댓글 삭제 시 댓글목록과 댓글 수 업데이트
    const updatedComments = comments.filter(comment => comment.commentid !== deletedCommentId);  // 삭제된 댓글을 제외한 새로운 댓글 목록 생성
    setComments(updatedComments);                                                                // 댓글 목록 업데이트
    setCommentCount(commentCount - 1);
  }
  
  
  if (!post) {
    return <div>Loading...</div>;                                                                // post가 없을 경우 'Loading...' 표시
  }

  const onDeleteHandler = async () => {                                                          // 삭제 버튼 클릭 시 호출되는 핸들러 함수
  const userConfirmed = window.confirm('정말로 게시글을 삭제하시겠습니까?');                     // 삭제 확인 창 출력
  if (userConfirmed) {                                                                           // 사용자가 확인을 선택한 경우에만 삭제 진행
    try {
      await axios.delete(`${baseURL}/Community/Read/${id}`);
      navigate('/Community');                                                                    // 삭제가 성공하면 게시물 목록 페이지로 리다이렉트
    } catch (err) {
      console.error('게시물 삭제 중 에러 발생:', err);
    }
  }
  };

  const toggleLike = async () => {                                                               // 로그인 상태일 경우 좋아요 반영
  if (loggedIn) {
    try {
      const response = await axios.put(`${baseURL}/Community/Read/${id}/ToggleLike`, {
        userid: userid,
      });
      setIsLiked(!isLiked);
      setLikeCount(response.data.likeCount);
    } catch (error) {
      console.error('좋아요 토글 중 에러 발생:', error);
    }
  } else {                                                                                       // 로그인 상태가 아닐 경우 로그인 페이지로 이동
    if (window.confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?")) {
      navigate('/Login');
    }
  }
};

  const isOwner = loggedIn && post.userid === userid;                                            // 로그인 한 유저가 게시글을 작성한 유저인지의 여부를 확인하는 변수 선언

  return (
    <div className='community-read-page inner'>
      {/* 커뮤니티 헤더 */}
      <div className='com-header'><h1 className='com-header__title'>
        커뮤니티
      <p className='com-header__title--detail'>
        다른 사람들은 탄소중립을 어떻게 실천하고 있을까요?
        <br />
            팁도 얻고 고민도 해결해요. 실천기록을 남기면 칭찬과 격려 속에 뿌듯함은 두 배 !
            </p>
            </h1>
            </div>
      <div className='commu-post-detail__title-box'>
        <p className='commu-post-detail__title'>{post.title}</p>
        <div className='commu-post-detail__info-box'>
      <div className='commu-post-detail__username-and-date-box'>
      <p className='commu-post-detail__username'>{post.username}</p>
      <p><span className='commu-post-detail__datetime'>{formattedDateAndTime(post.createdAt)}</span></p>
      </div>
      <div className='commu-post-detail__view-and-like-box'>
      <p className='commu-post-detail__view-box'><Icon icon="fluent-mdl2:view" />
      <span className='commu-post-detail__view'>{post.view}</span></p>
      </div>
      </div>
      </div>
      {/* 글 작성자 본인만 게시글 수정, 삭제 가능한 메뉴 버튼 보이도록 설정 */}
      {isOwner &&(
      <div className='commu-post-detail__icon-box'>
      <Icon icon="uis:ellipsis-v" className='commu-post-detail__icon' onClick={() => setIsMenuOpen(!isMenuOpen)} />
      {isMenuOpen && ( /* 수정: 작은 박스 열린 상태일 때만 아래의 내용을 표시 */
        <div className='commu-post-detail__menu'>
          <button className='commu-post-detail__menu--edit' onClick={() => navigate(`/Community/Edit/${id}`)}>수정</button>
          <button className='commu-post-detail__menu--delete' onClick={onDeleteHandler}>삭제</button>
        </div>
      )}
      </div>
      )}
      {/* quill editor의 HTML태그 사용을 위한 설정. 리액트는 보안 이슈로 인해 HTML태그의 직접적인 사용을 제한하기 때문에 HTML태그 사용을 선언하는대신 DOMPurify를 사용해 보안 강화*/}
      <div className='commu-post-detail__content-box' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}></div>

      <div className="commu-post-detail__like-box" onClick={toggleLike}><Icon icon={isLiked ? "icon-park-solid:like" : "icon-park-outline:like"} /><span className='commu-post-detail__like'>{likeCount}</span></div>
      
      {/* 댓글 표시를 위한 Comment 컴포넌트 렌더링 */}
      <div className='commu-comment-box'>
        <Comment baseURL={baseURL} loggedIn={loggedIn} userid={userid} refreshFunction={refreshFunction} commentLists={comments} post={post} commentCount={commentCount} updateComment={updateComment} deleteComment={deleteComment}/>
      </div>
      {/* 게시글 목록으로 이동할 수 있는 버튼 */}
      <div className='commu-post-detail__button--go-list-box'>
        <button className='commu-post-detail__button--go-list' onClick={() => navigate('/Community')}>목록</button>
      </div>
    </div>
  )
}

export default CommunityRead;