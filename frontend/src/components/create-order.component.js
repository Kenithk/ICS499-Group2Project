import React, { Component } from "react";
import ContentsService from "../services/contents.service";
import EventBus from "../common/EventBus";
import OrderDataService from "../services/order.service";
export default class CreateOrder extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeUserId = this.onChangeUserId.bind(this);
    this.saveOrder = this.saveOrder.bind(this);
    this.newOrder = this.newOrder.bind(this);
    this.state = {
      content: "",
      id: null,
      title: "",
      description: "", 
      completed: false,
      userId: "",
      submitted: false
    };
  }

  componentDidMount() {
    ContentsService.getCreateOrder().then(
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
      }
    );
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  onChangeUserId(e) {
    this.setState({
      userId: e.target.value
    });
  }

  saveOrder() {
    var data = {
      title: this.state.title,
      description: this.state.description,
      completed: this.state.completed,
      userId: this.state.userId
    };
    OrderDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          completed: response.data.completed,
          userId: response.data.userId,
          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newOrder() {
    this.setState({
      id: null,
      title: "",
      description: "",
      completed: false,
      userId: "",
      submitted: false
    });
  }
  
  render() {
    const { content } = this.state;
    if (content === "Create Order") {
      return (
        <div className="submit-form">
          {this.state.submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <button className="btn btn-success" onClick={this.newOrder}>
                Create new
              </button>
            </div>
          ) : (
            <div>
              <div className="form-group">
                <h4>Create new Order</h4>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  required
                  value={this.state.title}
                  onChange={this.onChangeTitle}
                  name="title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  required
                  value={this.state.description}
                  onChange={this.onChangeDescription}
                  name="description"
                />
              </div>
              <div className="form-group">
                <label htmlFor="userId">User ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="userId"
                  required
                  value={this.state.userId}
                  onChange={this.onChangeUserId}
                  name="userId"
              />
              </div>
              <button onClick={this.saveOrder} className="btn btn-success">
                Submit
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="container">
        <header className="jumbotron">
          <h3><strong>{this.state.content}</strong></h3>
        </header>
      </div>
      )
    }  
  }
}