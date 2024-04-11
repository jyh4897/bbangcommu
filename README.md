## 🍃 탄소중립 정보 공유 커뮤니티 플랫폼 '빵끗' 🍃

<!-- 
### 🤗 프로젝트 소개

![표지](https://github.com/iiingkeep/community/assets/151604087/f16f36d1-49a6-4118-8baa-ff869a10d605)

***
### 📆 개발 일정
* 기획 및 설계 시작 : 2024.02.05  
* 개발 시작 : 2024.02.19  
* 검증 시작 : 2024.03.18  
* 발표 및 평가 : 2024.03.28  
* 프로젝트 종료 : 2024.04.09  
***
### ✅ 기획 의도
![기획의도](https://github.com/iiingkeep/community/assets/151603893/cca4882d-52be-4f80-b01b-ad97c4f96cd6)
***
### 🙋 팀원
* 곽별이 : MyPage, WordCloud
 
* 김민규 : Community

* 김민호 : Login, Membership-Register

* 김연진 : Main, Community

* 이주호 : News-Feed, Web-Crawling
***
### 🛠️ 기술 스택
<p align="center">
<img width="90%" src="https://github.com/iiingkeep/community/assets/151603893/1fba5371-b1ac-4d74-99be-281670f2c499" />
</p>
<p align="center">
<img width="90%" src="https://github.com/iiingkeep/community/assets/151603893/c702dae4-7f5b-47bb-b31e-816099ca6c93"/>
</p>
   
***
   
### 🎠 주요 기능   
   
#### 로그인 : 로그인 시 세션에 유저 데이터를 저장, 만료시간을 설정하여 1시간 후 또는 로그아웃 시 데이터 삭제 
| 기능 | 구현 영상 |
| :---: | :---: |
| 등록된 정보와<br> 일치여부 확인을 통한 <nobr>유효성 검사 후 로그인</nobr> | <img width="45%" src="https://github.com/iiingkeep/community/assets/151604087/f8289786-20ad-4c89-962e-138e071ec791" /> |

---
---
   
#### 회원가입 : 정규 표현식과 중복 확인을 통한 유효성 검사 설정. 비밀번호의 경우 bcrypt와 hash를 사용해 암호화하여 저장
| 기능 | 구현 영상 |
| :---: | :---: |
| 유효성 검사 후 회원가입 | <img src="https://github.com/iiingkeep/community/assets/143868975/dcc7f951-fe0c-45b1-b28c-29d844d572ac" /> |
   
---
---
   
#### 메인페이지 : 세 개의 섹션으로 나누어 사이트 소개 및 로그인 기능 설정
| 기능 | 구현 영상 |
| :---: | :---: |
| 첫 번째 섹션의 <br>로그인 기능 | <img src="https://github.com/iiingkeep/community/assets/143868975/339771b2-04b4-4cad-ac47-29a387d1189b" /> |
| 두 번째 섹션의 <br>각 메뉴별 소개 및<br> 이동 기능 | <img src="https://github.com/iiingkeep/community/assets/143868975/a05259c3-a75c-4be8-b545-129facd73248" /> |
| 세 번째 섹션의 <br>최신 환경 뉴스 기재,<br>그에 기반한 워드 클라우드 표시 및 다운로드 기능,<nobr>커뮤니티 인기글 기재</nobr> | <img src="https://github.com/iiingkeep/community/assets/143868975/9a0548db-9be5-4e53-b553-77ac4f53e9b2" /> |
 
---
---
 
#### 환경이슈 : 네이버 검색 API를 이용, 지정한 시간에 최신 환경 뉴스를 크롤링하여 데이터 목록 표시
| 기능 | 구현 영상 |
| :---: | :---: |
| 검색 기능 | ![검색기능](https://github.com/iiingkeep/community/assets/143868975/def43f9f-f5e2-4524-b9af-dc13ebb1d05d) |
| 최신순 / 오래된 순 /<br>조회수 높은 순 정렬 | ![검색기능](https://github.com/iiingkeep/community/assets/143868975/9be8bf98-4f02-4d80-9b09-6be8b47dfa5e) |
| 기사 클릭 시 해당 기사의 url로 이동하며 조회수 1 증가 | ![검색기능](https://github.com/iiingkeep/community/assets/143868975/e8abca1d-7a79-431b-934b-b663ea80d332) |
| 기사 좋아요 토글 시<br>비로그인 유저<br>→로그인 페이지 이동<br>로그인 유저<br>→좋아요 체크 | ![검색기능](https://github.com/iiingkeep/community/assets/143868975/cf52d480-99f5-48e5-9bda-ffbea68ad4a0) |
| 페이지네이션 | ![검색기능](https://github.com/iiingkeep/community/assets/143868975/cf87ba7d-ebf3-448f-9387-95bc65ce1dc7) |

---
---
 
#### 커뮤니티 글 목록 : 유저가 작성한 글을 카테고라이징하여 목록으로 표시
| 기능 | 구현 영상 |
| :---: | :---: |
| 카테고라이징 | <img src="https://github.com/iiingkeep/community/assets/143868975/919391ae-9621-4d30-8fff-7c593d4a235d" /> |
| 제목 / 본문 / 제목+본문 검색 | <img src="https://github.com/iiingkeep/community/assets/143868975/0f616d61-3b35-436b-b7ec-51cf9d8a86ba" /> |
| 페이지네이션 | <img src="https://github.com/iiingkeep/community/assets/143868975/ba0a4778-a8fd-44b1-969c-77b81a3f01fb" /> |

---
---
   
#### 커뮤니티 글 작성 / 수정 : 로그인한 유저만 글쓰기 가능하며 Quill 에디터 사용으로 다양한 기능 이용 가능
| 기능 | 구현 영상 |
| :---: | :---: |
| quill 에디터를 이용한 글 작성 | <img src="https://github.com/iiingkeep/community/assets/143868975/cff90797-0926-46b6-8c2f-875617e11921" /> |
| <nobr>quill 에디터를 이용한</nobr> 글 수정 | <img src="https://github.com/iiingkeep/community/assets/143868975/69329bf7-c0b5-4a74-b8ef-2faae23168d9" /> |

---
---
   
#### 커뮤니티 게시글 상세 : 게시글 작성자 본인만 수정/삭제 가능
| 기능 | 구현 영상 |
| :---: | :---: |
| 로그인 한 유저는 좋아요 등록 및 등록 해제 가능 | <img src="https://github.com/iiingkeep/community/assets/143868975/543dc1cf-dd43-4f3b-82ed-4feb246fd7fb" /> |
| 로그인 한 유저는 댓글 및 답글 등록 | <img src="https://github.com/iiingkeep/community/assets/143868975/9be25d05-1531-4bb5-b2dc-67490a680908" /> |
| <nobr>작성자 본인 댓글 수정</nobr> | <img src="https://github.com/iiingkeep/community/assets/143868975/12947b13-e6b4-457b-8b92-904fced1d74a" /> |
| <nobr>작성자 본인 댓글 삭제</nobr> | <img src="https://github.com/iiingkeep/community/assets/143868975/47caf440-023b-4b8e-b137-dc512f167f49" /> |
| <nobr>작성자 본인 게시글 삭제</nobr> | <img src="https://github.com/iiingkeep/community/assets/143868975/e991b91a-04b5-4fdc-93dd-5e16de43ffb1" /> |

---
---
   
#### 마이페이지 프로필 : 유저 프로필 표시 및 사진 설정
| 기능 | 구현 영상 |
| :---: | :---: |
| 프로필사진  등록 | <img src="https://github.com/iiingkeep/community/assets/143868975/2ad671e1-d86c-410d-b791-ff56cc68aee9" /> |
| 프로필사진  삭제 | <img src="https://github.com/iiingkeep/community/assets/143868975/e60cacc9-cd97-45b5-80f9-b60c60310f2d" /> |

---
---
   
#### 마이페이지 나의 정보 수정 : 본인만 수정할 수 있도록 인증 과정 설정
| 기능 | 구현 영상 |
| :---: | :---: |
| 회원정보 수정 시<br> 비밀번호 확인 후 페이지 이동 | <img src="https://github.com/iiingkeep/community/assets/143868975/6eab012d-1da5-411b-9ed6-3361225165ae" /> |
| 회원정보 수정 시<br> <nobr>정규표현식과 중복확인을 통한</nobr> 유효성 검사 | <img src="https://github.com/iiingkeep/community/assets/143868975/d339fabc-b153-4183-88b9-10a664929820" /> |

---
---
   
#### 마이페이지 나의 활동 : 내가 쓴 글과 댓글 목록 출력 및 이동 가능
| 기능 | 구현 영상 |
| :---: | :---: |
| 내가 쓴 글 표시 및<br> 클릭 시 해당 페이지로<br> 이동 | <img src="https://github.com/iiingkeep/community/assets/143868975/a1ddf691-7c81-434b-ae75-21feeea80810" /> |
| <nobr>내가 쓴 댓글 표시 및</nobr> 클릭 시 해당 페이지로<br> 이동 | <img src="https://github.com/iiingkeep/community/assets/143868975/9c08340d-88f4-4d51-bff9-33f2e7fe734b" /> |

---
---
   
#### 마이페이지 좋아요 : 내가 좋아요 한 뉴스와 게시글 목록 출력 및 이동 가능
| 기능 | 구현 영상 |
| :---: | :---: |
| 좋아요 한 뉴스 표시 및<br> 클릭 시 해당 페이지로<br> 이동 | <img src="https://github.com/iiingkeep/community/assets/143868975/c072c01b-4bd4-4f55-9f7a-5206baa75ba1" /> |
| 좋아요 한 게시글 표시 및 클릭 시 해당 페이지로 이동 | <img src="https://github.com/iiingkeep/community/assets/143868975/475ca059-54da-4df2-b03a-4688255f9a5f" /> | -->
