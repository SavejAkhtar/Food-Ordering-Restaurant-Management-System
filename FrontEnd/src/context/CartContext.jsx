import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

const emptyCart = { restaurant: null, items: [] };

const readSavedCart = () => {
    let saved = localStorage.getItem("cart");

    if (!saved) {
        return emptyCart;
    }

    try {
        return JSON.parse(saved);
    } catch {
        return emptyCart;
    }
};

export const CartProvider = ({ children }) => {
    let [cart, setCart] = useState(readSavedCart);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    let addToCart = (food, restaurant) => {
        let isDifferentRestaurant = cart.restaurant && cart.restaurant._id !== restaurant._id;

        if (isDifferentRestaurant) {
            let replaceCart = window.confirm(
                `Your cart already has items from ${cart.restaurant.name}. Clear the cart and add this item?`
            );

            if (!replaceCart) {
                return false;
            }

            setCart({
                restaurant: { _id: restaurant._id, name: restaurant.name },
                items: [{ foodItem: food._id, name: food.name, price: food.price, image: food.image, quantity: 1 }]
            });

            return true;
        }

        let existingItem = cart.items.find((item) => item.foodItem === food._id);

        if (existingItem) {
            setCart({
                restaurant: cart.restaurant,
                items: cart.items.map((item) =>
                    item.foodItem === food._id ? { ...item, quantity: item.quantity + 1 } : item
                )
            });

            return true;
        }

        setCart({
            restaurant: { _id: restaurant._id, name: restaurant.name },
            items: [
                ...cart.items,
                { foodItem: food._id, name: food.name, price: food.price, image: food.image, quantity: 1 }
            ]
        });

        return true;
    };

    let increaseQuantity = (foodId) => {
        setCart({
            ...cart,
            items: cart.items.map((item) =>
                item.foodItem === foodId ? { ...item, quantity: item.quantity + 1 } : item
            )
        });
    };

    let decreaseQuantity = (foodId) => {
        let item = cart.items.find((one) => one.foodItem === foodId);

        if (item.quantity === 1) {
            removeFromCart(foodId);
            return;
        }

        setCart({
            ...cart,
            items: cart.items.map((one) =>
                one.foodItem === foodId ? { ...one, quantity: one.quantity - 1 } : one
            )
        });
    };

    let removeFromCart = (foodId) => {
        let remainingItems = cart.items.filter((item) => item.foodItem !== foodId);

        setCart({
            restaurant: remainingItems.length > 0 ? cart.restaurant : null,
            items: remainingItems
        });
    };

    let clearCart = () => {
        setCart(emptyCart);
    };

    let subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                subtotal,
                totalItems,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeFromCart,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
