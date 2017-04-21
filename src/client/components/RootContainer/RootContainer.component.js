/**
 * @file
 * Root container component
 */

// Libraries
import React, {Component} from 'react';
import {Router, Route} from 'react-enroute';
import * as client from '../../state/client';

// Components
import {HelpContainerComponent} from '../HelpContainer/HelpContainer.component';
import HierarchyContainerComponent from '../HierarchyContainer/HierarchyContainer.component';
import {SearchResultsContainerComponent} from '../SearchResultsContainer/SearchResultsContainer.component';
import {TopBarComponent} from '../TopBar/TopBar.component';
import ComparerContainer from '../Comparer/ComparerContainer.component';

// Helper function
function getHash(hash) {
  if (typeof hash === 'string' && hash.length > 0) {
    if (hash.substring(0, 2) === '#!') {
      return hash.substring(2).length === 0 ? '/' : hash.substring(2);
    }

    return hash;
  }

  return '/';
}

// Global state object
const state = {
  location: getHash(window.location.hash),
  search: {
    categories: {
      '00 - 07': {
        label: 'Bogvæsen. Biblioteker. Museer. Medier. Leksika og blandede værker',
        index: '00-07',
        backgroundImage: '/categories/bogvaesen.jpg'
      },
      '10 - 19': {
        label: 'Filosofi. Psykologi. Videnskab og forskning. Kommunikation og IT',
        index: '10-19',
        backgroundImage: '/categories/filosofi.jpg'
      },
      '20 - 29': {
        label: 'Religion',
        index: '20-29',
        backgroundImage: '/categories/religion.jpg'
      },
      '30 - 39': {
        label: 'Samfundsfag. Pædagogik. Forsorg. Folkekultur',
        index: '30-39',
        backgroundImage: '/categories/samfundsfag.jpg'
      },
      '40 - 49': {
        label: 'Geografi og rejser. Lokalhistorie.',
        index: '40-49',
        backgroundImage: '/categories/geografi.jpg'
      },
      '50 - 59': {
        label: 'Naturvidenskab. Matematik. Antropologi og etnografi.',
        index: '50-59',
        backgroundImage: '/categories/naturvidenskab.jpg'
      },
      '60 - 69': {
        label: 'Teknik. Sygdom og sundhed. Erhverv. Hus og hjem.',
        index: '60-69',
        backgroundImage: '/categories/teknik.jpg'
      },
      '70 - 79': {
        label: 'Kultur. Kunstarter. Sport',
        index: '70-79',
        backgroundImage: '/categories/kultur.jpg'
      },
      '80 - 89': {
        label: 'Litteratur. Sprog',
        index: '80-89',
        backgroundImage: '/categories/litteratur.jpg'
      },
      '90 - 99': {
        label: 'Historie. Biografier og erindringer',
        index: '90-99',
        backgroundImage: '/categories/historie.jpg'
      }
    }
  },
  hierarchy: {},
  suggest: {},
  cart: {
    contents: {},
    isToggled: false
  },
  pro: typeof window !== 'undefined' && window.PRO
};

export class RootContainerComponent extends Component {
  constructor() {
    super();

    state.cart.addOrRemoveContent = this.addRemoveContentsToCart.bind(this);
    state.cart.toggleCart = this.toggleCart.bind(this);
    this.state = state;
  }

  componentDidMount() {
    window.addEventListener('popstate', () => {
      this.setState({
        location: getHash(window.location.hash)
      });
    });
  }

  addRemoveContentsToCart(item) {
    const cart = Object.assign({}, this.state.cart);
    if (cart.contents[item.index]) {
      delete cart.contents[item.index];
    }
    else {
      cart.contents[item.index] = item;
      this.getAdditionalInfoOnItems(item.index);
    }

    this.setState({cart: cart});
  }

  getAdditionalInfoOnItems(indexes) {
    client.list(indexes)
      .then((result) => {
        const cart = Object.assign({}, this.state.cart);
        const keys = Object.keys(result);

        keys.forEach((index) => {
          if (cart.contents[index]) {
            cart.contents[index].data = result[index];
          }
        });

        this.setState({cart: cart});
      })
      .catch((err) => {
        console.error(`Der kunne ikke hentes data for index(er): ${indexes}`, err); // eslint-disable-line no-console
      });
  }

  getChildContext() {
    return {
      navigate: path => {
        window.location.hash = path;
        this.setState({
          location: getHash(path)
        });
      }
    };
  }

  toggleCart() {
    const cart = Object.assign({}, this.state.cart);
    cart.isToggled = !cart.isToggled;
    this.setState({cart: cart});
  }

  render() {
    return (
      <div>
        <TopBarComponent cart={this.state.cart} pro={this.state.pro}/>

        <Router {...this.state}>
          <Route path="/" component={SearchResultsContainerComponent}/>
          <Route path="/help" component={HelpContainerComponent}/>
          <Route path="/hierarchy/:id?" component={HierarchyContainerComponent}/>
          <Route path="/search/:q/:limit/:offset/:sort/:spell?" component={SearchResultsContainerComponent}/>
        </Router>

        {this.state.pro && <ComparerContainer cart={this.state.cart}/>}
      </div>
    );
  }
}

RootContainerComponent.displayName = 'RootContainer';
