// ActivityForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import "../Styles/MyPage.css";

const ActivityForm = ({ userId, baseURL }) => {
  const [actiData, setActiData] = useState([]);
  const [commData, setCommData] = useState([]);

  useEffect(() => {                                                                 // 활동 글 요청
    const fetchPostData = async () => {
      try {
        const posResponse = await axios.get(
          `${baseURL}/acti-post/${userId}`
        );
        const posData = posResponse.data;
        setActiData(posData);
      } catch (error) {
        console.log("Error fetching post data:", error);
      }
    };

    const fetchCommentData = async () => {                                          // 활동 댓글 요청
      try {
        const comResponse = await axios.get(
          `${baseURL}/acti-comment/${userId}`
        );
        const comData = comResponse.data;
        setCommData(comData);
      } catch (error) {
        console.log("Error fetching comment data:", error);
      }
    };
    fetchPostData();                                                                // 각각의 요청을 별도로 처리
    fetchCommentData();
  }, [userId]);

  return (
    <div className="my-acti-form">
      <div className="my-acti-content">
        <div className="my-form__title">
          <p className="my-form__text">나의 활동</p>
        </div>

        <div className="my-form-table-wrapper">
          <div className="my-content__list">
            <p className="my-form-table__title">내가 쓴 글</p>
            <table className="my-forms-table">
              <thead>
                <tr>
                  <th className="my-forms-table__date">날짜</th>
                  <th className="my-forms-table__title">제목</th>
                </tr>
              </thead>
              <tbody>
                {actiData.length === 0 ? (                                         // likedNews 배열의 길이가 0인 경우
                  <tr>
                    <td colSpan="2">
                      내가 쓴 글이 없습니다.
                    </td> 
                  </tr>
                ) : (
                  actiData.map((activity) => (
                    <tr key={activity.postid}>
                      <td>{moment(activity.createdAt).format("MM월 DD일")}</td>
                      <td>
                        <div className="my-table__td-box">
                          <Link
                            className="my-content__link"
                            to={`/Community/Read/${activity.postid}`}
                          >
                            <span>
                              {activity.title.length > 25
                                ? activity.title.substring(0, 25) + "..."
                                : activity.title}
                            </span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )))}
              </tbody>
            </table>
          </div>

          <div className="my-content__list">
            <p className="my-form-table__title">내가 남긴 댓글</p>
            <table className="my-forms-table">
              <thead>
                <tr>
                  <th className="my-forms-table__date">날짜</th>
                  <th className="my-forms-table__title">내용</th>
                </tr>
              </thead>
              <tbody>
                {commData.length === 0 ? (
                  <tr>
                    <td colSpan="2">내가 남긴 댓글이 없습니다.</td>
                  </tr>
                ) : (
                  commData.map((activity) => (
                    <tr key={activity.postid}>
                      <td>{moment(activity.createdAt).format("MM월 DD일")}</td>
                      <td>
                        <div className="my-table__td-box">
                          <Link
                            className="my-content__link"
                            to={`/Community/Read/${activity.postid}`}
                            >
                            <span>
                              {activity.content.length > 25
                                ? activity.content.substring(0, 25) + "..."
                                : activity.content}
                            </span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityForm;
