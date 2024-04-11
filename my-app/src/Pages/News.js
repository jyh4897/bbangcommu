import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "react-js-pagination";
import { useNavigate, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import "../Styles/News.css";
import { formattedDateAndTime } from "../Util/utils";

const News = ({baseURL}) => {
  const [news, setNews] = useState([]);                                                       // news : DB에 있는 뉴스 데이터
  const [page, setPage] = useState(1);                                                        // page : 현재 페이지
  const [currenPosts, setCurrenPosts] = useState([]);                                         // currenPosts : 현재 페이지에 보이는 기사들
  const [sortBy, setSortBy] = useState("latest");                                             // 정렬(sortBy에 기본값으로 'latest' 설정)
  const [searchTerm, setSearchTerm] = useState("");                                           // 검색
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);                      // 검색 버튼
  const [likedArticles, setLikedArticles] = useState([]);                                     // 좋아요
  const [loggedIn, setLoggedIn] = useState([]);                                               // 로그인 상태
  const [userid, setUserid] = useState([]);                                                   // userid 데이터

  useEffect(() => {
    if (JSON.parse(sessionStorage.getItem("loggedIn")) === true) {
      setLoggedIn(JSON.parse(sessionStorage.getItem("loggedIn")));
      setUserid(JSON.parse(sessionStorage.getItem("userData")).userid);
    }
  }, [loggedIn, userid]);

  const navigate = useNavigate();

  useEffect(() => {                                                                           // 뉴스 정보 가져오기
    axios
      .get(`${baseURL}/news`)
      .then((response) => {
        const sortedNews = response.data
          .map((item) => {
            if (!item.image_url) {                                                            // 만약 image_url이 비어있다면, thumb4.png를 대신 사용
              return { ...item, image_url: "background_img/thumb4.png" };
            }
            return item;
          })
          .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        setNews(sortedNews);
      })
      .catch((error) => {
        console.error("뉴스 데이터 불러오는 중 에러 발생:", error);
      });
  }, []);

  const articlesPerPage = 10;                                                                 // articlesPerPage : 한 페이지에서 보이는 기사 개수
  const indexOfLastArticle = page * articlesPerPage;                                          // indexOfLastArticle : 한 페이지의 마지막 기사의 인덱스
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;                           // indexOfFirstArticle : 한 페이지의 첫번째 기사의 인덱스

  const filteredNews = searchButtonClicked                                                    // 검색
    ? news.filter((item) =>                                                                   // searchButtonClicked 상태가 true 이면 검색 버튼이 클릭되었다는 것을 의미하며
        item.title.toLowerCase().includes(searchTerm.toLowerCase())                           // news 배열에서 searchTerm에 해당하는 뉴스 필터링하고
      )                                                                                       // toLowerCase()를 사용해서 대소문자 무시하고 비교해 filteredNews 배열 생성
    : news;                                                                                   // searchButtonClicked 상태가 false 이면 그냥 news의 값을 사용

  useEffect(() => {                                                                           // filteredNews 배열에서 현재 페이지에 해당하는 기사들만 currenPosts의 값으로 설정
    setCurrenPosts(filteredNews.slice(indexOfFirstArticle, indexOfLastArticle));              // setCurrenPosts() : 현재 페이지에서 보이는 뉴스기사들은 filteredNews를
  }, [page, filteredNews]);                                                                   // 해당 페이지의 첫 기사의 인덱스부터 마지막 기사의 인덱스까지 잘라서 보여줌

  useEffect(() => {                                                                           // 정렬
    let sortedNews = [...news];                                                               // 최신순
    if (sortBy === "latest") {
      sortedNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    } else if (sortBy === "oldest") {                                                         // 오래된순
      sortedNews.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));
    } else if (sortBy === "viewsHigh") {                                                      // 조회수 높은 순
      sortedNews.sort((a, b) => b.views - a.views);
    }
    setNews(sortedNews);
  }, [sortBy]);

  const handleClick = (item) => {                                                             // 기사 클릭 시 조회수 증가(썸네일, 제목에 사용)
    const clickedNews = news.map((n) =>
      n.newsid === item.newsid ? { ...n, views: n.views + 1 } : n
    );
    setNews(clickedNews);

    axios
      .post(`${baseURL}/news/views`, {                                             // 서버로 조회수 데이터 전송
        newsid: item.newsid,                                                                  // newsid 이름으로 기사 newsid 정보를 넘겨줌
        views: item.views + 1,                                                                // views라는 이름으로 기사 조회수 정보를 넘겨줌
      })
      .then((response) => console.log(response.data))
      .catch((error) => console.error(error));

    window.open(item.url, "_blank");                                                          // 기사 링크 열기
  };

  const handleLogoClick = () => {                                                             // 로고 클릭시 초기페이지로 돌아감
    setPage(1);
    setSearchTerm("");
    setSortBy("latest");
    setSearchButtonClicked(false);
  };

  const handleChangePage = (page) => {                                                        // 페이지 변화 핸들링 함수
    setPage(page);

    window.scrollTo({ top: 0 });                                                              // 페이지 이동 후 스크롤을 맨 위로 이동
  };

  const handleSearchChange = (e) => {                                                         // 검색 핸들링
    setSearchTerm(e.target.value);
    setSearchButtonClicked(false);
  };

  const handleSearchButtonClick = () => {                                                     // 검색 버튼 핸들링
    setSearchButtonClicked(true);
    setPage(1);
  };

  const handleKeyDown = (e) => {                                                              // 검색 input에서 엔터 키를 눌렀을 때 검색 버튼 클릭과 동일한 작동
    if (e.key === "Enter") {
      handleSearchButtonClick();
    }
  };

  const handleSortChange = (e) => {                                                           // 정렬 핸들링
    setSortBy(e.target.value);
    setPage(1);                                                                               // 정렬시 1페이지로 이동
  };

  useEffect(() => {                                                                           // 좋아요
    if (!sessionStorage.getItem("userData")) {                                                // 로그인 안되어있는 경우
      return;
    }

    axios.get(`${baseURL}/news/likes`).then((response) => {
      const likedArticles = {};
      const loggedInUserId = JSON.parse(                                                      // 현재 로그인된 사용자의 userid
        sessionStorage.getItem("userData")
      ).userid;

      response.data.forEach((article) => {                                                    // 서버에서 받아온 좋아요 데이터를 사용자별로 분류하여 저장
        const { userid, newsid, news_isLiked } = article;
        if (userid === loggedInUserId) {                                                      // 현재 로그인된 사용자와 해당 기사의 userid가 일치하는 경우에만 추가
          likedArticles[newsid] = news_isLiked === 1;
        }
      });
      setLikedArticles(likedArticles);
      console.log(likedArticles);
    });
  }, []);

  const handleLikeClick = (newsid, loggedIn, userid) => {                                     // 좋아요 버튼 클릭 시 호출되는 함수
    console.log(loggedIn, userid);
    if (loggedIn !== true) {
      if (
        window.confirm(
          "로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?"
        )
      ) {
        navigate("/Login");
        window.scrollTo(0, 0);
      } else {
        navigate("/News");
      }
      return;
    } else {
      const updatedLikedArticles = {                                                          // 좋아요 상태 변경 토글
        ...likedArticles,
        [newsid]: !likedArticles[newsid],
      };
      setLikedArticles(updatedLikedArticles);

      axios
        .post(`${baseURL}/news/likes`, {                                           // 서버로 좋아요 상태 업데이트 요청
          userid: userid,
          newsid: newsid,
          news_isLiked: !likedArticles[newsid] ? 1 : 0,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div className="news-page inner">
      <Link to="/news">
        <div className="com-header">
          <h1 className="com-header__title" onClick={handleLogoClick}>
            환경이슈{" "}
            <p className="com-header__title--detail">
              아침에 일어나서 한 번, 저녁 식사 후 한 번<br />
              최신 환경 동향에 대해 파악하고 생각해 보는 시간을 가질 수 있어요
            </p>
          </h1>
        </div>
      </Link>
      {/* 검색 */}
      <div className="news-search-and-sort-box">
        <div className="news-search-box">
          <input
            type="text"
            placeholder="뉴스 검색"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          {/* 검색 버튼 추가 */}
          <button onClick={handleSearchButtonClick}>검색</button>
        </div>
        {/* 정렬 */}
        <select
          className="news-sort-box"
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="viewsHigh">조회수 높은순</option>
        </select>
      </div>
      {/* 뉴스 목록 */}
      <ul className="news-list">
        {currenPosts.map((item) => (
          <div className="news-list-box">
            <li key={item.newsid}>
              {/* 썸네일 */}
              <div className="news-list__img-box">
                <img
                  src={item.image_url}
                  alt="뉴스 썸네일"
                  onClick={() => handleClick(item)}
                />
              </div>
              {/* 제목 */}
              <a
                onClick={() => handleClick(item)}
              >
                {item.title}
              </a>
              {/* 조회수 */}
              <p>
                <Icon icon="fluent-mdl2:view" />
                <span className="news-list__views">{item.views}</span>
              </p>
              {/* 좋아요 */}
              <div className="news-like__button">
                <button
                  onClick={() => handleLikeClick(item.newsid, loggedIn, userid)}
                >
                  {likedArticles[item.newsid] ? (
                    <Icon icon="icon-park-solid:like" />
                  ) : (
                    <Icon icon="icon-park-outline:like" />
                  )}
                </button>
              </div>
              <div className="news-list__datetime">
                <p>
                  {formattedDateAndTime(item.pubDate, "date")}{" "}
                  {formattedDateAndTime(item.pubDate, "time")}
                </p>
              </div>
            </li>
          </div>
        ))}
      </ul>
      {/* 페이지네이션 */}
      <Pagination
        activePage={page}
        itemsCountPerPage={articlesPerPage}
        totalItemsCount={filteredNews.length}
        pageRangeDisplayed={5}
        prevPageText={"<"}
        nextPageText={">"}
        onChange={handleChangePage}
      />
    </div>
  );
};

export default News;
