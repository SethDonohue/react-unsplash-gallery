import React, { Component } from "react";
import ReactDOM from "react-dom";
import Unsplash, { toJson } from "unsplash-js";
import {
  CSSTransition,
  TransitionGroup,
  Fragment
} from "react-transition-group";

import "./styles.css";
import spinnerImg from "./assets/Loading.gif";
import * as transitions from "./transition-styles";

require("dotenv").config();

// Unsplash API setup.
const unsplash = new Unsplash({
  applicationId: process.env.APPLICATION_ID,
  secret: process.env.SECRET
});

// TODO: ADD propTypes...
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

class MyButton extends Component {
  render() {
    return (
      <button className={this.props.passedClassName}>{this.props.text}</button>
    );
  }
}

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
        <input name="term" type="text" onChange={this.props.handleChange} />
        <label htmlFor="qty"> Image Quantity</label>
        <input name="qty" type="number" onChange={this.props.handleChange} />
        <MyButton passedClassName="my-button" text={buttonText} type="submit" />
      </form>
    );
  }
}

class App extends Component {
  //  Seting a default state to avoid sending null data for
  //  parts of the request if the inputs are empty.
  state = {
    images: [],
    firstPage: true,
    currPage: 1,
    term: "mountain",
    qty: 3,
    searchError: null
  };
  // TODO: ADD user inputs to allow control for:
  //      + Size of images to return
  //      +

  requestNewCollection = () => {
    unsplash.search
      .photos(
        this.state.term.toLowerCase(),
        this.state.currPage,
        this.state.qty
      )
      .then(toJson)
      .then(pictures => {
        console.log("App ID: ", process.env.APPLICATION_ID);
        console.log("Sec: ", process.env.SECRET);
        console.log(pictures);
        // Trigger search error if most recent results are empty.
        if (pictures.results.length < 1) {
          this.setState({
            searchError: "Your search term returned no results!"
          });
        } else {
          this.setState({ searchError: null });
        }
        this.setState((prevState, props) => {
          return {
            // Save photos to state... on top of previous state so we keep
            //  adding to the gallery instead of restarting.
            images: [...prevState.images].concat(pictures.results),
            currPage: prevState.currPage + 1
          };
        });
      });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { images } = this.state;
    const result = [[], [], []];
    (() => {
      // Go through all the images, and skip to next 3 when inner
      //  loop is complete.
      for (let i = 0; i < images.length; i = i + 3) {
        for (let j = 0; j < 3; j++) {
          const imageObj = images[i + j];
          result[j].push(
            <CSSTransition
              key={imageObj.id}
              timeout={transitions.duration}
              classNames={transitions.type.fade}
            >
              <li>
                <ImageBlock imageObj={imageObj} />
              </li>
            </CSSTransition>
          );
        }
      }
    })();

    return (
      <div className="App">
        <header className="App-header" />
        <main>
          <MyForm
            firstPage={this.state.firstPage}
            handleSubmit={this.requestNewCollection}
            handleChange={this.handleChange}
          />
          <TransitionGroup>
            {this.state.searchError ? (
              <CSSTransition
                key="123"
                timeout={transitions.duration}
                classNames={transitions.type.fade}
              >
                <div className="search-error">{this.state.searchError}</div>
              </CSSTransition>
            ) : null}
          </TransitionGroup>

          <div className="gallery">
            <ImageColumn images={result[0]} />
            <ImageColumn images={result[1]} />
            <ImageColumn images={result[2]} />
          </div>
        </main>
      </div>
    );
  }
}

export default App;

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
