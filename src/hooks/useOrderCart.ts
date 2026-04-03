import { useState, useCallback, useMemo } from "react";
import type { CartItem, Product, OrderSummary } from "@/types";

export interface UseOrderCartReturn {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updatePrice: (productId: number, unitPrice: number) => void;
  updateDiscount: (productId: number, discountPercent: number) => void;
  updateTax: (productId: number, taxRate: number) => void;
  clearCart: () => void;
  summary: OrderSummary;
  itemCount: number;
}

interface UseOrderCartOptions {
  shippingFee?: number;
}

export function useOrderCart(options: UseOrderCartOptions = {}): UseOrderCartReturn {
  const { shippingFee = 0 } = options;
  const [items, setItems] = useState<CartItem[]>([]);

  // Add item to cart
  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      // Check if item already exists
      const existingIndex = prev.findIndex((item) => item.productId === product.id);

      if (existingIndex >= 0) {
        // Update quantity if exists
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      // Add new item
      const newItem: CartItem = {
        productId: product.id,
        product,
        quantity,
        unitPrice: product.sellingPriceRetail || 0,
        discountPercent: 0,
        taxRate: product.taxRate || 0,
      };

      return [...prev, newItem];
    });
  }, []);

  // Remove item from cart
  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  // Update quantity
  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeItem]);

  // Update unit price
  const updatePrice = useCallback((productId: number, unitPrice: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, unitPrice }
          : item
      )
    );
  }, []);

  // Update discount percent
  const updateDiscount = useCallback((productId: number, discountPercent: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, discountPercent }
          : item
      )
    );
  }, []);

  // Update tax rate
  const updateTax = useCallback((productId: number, taxRate: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, taxRate }
          : item
      )
    );
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Calculate summary
  const summary = useMemo<OrderSummary>(() => {
    const subtotal = items.reduce((sum, item) => {
      return sum + item.unitPrice * item.quantity;
    }, 0);

    const discount = items.reduce((sum, item) => {
      const itemSubtotal = item.unitPrice * item.quantity;
      const itemDiscount = (itemSubtotal * item.discountPercent) / 100;
      return sum + itemDiscount;
    }, 0);

    const tax = items.reduce((sum, item) => {
      const itemSubtotal = item.unitPrice * item.quantity;
      const itemDiscount = (itemSubtotal * item.discountPercent) / 100;
      const taxableAmount = itemSubtotal - itemDiscount;
      const itemTax = (taxableAmount * item.taxRate) / 100;
      return sum + itemTax;
    }, 0);

    const total = subtotal - discount + tax + shippingFee;

    console.log('total', total);

    return {
      subtotal,
      discount,
      tax,
      shipping: shippingFee,
      total,
    };
  }, [items, shippingFee]);

  // Item count
  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    updatePrice,
    updateDiscount,
    updateTax,
    clearCart,
    summary,
    itemCount,
  };
}
