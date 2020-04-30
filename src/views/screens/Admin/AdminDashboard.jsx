import React from "react";
import { connect } from "react-redux";
import swal from "sweetalert";

import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";
import TextField from "../../components/TextField/TextField";

class AdminDashboard extends React.Component {

    state = {
        productList: [],
        createForm: {
            productName: "",
            price: 0,
            category: "Phone",
            image: "",
            desc: ""
        },
        editForm: {
            id: 0,
            productName: "",
            price: 0,
            category: "",
            image: "",
            desc: ""
        }
    }

    componentDidMount() {
        this.getProductList()
    }

    getProductList() {
        Axios.get(`${API_URL}/products`)
            .then((res) => {
                this.setState({ productList: res.data })
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    inputHandler = (e, field, form) => {
        const { value } = e.target
        this.setState({
            [form]: {
                ...this.state[form],
                [field]: value
            }
        })
    }

    createProductHandler = () => {
        Axios.post(`${API_URL}/products`, this.state.createForm)
            .then((res) => {
                this.setState({
                    createForm: {
                        productName: "",
                        price: 0,
                        category: "Phone",
                        image: "",
                        desc: ""
                    }
                }
                )
                swal("Berhasil", "Berhasil menambahkan produk baru!", "success")
                this.getProductList()
            })
            .catch((err) => {
                swal("Error", "Terjadi kesalahan jaringan saat menambahkan data!", "error")
                console.log(err);
            });
    }

    editBtnHandler = (idx) => {
        this.setState({
            editForm: {
                ...this.state.productList[idx]
            }
        })
    }

    editProductHandler = () => {
        Axios.put(`${API_URL}/products/${this.state.editForm.id}`, this.state.editForm)
            .then((res) => {
                this.setState({
                    editForm: {
                        id: 0,
                        productName: "",
                        price: 0,
                        category: "Phone",
                        image: "",
                        desc: ""
                    }
                }
                )
                swal("Berhasil", "Berhasil mengedit produk baru!", "success")
                this.getProductList()
            })
            .catch((err) => {
                swal("Error", "Terjadi kesalahan jaringan saat mengedit data!", "error")
                console.log(err);
            });
    }

    renderProductList = () => {
        return this.state.productList.map(({ id, productName, price, category, desc, image }, idx) => {
            return (
                <tr key={`cart-${id}`}>
                    <td className="align-middle"><img src={image} alt={productName} className="img-thumbnail" width="100px" height="100px" /></td>
                    <td className="align-middle">{productName}</td>
                    <td className="align-middle">{category}</td>
                    <td className="align-middle">
                        {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                        }).format(price)}
                    </td>
                    <td className="align-middle">{desc}</td>
                    <td className="align-middle" align="right">
                        <ButtonUI onClick={() => this.editBtnHandler(idx)}>Edit</ButtonUI>
                    </td>
                    <td className="align-middle" align="left">
                        <ButtonUI type="outlined">Delete</ButtonUI>
                    </td>
                </tr>
            )
        })
    }

    render() {
        const { createForm, editForm } = this.state
        return (
            <div className="container">
                <div className="text-center">
                    {
                        this.state.productList.length != 0 ? (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Produk</th>
                                        <th>Kategori</th>
                                        <th>Harga</th>
                                        <th>Deskripsi</th>
                                        <th colSpan="2">Opsi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderProductList()}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td>
                                            <TextField onChange={(e) => this.inputHandler(e, "productName", "createForm")} value={createForm.productName} placeholder="Nama" />
                                        </td>
                                        <td>
                                            <TextField onChange={(e) => this.inputHandler(e, "price", "createForm")} value={createForm.price} placeholder="Harga" />
                                        </td>
                                        <td colSpan="2">
                                            <select onChange={(e) => this.inputHandler(e, "category", "createForm")} value={createForm.category} className="form-control">
                                                <option value="Phone">Phone</option>
                                                <option value="Laptop">Laptop</option>
                                                <option value="Tablet">Tablet</option>
                                                <option value="Desktop">Desktop</option>
                                            </select>
                                        </td>
                                        <td>
                                            <TextField onChange={(e) => this.inputHandler(e, "image", "createForm")} value={createForm.image} placeholder="Gambar" />
                                        </td>
                                        <td colSpan="2">
                                            <TextField onChange={(e) => this.inputHandler(e, "desc", "createForm")} value={createForm.desc} placeholder="Deskripsi" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={6}></td>
                                        <td colSpan={1}>
                                            <ButtonUI onClick={this.createProductHandler} type="contained">Create</ButtonUI>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <TextField onChange={(e) => this.inputHandler(e, "productName", "editForm")} value={editForm.productName} placeholder="Nama" />
                                        </td>
                                        <td>
                                            <TextField onChange={(e) => this.inputHandler(e, "price", "editForm")} value={editForm.price} placeholder="Harga" />
                                        </td>
                                        <td colSpan="2">
                                            <select onChange={(e) => this.inputHandler(e, "category", "editForm")} value={editForm.category} className="form-control">
                                                <option value="Phone">Phone</option>
                                                <option value="Laptop">Laptop</option>
                                                <option value="Tablet">Tablet</option>
                                                <option value="Desktop">Desktop</option>
                                            </select>
                                        </td>
                                        <td>
                                            <TextField onChange={(e) => this.inputHandler(e, "image", "editForm")} value={editForm.image} placeholder="Gambar" />
                                        </td>
                                        <td colSpan="2">
                                            <TextField onChange={(e) => this.inputHandler(e, "desc", "editForm")} value={editForm.desc} placeholder="Deskripsi" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={6}></td>
                                        <td colSpan={1}>
                                            <ButtonUI onClick={this.editProductHandler} type="contained">Save</ButtonUI>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        ) : (
                                <div class="alert alert-primary" role="alert" style={{ marginTop: "20%" }}>
                                    <p>Produk masih kosong!</p>
                                </div>
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

export default connect(mapStateToProps)(AdminDashboard);
