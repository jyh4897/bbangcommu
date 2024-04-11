// ImageContext.js
import React, { createContext, useContext, useState } from 'react';

const ImageContext = createContext();

export const useImage = () => useContext(ImageContext);

export const ImageProvider = ({ children }) => {
  const [imageUrl, setImageUrl] = useState('');

  return (
    <ImageContext.Provider value={{ imageUrl, setImageUrl }}>
      {children}
    </ImageContext.Provider>
  );
};

// useImage 커스텀 훅은 Context의 값을 가져오기 위한 함수입니다. 
// ImageProvider는 이미지 URL을 관리하고 전역적으로 제공하기 위한 컴포넌트
// 그런 다음, 이 컨텍스트를 사용하여 이미지 팝업과 프로필 폼에서 이미지 URL을 관리하도록 코드를 수정