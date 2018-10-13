import React, { Component } from "react";

class MyButton extends Component {
  render() {
    return (
      <button className={this.props.passedClassName}>
        {this.props.text}
      </button>
    );
  }
}

export default MyButton;
