/**
 * @file
 * Search Field is defined here
 */

// Libraries
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import request from 'superagent';

// Components
import Link from '../Link';
import {SuggestionsComponent} from '../Suggestions/Suggestions.component';
import {Spinner} from '../General/spinner.component';

export class SearchFieldComponent extends Component {
  constructor() {
    super();

    // Load the initial state
    this.state = {
      queryUrl: '',
      query: '',
      suggestions: {},
      suggestActive: false,
      selectedSuggestion: -1,
      pendingSuggest: false
    };

    // Bind context where required
    this.onTextEntered = this.onTextEntered.bind(this);
    this.queryWasSubmitted = this.queryWasSubmitted.bind(this);
    this.onSearchFocus = this.onSearchFocus.bind(this);
    this.onSearchBlurred = this.onSearchBlurred.bind(this);
    this.onSearchKeyUp = this.onSearchKeyUp.bind(this);
    this.selectPreviousSuggestion = this.selectPreviousSuggestion.bind(this);
    this.selectNextSuggestion = this.selectNextSuggestion.bind(this);
    this.getSuggestions = this.deferExecution(
      this.getSuggestions.bind(this),
      200
    );
  }

  componentDidMount() {
    // If the page is loaded with a query, we want write that query into our textfield.

    // Add keyPress event listener
    document.addEventListener('keypress', this.onKeyPress, true);

    if (this.props.params.q) {
      this.onTextEntered({
        target: {
          value: this.props.params.q
        },
        noSuggest: true
      });
    }
  }

  componentWillUnmountn() {
    document.removeEventListener('keypress', this.onKeyPress, true);
  }

  onKeyPress = () => {
    if (this.searchField) {
      this.searchField.focus();
    }
  };

  // UNSAFE_componentWillReceiveProps(props) {
  componentWillReceiveProps(props) { // eslint-disable-line react/no-deprecated
    if (props.params && props.params.q) {
      this.setState({query: props.params.q});
    }
  }

  // Helper function to prevent dispatching requests while a user is typing.
  deferExecution(func, timeout) {
    let timer = null;
    return function() {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(func, timeout, ...arguments);
    };
  }

  // This function requests the suggestions if it can't find them.
  // This function is deferred, so it only executes if a timeinterval has lapsed.
  getSuggestions(query) {
    const suggestions = this.state.suggestions;
    suggestions[query] = query;
    this.setState({suggestions});

    const suggestUrl = encodeURI(`/api/suggest?q=${query}&limit=10`);
    this.setState({pendingSuggest: true});
    request
      .get(suggestUrl)
      .set('Accept', 'application/json')
      .end((err, res) => {
        const bd = JSON.parse(res.text);
        const newSuggestions = Object.assign({}, this.state.suggestions);
        newSuggestions[query] = bd.response;
        this.setState({suggestions: newSuggestions, pendingSuggest: false});
      });
  }

  getValue(input) {
    const regex = /^\d{3,}/g;

    if (regex.test(input)) {
      input = [input.slice(0, 2), '.', input.slice(2)].join('');
    }
    else if (input.length === 3 && input.charAt(2) === '.') {
      input = input.slice(0, 2);
    }

    return input;
  }

  // Updates the state of the component and calls getSuggestions
  onTextEntered = evt => {
    const query = this.getValue(evt.target.value);
    const queryUrl = `/search/${encodeURIComponent(
      query
    )}/100/0/relevance/dictionary`;
    this.setState({
      queryUrl,
      query,
      suggestActive: true,
      selectedSuggestion: -1
    });

    // Get suggestions if relevant.
    if (!evt.noSuggest && query.length >= 2 && !this.state.suggestions[query]) {
      this.getSuggestions(query);
    }
  };

