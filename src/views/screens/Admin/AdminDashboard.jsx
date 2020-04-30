import React from "react";
import "./AdminDashboard.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";

import { API_URL } from "../../../constants/API";

import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";

import swal from "sweetalert";

class AdminDashboard extends React.Component {
    state = {
        productList: [],
        createForm: {
            productName: "",
            price: 0,
            category: "Phone",
            image: "",
            desc: "",
        },
        editForm: {
            id: 0,
            productName: "",
            price: 0,
            category: "",
            image: "",
            desc: "",
        },
        activeProducts: [],
        modalOpen: false,
    };

    getProductList = () => {
        Axios.get(`${API_URL}/products`)
            .then((res) => {
                this.setState({ productList: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    renderProductList = () => {
        return this.state.productList.map((val, idx) => {
            const { id, productName, price, category, image, desc } = val;
            return (
                <>
                    <tr
                        onClick={() => {
                            if (this.state.activeProducts.includes(idx)) {
                                this.setState({
                                    activeProducts: [
                                        ...this.state.activeProducts.filter((item) => item !== idx),
                                    ],
                                });
                            } else {
                                this.setState({
                                    activeProducts: [...this.state.activeProducts, idx],
                                });
                            }
                        }}
                    >
                        <td> {id} </td>
                        <td> {productName} </td>
                        <td>
                            {" "}
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            }).format(price)}{" "}
                        </td>
                    </tr>
                    <tr
                        className={`collapse-item ${
                            this.state.activeProducts.includes(idx) ? "active" : null
                            }`}
                    >
                        <td className="" colSpan={3}>
                            <div className="d-flex justify-content-around align-items-center">
                                <div className="d-flex">
                                    <img src={image} alt="" />
                                    <div className="d-flex flex-column ml-4 justify-content-center">
                                        <h5>{productName}</h5>
                                        <h6 className="mt-2">
                                            Category:
                      <span style={{ fontWeight: "normal" }}> {category}</span>
                                        </h6>
                                        <h6>
                                            Price:
                      <span style={{ fontWeight: "normal" }}>
                                                {" "}
                                                {new Intl.NumberFormat("id-ID", {
                                                    style: "currency",
                                                    currency: "IDR",
                                                }).format(price)}
                                            </span>
                                        </h6>
                                        <h6>
                                            Description:
                      <span style={{ fontWeight: "normal" }}> {desc}</span>
                                        </h6>
                                    </div>
                                </div>
                                <div className="d-flex flex-column align-items-center">
                                    <ButtonUI
                                        onClick={(_) => this.editBtnHandler(idx)}
                                        type="contained"
                                    >
                                        Edit
                  </ButtonUI>
                                    <ButtonUI className="mt-3" type="textual">
                                        Delete
                  </ButtonUI>
                                </div>
                            </div>
                        </td>
                    </tr>
                </>
            );
        });
    };

    inputHandler = (e, field, form) => {
        let { value } = e.target;
        this.setState({
            [form]: {
                ...this.state[form],
                [field]: value,
            },
        });
    };

    createProductHandler = () => {
        Axios.post(`${API_URL}/products`, this.state.createForm)
            .then((res) => {
                swal("Success!", "Your item has been added to the list", "success");
                this.setState({
                    createForm: {
                        productName: "",
                        price: 0,
                        category: "Phone",
                        image: "",
                        desc: "",
                    },
                });
                this.getProductList();
            })
            .catch((err) => {
                swal("Error!", "Your item could not be added to the list", "error");
            });
    };

    editBtnHandler = (idx) => {
        this.setState({
            editForm: {
                ...this.state.productList[idx],
            },
            modalOpen: true,
        });
    };

    editProductHandler = () => {
        Axios.put(
            `${API_URL}/products/${this.state.editForm.id}`,
            this.state.editForm
        )
            .then((res) => {
                swal("Success!", "Your item has been edited", "success");
                this.setState({ modalOpen: false });
                this.getProductList();
            })
            .catch((err) => {
                swal("Error!", "Your item could not be edited", "error");
                console.log(err);
            });
    };

    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    componentDidMount() {
        this.getProductList();
    }

    render() {
        return (
            <div className="container py-4">
                <div className="dashboard">
                    <caption className="p-3">
                        <h2>Products</h2>
                    </caption>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>{this.renderProductList()}</tbody>
                    </table>
                </div>
                <div className="dashboard-form-container p-4">
                    <caption className="mb-4 mt-2">
                        <h2>Add Product</h2>
                    </caption>
                    <div className="row">
                        <div className="col-8">
                            <TextField
                                value={this.state.createForm.productName}
                                placeholder="Product Name"
                                onChange={(e) =>
                                    this.inputHandler(e, "productName", "createForm")
                                }
                            />
                        </div>
                        <div className="col-4">
                            <TextField
                                value={this.state.createForm.price}
                                placeholder="Price"
                                onChange={(e) => this.inputHandler(e, "price", "createForm")}
                            />
                        </div>
                        <div className="col-12 mt-3">
                            <textarea
                                value={this.state.createForm.desc}
                                onChange={(e) => this.inputHandler(e, "desc", "createForm")}
                                style={{ resize: "none" }}
                                placeholder="Description"
                                className="custom-text-input"
                            ></textarea>
                        </div>
                        <div className="col-6 mt-3">
                            <TextField
                                value={this.state.createForm.image}
                                placeholder="Image Source"
                                onChange={(e) => this.inputHandler(e, "image", "createForm")}
                            />
                        </div>
                        <div className="col-6 mt-3">
                            <select
                                value={this.state.createForm.category}
                                className="custom-text-input h-100 pl-3"
                                onChange={(e) => this.inputHandler(e, "category", "createForm")}
                            >
                                <option value="Phone">Phone</option>
                                <option value="Tab">Tab</option>
                                <option value="Laptop">Laptop</option>
                                <option value="Desktop">Desktop</option>
                            </select>
                        </div>
                        <div className="col-3 mt-3">
                            <ButtonUI onClick={this.createProductHandler} type="contained">
                                Create Product
              </ButtonUI>
                        </div>
                    </div>
                </div>
                <Modal
                    toggle={this.toggleModal}
                    isOpen={this.state.modalOpen}
                    className="edit-modal"
                >
                    <ModalHeader toggle={this.toggleModal}>
                        <caption>
                            <h3>Edit Product</h3>
                        </caption>
                    </ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-8">
                                <TextField
                                    value={this.state.editForm.productName}
                                    placeholder="Product Name"
                                    onChange={(e) =>
                                        this.inputHandler(e, "productName", "editForm")
                                    }
                                />
                            </div>
                            <div className="col-4">
                                <TextField
                                    value={this.state.editForm.price}
                                    placeholder="Price"
                                    onChange={(e) => this.inputHandler(e, "price", "editForm")}
                                />
                            </div>
                            <div className="col-12 mt-3">
                                <textarea
                                    value={this.state.editForm.desc}
                                    onChange={(e) => this.inputHandler(e, "desc", "editForm")}
                                    style={{ resize: "none" }}
                                    placeholder="Description"
                                    className="custom-text-input"
                                ></textarea>
                            </div>
                            <div className="col-6 mt-3">
                                <TextField
                                    value={this.state.editForm.image}
                                    placeholder="Image Source"
                                    onChange={(e) => this.inputHandler(e, "image", "editForm")}
                                />
                            </div>
                            <div className="col-6 mt-3">
                                <select
                                    value={this.state.editForm.category}
                                    className="custom-text-input h-100 pl-3"
                                    onChange={(e) => this.inputHandler(e, "category", "editForm")}
                                >
                                    <option value="Phone">Phone</option>
                                    <option value="Tab">Tab</option>
                                    <option value="Laptop">Laptop</option>
                                    <option value="Desktop">Desktop</option>
                                </select>
                            </div>
                            <div className="col-12 text-center my-3">
                                <img src={this.state.editForm.image} alt="" />
                            </div>
                            <div className="col-5 mt-3 offset-1">
                                <ButtonUI
                                    className="w-100"
                                    onClick={this.toggleModal}
                                    type="outlined"
                                >
                                    Cancel
                </ButtonUI>
                            </div>
                            <div className="col-5 mt-3">
                                <ButtonUI
                                    className="w-100"
                                    onClick={this.editProductHandler}
                                    type="contained"
                                >
                                    Save
                </ButtonUI>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default AdminDashboard;
