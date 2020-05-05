import React from "react";
import "./AdminDashboard.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";

import { API_URL } from "../../../constants/API";

import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";

import swal from "sweetalert";

import avatar from '../../../assets/images/profile.png'

class AdminMember extends React.Component {
    state = {
        usersList: [],
        createForm: {
            username: "",
            fullName: "",
            password: "",
            email: "",
            role: "admin",
        },
        editForm: {
            id: 0,
            username: "",
            fullName: "",
            password: "",
            email: "",
            role: "",
        },
        activeUsers: [],
        modalOpen: false,
    };

    getUsersList = () => {
        Axios.get(`${API_URL}/users`)
            .then((res) => {
                this.setState({ usersList: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    deleteUser = (id) => {
        Axios.delete(`${API_URL}/users/${id}`)
            .then((res) => {
                swal("Success!", "User deleted.", "success");
                this.getUsersList();
                console.log(res);
            })
            .catch((err) => {
                swal("Error!", "Delete user failed!", "error");
                console.log(err);
            });
    }

    renderUsersList = () => {
        return this.state.usersList.map((val, idx) => {
            const { id, username, fullName, password, email, role } = val;
            return (
                <>
                    <tr
                        onClick={() => {
                            if (this.state.activeUsers.includes(idx)) {
                                this.setState({
                                    activeUsers: [
                                        ...this.state.activeUsers.filter((item) => item !== idx),
                                    ],
                                });
                            } else {
                                this.setState({
                                    activeUsers: [...this.state.activeUsers, idx],
                                });
                            }
                        }}
                    >
                        <td> {id} </td>
                        <td> {fullName} </td>
                        <td> {role} </td>
                    </tr>
                    <tr
                        className={`collapse-item ${
                            this.state.activeUsers.includes(idx) ? "active" : null
                            }`}
                    >
                        <td className="" colSpan={3}>
                            <div className="d-flex justify-content-around align-items-center">
                                <img src={avatar} alt="" />
                                <div className="d-flex">
                                    <div className="d-flex flex-column ml-4 justify-content-center">
                                        <h5>{fullName}</h5>
                                        <h6 className="mt-2">
                                            <span style={{ fontWeight: "normal" }}> {email}</span>
                                        </h6>
                                        <h6>
                                            <span style={{ fontWeight: "normal" }}>{username}</span>
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
                                    <ButtonUI onClick={() => this.deleteUser(id)} className="mt-3" type="textual">
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

    createUserHandler = () => {
        Axios.post(`${API_URL}/users`, this.state.createForm)
            .then((res) => {
                swal("Success!", "User been added.", "success");
                this.setState({
                    createForm: {
                        username: "",
                        fullName: "",
                        password: "",
                        email: "",
                        role: "",
                    },
                });
                this.getUsersList();
            })
            .catch((err) => {
                console.log(err)
                swal("Error!", "User could not be added.", "error");
            });
    };

    editBtnHandler = (idx) => {
        this.setState({
            editForm: {
                ...this.state.usersList[idx],
            },
            modalOpen: true,
        });
    };

    editUserHandler = () => {
        Axios.put(
            `${API_URL}/users/${this.state.editForm.id}`,
            this.state.editForm
        )
            .then((res) => {
                swal("Success!", "User has been edited", "success");
                this.setState({ modalOpen: false });
                this.getUsersList();
            })
            .catch((err) => {
                swal("Error!", "User could not be edited", "error");
                console.log(err);
            });
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
                    <caption className="p-3">
                        <h2>Users</h2>
                    </caption>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fullname</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>{this.renderUsersList()}</tbody>
                    </table>
                </div>
                <div className="dashboard-form-container p-4">
                    <caption className="mb-4 mt-2">
                        <h2>Add User</h2>
                    </caption>
                    <div className="row">
                        <div className="col-8">
                            <TextField
                                value={this.state.createForm.fullName}
                                placeholder="Full Name"
                                onChange={(e) =>
                                    this.inputHandler(e, "fullName", "createForm")
                                }
                            />
                        </div>
                        <div className="col-4">
                            <TextField
                                value={this.state.createForm.username}
                                placeholder="Username"
                                onChange={(e) => this.inputHandler(e, "username", "createForm")}
                            />
                        </div>
                        <div className="col-12 mt-3">
                            <TextField
                                value={this.state.createForm.email}
                                placeholder="E-Mail"
                                onChange={(e) => this.inputHandler(e, "email", "createForm")}
                            />
                        </div>
                        <div className="col-6 mt-3">
                            <select
                                value={this.state.createForm.role}
                                className="custom-text-input h-100 pl-3"
                                onChange={(e) => this.inputHandler(e, "role", "createForm")}
                            >
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>

                        </div>
                        <div className="col-6 mt-3">
                            <TextField
                                value={this.state.createForm.password}
                                placeholder="Password"
                                onChange={(e) => this.inputHandler(e, "password", "createForm")}
                            />
                        </div>
                        <div className="col-3 mt-3">
                            <ButtonUI onClick={this.createUserHandler} type="contained">
                                Create User
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
                            <h3>Edit User</h3>
                        </caption>
                    </ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-8">
                                <TextField
                                    value={this.state.editForm.fullName}
                                    placeholder="Full Name"
                                    onChange={(e) =>
                                        this.inputHandler(e, "fullName", "editForm")
                                    }
                                />
                            </div>
                            <div className="col-4">
                                <TextField
                                    value={this.state.editForm.username}
                                    placeholder="Username"
                                    onChange={(e) => this.inputHandler(e, "username", "editForm")}
                                />
                            </div>
                            <div className="col-12 mt-3">
                                <TextField
                                    value={this.state.editForm.email}
                                    placeholder="E-Mail"
                                    onChange={(e) => this.inputHandler(e, "email", "editForm")}
                                />
                            </div>
                            <div className="col-6 mt-3">
                                <select
                                    value={this.state.editForm.role}
                                    className="custom-text-input h-100 pl-3"
                                    onChange={(e) => this.inputHandler(e, "role", "editForm")}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>


                            </div>
                            <div className="col-6 mt-3">
                                <TextField
                                    value={this.state.editForm.password}
                                    placeholder="Password"
                                    onChange={(e) => this.inputHandler(e, "password", "editForm")}
                                />
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
                                    onClick={this.editUserHandler}
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

export default AdminMember;
