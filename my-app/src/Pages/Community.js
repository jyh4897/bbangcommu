import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import PaginatedItems from '../Component/PaginatedItems';
import DOMPurify from 'dompurify';
import {Icon} from '@iconify/react';
import { formattedDateAndTime } from "../Util/utils";
import { getPostThumbnail } from "../Util/utils";
import '../Styles/Community.css';

const Community = ({loggedIn, baseURL}) => {                                                                     // 게시물 목록을 페이지별로 출력하는 컴포넌트
  const [posts, setPosts] = useState([]);                                                               // 게시글 목록, 전체 게시글 갯수, 현재 페이지, 검색어, 검색유형 상태 관리
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [selectedCategory, setSelectedCategory] = useState(1);

  const navigate = useNavigate();

  const handleSearchInputChange = (e) => {                                                              // 검색어 업데이트
    setSearchQuery(e.target.value);
  };

  const handleSearchTypeChange = (e) => {                                                               // 검색유형 업데이트
    setSearchType(e.target.value);
  };

  const handleSearchButtonClick = () => {                                                               // 검색버튼 클릭 시 페이지를 1로 새로고침 후 게시글 불러오기
    setCurrentPage(1);
    fetchPosts();
  };

  const handleKeyDown = (e) => {                                                                        // 검색어 입력 후 엔터키 누르면 검색버튼 클릭과 같은 효과
    if (e.key === "Enter") {
      handleSearchButtonClick();
    }
  };

  const handleCategoryClick = (categoryId) => {                                                         //카테고리 선택 버튼
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };


  useEffect(() => {
    fetchPosts();
  }, [currentPage,selectedCategory]);


  const fetchPosts = async () => {
    try {                                                                                               // 서버의 다음 엔드포인트에 게시글 목록과 게시글의 총 갯수 GET요청
      const response = await axios.get(`${baseURL}/Community?categoryId=${selectedCategory}&page=${currentPage}&searchQuery=${searchQuery}&searchType=${searchType}`);
      setPosts(response.data.posts);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      console.error('데이터를 가져오는 중 오류 발생:', error);
    }
  };

  const getPostContentWithoutImages = (content) => {                                                    // 게시글 내용에 이미지를 제외하고 표시하도록 하는 함수
    return content.replace(/<img\s+[^>]*src="[^"]*"[^>]*>/g, '');
  };

  const goCommunityWrite = () => {                                                                      // 글쓰기 버튼 클릭 시 게시글 작성 페이지로 이동하는 함수
    if (loggedIn) {                                                                                     // 로그인 상태일 경우 글쓰기 페이지로 이동
    navigate('/Community/Write', { state: { selectedCategory } });                                      // 글쓰기 페이지로 이동할 때 selectedCategory 상태를 함께 전달
    } else {
      if (window.confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?")) {          // 로그인 상태가 아닐 경우 로그인 페이지로 이동
      navigate('/Login');
      }
    }
  };
  
  const handlePageChange = (newPage) => {                                                              // 현재 페이지를 변경하는 함수
    setCurrentPage(newPage);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="community-page inner">
      {/* 커뮤니티 헤더 */}
      <div className='com-header'><h1 className='com-header__title'>커뮤니티<p className='com-header__title--detail'>다른 사람들은 탄소중립을 어떻게 실천하고 있을까요?<br />
            팁도 얻고 고민도 해결해요. 실천기록을 남기면 칭찬과 격려 속에 뿌듯함은 두 배 !</p></h1>
      </div>

      {/* 게시글 카테고리 탭 */}
      <div className='commu-category-box'>
        <button className={'commu-category__button' + (selectedCategory === 1 ? ' commu-category__button--selected' : '')} onClick={() => handleCategoryClick(1)}>실천기록</button>
        <button className={'commu-category__button' + (selectedCategory === 2 ? ' commu-category__button--selected' : '')} onClick={() => handleCategoryClick(2)}>자유게시판</button>
        <button className={'commu-category__button' + (selectedCategory === 3 ? ' commu-category__button--selected' : '')} onClick={() => handleCategoryClick(3)}>고민과질문</button>
      </div>


        {/* 검색창 */}
      <div className='commu-search-and-go-write-box'>
      <div className='commu-search-box'>
        <div className='commu-search-box--except-button'>
        <select className='commu-search-box__option' value={searchType} onChange={handleSearchTypeChange}>
          <option value="title">제목</option>
          <option value="content">본문</option>
          <option value="titleAndContent">제목+본문</option>
        </select>
        <input className='commu-search-box__input' type="text" value={searchQuery} onChange={handleSearchInputChange} onKeyDown={handleKeyDown}/>
        </div>
        <button className='commu-search-box__button button' onClick={handleSearchButtonClick}>검색</button>
      </div>

      {/* 글쓰기 버튼 클릭 시 게시글 작성 페이지로 이동 */}
      <div className='commu-go-write-box'>
        <button className='commu-go-write-box__button button' onClick={goCommunityWrite}>글쓰기</button>
      </div>
      </div>

      {/* 게시글 목록 출력 */}
      <ul className='commu-post-list-box'>
        {posts.map((post) => (
          <li key={post.postid} className='commu-post-list'>
            {/* 게시글 썸네일, 클릭 시 상세 게시글 이동 */}
            <Link to={`/Community/Read/${post.postid}`}>
            <div className="commu-post-list__thumbnail" style={{backgroundImage: `url('${getPostThumbnail(post.content)}')`}}></div>
            </Link>
            <div className='commu-post-list__info-box'>
            <div className='commu-post-list__title-and-content-and-datetime'>
            <div className='commu-post-list__title-and-content'>
            <Link to={`/Community/Read/${post.postid}`}>
              <p className='commu-post-list__title'>{post.title}</p>
              <div className='commu-post-list__content' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(getPostContentWithoutImages(post.content)) }}></div>
            </Link>
            </div>

            <div className='commu-post-list__datetime'>
            <p className='commu-post-list__datetime--date'>{formattedDateAndTime(post.createdAt, 'date')}</p>
            <p className='commu-post-list__datetime--time'>{formattedDateAndTime(post.createdAt, 'time')}</p>
            </div>

            </div>
            <div className='commu-post-list__detail'>

              <div className='commu_post-list__detail--userinfo'>
                <p>{post.username}</p>
              </div>

              <div className='commu_post-list__detail--attention'>
            <span className='commu-post-list__view'>
            <Icon icon="fluent-mdl2:view" className='commu-post-list__icon'/>
            {post.view}</span>
            <span className='commu-post-list__like'>
            <Icon icon="icon-park-outline:like" className='commu-post-list__icon'/>
            {post.totalLikes}</span>
            <span className='commu-post-list__comment'>
            <Icon icon="f7:ellipses-bubble" className='commu-post-list__icon'/>
            {post.commentCount}</span>
            </div>

            </div>
            </div>
          </li>
        ))}
      </ul>
      
      {/* 페이지네이션 */}
      <PaginatedItems
          totalItems={totalItems}
          itemsPerPage={5}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
    </div>
  );
};

export default Community;
