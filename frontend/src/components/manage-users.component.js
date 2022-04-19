import React, { Component } from "react";
import ContentsService from "../services/contents.service";
import EventBus from "../common/EventBus";
import UserDataService from "../services/user.service";
import PScription from "../components/images/logo192.png";

export default class ManageUsers extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchCriteria = this.onChangeSearchCriteria.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.retrieveUsers = this.retrieveUsers.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveUser = this.setActiveUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.setUser = this.setUser.bind(this);
    this.setMod = this.setMod.bind(this);
    this.setAdmin = this.setAdmin.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.searchCriteria = this.searchCriteria.bind(this);
    this.state = {
      content: "",
      users: [],
      currentUser: null,
      currentIndex: -1,
      searchCriteria: ""
    };
  }

  componentDidMount() {
    ContentsService.getManageUsers().then(
      response => {
        this.setState({
          content: response.data,
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
        
        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      },
      this.retrieveUsers()
    );
  }

  onChangeSearchCriteria(e) {
    const searchCriteria = e.target.value;
    this.setState({
      searchCriteria: searchCriteria
    });
  }

  onChangeUsername(e) {
    const username = e.target.value;   
    this.setState(prevState => ({
      currentUser: {
        ...prevState.currentUser,
        username: username
      }
    }));
  }

  onChangeEmail(e) {
    const email = e.target.value;   
    this.setState(prevState => ({
      currentUser: {
        ...prevState.currentUser,
        email: email
      }
    }));
  }

  retrieveUsers() {
    UserDataService.getAll()
      .then(response => {
        this.setState({
          users: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveUsers();
    this.setState({
      currentUser: null,
      currentIndex: -1
    });
  }

  setActiveUser(user, index) {
    this.setState({
      currentUser: user,
      currentIndex: index
    });
  }

  searchCriteria() {
    UserDataService.getByCriteria(this.state.searchCriteria)
      .then(response => {
        this.setState({
          users: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateUser() {
    UserDataService.update(
      this.state.currentUser.id,
      this.state.currentUser
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The user was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  setUser() {
    UserDataService.setUser(
      this.state.currentUser.id,
      this.state.currentUser
    )
    .then(response => {
      console.log(response.data);
      this.setState({
        message: "User role assigned successfully!"
      });
    })
    .catch(e => {
      console.log(e);
    });
  }

  setMod() {
    UserDataService.setMod(
      this.state.currentUser.id,
      this.state.currentUser
    )
    .then(response => {
      console.log(response.data);
      this.setState({
        message: "Mod role assigned successfully!"
      });
    })
    .catch(e => {
      console.log(e);
    });
  }

  setAdmin() {
    UserDataService.setAdmin(
      this.state.currentUser.id,
      this.state.currentUser
    )
    .then(response => {
      console.log(response.data);
      this.setState({
        message: "Admin role assigned successfully!"
      });
    })
    .catch(e => {
      console.log(e);
    });
  }

  deleteUser() {    
    UserDataService.delete(this.state.currentUser.id)
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The user was deleted successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  } 

  render() {
    const { searchCriteria, users, currentUser, currentIndex, content} = this.state;
    const windowWidth = document.documentElement.clientWidth;
    if (content === "Manage Users") {
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
            <div className="col-md-6">
              <h2><strong>Manage Users</strong></h2>
              </div>
              <div className="col-md-5">
              <h4>Search Users</h4>
              <div className="input-group mb-3">
                <input
                type="text"
                className="form-control"
                placeholder="Search by ID, Username, Email"
                value={searchCriteria}
                onChange={this.onChangeSearchCriteria}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={this.searchCriteria}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <h4>Users List</h4>
            <ul className="list-group">
              {users &&
                users.map((user, index) => (
                  <li
                    className={
                      "list-group-item " +
                      (index === currentIndex ? "active" : "")
                    }
                    onClick={() => this.setActiveUser(user, index)}
                    key={index}
                  >
                    {user.username}
                  </li>
                ))}
            </ul>
            <button
                className="m-3 btn btn-sm btn-primary"
                onClick={this.refreshList}
                >
                  Refresh
                  </button>
          </div>
          <div className= "col-md-8" style={{position: "absolute", left: windowWidth/2.05, top: 572}}>
            <div className="col-md-2">
            {currentUser ? (
              <div> 
                <h4>User #{currentUser.id}</h4>
                <div>
                  <label>
                    <strong>Username:</strong>
                  </label>{" "}
                  {currentUser.username}
                </div>
                <div>
                  <label>
                    <strong>Email:</strong>
                  </label>{" "}
                  {currentUser.email}
                </div>
              </div>
            ) : (
              <div>
                <br />
              </div>
            )}
          </div>
          <div className="col-md-2" style={{padding: 0, left: 300, top: -160}}>
            {currentUser ? (
            <div>
              <h4>Edit this User</h4>
              <form>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={currentUser.username}
                    onChange={this.onChangeUsername}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    value={currentUser.email}
                    onChange={this.onChangeEmail}
                  />
                </div>
              </form>
              <button
                className="badge badge-secondary mr-2"
                onClick={this.setUser}
              >
                User
              </button>
              <button
                className="badge badge-primary mr-2"
                onClick={this.setMod}
              >
                Mod
              </button>
              <button
                className="badge badge-warning mr-2"
                onClick={this.setAdmin}
              >
                Admin
              </button>
              <button
                className="badge badge-success"
                onClick={this.updateUser}
              >
                Update
              </button>
              <button
                className="badge badge-danger mr-2"
                onClick={this.deleteUser}
              >
                Delete
              </button>
              <p>{this.state.message}</p>
            </div>
          ) : (
            <div>
            </div>
          )}
          </div>
        </div>
        </div>
      )
    }
    return (
      <div className="container" style={{"width": windowWidth}}>
        <header className="jumbotron">
        <div className="col-md-8" style={{padding: 0, left: 250, top: 80}}>
        <h1><strong>PScription</strong></h1>
        </div>
        <div className="col-md-8" style={{padding: 0, left: 250, top: 100}}>
        <h2>A place for all your medical needs</h2>
        </div>
        <div className="col-md-8" style={{padding: 0, left: 250, top: 120}}>
        <h3><strong>{this.state.content}</strong></h3>
        </div>
        <div className="col-md-8" style={{padding: 0, left: 25, top: -75}}>
          <img src={PScription} height={192} width={192} alt= "PScription logo"/> 
        </div>            
        </header>
      </div>
    )
  }
}
