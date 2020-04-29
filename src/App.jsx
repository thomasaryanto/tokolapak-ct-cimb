import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Cookie from "universal-cookie";
import { connect } from "react-redux";

import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

import Home from "./views/screens/Home/Home";
import Navbar from "./views/components/Navbar/Navbar";
import AuthScreen from "./views/screens/Auth/AuthScreen";
import { userKeepLogin } from "./redux/actions";
import ProductDetails from "./views/screens/ProductDetails/ProductDetails";

const cookieObject = new Cookie();

class App extends React.Component {

  componentDidMount() {
    let cookieResult = cookieObject.get("authData")
    if (cookieResult) {
      this.props.userKeepLogin(cookieResult)
    }
  }

  render() {
    return (
      <>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/auth" component={AuthScreen} />
          <Route exact path="/product/:productId" component={ProductDetails} />
        </Switch>
        <div style={{ height: "120px" }} />
      </>
    );
  }
}

export default connect((state) => ({ user: state.user }), { userKeepLogin })(withRouter(App))
