import { create } from "zustand";
import type { CartItem, OrderSummary } from "@/types";

// Cart State Interface
interface CartState {
  // State
  items: CartItem[];
  customer_id: number | null;
  warehouse_id: number | null;
  shipping_fee: number;
  notes: string;

  // Computed
  summary: OrderSummary;

  // Actions
  addItem: (item: CartItem) => void;
  updateItem: (product_id: number, updates: Partial<CartItem>) => void;
  removeItem: (product_id: number) => void;
  updateQuantity: (product_id: number, quantity: number) => void;
  clearCart: () => void;
  setCustomer: (customer_id: number) => void;
  setWarehouse: (warehouse_id: number) => void;
  setShippingFee: (fee: number) => void;
  setNotes: (notes: string) => void;
  calculateSummary: () => void;
}

// Cart Store - Quản lý shopping cart cho sales orders
export const useCartStore = create<CartState>((set, get) => ({
  // Initial State
  items: [],
  customer_id: null,
  warehouse_id: null,
  shipping_fee: 0,
  notes: "",
  summary: {
    subtotal: 0,
    discount: 0,
    tax: 0,
    shipping: 0,
    total: 0,
  },

  // Add Item
  addItem: (item) => {
    set((state) => {
      // Check if item already exists
      const existingItemIndex = state.items.findIndex(
        (i) => i.productId === item.productId
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update quantity if exists
        newItems = state.items.map((i, index) => {
          if (index === existingItemIndex) {
            const newQuantity = i.quantity + item.quantity;
            const subtotal = newQuantity * i.unitPrice;
            const discount = (subtotal * i.discountPercent) / 100;
            const taxable = subtotal - discount;
            const tax = (taxable * i.taxRate) / 100;
            const total = taxable + tax;

            return {
              ...i,
              quantity: newQuantity,
              discount_amount: discount,
              tax_amount: tax,
              total_amount: total,
            };
          }
          return i;
        });
      } else {
        // Add new item
        newItems = [...state.items, item];
      }

      return { items: newItems };
    });

    // Recalculate summary
    get().calculateSummary();
  },

  // Update Item
  updateItem: (product_id, updates) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.productId === product_id) {
          const updatedItem = { ...item, ...updates };

          // Recalculate amounts
          const subtotal = updatedItem.quantity * updatedItem.unitPrice;
          const discount =
            updatedItem.discountPercent > 0
              ? (subtotal * updatedItem.discountPercent) / 100
              : updatedItem.discountAmount;
          const taxable = subtotal - discount;
          const tax = (taxable * updatedItem.taxRate) / 100;
          const total = taxable + tax;

          return {
            ...updatedItem,
            discount_amount: discount,
            tax_amount: tax,
            total_amount: total,
          };
        }
        return item;
      }),
    }));

    get().calculateSummary();
  },

  // Remove Item
  removeItem: (product_id) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== product_id),
    }));

    get().calculateSummary();
  },

  // Update Quantity
  updateQuantity: (product_id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(product_id);
      return;
    }

    get().updateItem(product_id, { quantity });
  },

  // Clear Cart
  clearCart: () => {
    set({
      items: [],
      customer_id: null,
      warehouse_id: null,
      shipping_fee: 0,
      notes: "",
      summary: {
        subtotal: 0,
        discount: 0,
        tax: 0,
        shipping: 0,
        total: 0,
      },
    });
  },

  // Set Customer
  setCustomer: (customer_id) => {
    set({ customer_id });
  },

  // Set Warehouse
  setWarehouse: (warehouse_id) => {
    set({ warehouse_id });
  },

  // Set Shipping Fee
  setShippingFee: (fee) => {
    set({ shipping_fee: fee });
    get().calculateSummary();
  },

  // Set Notes
  setNotes: (notes) => {
    set({ notes });
  },

  // Calculate Summary
  calculateSummary: () => {
    const { items, shipping_fee } = get();

    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const discount = items.reduce((sum, item) => sum + item.discountAmount, 0);
    const tax = items.reduce((sum, item) => sum + item.taxAmount, 0);
    const total = subtotal - discount + tax + shipping_fee;

    set({
      summary: {
        subtotal,
        discount,
        tax,
        shipping: shipping_fee,
        total,
      },
    });
  },
}));
