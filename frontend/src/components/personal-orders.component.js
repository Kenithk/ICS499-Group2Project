import React, { Component } from "react";
import ContentsService from "../services/contents.service";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";
import UserDataService from "../services/user.service";
import OrderDataService from "../services/order.service";
import PScription from "../components/images/logo192.png";

export default class PersonalOrders extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchUserId = this.onChangeSearchUserId.bind(this);
    this.onChangeUserId = this.onChangeUserId.bind(this);
    this.setActiveOrder = this.setActiveOrder.bind(this);
    this.searchUserId = this.searchUserId.bind(this);
    this.clearNotifications = this.clearNotifications.bind(this);
    this.retrieveOrders = this.retrieveOrders.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.state = {
      content: "",
      orders: [],
      currentOrder: null,
      currentIndex: -1,
      currentUser: { username: "" },
      searchId: "",
      searchTitle: "",
      searchUserId: ""
    };
  } 

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    this.setState({ currentUser: currentUser});
    ContentsService.getPersonalOrders().then(
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
      this.retrieveOrders(currentUser)
    );
  }

  onChangeSearchUserId(e) {
    const searchUserId = e.target.value;
    this.setState({
      searchUserId: searchUserId
    });
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

  setActiveOrder(order, index) {
    this.setState({
      currentOrder: order,
      currentIndex: index
    });
  }

  searchUserId() {
    OrderDataService.getByUserId(this.state.searchUserId)
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

  clearNotifications(currentUser) {
    UserDataService.clearNotifications(currentUser.id)
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "All notifications mark as read!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  retrieveOrders(currentUser) {
    OrderDataService.getByUserId(currentUser.id)
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

  render() {
    const { orders, currentUser, currentOrder, currentIndex, content } = this.state;
    const windowWidth = document.documentElement.clientWidth;
    if (content === "Personal Orders") {
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
          <h2><strong>My past and present Orders</strong></h2>
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
                className="m-4 btn btn-sm btn-success"
                onClick={() => this.clearNotifications(currentUser)}
                >
                  Mark All As Read
                  </button>
                  <p>{this.state.message}</p>
          </div>
          <div className="col-md-5" style={{position: "absolute", left: windowWidth/2.05, top: 572}}>
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