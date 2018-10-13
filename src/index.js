import React, { Component } from "react";
import ReactDOM from "react-dom";
import Unsplash, { toJson } from "unsplash-js";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import "./styles.css";
import * as transitions from "./transition-styles";

import ImageBlock from "./components/image-block";
import ImageColumn from "./components/image-column";
import MyForm from "./components/my-form";

require("dotenv").config();

// Unsplash API setup.
const unsplash = new Unsplash({
  applicationId: process.env.REACT_APP_APPLICATION_ID
});

// TODO: ADD propTypes...

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
          result[j].unshift(
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
