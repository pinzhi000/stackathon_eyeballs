import { combineReducers } from "redux";
import robots from "./robots";
import projects from "./projects";
import eyeballs from "./eyeballs";
import eyeballDiagnose from "./eyeballDiagnose";

// This reducer is just a stub. We should probably do something
// with that combineReducers thing up there...

const appReducer = combineReducers({
  robots,
  projects,
  eyeballs,
  eyeballDiagnose
});

export default appReducer;
