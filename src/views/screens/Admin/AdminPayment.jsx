import React from "react";
import "./AdminDashboard.css";
import { Table, Alert, Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";

import { API_URL } from "../../../constants/API";

import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";

import swal from "sweetalert";

import avatar from '../../../assets/images/profile.png'

class AdminPayment extends React.Component {
    state = {
        activePage: "pending",
        paymentsList: [],
        transactionData: {
            user: ""
        },
        transactionItems: [],
        modalOpen: false,
    };

    getPaymentsList = () => {
        Axios.get(`${API_URL}/transactions`, {
            params: { "_expand": "user" }
        })
            .then((res) => {
                this.setState({ paymentsList: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    renderPaymentsComponent = () => {
        const { activePage } = this.state;
        if (activePage == "pending") {
            return this.state.paymentsList.filter(val => val.status == "pending").map((val, idx) => {
                const { id, user, subTotal, shippingPrice } = val;
                return (
                    <>
                        <tr
                            onClick={() => this.getTransaction(id)}
                        >
                            <td> {id} </td>
                            <td> {user.username} </td>
                            <td> {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            }).format(subTotal + shippingPrice)} </td>
                        </tr>
                    </>
                );
            });
        } else {
            return this.state.paymentsList.filter(val => val.status == "completed").map((val, idx) => {
                const { id, user, subTotal, shippingPrice } = val;
                return (
                    <>
                        <tr
                            onClick={() => this.getTransaction(id)}
                        >
                            <td> {id} </td>
                            <td> {user.username} </td>
                            <td> {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            }).format(subTotal + shippingPrice)} </td>
                        </tr>
                    </>
                );
            });
        }
    };

    getTransaction = (id) => {
        Axios.get(`${API_URL}/transactions/${id}`, {
            params: { "_expand": "user" }
        })
            .then((res) => {
                this.setState({ transactionData: res.data });
                this.getTransactionItems(id)
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getTransactionItems = (id) => {
        Axios.get(`${API_URL}/transaction_details`, {
            params: {
                "transactionId": id,
                "_expand": "product"
            }
        })
            .then((res) => {
                this.setState({ transactionItems: res.data });
                this.setState({ modalOpen: true });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    renderTransactionItems = () => {
        return this.state.transactionItems.map((val, idx) => {
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
    }


    getTime = () => {
        let dateNow = new Date()
        return dateNow.toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + " - " + dateNow.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) + " WIB"
    }

    processBtnHandler = (id) => {
        Axios.patch(`${API_URL}/transactions/${id}`, {
            finishDate: this.getTime(),
            status: "completed"
        })
            .then((res) => {
                console.log(res);
                this.setState({ modalOpen: false });
                swal("Payment", "Transaction processed.", "success");
                this.getPaymentsList();
            })
            .catch((err) => {
                swal("Payment", "Failed to process transaction.", "error");
                console.log(err);
            });
    }

    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    componentDidMount() {
        this.getPaymentsList();
    }

    render() {
        return (
            <div className="container py-4">
                <div className="dashboard">

                    <div className="d-flex flex-row align-items-center">
                        <caption className="p-3">
                            <h2>Payments</h2>
                            <small>Click item to view details.</small>
                        </caption>
                        <ButtonUI
                            className={`auth-screen-btn ${
                                this.state.activePage == "pending" ? "active" : null
                                }`}
                            type="outlined"
                            onClick={() => this.setState({ activePage: "pending" })}
                        >
                            Pending
              </ButtonUI>
                        <ButtonUI
                            className={`ml-3 auth-screen-btn ${
                                this.state.activePage == "completed" ? "active" : null
                                }`}
                            type="outlined"
                            onClick={() => this.setState({ activePage: "completed" })}
                        >
                            Completed
              </ButtonUI>
                    </div>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Username</th>
                                <th>Total Transaction</th>
                            </tr>
                        </thead>
                        <tbody>{this.renderPaymentsComponent()}</tbody>
                    </table>
                </div>

                <Modal
                    toggle={this.toggleModal}
                    isOpen={this.state.modalOpen}
                    className="checkout-modal modal-lg"
                >
                    <ModalHeader toggle={this.toggleModal}>
                        <caption>
                            <h4>Transaction Details</h4>
                        </caption>
                    </ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-12">
                                <p>Full Name: {this.state.transactionData.user.fullName}</p>
                                <p>Shipping Address: {this.state.transactionData.shippingAddress}</p>
                                <p>Checkout Date: {this.state.transactionData.checkoutDate}</p>
                                {this.state.transactionData.status == "completed" ? (<p>Completed Date: {this.state.transactionData.finishDate}</p>) : null}
                                <br />
                                <p><strong>Item Lists</strong></p>
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
                                    <tbody>{this.renderTransactionItems()}</tbody>
                                </Table>

                                <p className="float-right">
                                    <strong>Sub Total : {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    }).format(this.state.transactionData.subTotal)}</strong>
                                </p>
                                <br />
                                <p className="float-right">
                                    <strong>Shipping Fee :&nbsp;
                                        {this.state.transactionData.shippingType != "Economy" ? (
                                            new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                            }).format(this.state.transactionData.shippingPrice) + " (" + this.state.transactionData.shippingType + ")"
                                        ) : ("FREE (Economy)")}
                                    </strong>
                                </p>
                                <br />
                                <p className="float-right">
                                    <strong>Grand Total : {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    }).format(this.state.transactionData.subTotal + this.state.transactionData.shippingPrice)}</strong>
                                </p>
                                <br />
                                <br />
                                <div className="d-flex flex-row float-right">
                                    {this.state.transactionData.status == "pending" ? (
                                        <>
                                            <ButtonUI onClick={() => this.setState({ modalOpen: false })} type="outlined">Cancel</ButtonUI>
                                            <ButtonUI onClick={() => this.processBtnHandler(this.state.transactionData.id)} className="ml-2">Process</ButtonUI>
                                        </>
                                    ) : (
                                            <p><strong>Transaction Completed.</strong></p>
                                        )}

                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default AdminPayment;
