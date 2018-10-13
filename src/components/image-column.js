import React, { Component } from "react";
import { TransitionGroup } from "react-transition-group";

class ImageColumn extends Component {
  render() {
    // TODO: CHANGE this to allow for a dynamic number of columns???
    return (
      <ul className="image-column">
        <TransitionGroup>{this.props.images}</TransitionGroup>
      </ul>
    );
  }
}

export default ImageColumn;
