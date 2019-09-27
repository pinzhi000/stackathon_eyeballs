import React from "react";
import { connect } from "react-redux";
import { getPredictionThunk } from "../redux/eyeballDiagnose";
//import UpdatePrediction from "../components/UpdatePredictionComp";

export class EyeballDiagnosis extends React.Component {
  componentDidMount() {
    try {
      this.props.getPredictionThunk();
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    // if (!this.props.prediction) {
    //   return <h1>test2</h1>;
    // } else {
    //   return <h1>My Prediction Is: {this.props.prediction}</h1>;
    // }

    //return <h2> test </h2>;
    return <h1>My Prediction Is: {this.props.prediction}</h1>;
    // console.log("PROPS", this.props);
    // return this.props.prediction ? (
    //   <h1>My prediction is: {this.props.prediction}</h1>
    // ) : (
    //   <h1>...</h1>
    // );
    // <div>
    //   My prediction is: {this.props.prediction}
    //   <UpdatePrediction />
    // </div>
  }
}

// move from state (store) to props
const mapStateToProps = state => {
  return {
    prediction: state.eyeballDiagnose
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // changes value of eyeballs in store
    getPredictionThunk: () => dispatch(getPredictionThunk())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EyeballDiagnosis);
