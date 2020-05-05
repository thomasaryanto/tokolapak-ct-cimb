import React from "react";
import "./History.css";
import { connect } from "react-redux";
import { Table, Alert, Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";

import { API_URL } from "../../../constants/API";

import ButtonUI from "../../components/Button/Button";

class History extends React.Component {
    state = {
        historyList: [],
        transactionData: {
            user: ""
        },
        transactionItems: [],
        modalOpen: false,
    };

    getHistoryList = () => {
        Axios.get(`${API_URL}/transactions`, {
            params: {
                "userId": this.props.user.id,
                "status": "completed",
                "_expand": "user",
            }
        })
            .then((res) => {
                this.setState({ historyList: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    renderHistory = () => {
        return this.state.historyList.map((val, idx) => {
            const { id, user, subTotal, shippingPrice, checkoutDate, finishDate } = val;
            return (
                <>
                    <tr
                        onClick={() => this.getTransaction(id)}
                    >
                        <td> {id} </td>
                        <td> {checkoutDate} </td>
                        <td> {finishDate} </td>
                        <td> {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                        }).format(subTotal + shippingPrice)} </td>
                    </tr>
                </>
            );
        });
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

    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    componentDidMount() {
        this.getHistoryList();
    }

    render() {
        return (
            <div className="container py-4">
                <div className="dashboard">

                    <div className="d-flex flex-row align-items-center">
                        <caption className="p-3">
                            <h2>Completed Transaction</h2>
                            <small>Click item to view details.</small>
                        </caption>
                    </div>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Checkout Date</th>
                                <th>Completed Date</th>
                                <th>Total Transaction</th>
                            </tr>
                        </thead>
                        <tbody>{this.renderHistory()}</tbody>
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
                                <p>Completed Date: {this.state.transactionData.finishDate}</p>
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
                                    <ButtonUI onClick={() => this.setState({ modalOpen: false })} type="outlined">Close</ButtonUI>
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


export default connect(mapStateToProps)(History);
