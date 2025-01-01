import React from "react";

const Loader = () => {
  const loaderStyle: React.CSSProperties = {
    width: "48px",
    height: "48px",
    display: "inline-block",
    position: "relative",
  };

  const commonStyles: React.CSSProperties = {
    boxSizing: "border-box",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "2px solid #FFF",
    position: "absolute",
    left: 0,
    top: 0,
    animation: "animloader 2s linear infinite",
  };

  const afterStyle: React.CSSProperties = {
    ...commonStyles,
    animationDelay: "1s",
  };

  return (
    <div>
      <span style={loaderStyle}>
        <style>
          {`
            @keyframes animloader {
              0% {
                transform: scale(0);
                opacity: 1;
              }
              100% {
                transform: scale(1);
                opacity: 0;
              }
            }
          `}
        </style>
        <span style={commonStyles}></span>
        <span style={afterStyle}></span>
      </span>
    </div>
  );
};

export default Loader;
