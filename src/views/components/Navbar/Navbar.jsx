import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons/";

import { faUser } from "@fortawesome/free-regular-svg-icons";

import "./Navbar.css";
import { Link } from "react-router-dom";
import ButtonUI from "../Button/Button.tsx";

import { connect } from "react-redux"
import { logoutHandler } from "../../../redux/actions"
import Cookie from 'universal-cookie';

const cookieObject = new Cookie();

const CircleBg = ({ children }) => {
  return <div className="circle-bg">{children}</div>;
};

class Navbar extends React.Component {
  state = {
    searchBarIsFocused: false,
    searcBarInput: "",
  };

  logout = () => {
    cookieObject.remove("authData")
    this.props.logoutHandler()
  }

  onFocus = () => {
    this.setState({ searchBarIsFocused: true });
  };

  onBlur = () => {
    this.setState({ searchBarIsFocused: false });
  };

  render() {
    return (
      <div className="d-flex flex-row justify-content-between align-items-center py-4 navbar-container">
        <div className="logo-text">
          <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
            LOGO
          </Link>
        </div>
        <div style={{ flex: 1 }} className="px-5">
          <input
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            className={`search-bar ${
              this.state.searchBarIsFocused ? "active" : null
              }`}
            type="text"
            placeholder="Cari produk impianmu disini"
          />
        </div>
        <div className="d-flex flex-row align-items-center">


          {
            this.props.user.id ?
              (
                <>
                  <FontAwesomeIcon icon={faUser} style={{ fontSize: 24 }} />
                  <p className="small ml-3 mr-4">{this.props.user.id}</p>
                  <FontAwesomeIcon className="mr-2" icon={faShoppingCart} style={{ fontSize: 24 }} />
                  <CircleBg>
                    <small style={{ color: "#3C64B1", fontWeight: "bold" }}>4</small>
                  </CircleBg>
                  <ButtonUI onClick={this.logout} type="contained" className="ml-2">Logout</ButtonUI>
                </>
              ) :
              (
                <>
                  <Link to="/auth">
                    <ButtonUI className="mr-3" type="textual">Sign in</ButtonUI>
                  </Link>

                  <Link to="/auth">
                    <ButtonUI type="contained">Sign up</ButtonUI>
                  </Link>
                </>

              )
          }
        </div>
      </div >
    );
  }
}

export default connect((state) => ({ user: state.user }), { logoutHandler })(Navbar);
