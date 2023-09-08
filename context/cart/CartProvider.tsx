import { useEffect, useReducer } from 'react';
import { ICartProduct, ShippingAddress } from '@/interfaces';
import { CartContext, cartReducer } from './';
import Cookie from 'js-cookie';

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;

  shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    try {
      const cookieProducts = Cookie.get('cart')
        ? JSON.parse(Cookie.get('cart')!)
        : [];
      dispatch({
        type: '[Cart] - LoadCartFromCookies | storage',
        payload: cookieProducts,
      });
    } catch (error) {
      dispatch({
        type: '[Cart] - LoadCartFromCookies | storage',
        payload: [],
      });
    }
  }, []);

  useEffect(() => {
    Cookie.set('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    if (Cookie.get('firstname')) {
      const shippingAddress = {
        firstName: Cookie.get('firstName') ?? '',
        lastName: Cookie.get('lastName') ?? '',
        address: Cookie.get('address') ?? '',
        address2: Cookie.get('address2') ?? '',
        zip: Cookie.get('zip') ?? '',
        city: Cookie.get('city') ?? '',
        country: Cookie.get('country') ?? '',
        phone: Cookie.get('phone') ?? '',
      };

      dispatch({
        type: '[Cart] - LoadAddressFromCookies',
        payload: shippingAddress,
      });
    }
  }, []);

  useEffect(() => {
    const numberOfItems = state.cart.reduce(
      (prev, current) => current.quantity + prev,
      0
    );
    const subTotal = state.cart.reduce(
      (prev, current) => current.quantity * current.price + prev,
      0
    );
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE ?? 0);
    const orderSumary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (taxRate + 1),
    };
    dispatch({ type: '[Cart] - UpdateOrderSummary', payload: orderSumary });
  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    const existProduct = state.cart.some(
      (p: ICartProduct) => p._id === product._id
    );
    if (!existProduct)
      return dispatch({
        type: '[Cart] - UpdateProductsInCart',
        payload: [...state.cart, product],
      });

    const existProductSizeWithDiferentSize = state.cart.some(
      (p: ICartProduct) => p._id === product._id && p.size === product.size
    );
    if (!existProductSizeWithDiferentSize)
      return dispatch({
        type: '[Cart] - UpdateProductsInCart',
        payload: [...state.cart, product],
      });

    //Acumular
    const updatedProducts = state.cart.map((p: ICartProduct) => {
      if (p._id !== product._id) return p;
      if (p.size !== product.size) return p;

      //Actualizar la cantidad
      p.quantity += product.quantity;
      return p;
    });

    dispatch({
      type: '[Cart] - UpdateProductsInCart',
      payload: updatedProducts,
    });
  };

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - UpdateProductCartQuantity', payload: product });
  };

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - RemoveProductInCart', payload: product });
  };

  const updateAddres = (address: ShippingAddress) => {
    Cookie.set('firstName', address.firstName);
    Cookie.set('lastName', address.lastName);
    Cookie.set('address', address.address);
    Cookie.set('address2', address.address2 ?? '');
    Cookie.set('zip', address.zip);
    Cookie.set('city', address.city);
    Cookie.set('country', address.country);
    Cookie.set('phone', address.phone);
    dispatch({ type: '[Cart] - UpdateShippingAddress', payload: address });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,

        //Methods
        addProductToCart,
        removeCartProduct,
        updateCartQuantity,
        updateAddres,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
