import React from "react";
import { connect } from "react-redux";
import "./Cart.css";

import { Table, Alert, Modal, ModalHeader, ModalBody } from "reactstrap";

import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";
import swal from "sweetalert";

class Cart extends React.Component {
  state = {
    cartData: [],
    cartTotal: 0,
    modalOpen: false,
    shippingAddress: ""
  };

  inputHandler = (event, field) => {
    this.setState({ [field]: event.target.value })
  }

  getCartData = () => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
        _expand: "product",
      },
    })
      .then((res) => {
        this.setState({ cartData: res.data })
        console.log(res.data);
        this.setState({ cartData: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderCartData = () => {
    return this.state.cartData.map((val, idx) => {
      const { quantity, product, id } = val;
      const { productName, image, price } = product;
      return (
        <tr>
          <td>{idx + 1}</td>
          <td>{productName}</td>
          <td>{new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(price)}</td>
          <td>{quantity}</td>
          <td>
            {" "}
            <img
              src={image}
              alt=""
              style={{ width: "100px", height: "200px", objectFit: "contain" }}
            />{" "}
          </td>
          <td>
            <ButtonUI
              type="outlined"
              onClick={() => this.deleteCartHandler(id)}
            >
              Delete Item
            </ButtonUI>
          </td>
        </tr>
      );
    });
  };

  renderCheckoutData = () => {
    return this.state.cartData.map((val, idx) => {
      const { quantity, product } = val;
      const { productName, price } = product;
      return (
        <tr>
          <td>{idx + 1}</td>
          <td>{productName}</td>
          <td>{new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(price)}</td>
          <td>{quantity}</td>
          <td>{new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(price * quantity)}</td>
        </tr>
      );
    });
  };

  deleteCartHandler = (id) => {
    Axios.delete(`${API_URL}/carts/${id}`)
      .then((res) => {
        this.getCartData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.getCartData();
  }

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  deleteCart = (id) => {
    Axios.delete(`${API_URL}/carts/${id}`)
      .then((res) => {
        this.setState({ modalOpen: false });
        console.log(res);
      })
      .catch((err) => {
        swal("Checkout", "Delete cart failed!", "error");
        console.log(err);
      });
  }

  checkoutBtnHandler = () => {
    var totalCount = 0;
    var x

    for (x of this.state.cartData) {
      totalCount += (x.product.price * x.quantity)
    }

    this.setState({ modalOpen: true, cartTotal: totalCount });
  }

  confirmBtnHandler = () => {
    var products = []
    var x

    for (x of this.state.cartData) {
      products = [...products, { ...x.product, quantity: x.quantity }]
    }

    Axios.post(`${API_URL}/transactions`, {
      userId: this.props.user.id,
      total: this.props.user.cartTotal,
      date: this.getTime(),
      shippingAddress: this.state.shippingAddress,
      products: products,
    })
      .then((res) => {
        for (x of this.state.cartData) {
          this.deleteCart(x.id)
        }
        this.setState({ cartData: [] })
        swal("Checkout", "Checkout successfully!", "success");
      })
      .catch((err) => {
        swal("Checkout", "Checkout failed!", "error");
        console.log(err);
      });
  }

  getTime = () => {
    let dateNow = new Date()
    return dateNow.toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + " - " + dateNow.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) + " WIB"
  }

  render() {
    return (
      <div className="container py-4">
        {this.state.cartData.length > 0 ? (
          <>
            <Table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{this.renderCartData()}</tbody>
            </Table>
            <br />
            <ButtonUI className="float-right" onClick={this.checkoutBtnHandler}>Checkout</ButtonUI>
          </>
        ) : (
            <Alert>
              Your cart is empty! <Link to="/">Go shopping</Link>
            </Alert>
          )}

        <Modal
          toggle={this.toggleModal}
          isOpen={this.state.modalOpen}
          className="checkout-modal modal-lg"
        >
          <ModalHeader toggle={this.toggleModal}>
            <caption>
              <h4>Checkout</h4>
            </caption>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-12">
                <p>{this.getTime()}</p>
                <Table>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>{this.renderCheckoutData()}</tbody>
                </Table>
                <p className="float-right">
                  <strong>Sub-total : {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(this.state.cartTotal)}</strong>
                </p>
                <br /><hr />
                <textarea
                  style={{ resize: "none" }}
                  value={this.state.shippingAddress}
                  onChange={(e) => this.inputHandler(e, "shippingAddress")}
                  placeholder="Enter shipping address..."
                  className="custom-text-input"
                ></textarea>
                <div className="d-flex flex-row float-right">
                  <ButtonUI onClick={() => this.setState({ modalOpen: false })} type="outlined">Cancel</ButtonUI>
                  <ButtonUI onClick={this.confirmBtnHandler} className="ml-2">Confirm</ButtonUI>
                </div>
              </div>
            </div>
          </ModalBody>
        </Modal>

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Cart);
