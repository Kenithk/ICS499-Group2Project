import React, { Component } from "react";
import OrderDataService from "../services/order.service";

export default class Order extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.getOrder = this.getOrder.bind(this);
    this.updatecompleted = this.updatecompleted.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.state = {
      currentOrder: {
        id: null,
        title: "",
        description: "",
        completed: false
      },
      message: ""
    };
  }
  componentDidMount() {
    this.getOrder(this.props.match.params.id);
  }
  onChangeTitle(e) {
    const title = e.target.value;
    this.setState(function(prevState) {
      return {
        currentOrder: {
          ...prevState.currentOrder,
          title: title
        }
      };
    });
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
  getOrder(id) {
    OrderDataService.get(id)
      .then(response => {
        this.setState({
          currentOrder: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  updatecompleted(status) {
    var data = {
      id: this.state.currentOrder.id,
      title: this.state.currentOrder.title,
      description: this.state.currentOrder.description,
      completed: status
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
        this.props.history.push('/orders')
      })
      .catch(e => {
        console.log(e);
      });
  }
  render() {
    const { currentOrder } = this.state;
    return (
      <div>
        {currentOrder ? (
          <div className="edit-form">
            <h4>Order</h4>
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
                <label>
                  <strong>Status:</strong>
                </label>
                {currentOrder.completed ? "completed" : "Pending"}
              </div>
            </form>
            {currentOrder.completed ? (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updatecompleted(false)}
              >
                Change Status
              </button>
            ) : (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updatecompleted(true)}
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
            <br />
            <p>Please click on a Order...</p>
          </div>
        )}
      </div>
    );
  }
}