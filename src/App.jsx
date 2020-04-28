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

const cookieObj = new Cookie();

import { connect } from 'react-redux';
import { userKeepLogin } from './redux/actions'
import Cookie from 'universal-cookie';

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
        </Switch>
        <div style={{ height: "120px" }} />
      </>
    );
  }
}

<<<<<<< HEAD
export default connect((state) => ({ user: state.user }), { userKeepLogin })(withRouter(App))
=======
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  keepLogin: userKeepLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
>>>>>>> f86fce85423ff90d22cec77cbdd6f8e9a566db3e
