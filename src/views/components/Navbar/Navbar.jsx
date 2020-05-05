import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons/";
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";

import { faUser } from "@fortawesome/free-regular-svg-icons";

import "./Navbar.css";
import ButtonUI from "../Button/Button";
import { connect } from "react-redux"
import { logoutHandler, searchHandler, cartUpdateHandler } from "../../../redux/actions"
import Cookie from 'universal-cookie';

const cookieObject = new Cookie();

const CircleBg = ({ children }) => {
  return <div className="circle-bg">{children}</div>;
};

class Navbar extends React.Component {
  state = {
    searchBarIsFocused: false,
    searcBarInput: "",
    dropdownOpen: false,
  };

  componentDidMount() {
    if (this.props.user.id) {
      this.props.cartUpdateHandler(this.props.user.id)
    }
  }

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

  logoutBtnHandler = () => {
    this.props.onLogout();
    // this.forceUpdate();
  };

  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  render() {
    return (
      <div className="d-flex flex-row justify-content-between align-items-center py-4 navbar-container">
        <div className="logo-text">
          <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
            LOGO
          </Link>
        </div>
        <div
          style={{ flex: 1 }}
          className="px-5 d-flex flex-row justify-content-start"
        >
          <input
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={(e) => this.props.onSearch(e.target.value)}
            className={`search-bar ${
              this.state.searchBarIsFocused ? "active" : null
              }`}
            type="text"
            placeholder="Cari produk impianmu disini"
          />
        </div>
        <div className="d-flex flex-row align-items-center">
          {this.props.user.id ? (
            <>
              <Dropdown
                toggle={this.toggleDropdown}
                isOpen={this.state.dropdownOpen}
              >
                <DropdownToggle tag="div" className="d-flex">
                  <FontAwesomeIcon icon={faUser} style={{ fontSize: 24 }} />
                  <p className="small ml-3 mr-4">{this.props.user.username}</p>
                </DropdownToggle>

                {this.props.user.role == "admin" ? (
                  <DropdownMenu className="mt-2">
                    <DropdownItem>
                      <Link
                        style={{ color: "inherit", textDecoration: "none" }}
                        to="/admin/dashboard"
                      >
                        Dashboard
                    </Link>
                    </DropdownItem>
                    <DropdownItem>
                      <Link
                        style={{ color: "inherit", textDecoration: "none" }}
                        to="/admin/reports"
                      >
                        Reports
                      </Link>
                    </DropdownItem>
                    <DropdownItem>
                      <Link
                        style={{ color: "inherit", textDecoration: "none" }}
                        to="/admin/payments"
                      >
                        Payments
                    </Link>
                    </DropdownItem>
                  </DropdownMenu>
                ) : (
                    <DropdownMenu className="mt-2">
                      {/* <DropdownItem>Wishlist</DropdownItem> */}
                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/history"
                        >
                          History
                      </Link>
                      </DropdownItem>
                    </DropdownMenu>
                  )}


              </Dropdown>
              <Link
                className="d-flex flex-row"
                to="/cart"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <FontAwesomeIcon
                  className="mr-2"
                  icon={faShoppingCart}
                  style={{ fontSize: 24 }}
                />
                <CircleBg>
                  <small style={{ color: "#3C64B1", fontWeight: "bold" }}>
                    {this.props.component.cartCount}
                  </small>
                </CircleBg>
              </Link>
              <ButtonUI
                onClick={this.logoutBtnHandler}
                className="ml-3"
                type="textual"
              >
                Logout
              </ButtonUI>
            </>
          ) : (
              <>
                <ButtonUI className="mr-3" type="textual">
                  <Link
                    style={{ textDecoration: "none", color: "inherit" }}
                    to="/auth"
                  >
                    Sign in
                </Link>
                </ButtonUI>
                <ButtonUI type="contained">
                  <Link
                    style={{ textDecoration: "none", color: "inherit" }}
                    to="/auth"
                  >
                    Sign up
                </Link>
                </ButtonUI>
              </>
            )}
        </div>
      </div >
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    component: state.component
  };
};

const mapDispatchToProps = {
  onLogout: logoutHandler,
  onSearch: searchHandler,
  cartUpdateHandler
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
