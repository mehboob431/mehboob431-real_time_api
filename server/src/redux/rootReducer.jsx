

// import { Redirect_TO_CART } from '../actions/cartActions';

const intialState = {
    loading: false,
    cartItems: []
}
export const rootReducer = (state = intialState, action) => {
    switch (action.type) {
        case 'Add_To_Cart':
            return {
                ...state,
                cartItems: [...state.cartItems, action.payload],
            };
        // case 'Redirect_TO_CART':
        //     return {
        //         ...state,
        //         cartItems: [...state.cartItems, action.payload], // Item ko cart mein add kar raha hai
        //     };
        case 'Update_Cart':
            return {
                ...state,
                cartItems: state.cartItems.map(item =>
                    item._id === action.payload._id
                        ? { ...item, quantity: action.payload.quantity }
                        : item)
            };
        case 'Delete_From_Cart':
            return {
                ...state,
                cartItems: state.cartItems.filter(
                    (item) => item._id !== action.payload._id
                ),
            };
        case 'Clear_Cart':
            return {
                ...state,
                cartItems: []
            };
        case 'Set_Cart':
            return {
                ...state,
                cartItems: action.payload,
            };
        default:
            return state
    }
}
