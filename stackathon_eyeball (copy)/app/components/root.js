import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { connect } from "react-redux";

//import { postEyeballThunk } from "../redux/eyeballs";
import EyeballLoadComp from "./EyeballLoadComp";
import EyeballDiagnosis from "./EyeballDiagComp";
import UpdateEyeball from "./EyeballUpdateComp";

export class Root extends React.Component {
  componentDidMount() {
    //this.props.postEyeball();
  }

  render() {
    return (
      <Router>
        <div>
          <nav>Welcome!</nav>
          <h1>
            Welcome to StackBot Project Management: your robot employees are
            awaiting assignments!
          </h1>
          {/* localhost */}
          <Route exact path="/" component={EyeballLoadComp} />
          <Route exact path="/diagnosis" component={EyeballDiagnosis} />
          <Route exact path="/update/:eyeballId" component={UpdateEyeball} />
        </div>
      </Router>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // postEyeball: () => dispatch(postEyeballThunk())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Root);
