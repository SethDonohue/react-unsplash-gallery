import React, { Component } from "react";

class ImageBlock extends Component {
  state = { imageStatus: "loading" };

  handleImageErrored = () => {
    this.setState({ imageStatus: "failed" });
  };
  render() {
    const { imageObj } = this.props;

    return (
      <div className="image-block">
        <a target="_blank" href={imageObj.links.html}>
          <img
            src={imageObj.urls.small}
            className="image-block-large"
            alt={imageObj.description}
            onLoad={this.props.handleLoadingUpdate}
            onError={this.handleImageErrored}
          />
        </a>
      </div>
    );
  }
}

export default ImageBlock;
