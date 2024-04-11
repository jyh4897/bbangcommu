import React, { useState } from 'react';
import "../Styles/MyPage.css";


const PasswordValid = ({ onPasswordValid }) => {
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => {                                                               // 부모 컴포넌트에게 기존 비밀번호 유효성 검사를 요청합니다.
        e.preventDefault();
        onPasswordValid(password);
    };

    return (
        <div className='my-pass-form'>
            <p>본인 확인을 위해<br/>비밀번호를 다시 확인해주세요</p>
            <form onSubmit={handleSubmit}>
                <label>
                    {/* <h4>비밀번호 확인</h4> */}
                    <br />
                    <input className='my-pass-input'
                        type="password"
                        value={password}
                        placeholder='비밀번호를 입력해주세요.'
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                </label>
                <br />
                <button className='my-pass__btn' type="submit">확인</button>
            </form>
        </div>
    );
};

export default PasswordValid;
