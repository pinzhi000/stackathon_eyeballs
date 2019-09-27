import React, { Component } from "react";
import { connect } from "react-redux";
import { postEyeballThunk } from "../redux/eyeballs";
import { withRouter } from "react-router-dom";

const defaultState = {
  imageUrl: "",
  success: false
};

class UploadEyeball extends Component {
  constructor() {
    super();

    console.log("CREATE EYEBALL PROP", this.props);
    this.state = defaultState;

    // bind methods
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
      success: false
    });
  };

  handleSubmit(event) {
    event.preventDefault();
    try {
      // const res = await axios.post("/api/eyeballs", this.state);
      this.props.postEyeballThunk({ imageUrl: this.state.imageUrl });
      this.setState({
        success: true
      });
    } catch (error) {
      this.setState({
        errorMessage: `There was a problem creating the robot: ${error.message}`
      });
    }
  }

  // eslint-disable-next-line complexity
  render() {
    console.log("PROPS", this.props);
    console.log("STATE", this.state);
    return (
      <form
        onSubmit={event => {
          this.handleSubmit(event);
        }}
      >
        {/* 1. Eyeball */}
        <div className="form">
          <label htmlFor="imageUrl">Eyeball Image URL:</label>
          <input
            name="imageUrl"
            type="url"
            onChange={this.handleChange}
            value={this.name}
          />
        </div>

        <button type="submit" className="btn robot-submit">
          Submit
        </button>
        {this.state.success && <div>Posted to DB!</div>}
      </form>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    postEyeballThunk: eyeball => dispatch(postEyeballThunk(eyeball))
  };
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(UploadEyeball)
);
