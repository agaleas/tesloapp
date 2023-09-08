import { ICartProduct, ShippingAddress } from '@/interfaces';

type CartActionType =
  | { type: '[Cart] - LoadCartFromCookies | storage'; payload: ICartProduct[] }
  | { type: '[Cart] - UpdateProductsInCart'; payload: ICartProduct[] }
  | { type: '[Cart] - UpdateProductCartQuantity'; payload: ICartProduct }
  | { type: '[Cart] - RemoveProductInCart'; payload: ICartProduct }
  | { type: '[Cart] - LoadAddressFromCookies'; payload: ShippingAddress }
  | { type: '[Cart] - UpdateShippingAddress'; payload: ShippingAddress }
  | {
      type: '[Cart] - UpdateOrderSummary';
      payload: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
      };
    };

export const cartReducer = (
  state: CartState,
  action: CartActionType
): CartState => {
  switch (action.type) {
    case '[Cart] - LoadCartFromCookies | storage':
      return {
        ...state,
        isLoaded: true,
        cart: [...action.payload],
      };

    case '[Cart] - UpdateProductsInCart':
      return {
        ...state,
        cart: [...action.payload],
      };

    case '[Cart] - UpdateProductCartQuantity':
      return {
        ...state,
        cart: state.cart.map((product) => {
          if (product._id !== action.payload._id) return product;
          if (product.size !== action.payload.size) return product;

          return action.payload;
        }),
      };

    case '[Cart] - RemoveProductInCart':
      return {
        ...state,
        // cart: state.cart.filter((product) =>product._id !== action.payload._id ||(product._id === action.payload._id && product.size !== action.payload.size)),
        cart: state.cart.filter(
          (product) =>
            !(
              product._id === action.payload._id &&
              product.size === action.payload.size
            )
        ),
        // cart: state.cart.filter((product) => {
        //   if (
        //     product._id === action.payload._id &&
        //     product.size === action.payload.size
        //   ) {
        //     return false;
        //   }
        //   return true;
        // }),
      };

    case '[Cart] - UpdateOrderSummary':
      return {
        ...state,
        ...action.payload,
      };

    case '[Cart] - UpdateShippingAddress':
    case '[Cart] - LoadAddressFromCookies':
      return {
        ...state,
        shippingAddress: action.payload,
      };

    default:
      return state;
  }
};
