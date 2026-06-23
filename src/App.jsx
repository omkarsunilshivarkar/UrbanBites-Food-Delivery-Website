import { useState } from 'react';
import Cart from './components/Cart.jsx';
import Checkout from './components/Checkout.jsx';
import Header from './components/Header.jsx';
import Meals from './components/Meals.jsx';
import Toast from './components/UI/Toast.jsx';
import { CartContextProvider } from './store/CartContext.jsx';
import { UserProgressContextProvider } from './store/UserProgressContext.jsx';
import { ToastContextProvider } from './store/ToastContext.jsx';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  function handleSearchChange(term) {
    setSearchTerm(term);
  }

  return (
    <ToastContextProvider>
      <UserProgressContextProvider>
        <CartContextProvider>
          <Toast />
          <Header onSearchChange={handleSearchChange} />
          <Meals searchTerm={searchTerm} />
          <Cart />
          <Checkout/>
        </CartContextProvider>
      </UserProgressContextProvider>
    </ToastContextProvider>
  );
}

export default App;
