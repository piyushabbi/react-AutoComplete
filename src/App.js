import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      data: [],
      filteredRes: []
    };
  }
  componentDidMount() {
    fetch("http://localhost:4000/data")
      .then(res => res.json())
      .then(res => {
        this.setState(prevState => ({
          data: [...prevState, ...res]
        }));
      });
  }
  onChangeHandler = e => {
    this.setState(
      {
        searchTerm: e.target.value
      },
      () => {
        if (this.state.searchTerm.length) {
          const filteredData = this.state.data.filter(
            f => f.title.indexOf(this.state.searchTerm) > -1
          );
          this.setState(prevState => ({
            filteredRes: [...prevState, ...filteredData]
          }));
        } else {
          this.setState(prevState => ({
            filteredRes: []
          }));
        }
      }
    );
  };
  /**
   * Find and highlight relevant keywords within a block of text
   * @param  {string} label - The text to parse
   * @param  {string} value - The search keyword to highlight
   * @return {object} A JSX object containing an array of alternating strings and JSX
   */
  formatLabel = (label, value) => {
    if (!value) {
      return label;
    }
    return (
      <span>
        {
          label
          .split(value)
          .reduce((prev, current, i) => {
            if (!i) {
              return [current];
            }
            return prev.concat(
              <mark key={value + current}><b>{value}</b></mark>,
              current
            );
          }, [])
        }
      </span>
    );
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>
            Book Search <i>(with AutoComplete | Type Ahead)</i>
          </h1>
        </header>
        <input
          type="search"
          value={this.state.searchTerm}
          autoFocus={true}
          onChange={this.onChangeHandler}
          placeholder="Search for Books"
        />
        {this.state.filteredRes.length !== 0 && (
          <div className="list">
            <ul>
              {this.state.filteredRes.map(m => (
                <li key={m["s.no"]}>
                  {this.formatLabel(m.title, this.state.searchTerm)}
                </li>
              ))}
            </ul>
          </div>
        )}
        {this.state.filteredRes.length === 0 &&
          this.state.searchTerm.length !== 0 && (
            <div>
              <i>No Results matched</i>
            </div>
          )}
      </div>
    );
  }
}

export default App;
