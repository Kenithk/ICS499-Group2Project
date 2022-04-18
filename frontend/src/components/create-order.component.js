import React, { Component } from "react";
import ContentsService from "../services/contents.service";
import EventBus from "../common/EventBus";
import OrderDataService from "../services/order.service";
import PScription from "../components/images/logo192.png";

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
        <div className="form-group">
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
          {this.state.submitted ? (
            <div className="col-md-4" style={{padding: 0, left: 400, top: 10}}>
              <h4><strong>You submitted successfully!</strong></h4>
              <div className="col-md-4" style={{padding: 0, left: 100, top: 15}}>
              <button className="btn btn-success" onClick={this.newOrder}>
                Create new
              </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="col-md-4" style={{padding: 0, left: 400, top: 10}}>
                <h2><strong>Create new Order</strong></h2>
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
              <div className="col-md-4" style={{padding: 0, left: 400, top: 15}}>
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
              <div className="col-md-4" style={{padding: 0, left: 400, top: 20}}>
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
              <div className="col-md-8" style={{padding: 0, left: 550, top: 35}}>
              <button onClick={this.saveOrder} className="btn btn-success">
                Submit
              </button>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="container">
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
}