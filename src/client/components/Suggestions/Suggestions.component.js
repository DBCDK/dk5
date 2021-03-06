/**
 * @file: This file defines the suggestions dropdown that is triggered on typing in the search field.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Link from '../Link';

export class SuggestionsComponent extends Component {
  render() {
    let suggestions = this.props.suggestions[this.props.query];
    if (!this.props.active || !Array.isArray(suggestions) || Array.isArray(suggestions) && !suggestions.length) {
      return (
        <span className="no-suggestions" />
      );
    }

    suggestions = suggestions.map((suggestion, idx) => {
      let className = 'suggestions--suggestion';
      if (idx === this.props.selectedSuggestion) {
        className += ' active--suggestion';
      }

      return (
        <Link key={suggestion.href} to={suggestion.href} className={className}>{suggestion.label}</Link>
      );
    });

    return (
      <div className='suggestions--container'>
        <div className='suggestions--floater'>
          {suggestions}
        </div>
      </div>
    );
  }
}

SuggestionsComponent.displayName = 'Suggestions';
SuggestionsComponent.propTypes = {
  suggestions: PropTypes.object,
  query: PropTypes.string,
  active: PropTypes.bool,
  selectedSuggestion: PropTypes.number
};
