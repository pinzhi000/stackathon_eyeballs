import React from "react";
import { getEyeballThunk, updateEyeballThunk } from "../redux/eyeballs";
import { connect } from "react-redux";
// Link
import { withRouter } from "react-router-dom";

class UpdateEyeball extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      diagnosis: this.props.eyeballs.diagnosis
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.loadSingleEyeball(1);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
      success: false
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    //this.state.id = this.props.eyeballs.id;

    const updatedEyeball = {
      id: this.props.eyeballs.id,
      imageUrl: this.props.eyeballs.imageUrl,
      diagnosis:
        typeof this.state.diagnosis === "string"
          ? this.state.diagnosis
          : this.props.eyeballs.diagnosis
    };

    this.props.updateEyeballThunk(updatedEyeball);
    //this.props.loadSingleEyeball(1); // ?
    this.setState({
      success: true
    });
  }

  render() {
    console.log("PROPS", this.props);
    return (
      <div>
        <h1>Edit Diagnosis</h1>
        <form onSubmit={this.handleSubmit}>
          <div>
            <span>
              <p>Disease Prediction</p>
              <input
                type="text"
                name="diagnosis"
                value={
                  //this.state.name
                  typeof this.state.diagnosis === "string"
                    ? this.state.diagnosis
                    : this.props.eyeballs.diagnosis
                }
                onChange={this.handleChange}
              />
            </span>

            {/* <span>
              <p>Beer Image</p>
              <select
                name="imageUrl"
                value={
                  typeof this.state.imageUrl === "string"
                    ? this.state.imageUrl
                    : this.props.beer.imageUrl
                }
                onChange={this.handleChange}
              >
                <option value="">select a beer image</option>
                <option value="/images/bad-mama-yama.jpg">Bad Mama Yama</option>
                <option value="/images/dark-paradise.jpg">Dark Paradise</option>
                <option value="./images/default-beer.jpg">Default Beer</option>
                <option value="/images/hi-honey.jpg">Hi Honey</option>
                <option value="/images/hibiscus-saison.jpg">
                  Hibiscus Saison
                </option>
                <option value="/images/wedding-saison.jpg">
                  Wedding Saison
                </option>
              </select>
            </span> */}

            <br />

            <span>
              <p>
                <button type="submit">Update</button>
                {this.state.success && (
                  <div>Prediction has been updated in db!</div>
                )}
              </p>
            </span>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    eyeballs: state.eyeballs
  };
};

const mapDispatchToProps = dispatch => ({
  loadSingleEyeball: id => dispatch(getEyeballThunk(id)),
  updateEyeballThunk: updatedEyeball =>
    dispatch(updateEyeballThunk(updatedEyeball))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UpdateEyeball)
);
