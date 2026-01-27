/**
 * @file
 * Root container component
 */

// Libraries
import React, { Component } from "react";
import { Router, Route } from "react-enroute";
import * as client from "../../state/client";

// Components
import { AboutContainerComponent } from "../AboutContainer/AboutContainer.component";
import { HelpContainerComponent } from "../HelpContainer/HelpContainer.component";
import HierarchyContainerComponent from "../HierarchyContainer/HierarchyContainer.component";
import { SearchResultsContainerComponent } from "../SearchResultsContainer/SearchResultsContainer.component";
import { TopBarComponent } from "../TopBar/TopBar.component";
import ComparerContainer from "../Comparer/ComparerContainer.component";
import ResetToFrontpage from "../ResetToFrontpage/ResetToFrontpage.component";
import Link from "../Link";

// Helper function
function getHash(hash) {
  if (typeof hash === "string" && hash.length > 0) {
    if (hash.substring(0, 2) === "#!") {
      return hash.substring(2).length === 0 ? "/" : hash.substring(2);
    }

    return hash;
  }

  return "/";
}

// Global state object
const state = {
  location: getHash(window.location.hash),
  search: {
    categories: {
      "00 xx 07": {
        label:
          "Bogvæsen. Biblioteker. Museer. Medier. Leksika og blandede værker",
        index: "00-07",
        backgroundImage: "/categories/bogvaesen.jpg",
      },
      "10 - 19": {
        label:
          "Filosofi. Psykologi. Videnskab og forskning. Kommunikation og IT",
        index: "10-19",
        backgroundImage: "/categories/filosofi.jpg",
      },
      "20 - 29": {
        label: "Religion",
        index: "20-29",
        backgroundImage: "/categories/religion.jpg",
      },
      "30 - 39": {
        label: "Samfundsfag. Pædagogik. Forsorg. Folkekultur",
        index: "30-39",
        backgroundImage: "/categories/samfundsfag.jpg",
      },
      "40 - 49": {
        label: "Geografi og rejser. Lokalhistorie.",
        index: "40-49",
        backgroundImage: "/categories/geografi.jpg",
      },
      "50 - 59": {
        label: "Naturvidenskab. Matematik. Antropologi og etnografi.",
        index: "50-59",
        backgroundImage: "/categories/naturvidenskab.jpg",
      },
      "60 - 69": {
        label: "Teknik. Sygdom og sundhed. Erhverv. Hus og hjem.",
        index: "60-69",
        backgroundImage: "/categories/teknik.jpg",
      },
      "70 - 79": {
        label: "Kultur. Kunstarter. Sport",
        index: "70-79",
        backgroundImage: "/categories/kultur.jpg",
      },
      "80 - 89": {
        label: "Litteratur. Sprog",
        index: "80-89",
        backgroundImage: "/categories/litteratur.jpg",
      },
      "90 - 99": {
        label: "Historie. Biografier og erindringer",
        index: "90-99",
        backgroundImage: "/categories/historie.jpg",
      },
    },
  },
  hierarchy: {},
  suggest: {},
  cart: {
    contents: {},
    isToggled: false,
  },
  pro: typeof window !== "undefined" && window.PRO,
  test: typeof window !== "undefined" && window.TEST,
};

export class RootContainerComponent extends Component {
  constructor() {
    super();

    state.cart.addOrRemoveContent = this.addRemoveContentsToCart.bind(this);
    state.cart.toggleCart = this.toggleCart.bind(this);
    state.cart.clearCart = this.clearCart.bind(this);
    this.state = state;
  }

  componentDidMount() {
    window.addEventListener(
      "hashchange",
      () => {
        this.setState({
          location: getHash(window.location.hash),
        });
      },
      true,
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.location === "/") {
      location.href = window.location.hash;
    }
  }

  getChildContext() {
    return {
      navigate: (path) => {
        window.location.hash = path;
        this.setState({
          location: getHash(path),
        });
      },
    };
  }

  addRemoveContentsToCart(item) {
    const cart = Object.assign({}, this.state.cart);
    if (cart.contents[item.index]) {
      delete cart.contents[item.index];
    } else {
      cart.contents[item.index] = item;
      this.getAdditionalInfoOnItems(item.index);
    }

    this.setState({ cart: cart });
  }

  getAdditionalInfoOnItems(indexes) {
    client
      .list(indexes)
      .then((result) => {
        const cart = Object.assign({}, this.state.cart);
        const keys = Object.keys(result);

        keys.forEach((index) => {
          if (cart.contents[index]) {
            cart.contents[index].data = result[index];
          }
        });

        this.setState({ cart: cart });
      })
      .catch((err) => {
        console.error(
          `Der kunne ikke hentes data for index(er): ${indexes}`,
          err,
        ); // eslint-disable-line no-console
      });
  }

  toggleCart() {
    const cart = Object.assign({}, this.state.cart);
    cart.isToggled = !cart.isToggled;
    this.setState({ cart: cart });
  }

  clearCart() {
    location.reload();
  }

  render() {
    const displayComparer =
      this.state.pro &&
      (Object.keys(this.state.cart.contents).length ||
        this.state.cart.isToggled);

    return (
      <div
        className={`root-container ${
          (displayComparer && "has-comparer") || ""
        }`}
      >
        <ResetToFrontpage
          timerEnabled={
            !this.state.pro &&
            !(window.location.hash === "" || window.location.hash === "/")
          }
          testEnv={this.state.test}
        />
        <TopBarComponent cart={this.state.cart} pro={this.state.pro} />

        <Router {...this.state}>
          <Route path="/" component={SearchResultsContainerComponent} />
          <Route path="/help" component={HelpContainerComponent} />
          <Route path="/about" component={AboutContainerComponent} />
          <Route
            path="/hierarchy/:id?"
            component={HierarchyContainerComponent}
          />
          <Route
            path="/search/:q/:limit/:offset/:sort/:spell?"
            component={SearchResultsContainerComponent}
          />
        </Router>

        {displayComparer && <ComparerContainer cart={this.state.cart} />}
        <div className="footer">
          Copyright 2017 © DBC DIGITAL A/S, Tempovej 7-11, DK-2750
          Ballerup,&nbsp;
          <a title="telefon nr" href="tel:+4544867711">
            +45 44 86 77 11
          </a>
          ,&nbsp;
          <a
            title="DBC kundeservice"
            href="https://kundeservice.dbc.dk/"
            target="_blank"
            rel="noopener noreferrer"
          >
            kundeservice.dbc.dk
          </a>
          <br />
          <Link title="Om dk5" className="link" to="#!/about">
            Om DK5
          </Link>
          <br />
          {(!this.state.pro && (
            <a
              title="tilgængelighedserklæring"
              className="link"
              rel="noreferrer"
              href="https://www.was.digst.dk/dk5-dk"
              target="_blank"
            >
              Tilgængelighedserklæring
            </a>
          )) ||
            ""}
        </div>
      </div>
    );
  }
}

RootContainerComponent.displayName = "RootContainer";
