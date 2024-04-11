// MyPage.js
import { useEffect, useState } from "react";
import ProfileForm from "../Component/ProfileForm";
import EditForm from '../Component/EditForm';
import ActivityForm from '../Component/ActivityForm';
import IsLikeForm from "../Component/IsLikeForm";
import axios from "axios";
import "../Styles/MyPage.css";

const MyPage = ({baseURL}) => {
  const [activeForm, setActiveForm] = useState('profile');
  const [formData, setFormData] = useState({});
  const [selectedButton, setSelectedButton] = useState('profile');

   const storedUserData = sessionStorage.getItem("userData");
   const userData = JSON.parse(storedUserData);
  //  console.log("세션확인:",userData)

  useEffect(() => {
    const fetchData = async (formType) => {
      try {
        const storedUserData = sessionStorage.getItem("userData");
        const userData = JSON.parse(storedUserData);
        const response = await axios.get(`${baseURL}/my/${formType}/${userData.userid}`);

        if (response.data.length > 0) {                                                                           // 반환된 데이터가 배열 안에 객체이므로 첫 번째 요소를 선택
          setFormData(response.data[0]);                                                                          // 응답 데이터 형식은 배열 안에 객체의 형태
        } else {                                                                                                  // response.data는 배열이며, 실제 데이터는 배열의 첫 번째 요소인 객체에 들어 있다 
          console.log("User data not found");                                                                     // 첫 번째 요소에 해당하는 객체를 상태로 설정
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData(activeForm);
  }, [activeForm]);

  const handleFormChange = (formType) => {                                                                        // 폼 선택 핸들러
    setActiveForm(formType);
    setSelectedButton(formType);
  };

  return (
    <div className="my-page inner">
      <div className='com-header'><h1 className='com-header__title'>마이페이지<p className='com-header__title--detail'>내가 남긴 발자국은 어떤 모양일까?<br />
      나의 탄소중립 활동으로 확인해요. 발자국이 많을 수록 탄소중립에 한 발 더 가까이!</p></h1>
      </div>
      <div className="my-page__wrapper">
        <div className="my-page__btn">
          <ul>
          <li><button className={`my-btn__button ${selectedButton === 'profile' ? 'active' : ''}`} onClick={() => handleFormChange('profile')}>프로필</button></li>
          <li><button className={`my-btn__button ${selectedButton === 'edit' ? 'active' : ''}`} onClick={() => handleFormChange('edit')}>정보수정</button></li>
          <li><button className={`my-btn__button ${selectedButton === 'activity' ? 'active' : ''}`} onClick={() => handleFormChange('activity')}>나의활동</button></li>
          <li><button className={`my-btn__button ${selectedButton === 'islike' ? 'active' : ''}`} onClick={() => handleFormChange('islike')}>좋아요</button></li>
          </ul>
        </div>
      {/* Form 조건부 렌더링 */}
        <div className="my-page__right">
        {activeForm === 'profile' && <ProfileForm baseURL={baseURL} formData={formData} userId={userData.userid} />}
        {/* {activeForm === 'profile' && <ProfileForm formData={formData} userId={userData.userid} />} */}
        {activeForm === 'edit' && <EditForm baseURL={baseURL} formData={formData} userId={userData.userid} onFormChange={handleFormChange} />}
        {activeForm === 'activity' && <ActivityForm baseURL={baseURL} formData={formData} userId={userData.userid} />}
        {activeForm === 'islike' && <IsLikeForm baseURL={baseURL} formData={formData} userId={userData.userid} />}
        </div>
      </div>
      <div>
      </div>
    </div>
  );
};

export default MyPage;