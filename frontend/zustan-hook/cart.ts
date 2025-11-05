// lib/store/cartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============ TYPES ============
// ✅ NEW: Variant type
export interface ProductVariant {
  size: string;
  color: string;
  price: number;
  discountPrice?: number;
}

// ✅ UPDATED: CartItem with variant
export interface CartItem {
  _id: string; // unique key: productId-size-color
  productId: string;
  name: string;
  thumbnail: string;
  quantity: number;
  brandName: string;
  slug: string;

  // ✅ NEW: Variant info
  variant: ProductVariant;

  // ✅ NEW: Unit price (variant-specific)
  unitPrice: number; // discountPrice if exists, else price

  // ✅ NEW: Variant stock
  variantStock: number;
}

export interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalDiscount: number;
  totalItems: number;

  // ADD TO CART
  addToCart: (product: Omit<CartItem, "quantity">) => void;

  // REMOVE FROM CART
  removeFromCart: (cartItemId: string) => void;

  // UPDATE QUANTITY
  updateQuantity: (cartItemId: string, quantity: number) => void;

  // INCREMENT QUANTITY
  incrementQuantity: (cartItemId: string) => void;

  // DECREMENT QUANTITY
  decrementQuantity: (cartItemId: string) => void;

  // GET ITEMS
  getCartItems: () => CartItem[];

  // CLEAR CART
  clearCart: () => void;

  // GET CART SUMMARY
  getCartSummary: () => {
    items: CartItem[];
    totalPrice: number;
    totalDiscount: number;
    totalItems: number;
    finalTotal: number;
  };
}

// ============ ZUSTAND STORE ============
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalPrice: 0,
      totalDiscount: 0,
      totalItems: 0,

      // ✅ ADD TO CART - NOW WITH VARIANTS
      addToCart: (product: Omit<CartItem, "quantity">) => {
        set((state) => {
          // ✅ CHANGED: Find by cart item ID (includes variant)
          const existingItem = state.items.find(
            (item) => item._id === product._id
          );

          let newItems: CartItem[];

          if (existingItem) {
            // If product + variant exists, increase quantity
            newItems = state.items.map((item) =>
              item._id === product._id
                ? {
                    ...item,
                    quantity: Math.min(
                      item.quantity + 1,
                      product.variantStock
                    ),
                  }
                : item
            );
          } else {
            // Add new product variant with quantity 1
            newItems = [
              ...state.items,
              {
                ...product,
                quantity: 1,
              },
            ];
          }

          // ✅ Calculate totals using variant-specific prices
          const totalPrice = newItems.reduce((sum, item) => {
            return sum + item.unitPrice * item.quantity;
          }, 0);

          // ✅ Calculate discount (only if variant has discountPrice)
          const totalDiscount = newItems.reduce((sum, item) => {
            if (item.variant.discountPrice) {
              const discount =
                (item.variant.price - item.variant.discountPrice) *
                item.quantity;
              return sum + discount;
            }
            return sum;
          }, 0);

          const totalItems = newItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          return {
            items: newItems,
            totalPrice,
            totalDiscount,
            totalItems,
          };
        });
      },

      // ✅ REMOVE FROM CART - USES CART ITEM ID
      removeFromCart: (cartItemId: string) => {
        set((state) => {
          const newItems = state.items.filter(
            (item) => item._id !== cartItemId
          );

          // Recalculate totals
          const totalPrice = newItems.reduce((sum, item) => {
            return sum + item.unitPrice * item.quantity;
          }, 0);

          const totalDiscount = newItems.reduce((sum, item) => {
            if (item.variant.discountPrice) {
              const discount =
                (item.variant.price - item.variant.discountPrice) *
                item.quantity;
              return sum + discount;
            }
            return sum;
          }, 0);

          const totalItems = newItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          return {
            items: newItems,
            totalPrice,
            totalDiscount,
            totalItems,
          };
        });
      },

      // ✅ UPDATE QUANTITY - USES CART ITEM ID
      updateQuantity: (cartItemId: string, quantity: number) => {
        set((state) => {
          let newItems: CartItem[];

          if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            newItems = state.items.filter((item) => item._id !== cartItemId);
          } else {
            // Update quantity
            newItems = state.items.map((item) =>
              item._id === cartItemId
                ? {
                    ...item,
                    quantity: Math.min(quantity, item.variantStock),
                  }
                : item
            );
          }

          // Recalculate totals
          const totalPrice = newItems.reduce((sum, item) => {
            return sum + item.unitPrice * item.quantity;
          }, 0);

          const totalDiscount = newItems.reduce((sum, item) => {
            if (item.variant.discountPrice) {
              const discount =
                (item.variant.price - item.variant.discountPrice) *
                item.quantity;
              return sum + discount;
            }
            return sum;
          }, 0);

          const totalItems = newItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          return {
            items: newItems,
            totalPrice,
            totalDiscount,
            totalItems,
          };
        });
      },

      // ✅ INCREMENT QUANTITY
      incrementQuantity: (cartItemId: string) => {
        set((state) => {
          const newItems = state.items.map((item) => {
            if (item._id === cartItemId) {
              return {
                ...item,
                quantity: Math.min(
                  item.quantity + 1,
                  item.variantStock
                ),
              };
            }
            return item;
          });

          // Recalculate totals
          const totalPrice = newItems.reduce((sum, item) => {
            return sum + item.unitPrice * item.quantity;
          }, 0);

          const totalDiscount = newItems.reduce((sum, item) => {
            if (item.variant.discountPrice) {
              const discount =
                (item.variant.price - item.variant.discountPrice) *
                item.quantity;
              return sum + discount;
            }
            return sum;
          }, 0);

          const totalItems = newItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          return {
            items: newItems,
            totalPrice,
            totalDiscount,
            totalItems,
          };
        });
      },

      // ✅ DECREMENT QUANTITY
      decrementQuantity: (cartItemId: string) => {
        set((state) => {
          const newItems = state.items
            .map((item) => {
              if (item._id === cartItemId) {
                return {
                  ...item,
                  quantity: Math.max(item.quantity - 1, 0),
                };
              }
              return item;
            })
            .filter((item) => item.quantity > 0);

          // Recalculate totals
          const totalPrice = newItems.reduce((sum, item) => {
            return sum + item.unitPrice * item.quantity;
          }, 0);

          const totalDiscount = newItems.reduce((sum, item) => {
            if (item.variant.discountPrice) {
              const discount =
                (item.variant.price - item.variant.discountPrice) *
                item.quantity;
              return sum + discount;
            }
            return sum;
          }, 0);

          const totalItems = newItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          return {
            items: newItems,
            totalPrice,
            totalDiscount,
            totalItems,
          };
        });
      },

      // GET CART ITEMS
      getCartItems: () => {
        return get().items;
      },

      // CLEAR CART
      clearCart: () => {
        set({
          items: [],
          totalPrice: 0,
          totalDiscount: 0,
          totalItems: 0,
        });
      },

      // GET CART SUMMARY - READY FOR CHECKOUT
      getCartSummary: () => {
        const state = get();
        const finalTotal = state.totalPrice - state.totalDiscount;

        return {
          items: state.items,
          totalPrice: state.totalPrice,
          totalDiscount: state.totalDiscount,
          totalItems: state.totalItems,
          finalTotal,
        };
      },
    }),
    {
      name: "cart-store",
    }
  )
);


// have to make uniq id with variant const cartItemId = `${productId}-${variant.size}-${variant.color}`;