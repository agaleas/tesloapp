import { ICartProduct, ShippingAddress } from '@/interfaces';
import { createContext } from 'react';

interface ContextProps {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;

  shippingAddress?: ShippingAddress;

  //Methods
  addProductToCart: (product: ICartProduct) => void;
  updateCartQuantity: (product: ICartProduct) => void;
  removeCartProduct: (product: ICartProduct) => void;
  updateAddres: (address: ShippingAddress) => void;
}

export const CartContext = createContext({} as ContextProps);
