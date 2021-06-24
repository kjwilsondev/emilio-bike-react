import React from "react";
import { Link } from "react-router-dom";

const Canceled = () => {
  return (
    <div className="sr-root">
      <div className="sr-main">
        <header className="sr-header">
          <div className="sr-header__logo"></div>
        </header>
        <div className="sr-payment-summary completed-view">
          <h1>Your payment was canceled</h1>
          <Link to="/">Home</Link>
        </div>
      </div>
      <div className="sr-content">
        <div className="pasha-image-stack">
          <img
            alt=""
            src="https://emilio-stolenbike.s3.us-west-1.amazonaws.com/kiyomi.png"
            width="140"
            height="160"
          />
          <img
            alt=""
            src="https://emilio-stolenbike.s3.us-west-1.amazonaws.com/malik.png"
            width="140"
            height="160"
          />
          <img
            alt=""
            src="https://emilio-stolenbike.s3.us-west-1.amazonaws.com/wheelie.png"
            width="140"
            height="160"
          />
          <img
            alt=""
            src="https://emilio-stolenbike.s3.us-west-1.amazonaws.com/wheelie.png"
            width="140"
            height="160"
          />
        </div>
      </div>
    </div>
  );
};

export default Canceled;
