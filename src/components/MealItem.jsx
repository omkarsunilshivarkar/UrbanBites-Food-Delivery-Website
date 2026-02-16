import CartContext from "../store/CartContext"
import ToastContext from "../store/ToastContext"
import { currencyFormatter } from "../util/formatting"
import Button from "./UI/Button"
import { useContext, useState } from "react"

export default function MealItem({ meal }) {
    const [quantity, setQuantity] = useState(1);
    const cartCtx = useContext(CartContext);
    const toastCtx = useContext(ToastContext);

    function handleAddMealToCart() {
        for (let i = 0; i < quantity; i++) {
            cartCtx.addItem(meal);
        }
        toastCtx.showToast(`✓ ${quantity} ${meal.name}${quantity > 1 ? 's' : ''} added to cart!`, 'success');
        setQuantity(1);
    }

    function handleIncreaseQuantity() {
        setQuantity(prev => prev + 1);
    }

    function handleDecreaseQuantity() {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    }

    return (
        <li className="meal-item">
            <article>
                <img src={`http://localhost:3000/${meal.image}`} alt={meal.name} />
                <div>
                    <h3>{meal.name}</h3>
                    <p className="meal-item-price">{currencyFormatter.format(meal.price)}</p>
                    <p className="meal-item-description">{meal.description}</p>
                </div>
                <div className="meal-item-actions">
                    <div className="quantity-selector">
                        <button className="qty-btn" onClick={handleDecreaseQuantity}>−</button>
                        <span className="qty-display">{quantity}</span>
                        <button className="qty-btn" onClick={handleIncreaseQuantity}>+</button>
                    </div>
                    <Button onClick={handleAddMealToCart}>Add To Cart</Button>
                </div>
            </article>
        </li>
    )
}