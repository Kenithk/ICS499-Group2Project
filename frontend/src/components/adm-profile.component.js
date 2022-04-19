import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";
import PScription from "../components/images/logo192.png";

export default class AdmProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" }
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const { currentUser } = this.state;
    const windowWidth = document.documentElement.clientWidth;
    return (
      <div className="container" style={{"width": windowWidth}}>
        <header className="jumbotron">
            <div className="col-md-8" style={{padding: 0, left: 250, top: 80}}>
              <h1><strong>PScription</strong></h1>
              </div>
              <div className="col-md-8" style={{padding: 0, left: 250, top: 100}}>
                <h2>A place for all your medical needs</h2>
                </div>
                <div className="col-md-8" style={{padding: 0, left: 25, top: -75}}>
                  <img src={PScription} height={192} width={192} alt= "PScription logo"/> 
                  </div>            
            </header>
        {(this.state.userReady) ?
        <div>
        <div className="col-md-6">
          <h2><strong>My PScription profile</strong></h2>
          </div>
        <div className="col-md-6">
        <h4><strong>Personal Information</strong></h4>
        </div>
        <div className="col-md-6">
        <h4><strong>Username:</strong>{" "}{currentUser.username}</h4>
        </div >
        <div className="col-md-6">
        <h4><strong>User ID:</strong>{" "}{currentUser.id}</h4>
        </div>
        <div className="col-md-6">
        <h4><strong>Email:</strong>{" "}{currentUser.email}</h4>
        </div>
        <div className="col-md-6">
        <h4><strong>Assigned role(s):</strong></h4>
        <ul>
          {currentUser.roles &&
            currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
        </ul>
        </div>
      </div>: null}
      </div>
    );
  }
}