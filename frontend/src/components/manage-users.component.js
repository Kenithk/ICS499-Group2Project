import React, { Component } from "react";
import ContentsService from "../services/contents.service";
import EventBus from "../common/EventBus";
import UserDataService from "../services/user.service";

export default class ManageUsers extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchId = this.onChangeSearchId.bind(this);
    this.onChangeSearchUsername = this.onChangeSearchUsername.bind(this);
    this.onChangeSearchEmail = this.onChangeSearchEmail.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.retrieveUsers = this.retrieveUsers.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveUser = this.setActiveUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.searchId = this.searchId.bind(this);
    this.searchUsername = this.searchUsername.bind(this);
    this.searchEmail = this.searchEmail.bind(this);
    this.state = {
      content: "",
      users: [],
      currentUser: null,
      currentIndex: -1,
      searchUne: "",
      searchId: "",
      searchUsername: "",
      searchEmail: ""
    };
  }

  componentDidMount() {
    ContentsService.getManageUsers().then(
      response => {
        this.setState({
          content: response.data
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

  onChangeSearchId(e) {
    const searchId = e.target.value;
    this.setState({
      searchId: searchId
    });
  }

  onChangeSearchUsername(e) {
    const searchUsername = e.target.value;
    this.setState({
      searchUsername: searchUsername
    });
  }

  onChangeSearchEmail(e) {
    const searchEmail = e.target.value;
    this.setState({
      searchEmail: searchEmail
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

  searchId() {
    UserDataService.getById(this.state.searchId)
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

  searchUsername() {
    UserDataService.getByUsername(this.state.searchUsername)
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

  searchEmail() {
    UserDataService.getByEmail(this.state.searchEmail)
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
    const { searchId, searchUsername, searchEmail, users, currentUser, currentIndex, content} = this.state;
    if (content === "Manage Users") {
      return (
        <div className="list row">
           <div className="col-md-8" style={{padding: 0, left: 0, top: 10}}>
            <h4>Search Users By ID</h4>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by User ID"
                value={searchId}
                onChange={this.onChangeSearchId}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={this.searchId}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-8" style={{padding: 0, left: 0, top: 15}}>
            <h4>Search Users By Username</h4>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by Username"
                value={searchUsername}
                onChange={this.onChangeSearchUsername}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={this.searchUsername}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-8" style={{padding: 0, left: 0, top: 20}}>
            <h4>Search Users By Email</h4>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by Email"
                value={searchEmail}
                onChange={this.onChangeSearchEmail}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={this.searchEmail}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6" style={{padding: 0, left: 550, top: -265}}>
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
          </div>
          <div className="col-md-6" style={{padding: 0, left: -375, top: 50}}>
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
          <div className="col-md-6" style={{padding: 0, left: 170, top: -185}}>
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
                className="badge badge-danger mr-2"
                onClick={this.deleteUser}
              >
                Delete
              </button>
              <button
                type="submit"
                className="badge badge-success"
                onClick={this.updateUser}
              >
                Update
              </button>
              <p>{this.state.message}</p>
            </div>
          ) : (
            <div>
            </div>
          )}
        </div>
        </div>
      )
    }
    return (
      <div className="container">
        <header className="jumbotron">
          <h3><strong>{this.state.content}</strong></h3>
        </header>
      </div>
    )
  }
}
