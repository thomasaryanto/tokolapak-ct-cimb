import Axios from "axios";
import { API_URL } from "../../constants/API";

export const searchHandler = (searchQuery) => {
    return {
        type: "ON_SEARCH",
        payload: searchQuery
    };
};

export const cartUpdateHandler = (userId) => {
    return (dispatch) => {
        Axios.get(`${API_URL}/carts`, {
            params: {
                userId: userId
            },
        })
            .then((res) => {
                dispatch({
                    type: "ON_CART_UPDATE",
                    payload: res.data.length,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
};
