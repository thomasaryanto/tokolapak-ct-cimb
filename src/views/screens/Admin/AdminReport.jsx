import React from "react";
import "./AdminDashboard.css";
import { Table, Alert, Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";

import { API_URL } from "../../../constants/API";

import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";

import swal from "sweetalert";

import avatar from '../../../assets/images/profile.png'

class AdminReport extends React.Component {
    state = {
        activePage: "user",
        usersList: [],
        productsList: [],
        modalOpen: false,
    };

    getUsersList = () => {
        Axios.get(`${API_URL}/transactions`, {
            params: {
                "status": "completed",
                "_expand": "user",
                "_embed": "transaction_details"
            }
        })
            .then((res) => {
                console.log(res.data)
                var tempUser = []
                var tempProduct = []
                var x
                for (x of res.data) {
                    const { user, transaction_details, userId, subTotal, shippingPrice } = x;
                    var y;
                    var idxUser = tempUser.findIndex((val) => val.userId == userId)
                    if (idxUser != -1) {
                        tempUser[idxUser].totalShopping += subTotal + shippingPrice
                    }
                    else {
                        var newUser = { userId: userId, username: user.username, fullName: user.fullName, totalShopping: subTotal + shippingPrice }
                        tempUser.push(newUser)
                    }

                    for (y of transaction_details) {
                        var idxProduct = tempProduct.findIndex((val) => val.productId == y.productId)
                        console.log(y)
                        if (idxProduct != -1) {
                            tempProduct[idxProduct].countSales++
                            tempProduct[idxProduct].totalSales += y.quantity
                            tempProduct[idxProduct].totalSalesPrice += y.price * y.quantity
                        }
                        else {
                            var newProduct = { productId: y.productId, productName: y.productName, countSales: 1, totalSales: y.quantity, totalSalesPrice: y.price * y.quantity }
                            tempProduct.push(newProduct)
                        }
                    }


                }
                this.setState({ usersList: tempUser, productsList: tempProduct })
                console.log(this.state.usersList)
                console.log(this.state.productsList)

            })
            .catch((err) => {
                console.log(err);
            });
    };

    renderReportsComponent = () => {
        const { activePage } = this.state;
        if (activePage == "user") {
            return (
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Total Transaction</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.usersList.map((val) => {
                            const { userId, username, fullName, totalShopping } = val;
                            return (
                                <>
                                    <tr>
                                        <td> {userId} </td>
                                        <td> {username} </td>
                                        <td> {fullName} </td>
                                        <td> {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        }).format(totalShopping)} </td>
                                    </tr>
                                </>
                            );
                        })}
                    </tbody>
                </table>
            )
        } else {
            return (
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th>Sales Count</th>
                            <th>Total Sales</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.productsList.map((val, idx) => {
                            const { productId, productName, countSales, totalSales, totalSalesPrice } = val;
                            return (
                                <>
                                    <tr>
                                        <td> {productId} </td>
                                        <td> {productName} </td>
                                        <td> {countSales} kali ({totalSales} buah) </td>
                                        <td> {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        }).format(totalSalesPrice)}</td>
                                    </tr>
                                </>
                            );
                        })}
                    </tbody>
                </table>
            )

        }
    };


    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    componentDidMount() {
        this.getUsersList();
    }

    render() {
        return (
            <div className="container py-4">
                <div className="dashboard">

                    <div className="d-flex flex-row align-items-center">
                        <caption className="p-3">
                            <h2>Reports</h2>
                        </caption>
                        <ButtonUI
                            className={`auth-screen-btn ${
                                this.state.activePage == "user" ? "active" : null
                                }`}
                            type="outlined"
                            onClick={() => this.setState({ activePage: "user" })}
                        >
                            Users
              </ButtonUI>
                        <ButtonUI
                            className={`ml-3 auth-screen-btn ${
                                this.state.activePage == "product" ? "active" : null
                                }`}
                            type="outlined"
                            onClick={() => this.setState({ activePage: "product" })}
                        >
                            Products
                    </ButtonUI>
                    </div>
                    {this.renderReportsComponent()}
                </div>

            </div>
        );
    }
}

export default AdminReport;
