import React from "react";
import { connect } from "react-redux";
import "./Cart.css";

import { Table, Alert, Modal, ModalHeader, ModalBody } from "reactstrap";

import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";
import swal from "sweetalert";

import { cartUpdateHandler } from "../../../redux/actions";

class Cart extends React.Component {
  state = {
    cartData: [],
    cartTotal: 0,
    checkoutItems: [],
    modalOpen: false,
    shippingAddress: "",
    shippingType: "",
    shippingPrice: 0,
  };


  componentDidMount() {
    this.getCartData();
  }

  // componentDidUpdate() {
  //   if (this.props.user.id) {
  //     this.props.cartUpdateHandler(this.props.user.id);
  //   }
  // }

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
        console.log(res.data);
        this.setState({ cartData: res.data });
        this.props.cartUpdateHandler(this.props.user.id);
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
            {/* <input type="checkbox" onChange={(e) => this.checkBoxHandler(e, idx)} /> */}


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

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  deleteCart = (id) => {
    Axios.delete(`${API_URL}/carts/${id}`)
      .then((res) => {
        this.props.cartUpdateHandler(this.props.user.id);
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

    console.log(this.state.checkoutItems)

    for (x of this.state.cartData) {
      totalCount += (x.product.price * x.quantity)
    }

    this.setState({ modalOpen: true, cartTotal: totalCount });
  }

  confirmBtnHandler = () => {

    if (this.state.shippingAddress != "" && this.state.shippingType != "") {
      Axios.post(`${API_URL}/transactions`, {
        userId: this.props.user.id,
        subTotal: this.state.cartTotal,
        checkoutDate: this.getTime(),
        finishDate: "",
        shippingAddress: this.state.shippingAddress,
        shippingType: this.state.shippingType,
        shippingPrice: this.state.shippingPrice,
        status: "pending"
      })
        .then((res) => {
          var x
          for (x of this.state.cartData) {
            Axios.post(`${API_URL}/transaction_details`, {
              transactionId: res.data.id,
              productId: x.product.id,
              productName: x.product.productName,
              price: x.product.price,
              quantity: x.quantity,
              totalPrice: x.product.price * x.quantity
            })
              .then((res) => {
                console.log(res)
              })
              .catch((err) => {
                swal("Checkout", "Checkout failed!", "error");
                console.log(err);
              });
          }

          for (x of this.state.cartData) {
            this.deleteCart(x.id)
          }
          console.log(res)
          this.setState({ cartData: [] })
          this.setState({ modalOpen: false });
          swal("Checkout", "Checkout successfully!", "success");
        })
        .catch((err) => {
          swal("Checkout", "Checkout failed!", "error");
          console.log(err);
        });
    }
    else {
      swal("Checkout", "Please input shipping address and select the shipping method.", "error");
    }

  }

  checkBoxHandler = (e, idx) => {
    const { checked } = e.target

    if (checked) {
      this.setState({ checkoutItems: [...this.state.checkoutItems, idx] })
    }
    else {
      this.setState({ checkoutItems: [...this.state.checkoutItems.filter((val) => val !== idx)] })
    }
  }

  shippingHandler = (e) => {
    var idx = e.target.selectedIndex
    this.setState({ shippingPrice: parseInt(e.target.value), shippingType: e.target[idx].text })
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
                  <strong>Sub Total : {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(this.state.cartTotal)}</strong>
                </p>
                <br />

                {this.state.shippingType != "" ? (
                  <>
                    <p className="float-right">
                      <strong>Shipping Fee :&nbsp;
                      {this.state.shippingType != "Economy" ? (
                          new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(this.state.shippingPrice)
                        ) : ("FREE")}
                      </strong>
                    </p>
                    <br />
                    <p className="float-right">
                      <strong>Grand Total : {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(this.state.cartTotal + this.state.shippingPrice)}</strong>
                    </p>
                  </>
                ) : null}

                <br /><hr />
                <textarea
                  style={{ resize: "none" }}
                  value={this.state.shippingAddress}
                  onChange={(e) => this.inputHandler(e, "shippingAddress")}
                  placeholder="Enter shipping address..."
                  className="custom-text-input"
                ></textarea>
                <select
                  value={this.state.paymentType}
                  className="custom-text-input mb-3"
                  onChange={(e) => this.shippingHandler(e)}
                >
                  <option value="" disabled selected>Select shipping methods</option>
                  <option value="100000">Instant</option>
                  <option value="50000">Same Day</option>
                  <option value="20000">Express</option>
                  <option value="0">Economy</option>
                </select>
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

const mapDispatchToProps = {
  cartUpdateHandler
};


export default connect(mapStateToProps, mapDispatchToProps)(Cart);
