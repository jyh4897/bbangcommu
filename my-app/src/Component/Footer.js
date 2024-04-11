import React, { useEffect, useState } from 'react';
import '../Styles/Footer.css';

function Footer() {
    useEffect(() => {
        function fixFooterToBottom() {
            const footer = document.querySelector('.Footer');
            const body = document.body;
            const html = document.documentElement;

            const windowHeight = window.innerHeight;
            const bodyHeight = Math.max(
                body.scrollHeight, body.offsetHeight,
                html.clientHeight, html.scrollHeight, html.offsetHeight
            );

            if (windowHeight >= bodyHeight) {
                footer.style.position = 'relative';
                footer.style.bottom = '0';
                footer.style.left = '0';
                footer.style.width = '100%';
            } else {
                footer.style.position = 'static';
            }
        }

        fixFooterToBottom();
        window.addEventListener('resize', fixFooterToBottom);

        return () => {
            window.removeEventListener('resize', fixFooterToBottom);
        };
    }, []);

    const [isListVisible, setListVisible] = useState(false);

    const toggleListVisibility = () => {
        console.log("toggleListVisibility 함수가 호출되었습니다.");
        setListVisible((prevState) => !prevState);
        console.log("isListVisible:", isListVisible);
    };

    return (
        <footer className="Footer">
            <div className="FooterLayer1">
                <div className="LayerWrap">
                    <ul className="FooterLink">
                        <li>
                        <a href="">이용약관</a>
                        </li>
                        <li>
                        <a href="" className="personal">개인정보처리방침</a>
                        </li>
                        <li>
                        <a href="">이메일 무단수집 거부</a>
                        </li>
                        <li>
                        <a href="">저작권정책</a>
                        </li>
                    </ul>
                    <div className="LayerDivWrap">
                        <ul className="FooterLinkDivWrap">
                    <li>
                    <a href="">공지사항</a>
                    </li>
                    <li>
                    <a href="">FAQ</a>
                    </li>
                    </ul>
                </div>
                </div>
            </div>
            <div className="FooterLayer2">
                <div className="FooterContent">
                    <div className="leftContent">
                    <img src="/background_img/logo2.png" />
                        <br />
                        <p>COPYRIGHT (C) 2024 K-DIGITAL ALL RIGHTS RESERVED.</p>
                    </div>
                    <address>
                        "상호명 및 호스팅 서비스 제공 : 커뮤니티 빵끗"
                        <br />
                        "관리자 : Ezteam2CommunityTeam"
                        <br />
                        "인천광역시 남동구 인주대로 593 엔타스빌딩 12층"
                        <br />
                        "등록번호 : 000-0000-000"
                    </address>
                    <div className="labelList">
                        <button className={`label ${isListVisible ? 'active' : ''}`} onClick={toggleListVisibility}>
                            관련 사이트 바로가기 {isListVisible ? '▲' : '▼'}
                        </button>
                        <div className={`list ${isListVisible ? 'active' : ''}`}>
                            <ul>
                                <a onClick={() => window.open("http://me.go.kr/home/web/main.do", "_blank")} title="새창">환경부</a>
                                <a onClick={() => window.open("http://www.keci.or.kr/web/main.do", "_blank")} title="새창">한국환경보전원</a>
                                <a onClick={() => window.open("http://www.gihoo.or.kr/zerolife", "_blank")} title="새창">탄소중립 실천포털</a>
                                <a onClick={() => window.open("http://www.gihoo.or.kr/greencampus/", "_blank")} title="새창">그린캠퍼스</a>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="FooterLayer3">
            </div>
        </footer>
    );
}

export default Footer;

