import React, { Component } from "react";
import OrderDataService from "../services/order.service";
import { Link } from "react-router-dom";
export default class OrdersList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.retrieveOrders = this.retrieveOrders.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveOrder = this.setActiveOrder.bind(this);
    //this.removeAllOrders = this.removeAllOrders.bind(this);
    this.searchTitle = this.searchTitle.bind(this);
    this.state = {
      orders: [],
      currentOrder: null,
      currentIndex: -1,
      searchTitle: ""
    };
  }
  componentDidMount() {
    this.retrieveOrders();
  }
  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;
    this.setState({
      searchTitle: searchTitle
    });
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
  //removeAllOrders() {
    //OrderDataService.deleteAll()
      //.then(response => {
        //console.log(response.data);
        //this.refreshList();
      //})
      //.catch(e => {
        //console.log(e);
      //});
  //}
  searchTitle() {
    OrderDataService.findByTitle(this.state.searchTitle)
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
  render() {
    const { searchTitle, orders, currentOrder, currentIndex } = this.state;
    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title"
              value={searchTitle}
              onChange={this.onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchTitle}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
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
        </div>
        <div className="col-md-6">
          {currentOrder ? (
            <div>
              <h4>Order</h4>
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
              <Link
                to={"/orders/" + currentOrder.id}
                className="badge badge-warning"
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Order...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}