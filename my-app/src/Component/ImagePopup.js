// ImagePopup.js
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import '../Styles/ImagePopup.css';
import Draggable from "./Draggable";

const ImagePopup = ({ userId, onClose, handleProfileImg, baseURL }) => {

  const [imageUrl, setImageUrl] = useState("");                                                   // 이미지 URL 상태

  const fileInputRef = useRef(null);                                                              // file input 요소접근

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('img', file);

    try {
      const result = await axios.post(`${baseURL}/imgupdate/${userId}`, formData,      // const result = await axios.post('${baseURL}/my/profile/img', formData,
      { headers: { 'Content-Type': 'multipart/form-data' }}
      );
      console.log('success: 서버응답', result.data);

      const imageUrl = `${baseURL}/public/userimg/${result.data}`;                     // 이미지가 존재하는 파일명으로 경로 수정 - *수정코드
      setImageUrl(imageUrl);
      // handleProfileImg(imageUrl); // ----> 저장 전까지 Profile에 표시하지 않도록 주석처리
      // 업로드 성공 시 서버에서 받은 이미지 URL을 상태에 설정 - *오류코드
      // const imageUrl = `${baseURL}/my/profile/img/${result.data}`;
      // 이미지 URL을 부모 컴포넌트로 전달
      // handleProfileImg(`${baseURL}/my/profile/img/${result.data}`);
      // 이미지url 로컬스토리지 저장
      // localStorage.setItem('saveImgUrl', `${baseURL}/my/profile/img/${result.data}`);
      // localStorage.setItem('saveImgUrl', imgUrl);

    } catch (error) {
      console.error('이미지업로드: error', error);
      alert('이미지업로드: error');
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleUpload(file);
    } else {
      alert('이미지가 선택되지 않았습니다.');
    }
  };
  
  const handleImageDelete = () => {                                                               // 이미지url을 상태에서 제거하는 함수
    const confirmation = window.confirm("이미지를 삭제하시겠습니까?");
    if (confirmation) {
      setImageUrl("");
      localStorage.removeItem('storageImg');                                                      // 로컬스토리지에서 이미지url 제거
      window.location.reload();                                                                   // 페이지 새로고침
    }
  };

  const handleSaveImage = () => {                                                                 // 이미지url을 저장하는 함수
    if (imageUrl) {                                                                               // 이미지url이 존재할 경우에 저장
      localStorage.setItem('storageImg', imageUrl);                                               // key = saveImgUrl / value = imageUrl
      alert('이미지가 저장되었습니다.');
      onClose();
      window.location.reload();
    } else {
      alert('이미지를 선택해 주세요.');
    }
  };

  const handleUploadBtnRef = () => {                                                              // 파일 선택 창 이벤트 버튼
    if(fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.log('이미지업로드 버튼 참조 오류');
    }
  };

  useEffect(() => {
    const savedImageUrl = localStorage.getItem('storageImg');
    if (savedImageUrl) {
      setImageUrl(savedImageUrl);
    }
  }, [imageUrl]);

  return (
    <div className="img-modal">
      <Draggable>
        <div>
          <button className="img-modal__close" onClick={onClose}>X</button>
          <br />
          {/* 업로드 버튼 참조 */}
          <div className="img-btn__wrapper">
          <button className="img-modal__btn__select" onClick={handleUploadBtnRef}>파일선택</button>
          </div>
          {/* 파일 업로드 버튼 */}
          <input
            type="file"
            ref={fileInputRef} // useRef로 참조한 input요소
            name="image"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: "none" }} // input 요소 숨김
          /> 
          <br />
          <div className="img-space">
          {imageUrl ? ( // 이미지 URL이 존재할 경우 이미지 표시
              <img className="img-modal__content" src={imageUrl} alt="이미지" />
              ) : ( // 이미지 URL이 없을 경우 "선택된 파일이 없습니다." 표시
                <p>선택된 파일이 없습니다.</p>
              )}
          </div>
          <div className="img-btn__wrapper">
          <button className="img-modal__btn" onClick={handleSaveImage}>저장</button>
          <button className="img-modal__btn" onClick={handleImageDelete}>삭제</button>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default ImagePopup;