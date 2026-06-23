import { createContext, useReducer, useEffect } from "react";

const CartContext = createContext({
    items: [],
    addItem: () => { },
    removeItem: () => { },
    clearCart: () => { }
});

function cartReducer(state, action) {

    if (action.type === 'ADD_ITEM') {
        const existingCartItemIndex = state.items.findIndex((item) => item.id === action.item.id)

        const updatedItems = [...state.items];

        if (existingCartItemIndex > -1) {
            const existingItem = state.items[existingCartItemIndex];
            const updatedItem = {
                ...existingItem,
                quantity: existingItem.quantity + 1
            }
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            updatedItems.push({ ...action.item, quantity: 1 });
        }

        return { ...state, items: updatedItems }

    }
    if (action.type === 'REMOVE_ITEM') {
        const existingCartItemIndex = state.items.findIndex((item) => item.id === action.id)
        const existingCartItem = state.items[existingCartItemIndex]
        const updatedItems = [...state.items]

        if (existingCartItem.quantity === 1) {
            updatedItems.splice(existingCartItemIndex, 1)
        } else {
            const updatedItem = { ...existingCartItem, quantity: existingCartItem.quantity - 1 }
            updatedItems[existingCartItemIndex] = updatedItem;
        }

        return { ...state, items: updatedItems }

    }

    if (action.type==='CLEAR_CART'){
        return {...state,items:[]}
    }

    if (action.type === 'LOAD_CART') {
        return { ...state, items: action.items }
    }

    return state;
}

function getInitialCart() {
    try {
        const savedCart = localStorage.getItem('urbanbites_cart');
        return savedCart ? JSON.parse(savedCart) : { items: [] };
    } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
        return { items: [] };
    }
}

export function CartContextProvider({ children }) {

    const [cart, dispatchCartAction] = useReducer(cartReducer, getInitialCart());

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('urbanbites_cart', JSON.stringify(cart));
    }, [cart]);

    function addItem(item){
        dispatchCartAction({type:'ADD_ITEM', item})
    }

    function removeItem(id){
        dispatchCartAction({type:'REMOVE_ITEM', id})
    }

    function clearCart(){
        dispatchCartAction({type:'CLEAR_CART'})
    }

    const cartContext={
        items:cart.items,
        addItem,
        removeItem,
        clearCart
    }


    return <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
}


export default CartContext;