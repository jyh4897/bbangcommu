// ProfileForm.js
import axios from "axios";
import { useEffect, useState } from "react";
import ImagePopup from "./ImagePopup";
import "../Styles/MyPage.css";
import { Icon } from '@iconify/react';


const ProfileForm = ({ userId, baseURL }) => {
    const [profileData, setProfileData] = useState([]);                                                     // 회원 정보 상태관리
    const [imageUrl, setImageUrl] = useState("");                                                           // 이미지 URL 상태관리
    const [showPopup, setShowPopup] = useState(false);                                                      // 이미지팝업창 클릭이벤트 상태관리

    const handleImgPopup = () => {
        setShowPopup(true);
    };

    useEffect(() => {                                                                                       // 페이지 로드 시 저장된 이미지url 가져와서 상태에 설정
        const savedImageUrl = localStorage.getItem('storageImg');
        if (savedImageUrl) {
            setImageUrl(savedImageUrl);
        }

        const fetchProfile = async () => {                                                                  // fetchProfile 함수를 useEffect 내부에서 정의하고 호출
            try {
                const response = await axios.get(`${baseURL}/my/profile/${userId}`);
                const userData = response.data[0];                                                          // n번째 데이터
                setProfileData(userData);
            } catch (error) {
                console.error('Error: fetching profile data:', error);
            }
        };


        fetchProfile();                                                                                      // fetchProfile 함수 호출
    }, [userId]);                                                                                            // userId가 변경될 때마다 호출

    return (
        <div className="my-profile-form" >
            <div className="my-form__title">
                <p className="my-form__text">나의 프로필</p>
            </div>

            <div className="my-profile-form__wrapper">
                <div className="my-profile-form__img">
                    {/* 업로드 된 이미지가 없다면 user_img폴더의 이미지를 표시 */}
                    {imageUrl ? (<img src={imageUrl} alt="userimg" />)
                        : (<img className="my-profile-form__img" src="/user_img/basic.png" alt="IMG" />)}
                    <button className="my-profile__btn" onClick={handleImgPopup}><Icon className="my-profile__btn__icon" icon="mdi:photo-camera" /></button>
                </div>
            </div>

            {/* 이미지 팝업 */} {/* ImagePopup에 userId 전달 */}
            {showPopup && <ImagePopup userId={userId} onClose={() => setShowPopup(false)} />}

            {/* id식별 조건부 렌더링 */}
            {profileData.usertype === '2' || profileData.usertype === '3'
                ? (<p>사업자번호 {profileData.businessnumber}</p>) : null}
            <div className="my-profile-name__wrapper">
                <span className="my-profile__username">{profileData.username}</span>
                <span className="my-profile__sir">님</span>
            </div>

            <div class="my-profile-content__detail">
                <table>
                    <tr>
                        <td>아이디</td>
                        <td>{profileData.email}</td>
                    </tr>
                    <tr>
                        <td>휴대전화</td>
                        <td>{profileData.phonenumber && 
                            profileData.phonenumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}</td>
                    </tr>
                    <tr>
                        <td>주소</td>
                        <td>{profileData.address}</td>
                    </tr>
                    <tr>
                        <td>상세주소</td>
                        <td>{profileData.detailedaddress}</td>
                    </tr>
                </table>
            </div>
        </div>
    );
};
export default ProfileForm;