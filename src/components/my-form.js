import React, { Component } from "react";
import MyButton from "./my-button";

class MyForm extends Component {
  handleSubmit = event => {
    event.preventDefault();
    this.props.handleSubmit();
  };

  render() {
    const buttonText = this.props.firstPage
      ? "Request Photos from Unsplash!"
      : "Request MORE Photos!";

    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="term"> Search Term</label>
        <input
          name="term"
          type="text"
          onChange={this.props.handleChange}
        />
        {/* <label htmlFor="qty"> Image Quantity</label>
        <input
          name="qty"
          type="number"
          onChange={this.props.handleChange}
        /> */}
        <MyButton
          passedClassName="my-button"
          text={buttonText}
          type="submit"
        />
      </form>
    );
  }
}

export default MyForm;
