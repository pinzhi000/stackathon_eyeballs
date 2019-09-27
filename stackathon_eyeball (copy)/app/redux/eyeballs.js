// Robots Redux

import axios from "axios";

// action variables

const GET_EYEBALL = "GET_EYEBALL";
const ADD_EYEBALL = "ADD_EYEBALL";
const UPDATE_PREDICTION = "UPDATE_PREDICTION";

// action creater

export const getEyeball = getEyeballObj => ({
  type: GET_EYEBALL,
  getEyeballObj: getEyeballObj
});

export const addEyeball = eyeball => ({
  type: ADD_EYEBALL,
  eyeball: eyeball
});

export const updatePrediction = updatedPrediction => ({
  type: UPDATE_PREDICTION,
  updatedPrediction: updatedPrediction
});

// THUNKS

export const getEyeballThunk = eyeballId => async dispatch => {
  try {
    const { data } = await axios.get(`/api/eyeballs/${eyeballId}`);
    dispatch(getEyeball(data));
  } catch (err) {
    console.log(err);
  }
};

export const postEyeballThunk = newEyeball => async dispatch => {
  try {
    const response = await axios.post("/api/eyeballs/add", newEyeball);
    const createdEyeball = response.data;

    dispatch(addEyeball(createdEyeball));
  } catch (err) {
    console.log(err);
  }
};

export const updateEyeballThunk = predictionUpdate => async dispatch => {
  try {
    const { data } = await axios.put(
      `/api/eyeballs/${predictionUpdate.id}`,
      predictionUpdate
    );
    dispatch(updatePrediction(data));
  } catch (err) {
    console.log(err);
  }
};

// robots reducer
const initialState = {};

const eyeballReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EYEBALL:
      return action.getEyeballObj;
    case ADD_EYEBALL: {
      return action.eyeball;
    }
    case UPDATE_PREDICTION: {
      return action.updatedPrediction;
    }
    default:
      return state;
  }
};

export default eyeballReducer;
