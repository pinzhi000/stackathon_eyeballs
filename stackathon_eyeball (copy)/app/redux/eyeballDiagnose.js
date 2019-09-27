// Robots Redux

import axios from "axios";

// action variables

const GET_PREDICTION = "GET_PREDICTION";

// action creater

export const getPrediction = prediction => ({
  type: GET_PREDICTION,
  prediction: prediction
});

// THUNKS

// post eyeball

export const getPredictionThunk = () => async dispatch => {
  try {
    const { data } = await axios.get("/api/eyeballs");
    dispatch(getPrediction(data));
    console.log("CALL PREDICTION THUNK", data);
  } catch (err) {
    console.error(err);
  }
};

// robots reducer
const initialState = "";

const eyeballReducerTwo = (state = initialState, action) => {
  switch (action.type) {
    case GET_PREDICTION: {
      return action.prediction;
    }
    default:
      return state;
  }
};

export default eyeballReducerTwo;
