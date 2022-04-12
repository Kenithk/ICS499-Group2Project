import React, { Component } from "react";
import ContentsService from "../services/contents.service";
import EventBus from "../common/EventBus";
import OrderDataService from "../services/order.service";
import AuthService from "../services/auth.service";

export default class PersonalOrders extends Component {
  constructor(props) {
    super(props);
    this.retrieveOrders = this.retrieveOrders.bind(this);
    this.setActiveOrder = this.setActiveOrder.bind(this);
    this.state = {
      content: "",
      currentUser: { username: "" },
      currentIndex: -1,
      orders: [],
      userId: ""
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
        },
        );

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      },
      this.retrieveOrders()
    );
  }

  retrieveOrders() {
    OrderDataService.getByAll()
      .then(response => {
        this.setState({
          orders: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      })
  }

  setActiveOrder(order, index) {
    this.setState({
      currentOrder: order,
      currentIndex: index
    });
  }

  render() {
    const {  orders, currentIndex, content } = this.state;
    if (content === "Personal Orders") {
      return (
        <div className="list row">
          <div className="col-md-6" style={{padding: 0, left: -100, top: -10}}>
            <h4>My Past and Present Orders</h4>
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
          </div>
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