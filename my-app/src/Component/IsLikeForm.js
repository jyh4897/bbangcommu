// IsLikeForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Styles/MyPage.css";

const IsLikeForm = ({ userId, baseURL }) => {

  const [likedPosts, setLikedPosts] = useState([]);                                     // 좋아요를 누른 포스트 목록 상태
  const [likedNews, setLikedNews] = useState([]);                                       // 좋아요를 누른 뉴스 목록 상태

  useEffect(() => {
    const fetchLikedPost = async () => {                                                // 서버에서 유저가 좋아요를 누른 포스트 정보를 가져옴
      try {
        const postResponse = await axios.get(
          `${baseURL}/is-like/posts/${userId}`
        );
        const postData = postResponse.data;
        setLikedPosts(postData);
      } catch (error) {
        console.error("Error fetching liked items:", error);
      }
    };

    const fetchLikedNews = async () => {                                                // 서버에서 유저가 좋아요를 누른 뉴스 정보를 가져옴
      try {
        const newsResponse = await axios.get(
          `${baseURL}/is-like/news/${userId}`
        );
        const newsData = newsResponse.data;
        setLikedNews(newsData);
      } catch (error) {
        console.error("Error fetching liked items:", error);
      }
    };
    fetchLikedPost();
    fetchLikedNews();
  }, [userId]);
  console.log(likedNews);

  return (
    <div className="my-like-form">
      <div className="my-form__title">
        <p className="my-form__text">좋아요 목록</p>
      </div>
      <div className="my-form-table-wrapper">
        <div className="my-content__list">
          <p className="my-form-table__title">뉴스</p>
          <table className="my-forms-table">
            <thead>
              <tr className="my-forms-table">
                {/* <th className='forms-table__num'>No.</th> */}
                <th className="my-forms-table__title">이미지</th>
                <th className="my-forms-table__title">제목</th>
              </tr>
            </thead>
            <tbody className="my-like-news-list__body">
              {likedNews.length === 0 ? (
                <tr>
                  <td colSpan="2">내가 좋아요 한 뉴스가 없습니다.</td>
                </tr>
              ) : (
                likedNews.map((News) => (
                  <tr key={News.newsid}>
                    <td className="my-table__td">
                      <div className="my-table__td-box">
                        <Link to={News.url} target="_blank">
                          <img
                            src={News.image_url}
                            className="my-like-news-list__img"
                            alt="뉴스 이미지"
                          />
                        </Link>
                      </div>
                    </td>
                    <td className="my-table__td">
                      <div className="my-table__td-box">
                        <Link to={News.url} target="_blank">
                          <span>{News.title}</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="my-content__list">
          <p className="my-form-table__title">게시글</p>
          <table className="my-forms-table">
            <thead>
              <tr>
                {/* <th className='forms-table__num'>No.</th> */}
                <th className="my-forms-table__title">작성자</th>
                <th className="my-forms-table__title">제목</th>
              </tr>
            </thead>
            <tbody className="my-like-news-list__body">
              {likedPosts.length === 0 ? (
                <tr>
                  <td colSpan="2">내가 좋아요 한 글이 없습니다.</td>
                </tr>
              ) : (
                likedPosts.map((likedPost) => (
                  <tr key={likedPost.postid}>
                    <td className="my-table__td">
                      <div className="my-table__td-box">
                        <span>{likedPost.username}</span>
                      </div>
                    </td>
                    <td className="my-table__td">
                      <div className="my-table__td-box">
                        <Link to={`/Community/Read/${likedPost.postid}`}>
                          <span>{likedPost.title}</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IsLikeForm;
