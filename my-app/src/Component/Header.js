import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Header.css";

const Header = ({ loggedIn, handleLogout }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {                                                            // 헤더에서 메뉴 클릭 시 해당 페이지로 이동 후 스크롤을 맨 위로 초기화
    navigate(path);
    window.scrollTo(0, 0);
  };
  const handleMain = () => handleNavigation("/");
  const handleNetZero = () => handleNavigation("/NetZero");
  const handleLogin = () => handleNavigation("/Login");
  const handleRegister = () => handleNavigation("/RegisterPersonal");
  const handleMyPage = () => handleNavigation("/MyPage");

  return (
    <div className="header">
      {/* 왼쪽 로고 */}
      <div className="header__logo">
      <img src="/background_img/logo2.png" className="header__logo--img"onClick={handleMain} />
      </div>
      {/* 가운데 메뉴 */}
      <div className="header__menu">
        <button className="header__menu--button" onClick={handleNetZero}>
          탄소중립이란?{" "}
        </button>
        <button className="header__menu--button"
        onClick={() => navigate("/news")}>
          환경이슈{" "}
        </button>
        <button
          className="header__menu--button"
          onClick={() => navigate("/Community")}>
          커뮤니티{" "}
        </button>
      </div>
      {/* 오른쪽 버튼 */}
      <div className="header__button">
        {loggedIn ? (
          <div>
            <button
              className="header__button--button button"
              onClick={handleMyPage}>
              마이페이지
            </button>
            <button
              className="header__button--button button"
              onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        ) : (
          <div>
            <button
              className="header__button--button button"
              onClick={handleLogin}>
              로그인
            </button>
            <button
              className="header__button--button button"
              onClick={handleRegister}>
              회원가입
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
