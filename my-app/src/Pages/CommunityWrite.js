import ReactQuill, {Quill} from "react-quill";
import 'react-quill/dist/quill.snow.css';
import ImageResize from "quill-image-resize-module-react";
import React, {useState,useEffect, useRef, useMemo} from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';
import '../Styles/CommunityWrite.css'
Quill.register("modules/imageResize", ImageResize);

const CommunityWrite = ({userid, baseURL}) => {                                                    // 게시글 작성 컴포넌트
  const location = useLocation();
  const navigate = useNavigate();                                                         
  const [title, setTitle] = useState('');                                                 // 게시글 제목과 내용 상태 관리
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(1);
  const quillRef = useRef(null);

  const handleTitleChange = (e) => {                                                      // 게시글 제목(title)값 업데이트
    setTitle(e.target.value);
  };
  const handleContentChange = (value) => {                                                // 게시글 내용(content)값 업데이트
    setContent(value);
  };
  useEffect(() => {                                                                       // 글목록 페이지에서 선택한 카테고리 정보를 그대로 가져오기
    if (location.state && location.state.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
    }
  }, [location.state]);
  const handleCategoryClick = (categoryId) => {                                           // 카테고리(category)값 업데이트
    setSelectedCategory(categoryId);
  };

  const imageHandler = () => {                          // quill-editor 사용 시 이미지가 base64 형태로 저장되어 DB에 데이터가 들어가지 않는 현상 방지를 위한 이미지 처리 핸들러
                                                        // 따로 생성한 input에서 이미지를 받아 서버로 보내면 서버에서 이미지 src를 url로 변환 후 그 값을 받아와 에디터에 이미지가 나타나게끔 설정

  console.log('에디터에서 이미지 버튼을 클릭하면 이 핸들러가 시작됩니다!');


  const input = document.createElement('input');                                          // 이미지를 저장할 input type=file DOM을 만든다.
  input.setAttribute('type', 'file');                                                     // input의 속성 지정
  input.setAttribute('accept', 'image/*');
  input.click();                                                                          // 에디터의 이미지버튼 클릭 시 이 input이 클릭되도록 설정.
                                                                                          // input이 클릭되면 파일 선택창 표시
  input.addEventListener('change', async () => {                                          // input요소 값이 변할 경우(이미지를 선택했을 때) 이벤트 헨들러 함수 호출
                                                                                          // 선택한 파일 중 첫 번째 파일 할당
    const file = input.files[0];                                                          // multer에 맞는 형식으로 데이터 생성
    const formData = new FormData();                                                      // formData는 key-value구조로, key는 img, value는 선택된 파일로 설정하여 추가
    formData.append('img', file); 

    try {                                                                                 // 서버의 다음 엔드포인트에 이미지 데이터를 보내기 위한 POST 요청
      const result = await axios.post(`${baseURL}/img`, formData);
      console.log('성공 시, 백엔드가 보내주는 데이터', result.data.url);                  // 서버로부터 받은 이미지url 데이터를 IMG_URL에 할당
      const IMG_URL = result.data.url;                                                    // 이 url을 img 태그의 src에 넣어 에디터의 커서에 삽입 시 에디터 내 이미지 출력
      const editor = quillRef.current.getEditor();                                        // 에디터에 이미지 태그 넣기
                                                                                          // useRef를 이용해 에디터 객체 선택
      const range = editor.getSelection();                                                // 현재 에디터 커서 위치값 가져오기
      editor.insertEmbed(range.index, 'image', IMG_URL,  );                               // 가져온 위치에 이미지를 삽입
    } catch (error) {
      console.log('failed');
    }
  });
};


  const handlePostSubmit = async (e) => {                                                 // 글 작성 후 등록 버튼 클릭 시 호출되는 헨들러 함수
    e.preventDefault();
    const view = 0;
    try {                                                                                 // 제목 또는 내용이 입력되어 있지 않은 경우 유저에게 알리고 입력하도록 포커스
      if (!title||content.replace(/<[^>]*>/g, '').trim()=="") {
      if (!title) {
        alert('제목을 입력해주세요.');
          document.querySelector('.commu-write__title').focus();
          return;}
      else if(content.replace(/<[^>]*>/g, '').trim()=="") {
          alert('내용을 입력해주세요.');
          document.querySelector('.ql-editor').focus();
          return;
        }
      } else {
      const response = await axios.post(`${baseURL}/Community/Write`, {        // 제목과 내용 작성을 완료했을 경우 서버의 다음 엔드포인트로 새 게시글 정보(제목, 내용) POST 요청
        userid,
        categoryid: selectedCategory,
        title,
        content,
        view: view
      });
      console.log(response.status);
      console.log(response.data);

      if (response&&response.status === 201) {                                            // 게시글 등록 성공 시 알림
        console.log('글이 성공적으로 등록되었습니다.');
        alert('글이 성공적으로 등록되었습니다.')
        navigate('/Community');
        window.scrollTo({ top: 0 });
      } else {
        console.error('예상치 못한 응답:', response);
        alert('글 등록에 실패했습니다. 다시 한 번 시도해주세요.')
      }}
    } catch (error) {
      console.error('에러 발생:', error);
      alert('글 작성에 실패했습니다. 다시 한 번 시도해주세요.')
    }
  };


                                       // quill 에디터 이용을 위한 modules와 formats 설정
  const modules = useMemo(() => {                                                         // modules: 에디터의 여러 기능 활성화 또는 비활성화
    return {                                                                              // formats: 텍스트 스타일링과 형식 정의
    toolbar: {                                                                            // modules설정. toolbar와 imageResize 모듈 사용.
      container: [                                                                        //useMemo를 이용해 이전 값을 기억해 성능 최적화.
        [{ header: [1, 2, 3, 4, 5, false] }],
        ["bold","italic", "underline","strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image"],
        [{ align: [] }, { color: [] }, { background: [] }]
      ],
      handlers : {image: imageHandler,},
    },
    imageResize: {                                                                       // 이미지 크기를 조절하기 위한 모듈
      parchment: Quill.import("parchment"),                                              // parchment를 import하여 imageRiseze모듈이 이미지 처리하는 방식 지정
      modules: [
        "Resize", "DisplaySize", "Toolbar"],                                             // imageResize module의 구성
    },                                                                                   // Resize: 이미지 선택시 크기 조절 핸들이 나타나 크기 조절 가능
  };                                                                                     // DisplaySize: 이미지 선택시 이미지의 현재 크기 표시
  },[]);                                                                                 // Toolbar: 툴바에 이미지 리사이즈 관련 버튼 생성
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "color",
    "background",
  ];


  return (
    <div className='commu-write-page inner'>

      {/* 커뮤니티 헤더 */}
      <div className='com-header'><h1 className='com-header__title'>
        커뮤니티
      <p className='com-header__title--detail'>
        다른 사람들은 탄소중립을 어떻게 실천하고 있을까요?
        <br />
            팁도 얻고 고민도 해결해요. 실천기록을 남기면 칭찬과 격려 속에 뿌듯함은 두 배 !
            </p></h1></div>

      {/* 게시글 카테고리 탭 */}
      <div className='commu-category-box commu-write__category-box'>
        <button className={'commu-category__button' + (selectedCategory === 1 ? ' commu-category__button--selected' : '')} onClick={() => handleCategoryClick(1)}>
          실천기록
          </button>
        <button className={'commu-category__button' + (selectedCategory === 2 ? ' commu-category__button--selected' : '')} onClick={() => handleCategoryClick(2)}>
          자유게시판
          </button>
        <button className={'commu-category__button' + (selectedCategory === 3 ? ' commu-category__button--selected' : '')} onClick={() => handleCategoryClick(3)}>
          고민과질문
          </button>
      </div>

      {/* 글 작성을 위한 폼 */}
      <form onSubmit={handlePostSubmit}>

        {/* 제목 입력 input 설정 */}
      <div className='commu-write__title-box'>
        <input
            id='post_title'
            className="commu-write__title"
            type='text'
            value={title}
            onChange={handleTitleChange}
            placeholder="제목을 입력해 주세요"
          />
      </div>

      {/* 내용 입력을 위한 quill-editor 설정 */}
      <div className='commu-write__content-box' >
        <ReactQuill 
        ref={quillRef}
        className="commu-write__content"
        modules={modules}
        formats={formats}
        theme='snow'
        value={content}
        onChange={handleContentChange}/>
      </div>

      {/* 게시물 등록/취소 버튼 */}
      <div className='commu-write__button'>
        <button className="commu-write__button--submit button" type='submit'>등록</button>
        <button className="commu-write__button--cancel button" onClick={() => navigate('/Community')}>취소</button>
      </div>

      </form>
    </div>
  )
}



export default CommunityWrite;