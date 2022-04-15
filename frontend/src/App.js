import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import PersonalOrders from "./components/personal-orders.component"
import ManageUsers from "./components/manage-users.component";
import ManageOrders from "./components/manage-orders.component";
import CreateOrder from "./components/create-order.component";

// import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      showUserBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
        showUserBoard: user.roles.includes("ROLE_USER")
      });
    }
    
    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      showUserBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard, showUserBoard } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            PScription
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>
            
            {currentUser && (
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  Profile
                </Link>
              </li>
            )}
            
            {showUserBoard && (
              <li className="nav-item">
                <Link to={"/myorders"} className="nav-link">
                  My Orders
                </Link>
              </li>
            )}

            {showModeratorBoard && (
             <><><li className="nav-item">
              <Link to={"/manageorders"} className="nav-link">
                Manage Orders
              </Link>
            </li></><li className="nav-item">
              <Link to={"/createorder"} className="nav-link">
                Create Order
              </Link>
            </li></>
            )}

            {showAdminBoard && (
              <><><li className="nav-item">
                <Link to={"/manageusers"} className="nav-link">
                  Manage Users
                </Link>
              </li><li className="nav-item">
                  <Link to={"/manageorders"} className="nav-link">
                    Manage Orders
                  </Link>
                </li></><li className="nav-item">
                  <Link to={"/createorder"} className="nav-link">
                    Create Order
                  </Link>
                </li></>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  Sign out
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Sign in
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/myorders" component={PersonalOrders} />
            <Route path="/manageusers" component={ManageUsers} />
            <Route exact path={["/", "/manageorders"]} component={ManageOrders} />
            <Route exact path="/createorder" component={CreateOrder} />
          </Switch>
        </div>

        { /*<AuthVerify logOut={this.logOut}/> */ }
      </div>
    );
  }
}

export default App;
