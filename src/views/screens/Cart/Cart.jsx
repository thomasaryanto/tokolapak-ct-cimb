import React from "react";
import { connect } from "react-redux";
import "./Cart.css";

import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";

class Cart extends React.Component {
  state = {
    cartData: []
  }

  componentDidMount() {
    this.getCart()
  }

  getCart() {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
        _expand: "product",
      },
    })
      .then((res) => {
        this.setState({ cartData: res.data })
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  deleteCart(cartId) {
    Axios.delete(API_URL + "/carts/" + cartId)
      .then((res) => {
        console.log(res)
        this.getCart()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  renderCart = () => {
    return this.state.cartData.map(({ id, quantity, product }, idx) => {
      return (
        <tr key={`cart-${id}`}>
          <td className="align-middle"><img src={product.image} alt={product.productName} className="img-thumbnail" width="100px" height="100px" /></td>
          <td className="align-middle">{product.productName}</td>
          <td className="align-middle">{quantity}</td>
          <td className="align-middle">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(product.price)}
          </td>
          <td className="align-middle" align="center">
            <ButtonUI onClick={() => this.deleteCart(id)}>Hapus</ButtonUI>
          </td>
        </tr>
      )
    })
  }

  render() {
    return (
      <div className="container">
        <div className="text-center">
          {
            this.state.cartData.length != 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Produk</th>
                    <th>Jumlah</th>
                    <th>Harga</th>
                    <th>Opsi</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderCart()}
                </tbody>
              </table>
            ) : (
                <h3 style={{ marginTop: "20%" }}>Cart anda kosong!</h3>
              )
          }
        </div>
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