  // Called when the user presses enter or clicks the search button.
  queryWasSubmitted(evt) {
    evt.preventDefault();
    const s = this.state;
    let link = `#!${this.state.queryUrl}`;
    if (
      s.selectedSuggestion >= 0 &&
      s.suggestions[s.query] &&
      s.suggestions[s.query][s.selectedSuggestion] &&
      s.suggestActive
    ) {
      link = s.suggestions[s.query][s.selectedSuggestion].href;
      this.onTextEntered({
        target: {value: s.suggestions[s.query][s.selectedSuggestion].label},
        noSuggest: true
      });
    }

    this.setState({
      suggestActive: false
    });

    return this.context.navigate(link);
  }

  // Let's the user use arrow keys to select a suggestion.
  selectPreviousSuggestion() {
    const suggestLength = (this.state.suggestions[this.state.query] || [])
      .length;
    let newSelection = this.state.selectedSuggestion - 1;
    if (newSelection < 0) {
      newSelection = suggestLength - 1;
    }

    this.setState({
      selectedSuggestion: newSelection
    });
  }

  // Let's the user use arrow keys to select a suggestion.
  selectNextSuggestion() {
    const suggestLength = (this.state.suggestions[this.state.query] || [])
      .length;
    let newSelection = this.state.selectedSuggestion + 1;
    if (newSelection >= suggestLength) {
      newSelection = 0;
    }

    this.setState({
      selectedSuggestion: newSelection
    });
  }

  // Triggered when user clicks on search field
  onSearchFocus() {
    this.setState({suggestActive: true});
  }

  // When a user clicks away from the search field we want to hide the suggestions.
  onSearchBlurred() {
    // Wait 100 ms in case the user clicked one of the suggestions
    setTimeout(() => this.setState({suggestActive: false}), 200);
  }

  // Listens to keys from searchfield
  onSearchKeyUp(evt) {
    switch (evt.keyCode) {
      // Escape key
      case 27: {
        return [
          (this.onSearchBlurred(),
          this.setState({suggestActive: false, query: ''}))
        ];
      }
      // ArrowUp key
      case 38: {
        evt.preventDefault();
        return this.selectPreviousSuggestion();
      }
      // ArrowDown key
      case 40: {
        evt.preventDefault();
        return this.selectNextSuggestion();
      }
      default: {
        return null;
      }
    }
  }

  render() {
    const isSmallScreen = window.innerWidth < 768;
    const inHierarchy = window.location.href.includes('hierarchy');
    if (isSmallScreen && inHierarchy) {
      return;
    }
    return (
      <form
        className="search-field--container"
        onSubmit={this.queryWasSubmitted}
      >
        <div className="search-field--title">
          <label htmlFor="search"><h2>Find hylden med bøger om ...</h2></label>
        </div>
        <div className="search-field--suggestions">
          <span className="search-field--query-area">
            <input
              id="search"
              type="search"
              ref={input => {
                this.searchField = input;
              }}
              autoComplete="off"
              onChange={this.onTextEntered}
              onBlur={this.onSearchBlurred}
              onFocus={this.onSearchFocus}
              onKeyUp={this.onSearchKeyUp}
              className="search-field"
              placeholder="Skriv emne"
              value={this.state.query}
              title="Indtast søgeord"
              accessKey="S"
            />

            <span className="search-field--spinner">
              {this.state.pendingSuggest && <Spinner size="small" />}
            </span>

            <Link to={this.state.queryUrl} className="search-field--button" >
              <div className="search-field--button--button">
                <div className="search-field--button--image">
                  <img alt="" src="/icon-search.svg" />
                </div>
              </div>
              <div className="search-field--button--text">SØG</div>
            </Link>
          </span>

          <SuggestionsComponent
            query={this.state.query}
            suggestions={this.state.suggestions}
            active={this.state.suggestActive}
            selectedSuggestion={this.state.selectedSuggestion}
          />
        </div>
      </form>
    );
  }
}

SearchFieldComponent.displayName = 'Search';
SearchFieldComponent.propTypes = {
  search: PropTypes.object,
  suggest: PropTypes.object,
  params: PropTypes.object,
  pro: PropTypes.bool
};
SearchFieldComponent.defaultProps = {
  search: {},
  suggest: {},
  params: {},
  pro: false
};
