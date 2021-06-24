import React, { useEffect, useReducer } from "react";
import { loadStripe } from "@stripe/stripe-js";

const fetchCheckoutSession = async ({ quantity }) => {
  return fetch("https://emilio-bike.herokuapp.com/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quantity,
    }),
  }).then((res) => res.json());
};

const formatPrice = ({ amount, currency, quantity }) => {
  const numberFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  for (let part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }
  amount = zeroDecimalCurrency ? amount : amount / 100;
  const total = (quantity * amount).toFixed(2);
  return numberFormat.format(total);
};

function reducer(state, action) {
  switch (action.type) {
    case "useEffectUpdate":
      return {
        ...state,
        ...action.payload,
        price: formatPrice({
          amount: action.payload.unitAmount,
          currency: action.payload.currency,
          quantity: state.quantity,
        }),
      };
    case "increment":
      return {
        ...state,
        quantity: state.quantity + 1,
        price: formatPrice({
          amount: state.unitAmount,
          currency: state.currency,
          quantity: state.quantity + 1,
        }),
      };
    case "decrement":
      return {
        ...state,
        quantity: state.quantity - 1,
        price: formatPrice({
          amount: state.unitAmount,
          currency: state.currency,
          quantity: state.quantity - 1,
        }),
      };
    case "setLoading":
      return { ...state, loading: action.payload.loading };
    case "setError":
      return { ...state, error: action.payload.error };
    default:
      throw new Error();
  }
}

const Checkout = () => {
  const [state, dispatch] = useReducer(reducer, {
    quantity: 1,
    price: null,
    loading: false,
    error: null,
    stripe: null,
  });

  useEffect(() => {
    async function fetchConfig() {
      console.log("HERE 0");
      // Fetch config from our backend.
      const { publicKey, unitAmount, currency } = await fetch(
        "https://emilio-bike.herokuapp.com/config"
      ).then((res) => {
        console.log(res);
        return res.json();
      });
      // Make sure to call `loadStripe` outside of a component’s render to avoid
      // recreating the `Stripe` object on every render.
      console.log("HERE 1");
      dispatch({
        type: "useEffectUpdate",
        payload: { unitAmount, currency, stripe: await loadStripe(publicKey) },
      });
      console.log("HERE 2");
    }
    console.log("CALL THE METHOD");
    fetchConfig();
  }, []);

  const handleClick = async (event) => {
    // Call your backend to create the Checkout session.
    dispatch({ type: "setLoading", payload: { loading: true } });
    const { sessionId } = await fetchCheckoutSession({
      quantity: state.quantity,
    });
    // When the customer clicks on the button, redirect them to Checkout.
    const { error } = await state.stripe.redirectToCheckout({
      sessionId,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    if (error) {
      dispatch({ type: "setError", payload: { error } });
      dispatch({ type: "setLoading", payload: { loading: false } });
    }
  };

  return (
    <div className="sr-root">
      <div className="sr-main">
        <header className="sr-header">
          <div className="sr-header__logo"></div>
        </header>
        <section className="container">
          <div>
            <h1>
              <center>Wheelie in Paradise</center>
            </h1>
            <div> </div>
            <div></div>
            <h4></h4>
            <div className="pasha-image">
              <img
                alt="Random asset from Picsum"
                src="https://emilio-stolenbike.s3.us-west-1.amazonaws.com/shirt.png"
                width="180"
                height="200"
              />
            </div>
          </div>
          <div className="quantity-setter">
            <button
              className="increment-btn"
              disabled={state.quantity === 1}
              onClick={() => dispatch({ type: "decrement" })}
            >
              -
            </button>
            <input
              type="number"
              id="quantity-input"
              min="1"
              max="10"
              value={state.quantity}
              readOnly
            />
            <button
              className="increment-btn"
              disabled={state.quantity === 10}
              onClick={() => dispatch({ type: "increment" })}
            >
              +
            </button>
          </div>
          <p className="sr-legal-text"></p>

          <button
            role="link"
            onClick={handleClick}
            disabled={!state.stripe || state.loading}
          >
            {state.loading || !state.price
              ? `Loading...`
              : `Buy for ${state.price}`}
          </button>
          <div id="about2">
            <center>
              We as a community are raising money on Emilio's behalf to help our
              friend buy a new bike.
            </center>
          </div>
          <div className="sr-field-error">{state.error?.message}</div>
        </section>
      </div>
    </div>
  );
};

export default Checkout;
