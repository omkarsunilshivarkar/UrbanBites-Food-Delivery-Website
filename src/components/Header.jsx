import { useContext } from 'react';
import logoImg from '../assets/logo.jpg';
import Button from './UI/Button';
import MealsFilter from './MealsFilter';
import CartContext from '../store/CartContext';
import UserProgressContext from '../store/UserProgressContext';

export default function Header({ onSearchChange, searchTerm }) {

    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const totalCartItems=cartCtx.items.reduce((totalNumberOfItems,item)=>{
        return totalNumberOfItems + item.quantity
    },0)

    function handleShowCart(){
        userProgressCtx.showCart()
    }
    
    return <header id="main-header">
        <div id="title">
            <img src={logoImg} alt="UrbanBites Logo" />
            <h1>UrbanBites</h1>
        </div>
        <MealsFilter onSearchChange={onSearchChange} />
        <nav>
            <Button textOnly onClick={handleShowCart}>Cart ({totalCartItems})</Button>
        </nav>
    </header>
}