import { useState, useRef, useEffect } from "react";                                  // 이미지 팝업창 마우스로 움직이는 컴포넌트

const Draggable = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);

  useEffect(() => {                                                                   // 마운트될 때 한 번 실행되도록 설정
    const modal = modalRef.current;
    const centerX = window.innerWidth / 2 - modal.offsetWidth / 2;                    // 화면의 중앙에 모달을 위치시키기 위한 계산
    const centerY = window.innerHeight / 2 - modal.offsetHeight / 2;
    modal.style.left = centerX + "px";                                                // 모달의 초기 위치를 설정  
    modal.style.top = centerY + "px";
  }, []);

  const handleMouseDown = (event) => {
    setIsDragging(true);
    const modal = modalRef.current;
    const offsetX = event.clientX - modal.offsetLeft;
    const offsetY = event.clientY - modal.offsetTop;
    setOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const modal = modalRef.current;
      modal.style.left = event.clientX - offset.x + "px";
      modal.style.top = event.clientY - offset.y + "px";
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={modalRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        position: "absolute",
        border: "1px solid #ccc",
        backgroundColor: "#fff",
        padding: "20px",
      }}
    >
      {children}
    </div>
  );
};

export default Draggable;
