// 게시글 작성 시간을 변환하는 함수
export const formattedDateAndTime = (createdAt, format) => {
  const date = new Date(createdAt);
  
  // 각 부분의 값을 가져옴
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  
  // 오전/오후 구분
  const ampm = hour < 12 ? '오전' : '오후';
  
  // 12시간제로 변경
  const formattedHour = hour % 12 || 12;
  
  // 출력 형식 조합
  const formattedDateTime = `${year}. ${month}. ${day} ${ampm} ${formattedHour}:${minute}`;
  
  // 요청된 포맷에 따라 반환
  switch (format) {
    case 'date':
      return `${year}. ${month}. ${day}`;
    case 'time':
      return `${ampm} ${formattedHour}:${minute}`;
    default:
      return formattedDateTime; // 날짜와 시간 반환
  }
};

// 게시글 콘텐츠에서 이미지 URL을 추출하여 썸네일 생성
export const getPostThumbnail = (content) => {
  // 정규 표현식을 사용하여 이미지 URL 추출
  const regex = /<img\s+src\s*=\s*\"([^\"]+)\"/g;
  const matches = content.match(regex);
  console.log(matches)

  // 게시글에 이미지가 있는 경우 첫 번째 이미지 URL 반환, 없는 경우 null 반환
  const url = matches ? matches[0].replace('<img src="', '').replace('"', '') : null;
  console.log(url)
  return matches ? matches[0].replace('<img src="', '').replace('"', '') : '/background_img/thumb4.png';
};