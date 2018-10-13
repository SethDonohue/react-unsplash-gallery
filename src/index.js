import React, { Component } from "react";
import ReactDOM from "react-dom";
import Unsplash, { toJson } from "unsplash-js";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import "./styles.css";
import * as transitions from "./transition-styles";
import spinnerImg from "./assets/loading-gears-animation-13-3.gif";

import ImageBlock from "./components/image-block";
import ImageColumn from "./components/image-column";
import MyForm from "./components/my-form";

require("dotenv").config();

// Unsplash API setup.
const unsplash = new Unsplash({
  applicationId: process.env.REACT_APP_APPLICATION_ID
});

// TODO: ADD propTypes...
// TODO: ADD user inputs to allow control for:
//      + Size of images to return
//      +

class App extends Component {
  //  Seting a default state to avoid sending null data for
  //  parts of the request if the inputs are empty.
  state = {
    images: [],
    firstPage: true,
    currPage: 1,
    term: "mountain",
    qty: 3,
    searchError: null,
    loading: 3
  };

  requestNewCollection = () => {
    this.setState({ loading: 0 });
    unsplash.search
      .photos(
        this.state.term.toLowerCase(),
        this.state.currPage,
        this.state.qty
      )
      .then(toJson)
      .then(pictures => {
        // Trigger search error if most recent results are empty.
        if (pictures.results.length < 1) {
          this.setState({
            searchError: "Your search term returned no results!",
            loading: this.state.qty
          });
        } else {
          this.setState({ searchError: null });
        }
        this.setState((prevState, props) => {
          return {
            // Save photos to state... on top of previous state so we keep
            // adding to the gallery instead of restarting.
            images: [...prevState.images].concat(pictures.results),
            currPage: prevState.currPage + 1
          };
        });
      });
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
      currPage: 1
    });
  };

  handleLoadingUpdate = () => {
    // increment load status while all 3 images load.
    this.setState(prevState => {
      return {
        loading: prevState.loading + 1
      };
    });
  };

  render() {
    const { images } = this.state;
    const result = [[], [], []];
    (() => {
      // Go through all the images, and skip to next 3 when inner
      //  loop is complete.
      for (let i = 0; i < images.length; i = i + this.state.qty) {
        for (let j = 0; j < this.state.qty; j++) {
          const imageObj = images[i + j];
          result[j].unshift(
            <CSSTransition
              key={imageObj.id}
              timeout={transitions.duration.medium}
              classNames={transitions.type.fadeHeight}
            >
              <li>
                <ImageBlock
                  handleLoadingUpdate={this.handleLoadingUpdate}
                  imageObj={imageObj}
                />
              </li>
            </CSSTransition>
          );
        }
      }
    })();

    // NOTE: Images load fast enough that the spinner normally does not show.
    const spinnerJSX =
      this.state.loading < this.state.qty ? (
        <CSSTransition
          key="123"
          timeout={transitions.duration.fast}
          classNames={transitions.type.fade}
        >
          <img className="spinner" src={spinnerImg} alt="spinner gif" />
        </CSSTransition>
      ) : null;

    return (
      <div className="App">
        <header className="App-header" />
        <main>
          <TransitionGroup>{spinnerJSX}</TransitionGroup>
          <MyForm
            firstPage={this.state.firstPage}
            handleSubmit={this.requestNewCollection}
            handleChange={this.handleChange}
          />
          <TransitionGroup>
            {this.state.searchError ? (
              <CSSTransition
                key="123"
                timeout={transitions.duration.slow}
                classNames={transitions.type.fadeHeight}
              >
                <div className="search-error">
                  {this.state.searchError}
                </div>
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
