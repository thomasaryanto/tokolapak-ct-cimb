import React from "react";
import "./TextField.css";

type TextFieldProps = {
  focused?: boolean;
  className?: string;
  placeholder?: string;
  onChange?: any;
  value?: any;
  type?: string;
};

class TextField extends React.Component<TextFieldProps> {
  state = {
    searchBarIsFocused: false,
    searcBarInput: "",
  };

  onFocus = () => {
    this.setState({ searchBarIsFocused: true });
  };

  onBlur = () => {
    this.setState({ searchBarIsFocused: false });
  };

  render() {
    return (
      <input
        value={this.props.value}
        onChange={this.props.onChange}
        placeholder={this.props.placeholder}
<<<<<<< HEAD
        type={this.props.type}
=======
        type={this.props.type || "text"}
>>>>>>> f86fce85423ff90d22cec77cbdd6f8e9a566db3e
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        className={`custom-text-input ${
          this.state.searchBarIsFocused ? "active" : null
          } ${this.props.className}`}
      />
    );
  }
}

export default TextField;
