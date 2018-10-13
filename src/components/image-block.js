import React, { Component } from "react";
import spinnerImg from "../assets/loading-gears-animation-13-3.gif";

class ImageBlock extends Component {
  state = { imageStatus: "loading" };

  handleImageLoaded = () => {
    this.setState({ imageStatus: "loaded" });
  };

  handleImageErrored = () => {
    this.setState({ imageStatus: "failed" });
  };
  render() {
    // TODO: Add click handlers to go to image location on unsplash
    //      and/or show it in larger moodal.
    const { imageObj } = this.props;

    // NOTE: Images load fast enough that the spinner normally does not show.
    const spinnerJSX =
      this.state.imageStatus === "loading" ? (
        <img className="spinner" src={spinnerImg} alt="spinner gif" />
      ) : null;

    return (
      <div className="image-block">
        {spinnerJSX}
        <a target="_blank" href={imageObj.links.html}>
          <img
            src={imageObj.urls.small}
            className="image-block-large"
            alt={imageObj.description}
            onLoad={this.handleImageLoaded}
            onError={this.handleImageErrored}
          />
        </a>
      </div>
    );
  }
}

export default ImageBlock;
