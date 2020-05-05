import React from "react";
import { connect } from "react-redux";
import swal from "sweetalert";

import "./ProductDetails.css";
import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import { cartUpdateHandler } from "../../../redux/actions";

class ProductDetails extends React.Component {
    state = {
        productData: {
            image: "",
            productName: "",
            price: 0,
            desc: "",
            category: "",
            id: 0,
        },
    };

    addToCartHandler = () => {
        // POST method ke /cart
        // Isinya: userId, productId, quantity
        // console.log(this.props.user.id);
        // console.log(this.state.productData.id);

        Axios.get(`${API_URL}/carts`, {
            params: {
                userId: this.props.user.id,
                productId: this.state.productData.id,
            },
        })
            .then((res) => {
                if (res.data.length > 0) {
                    Axios.patch(`${API_URL}/carts/${res.data[0].id}`, {
                        quantity: res.data[0].quantity + 1
                    })
                        .then((res) => {
                            console.log(res);
                            this.props.cartUpdateHandler(this.props.user.id);
                            swal("Add to cart", "Your item has been added to your cart", "success");
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    Axios.post(`${API_URL}/carts`, {
                        userId: this.props.user.id,
                        productId: this.state.productData.id,
                        quantity: 1,
                    })
                        .then((res) => {
                            console.log(res);
                            this.props.cartUpdateHandler(this.props.user.id);
                            swal("Add to cart", "Your item has been added to your cart", "success");
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            })
            .catch((err) => {
                alert("Terjadi kesalahan jaringan!")
                console.log(err);
            });


    };

    componentDidMount() {
        Axios.get(`${API_URL}/products/${this.props.match.params.productId}`)
            .then((res) => {
                this.setState({ productData: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        const {
            productName,
            image,
            price,
            desc,
            category,
            id,
        } = this.state.productData;
        return (
            <div className="container">
                <div className="row py-4">
                    <div className="col-6 text-center">
                        <img
                            style={{ width: "100%", objectFit: "contain", height: "550px" }}
                            src={image}
                            alt=""
                        />
                    </div>
                    <div className="col-6 d-flex flex-column justify-content-center">
                        <h3>{productName}</h3>
                        <h4>
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            }).format(price)}
                        </h4>
                        <p className="mt-4">{desc}</p>
                        {/* <TextField type="number" placeholder="Quantity" className="mt-3" /> */}
                        <div className="d-flex flex-row mt-4">
                            {this.props.user.id ? (
                                <>
                                    <ButtonUI onClick={this.addToCartHandler}>Add To Cart</ButtonUI>
                                    <ButtonUI className="ml-4" type="outlined">Add To Wishlist</ButtonUI>
                                </>
                            ) : (
                                    <p><strong>Login to add item.</strong></p>
                                )}

                        </div>
                    </div>
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

const mapDispatchToProps = {
    cartUpdateHandler
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
