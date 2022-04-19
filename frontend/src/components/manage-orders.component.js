import React, { Component } from "react";
import ContentsService from "../services/contents.service";
import EventBus from "../common/EventBus";
import OrderDataService from "../services/order.service";
import PScription from "../components/images/logo192.png";

export default class ManageOrders extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchCriteria = this.onChangeSearchCriteria.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeUserId = this.onChangeUserId.bind(this);
    this.retrieveOrders = this.retrieveOrders.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveOrder = this.setActiveOrder.bind(this);
    this.removeAllOrders = this.removeAllOrders.bind(this);
    this.updateCompleted = this.updateCompleted.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.searchCriteria = this.searchCriteria.bind(this);
    this.state = {
      content: "",
      orders: [],
      currentOrder: null,
      currentIndex: -1,
      searchCriteria: "",
    };
  } 

  componentDidMount() {
    ContentsService.getManageOrders().then(
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
      this.retrieveOrders()
    );
  }

  onChangeSearchCriteria(e) {
    const searchCriteria = e.target.value;
    this.setState({
      searchCriteria: searchCriteria
    });
  }

  onChangeTitle(e) {
    const title = e.target.value;   
    this.setState(prevState => ({
      currentOrder: {
        ...prevState.currentOrder,
        title: title
      }
    }));
  }

  onChangeDescription(e) {
    const description = e.target.value;   
    this.setState(prevState => ({
      currentOrder: {
        ...prevState.currentOrder,
        description: description
      }
    }));
  }

  onChangeUserId(e) {
    const userId = e.target.value;   
    this.setState(prevState => ({
      currentOrder: {
        ...prevState.currentOrder,
        userId: userId
      }
    }));
  }

  retrieveOrders() {
    OrderDataService.getAll()
      .then(response => {
        this.setState({
          orders: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveOrders();
    this.setState({
      currentOrder: null,
      currentIndex: -1
    });
  }

  setActiveOrder(order, index) {
    this.setState({
      currentOrder: order,
      currentIndex: index
    });
  }

  removeAllOrders() {
    OrderDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }

  searchCriteria() {
    OrderDataService.getByCriteria(this.state.searchCriteria)
      .then(response => {
        this.setState({
          orders: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateCompleted(status) {
    var data = {
      id: this.state.currentOrder.id,
      title: this.state.currentOrder.title,
      description: this.state.currentOrder.description,
      completed: status,
      userId: this.state.currentOrder.userId
    };
    OrderDataService.update(this.state.currentOrder.id, data)
      .then(response => {
        this.setState(prevState => ({
          currentOrder: {
            ...prevState.currentOrder,
            completed: status
          }
        }));
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateOrder() {
    OrderDataService.update(
      this.state.currentOrder.id,
      this.state.currentOrder
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The order was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteOrder() {    
    OrderDataService.delete(this.state.currentOrder.id)
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The order was deleted successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { searchCriteria, orders, currentOrder, currentIndex, content } = this.state;
    const windowWidth = document.documentElement.clientWidth;
    if (content === "Manage Orders") {
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
          <h2><strong>Manage Orders</strong></h2>
          </div>
          <div className="col-md-5">
              <h4>Search Orders</h4>
              <div className="input-group mb-3">
                <input
                type="text"
                className="form-control"
                placeholder="Search by ID, Title, Description, Status, User ID"
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
            <h4>Orders List</h4>
            <ul className="list-group">
              {orders &&
                orders.map((order, index) => (
                  <li
                    className={
                      "list-group-item " +
                      (index === currentIndex ? "active" : "")
                    }
                    onClick={() => this.setActiveOrder(order, index)}
                    key={index}
                  >
                    {order.title}
                  </li>
                ))}
                </ul>
                <button
                className="m-3 btn btn-sm btn-danger"
                onClick={this.removeAllOrders}
                >
                  Remove All
                  </button>
                <button
                className="m-3 btn btn-sm btn-primary"
                onClick={this.refreshList}
                >
                  Refresh
                  </button>
                  </div>
            <div className= "col-md-8" style={{position: "absolute", left: windowWidth/2.05, top: 572}}>
            <div className="col-md-3" >
              {currentOrder ? (
               <div>
                <h4>Order #{currentOrder.id}</h4>
                <div>
                  <label>
                    <strong>Title:</strong>
                  </label>{" "}
                  {currentOrder.title}
                </div>
                <div>
                  <label>
                    <strong>Description:</strong>
                  </label>{" "}
                  {currentOrder.description}
                </div>
                <div>
                  <label>
                    <strong>Status:</strong>
                  </label>{" "}
                  {currentOrder.completed ? "Completed" : "Pending"}
                </div>
                <div>
                  <label>
                    <strong>User ID:</strong>
                  </label>{" "}
                  {currentOrder.userId}
                </div>
              </div>
            ) : (
              <div>
                <br />
              </div>
            )}
            </div>
            <div className="col-md-2" style={{position: "absolute", left: 200, top: 0}}>
            {currentOrder ? (
            <div>
              <h4>Edit this Order</h4>
              <form>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={currentOrder.title}
                    onChange={this.onChangeTitle}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    value={currentOrder.description}
                    onChange={this.onChangeDescription}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="userId">User ID</label>
                  <input
                    type="text"
                    className="form-control"
                    id="userId"
                    value={currentOrder.userId}
                    onChange={this.onChangeUserId}
                  />
                </div>
                <div className="form-group">
                  <label>
                    <strong>Status:</strong>
                  </label>
                  {currentOrder.completed ? "Completed" : "Pending"}
                </div>
              </form>
              {currentOrder.completed ? (
                <button
                  className="badge badge-primary mr-2"
                  onClick={() => this.updateCompleted(false)}
                >
                  Change Status
                </button>
              ) : (
                <button
                  className="badge badge-primary mr-2"
                  onClick={() => this.updateCompleted(true)}
                >
                  Complete Status
                </button>
              )}
              <button
                className="badge badge-danger mr-2"
                onClick={this.deleteOrder}
              >
                Delete
              </button>
              <button
                type="submit"
                className="badge badge-success"
                onClick={this.updateOrder}
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
        </div>    
      );
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