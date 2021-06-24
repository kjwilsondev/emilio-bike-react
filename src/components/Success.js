import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Success = () => {
  const [session, setSession] = useState({});
  const location = useLocation();
  const sessionId = location.search.replace("?session_id=", "");

  useEffect(() => {
    async function fetchSession() {
      setSession(
        await fetch("/checkout-session?sessionId=" + sessionId).then((res) =>
          res.json()
        )
      );
    }
    fetchSession();
  }, [sessionId]);

  return (
    <div className="sr-root">
      <div className="sr-main">
        <header className="sr-header">
          <div className="sr-header__logo"></div>
        </header>
        <div className="sr-payment-summary completed-view">
          <h1>Your payment succeeded</h1>
          <h4>Thank you for your purchase!</h4>
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

export default Success;
