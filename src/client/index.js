/**
 * @file
 * Client side entry point
 */

// Libraries
import ReactDOM from "react-dom";
import React from "react";

// Styles
import "./scss/index.scss";

// Components
import { RootContainerComponent } from "./components/RootContainer/RootContainer.component";

// Get the elements we want to fill
const rootContainer = document.getElementById("content");

// Render the elements into the DOM.
ReactDOM.render(<RootContainerComponent />, rootContainer);
