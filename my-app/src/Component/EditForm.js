import axios from "axios";
import { useState, useEffect, useRef } from "react";
import DaumPostcode from "react-daum-postcode";
import { handlePostcode } from "./Postcodehandle";
import PasswordValid from "./PasswordValid";
import "../Styles/MyPage.css";

const EditForm = ({ userId, onFormChange, baseURL }) => {
  const [profileData, setProfileData] = useState({});
  const [showEditForm, setShowEditForm] = useState(false);

  const [username, setUsername] = useState("");                                                             // 이름
  const [password, setPassword] = useState("");                                                             // 비밀번호
  const [confirmPassword, setConfirmPassword] = useState("");                                               // 비밀번호 확인
  const [phonenumber, setPhonenumber] = useState("");                                                       // 휴대폰 번호

  const [openPostcode, setOpenPostcode] = useState(false);                                                  // 주소
  const [address, setAddress] = useState("");                                                               // 주소
  const [detailedaddress, setdetailedaddress] = useState("");                                               // 상세 주소

  const [usernameDuplication, setUsernameDuplication] = useState(false);                                    // 닉네임 유효성
  const [phonenumberDuplication, setPhonenumberDuplication] = useState(false);                              // 휴대폰 번호 유효성
  const [usernameChanged, setUsernameChanged] = useState(false);
  const [phonenumberChanged, setPhonenumberChanged] = useState(false);

  const handle = handlePostcode(openPostcode, setOpenPostcode, setAddress);

  const setPasswordMatch = (match) => {
    // setPasswordMatch(true) 또는 setPasswordMatch(false) 등으로 사용
  };

  const spacebar = /\s/g;                                                                                   // 공백 정규표현식
  const special = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;                                       // 특수문자 정규표현식
  const NICKcheck = /^[가-힣a-zA-Z0-9]{4,10}$/;
  const PWcheck =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=!])[a-zA-Z\d@#$%^&+=!]{8,16}$/;                                   // PW 정규표현식
  const tel = /^010\d{8}$/;                                                                                 // 휴대폰 번호 정규표현식

                                                                                                            // 이전 username, phonenumber 상태를 저장할 변수
  const prevUsername = useRef(username);
  const prevPhonenumber = useRef(phonenumber);

  useEffect(() => {                                                                                         // username 상태가 변경될 때만 실행
    if (prevUsername.current !== username) {
      setUsernameDuplication(false);                                                                        // setUsernameDuplication을 false로 설정
      prevUsername.current = username;                                                                      // 이전 username 상태를 갱신
    }
  }, [username]);                                                                                           // username 상태가 변경될 때만 실행되도록 useEffect의 의존성 배열에 추가

  useEffect(() => {                                                                                         // phonenumber 상태가 변경될 때만 실행
    if (prevPhonenumber.current !== phonenumber) {
      setPhonenumberDuplication(false);                                                                     // setPhonenumberDuplication을 false로 설정
      prevPhonenumber.current = phonenumber;                                                                // 이전 phonenumber 상태를 갱신
    }
  }, [phonenumber]);

  useEffect(() => {                                                                                         // 유저가 닉네임을 바꾸기 위해 수정을 시도한 경우에만 중복 검사 진행
    if (profileData.username !== username) {
      setUsernameChanged(true);
    } else {
      setUsernameChanged(false);
    }
  }, [profileData.username, username]);

  useEffect(() => {                                                                                         // 유저가 핸드폰 번호를 바꾸기 위해 수정을 시도한 경우에만 중복 검사 진행
    if (profileData.phonenumber !== phonenumber) {
      setPhonenumberChanged(true);
    } else {
      setPhonenumberChanged(false);
    }
  }, [profileData.phonenumber, phonenumber]);

  useEffect(() => {                                                                                       // 컴포넌트가 마운트될 때와 userId가 변경될 때마다 실행
    const fetchProfile = async () => {
      try {
        const response = await axios.get(                                                                 // axios를 사용하여 서버에서 해당 userId에 해당하는 사용자 프로필 데이터를 가져옵니다.
          `${baseURL}/my/edit/${userId}`
        );
        const userData = response.data[0];                                                                // 가져온 데이터를 profileData 상태에 설정
        setProfileData(userData);
        setUsername(userData.username);
        setPassword('')
        setPhonenumber(userData.phonenumber);
        setAddress(userData.address);
        setdetailedaddress(userData.detailedaddress);
        console.log('프로필 데이터', userData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfile();
  }, []);

  const handlePasswordValid = async (password) => {                                                       // 비밀번호 유효성 검사
    try {
      const response = await axios.post(                                                                  // 비밀번호 검사 요청을 서버에 보냅니다.
        `${baseURL}/pw-valid/${userId}`,
        {
          userId: userId,
          password: password,
        }
      );
      setShowEditForm(response.data.isValid);                                                             // 검증이 성공하면 수정 양식을 표시합니다.
      const res = response.data.isValid;
      console.log(res);
    } catch (error) {
      console.error("Error validating password:", error);
    }
  };

  const handleUsernameCheck = () => {                                                                     // 닉네임 중복 검사
    if (!username) {
      setUsernameDuplication(true);
    } else if (username.match(spacebar)) {
      alert("닉네임에 공백을 포함할 수 없습니다.");
      return;
    } else if (username.match(special)) {
      alert("닉네임에 특수문자를 포함할 수 없습니다.");
      return;
    } else if (!NICKcheck.test(username)) {
      alert("닉네임 형식이 올바르지 않습니다.");
      return;
    } else {
      setUsernameDuplication(true);
    }

    axios
      .post(`${baseURL}/checkUsernameDuplication`, { username })
      .then((response) => {
        console.log("서버 응답:", response.data);
        setUsernameDuplication(response.data.success);
        alert(response.data.message);
      })
      .catch((error) => {
        console.error("닉네임 중복 확인 중 오류:", error);
        alert("client :: 닉네임 중복 확인 중 오류가 발생했습니다.");
      });
  };

  const handlePhonenumberCheck = () => {                                                                  // 휴대폰 번호 중복 검사
    if (!phonenumber) {
      setPhonenumber(profileData.phonenumber);
      setPhonenumberDuplication(true);
      return;
    } else if (phonenumber.match(spacebar)) {
      alert("휴대폰 번호에 공백을 포함할 수 없습니다.");
      return;
    } else if (phonenumber.match(special)) {
      alert("휴대폰 번호에 특수문자를 포함할 수 없습니다.");
      return;
    } else if (!tel.test(phonenumber)) {
      alert("휴대폰 번호 형식이 올바르지 않습니다.");
      return;
    } else {
      setPhonenumberDuplication(true);
    }

    axios
      .post(`${baseURL}/checkPhonenumberDuplication`, {
        phonenumber,
      })
      .then((response) => {
        console.log("서버 응답:", response.data);
        setPhonenumberDuplication(response.data.success);
        alert(response.data.message);
      })
      .catch((error) => {
        console.error("휴대폰 번호 중복 확인 중 오류:", error);
        alert("client :: 휴대폰 번호 중복 확인 중 오류가 발생했습니다.");
      });
  };

  const handleCancel = () => {                                                                           // MyPage 컴포넌트의 handleFormChange 함수 호출
    onFormChange('profile');
    window.scrollTo(0, 300);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();                                                                             // 수정된 정보를 서버에 전송
    try {
      if (usernameChanged && !usernameDuplication) {
        alert("닉네임 중복 확인을 해주세요.");
        return;
      }                                                                                                 // 비밀번호를 입력한 경우에만 유효성 검사
      if (password && (password.match(spacebar))) {
        alert("비밀번호에 공백을 포함할 수 없습니다.");
        setPasswordMatch(false);
        return; 
      }                                                                                                 // 비밀번호를 입력한 경우에만 유효성 검사
      if (password && (!PWcheck.test(password))) {
        alert("비밀번호 형식이 올바르지 않습니다.");
        setPasswordMatch(false);
        return;
      }
      if (password !== confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        setPasswordMatch(false);
        return;
      }
      if (phonenumberChanged && !phonenumberDuplication) {
        alert("휴대폰 번호 중복 확인을 해주세요.");
        return;
      }
      if (!address) {
        alert("주소를 입력하세요.");
        return;
      }

      const updatedData = {                                                                             //변경된 정보만 추출
        username: username,
        ...(password && { password: password }),                                                        // 비밀번호를 입력했다면 입력된 비밀번호를 반환, 그렇지 않으면 아무것도 반환하지 않음(서버에 전송X)
        confirmPassword: confirmPassword,
        phonenumber: phonenumber,
        address: address,
        detailedaddress: detailedaddress,
      };
      await axios.put(
        `${baseURL}/my/edit/update/${userId}`,
        updatedData
      );
      alert("성공적으로 수정되었습니다.");
      handleCancel();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const passwordMatch = !spacebar.test(password) && password.match(PWcheck);                            // 비밀번호 유효성 검사 만족하는 상태

  return (
    <div className="my-edit-form">
      <div className="my-edit-form__wrapper">
        <div className="my-form__title">
          <p className="my-form__text">나의 정보 수정</p>
        </div>
        <table>
          <tbody>
            {!showEditForm ? (
              <tr>
                <td>
                  <PasswordValid onPasswordValid={handlePasswordValid} />
                </td>
              </tr>
            ) : (
              <tr>
                <td className="my-edit-form__content">
                  <tr>
                    <td>
                      <label className="my-edit-form__label">
                        <span className="my-edit-form__text">ID</span>
                        <input
                          className="my-edit-form__input"
                          type="text"
                          name="email"
                          value={profileData.email}
                          placeholder={profileData.email}
                          disabled
                        />
                        <div className="my-edit__addspace"></div>
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className="my-edit-form__label">
                        <span className="my-edit-form__text">닉네임</span>
                        <input
                          className="my-edit-form__input"
                          type="text"
                          name="username"
                          value={username}
                          placeholder={profileData.username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <div className="my-edit__addspace">
                        <button
                          className="my-edit__sub__btn"
                          onClick={handleUsernameCheck}
                        >
                          중복 확인
                        </button>
                        </div>
                      </label>
                    </td>
                  </tr>
                  <p className="my-edit-form-match__text">한글·영문·숫자로만 4~10자리</p>
                  <tr>
                    <td>
                      <label className="my-edit-form__label">
                        <span className="my-edit-form__text">PW 변경</span>
                        <input
                          className="my-edit-form__input"
                          type="password"
                          name="password"
                          value={password}
                          placeholder="변경할 비밀번호를 입력하세요."
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="my-edit__addspace">
                        {password && password.match(spacebar) && (
                          <p style={{ color: "red", textAlign: "center", lineHeight: "1.5" }}>
                            비밀번호에 공백을<p>포함할 수 없습니다.</p></p>
                        )}
                        {password && !PWcheck.test(password) && (
                          <p style={{ color: "red", textAlign: "center", lineHeight: "1.5" }}>
                            비밀번호 형식이<p>올바르지 않습니다.</p></p>
                        )}
                        {password && passwordMatch && (
                          <p style={{ color: "rgb(83, 212, 92)", textAlign: "center", lineHeight: "1.5" }}>
                            사용 가능한 <p>비밀번호 입니다.</p>
                          </p>
                        )}
                        </div>
                      </label>
                    </td>
                  </tr>
                  <p className="my-edit-form-match__text">영문·숫자·특수문자 섞어서 8~16 자리(사용 가능한 특수문자 : @#$%^&+=!)</p>
                  <tr>
                    <td>
                      <label className="my-edit-form__label">
                        <span className="my-edit-form__text">
                          PW 재입력
                        </span>
                        <input
                          className="my-edit-form__input"
                          type="password"
                          name="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={!password}                                                          // password가 비어 있으면 confirmPassword를 비활성화
                        />
                        <div className="my-edit__addspace">
                        {passwordMatch && confirmPassword && (
                          <p
                            style={{
                              color: password === confirmPassword ? "rgb(83, 212, 92)" : "red", 
                              textAlign: "center", lineHeight: "1.5",
                            }}
                          >
                            {password === confirmPassword
                              ? <p>비밀번호가<br/>일치합니다.</p>
                              : <p>비밀번호가<br/>일치하지 않습니다.</p>}
                          </p>
                        )}
                        </div>
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className="my-edit-form__label">
                        <span className="my-edit-form__text">휴대폰 번호</span>
                        <input
                          className="my-edit-form__input"
                          type="text"
                          name="phonenumber"
                          value={phonenumber}
                          placeholder={profileData.phonenumber}
                          onChange={(e) => setPhonenumber(e.target.value)}
                        />
                        <div className="my-edit__addspace">
                        <button
                          className="my-edit__sub__btn"
                          onClick={handlePhonenumberCheck}
                        >
                          중복 확인
                        </button>
                        </div>
                      </label>
                    </td>
                  </tr>
                  <p className="my-edit-form-match__text">하이픈 '-' 제외 e.g. 01012345678</p>
                  <tr>
                    <td>
                      <label className="my-edit-form__label">
                        <span className="my-edit-form__text">주소</span>
                        <input
                          className="my-edit-form__input"
                          type="text"
                          name="address"
                          value={address}
                          placeholder={profileData.address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                        <div className="my-edit__addspace">
                        <button
                          type="button"
                          className="my-edit__sub__btn"
                          onClick={handle.clickButton}
                        >
                          주소 선택
                        </button>
                        </div>
                      </label>
                      {openPostcode && (
                        <DaumPostcode
                          onComplete={handle.selectAddress}
                          autoClose={false}
                          defaultQuery=""
                        />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className="my-edit-form__label">
                        <span className="my-edit-form__text">상세주소</span>
                        <input
                          className="my-edit-form__input"
                          type="text"
                          name="detailedaddress"
                          value={detailedaddress}
                          placeholder={profileData.detailedaddress}
                          onChange={(e) => setdetailedaddress(e.target.value)}
                        />
                      </label>
                    </td>
                  </tr>
                  <div className="my-edit-form-wrapper__btn">
                    <button
                      className="my-edit-form__btn"
                      onClick={handleEditSubmit}
                    >
                      수정하기
                    </button>
                    <button className="my-edit-form__btn" onClick={handleCancel}>
                      취소
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
      );
};

      export default EditForm;
