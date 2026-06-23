import { useContext, useActionState, useEffect } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import ToastContext from "../store/ToastContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}

export default function Checkout() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);
    const toastCtx = useContext(ToastContext);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const { data, error, sendRequest, clearData } = useHttp(`${backendUrl}/orders`, requestConfig);

    const cartTotal = cartCtx.items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0);

    // Show toast on error
    useEffect(() => {
        if (error) {
            toastCtx.showToast(`✕ Error: ${error}`, 'error');
        }
    }, [error, toastCtx]);

    function handleClose() {
        userProgressCtx.hideCheckout()
    }

    function handleFinish() {
        userProgressCtx.hideCheckout()
        cartCtx.clearCart()
        clearData()
    }

    async function checkoutAction(prevState, fd) {
        const customerData = Object.fromEntries(fd.entries());

        await sendRequest(
            JSON.stringify({
                order: {
                    items: cartCtx.items,
                    customer: customerData
                }
            })
        )
    }

    const [, formAction, isSending] = useActionState(checkoutAction, null)

    let actions = (<><Button type="button" textOnly onClick={handleClose}>Close</Button>
        <Button>Submit Order</Button></>)

    if (isSending) {
        actions = <span>Sending order data...</span>
    }

    if (data && !error) {
        return <Modal open={userProgressCtx.progress === "checkout"} onClose={handleFinish}>
            <h2>Success !</h2>
            <p>Your order was submitted successfully.</p>
            <p>We will get back to you with more details via email within the next few minutes.</p>
            <p className="modal-actions">
                <Button onClick={handleFinish}>Okay</Button>
            </p>
        </Modal>
    }

    return <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
        <form action={formAction}>
            <h2>Checkout</h2>
            <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

            <Input label="Full Name" id="name" type="text" />
            <Input label="E-Mail Address" id="email" type="email" />
            <Input label="Street Address" id="street" type="text" />
            <div className="control-row">
                <Input label="Postal Code" id="postal-code" type="text" />
                <Input label="City" id="city" type="text" />

            </div>

            {error && <Error title="Failed to submit order" message={error} />}

            <p className="modal-actions">{actions}</p>

        </form>
    </Modal>
}