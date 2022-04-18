import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";
import UserDataService from "../services/user.service";
import PScription from "../components/images/logo192.png";

export default class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.refreshUser = this.refreshUser.bind(this);
    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" },
      notifications: null
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) this.setState({ redirect: "/home" })
    this.setState({ currentUser: currentUser, userReady: true});
    this.refreshUser(currentUser)
  }

  refreshUser(currentUser) {
    UserDataService.refreshUser(currentUser.id)
      .then(response => {
        this.setState({
          currentUser: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const { currentUser } = this.state;

    if(currentUser.notifications === 0) {
      return (
        <div className="container">
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
          <h4><strong>User ID:</strong>{" "}{currentUser.id} </h4>
          </div>
          <div className="col-md-6">
          <h4><strong>Email:</strong>{" "}{currentUser.email}</h4>
          </div>
          <div className="col-md-12">
          <h4><strong>You have no new notifications</strong></h4>
          </div>
        </div>: null}
        </div>
      );
    }

    return (
      <div className="container">
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
        <h4><strong>User ID:</strong>{" "}{currentUser.id} </h4>
        </div>
        <div className="col-md-6">
        <h4><strong>Email:</strong>{" "}{currentUser.email}</h4>
        </div>
        <div className="col-md-12">
        <h4><strong>You have {currentUser.notifications} new notifications from new Orders. Go to "My Orders" to see the details</strong></h4>
        </div>
      </div>: null}
      </div>
    );
  }
}