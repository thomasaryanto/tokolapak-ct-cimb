const init_state = {
    searchQuery: "",
    cartCount: 0,
    isLoading: false
};

export default (state = init_state, action) => {
    switch (action.type) {
        case "ON_SEARCH":
            return { ...state, searchQuery: action.payload };
        case "ON_CART_UPDATE":
            return { ...state, cartCount: action.payload };
        case "ON_LOADING":
            return { ...state, isLoading: action.payload };
        default:
            return { ...state };
    }
};
