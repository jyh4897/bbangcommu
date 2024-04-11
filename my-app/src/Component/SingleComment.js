import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formattedDateAndTime } from "../Util/utils";
import '../Styles/SingleComment.css'

const SingleComment = ({loggedIn, userid, comment, refreshFunction, updateComment, deleteComment, baseURL}) => {             // 작성된 원본 단일 댓글 표시, 각 댓글에 답글을 작성하는 컴포넌트
  const { id } = useParams();
  const [openReply, setOpenReply] = useState(false);
  const [commentValue, setCommentValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  const handleEdit = () => {                                                                                        // 댓글 수정 중 수정 버튼 클릭 시 호출되는 함수
    setCommentValue(comment.content);                                                                               // 이전의 댓글 내용을 폼에 가져오기 위한 상태 업데이트
    setIsEditing(true);                                                                                             // 수정 상태로 변경
  };

  const handleCancel = () => {                                                                                      // 댓글 수정 중 취소 버튼 클릭 시 호출되는 함수
    setIsEditing(false);                                                                                            // 수정 상태 취소
    setCommentValue('');                                                                                            // 폼 초기화
  };
  const onHandleCommentChange = (e) => {                                                                            // 댓글 수정 중 내용 변경 시 호출되는 함수
    setCommentValue(e.target.value);
  };

  //---------------------답글------------------------
  const onClickReplyOpen = () => {                                                                                  // 댓글에 답글을 다는 폼을 열고 닫는 함수
    setOpenReply(!openReply)                                                                                        // '답글 달기' 클릭 시 아래에 폼 제공
  }
  const onHandleReplyChange = (e) => {                                                                              // 답글 내용(commentValue) 업데이트 
    setCommentValue(e.target.value);
  }
  const onReplySubmit = async (e) => {                                                                              // 답글 등록 버튼 클릭 시 호출되는 핸들러 함수
    e.preventDefault();
    if (loggedIn) {                                                                                                 // 로그인 상태일 경우
      try{
        if (!commentValue) {
          alert('내용을 입력해주세요.');
          document.querySelector('.commu-comment__content').focus();
          return;
        }
        const response = await axios.post(`${baseURL}/Community/Read/${id}/SaveComment`, {               // 서버의 다음 엔드포인트로 답글 정보 
            userid: userid,                                                                                         // (게시글id, 작성한 답글의 내용, 부모댓글id)
            postId: id,                                                                                             // 데이터 전송을 위한 POST요청
            content: commentValue,
            responseTo: comment.commentid,
          });
          console.log(response.data);
      
          if (response&&response.status===201) {                                                                    // 답글 등록 성공 시 알림, 답글 창 초기화 및 닫힘
            console.log('답글이 등록되었습니다.');                                                                  // refreshFunction으로 새로 등록한 답글 즉시 렌더링
            alert('답글이 등록되었습니다.');
            setCommentValue('');
            setOpenReply(false);
            refreshFunction(response.data.result)
          }                                                                                                         // 답글 등록 실패 시 알림
          else {
            console.error('예상치 못한 응답:', response);
            alert('답글 등록에 실패했습니다. 다시 한 번 시도해주세요.')
          }                                                                                                         // 에러 발생 시 알림
        }catch(error) {
          console.error('에러 발생:', error);
          alert('답글 작성에 실패했습니다. 다시 한 번 시도해주세요.')
        }
    } else {
        if (window.confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?")) {                    // 로그인 상태가 아닐 경우 로그인 페이지로 이동
          navigate('/Login');
        }
    }
  }

    const onUpdateComment = async () => {                                                                          // 댓글 수정 후 등록버튼 클릭 시 호출되는 핸들러 함수
      const editComfirmed = window.confirm("댓글 수정을 완료하시겠습니까?");                                          // 사용자에게 수정 여부 확인 후 수정 진행
      if (editComfirmed) {
      try {
        if (!commentValue.trim()) {                                                                                 // 댓글에 내용이 없을 시 입력 요청
          alert('내용을 입력해주세요.');
          document.querySelector('.commu-single-comment__content--editing').focus();
          return;
        }
        const response = await axios.put(`${baseURL}/Community/Read/${id}/UpdateComment`, {
          commentid: comment.commentid,
          content: commentValue,
        });
        if (response && response.status === 200) {
          alert('댓글이 수정되었습니다.');
          updateComment(response.data.result);
          console.log(response.data.result)
          setIsEditing(false);
          setCommentValue('');                                                                                      // 수정 상태 종료
        } else {
          console.error('예상치 못한 응답:', response);
          alert('댓글 수정에 실패했습니다. 다시 한 번 시도해주세요.');
        }
      } catch (error) {
        console.error('에러 발생:', error);
        alert('댓글 수정에 실패했습니다. 다시 한 번 시도해주세요.');
      }
    } else {
      return;
    }
    } 
    
    const onDeleteComment = async () => {                                                                           // 댓글 삭제버튼 클릭 시 호출되는 핸들러 함수
      const userConfirmed = window.confirm('정말로 댓글을 삭제하시겠습니까?');                                      // 사용자에게 삭제 여부 확인 후 삭제 진행
      if (userConfirmed) {
      try {
        const response = await axios.delete(`${baseURL}/Community/Read/${id}/DeleteComment/${comment.commentid}`);
        if (response && response.status === 200) {
          console.log('댓글이 삭제되었습니다.');
          alert('댓글이 삭제되었습니다.');
          deleteComment(comment.commentid);                                                                         // 해당 댓글 삭제 후 UI 갱신
        } else {
          console.error('예상치 못한 응답:', response);
          alert('댓글 삭제에 실패했습니다. 다시 한 번 시도해주세요.');
        }
      } catch (error) {
        console.error('에러 발생:', error);
        alert('댓글 삭제에 실패했습니다. 다시 한 번 시도해주세요.');
      }
      }
    };
    
    return (
      <div className="commu-single-comment-box">
        <div className="commu-single-comment">
          {/* 댓글 수정버튼 클릭 했을 때와 클릭하지 않았을 때(기본) 출력상태 지정 */}
          {isEditing ? (                                                                                            // 댓글 수정 상태일 때 폼 출력
            <form className="commu-single-comment__form" 
            onSubmit={onUpdateComment}>
              <span className='commu-single-comment__name-box--editing'>{comment.username}</span>
              <textarea
                className="commu-single-comment__content--editing"
                value={commentValue}
                onChange={onHandleCommentChange}
              />
              <div className="commu-single-comment__button-box--editing">
                <button type="submit" className='commu-single-comment__button--editing button'>등록</button>
                <button type="button" className='commu-single-comment__button--editing button' onClick={handleCancel}>
                  취소
                </button>
              </div>
            </form>
          ) : (                                                                                                     // 댓글을 수정하지 않는 상태의 기본 댓글 출력
            <div className="commu-single-comment-box--basic">
            <div className="commu-single-comment__detail-box">
              <div className="commu-single-comment__name-date-box">
                  {comment.username}
                  <p className="commu-single-comment__date-box">
                    {formattedDateAndTime(comment.createdAt)}
                  </p>
              </div>
              <div className="commu-single-comment__content-box">
                {comment.content}</div>
              <span className="commu-single-comment__reply-button--write" onClick={onClickReplyOpen}>
                {" "}
                답글 달기
              </span>
            </div>
            <div className="commu-single-comment__button--edit-and-delete-box">
              {userid === comment.userid && (
              <>
                <button onClick={handleEdit}>수정</button>
                <button onClick={onDeleteComment}>삭제</button>
              </>
              )}
            </div>
            </div>
          )}
        </div>
        {/* 답글 달기 버튼을 클릭하여 openReply=true가 되면 답글 작성 폼 제공 */}
          {openReply && (
            <form onSubmit={onReplySubmit} className="commu-comment__form">
              <textarea
                className="commu-comment__content"
                onChange={onHandleReplyChange}
                value={commentValue}
                placeholder="답글을 작성해 보세요."
              />
              <button className="commu-comment__button--submit" onClick={onReplySubmit}>
                답글 등록
              </button>
            </form>
          )}
      </div>
    );
}

export default SingleComment;