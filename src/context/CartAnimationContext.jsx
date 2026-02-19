import React, { createContext, useContext, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CartAnimationContext = createContext();

export const useCartAnimation = () => useContext(CartAnimationContext);

export const CartAnimationProvider = ({ children }) => {
    const [cartIconRef, setCartIconRef] = useState(null);
    const [flyingItems, setFlyingItems] = useState([]);
    const [isCartBumping, setIsCartBumping] = useState(false);

    const registerCartIcon = (ref) => {
        setCartIconRef(ref);
    };

    const animateAddToCart = (startRect, imageSrc) => {
        if (!cartIconRef) return;

        const endRect = cartIconRef.getBoundingClientRect();
        const id = Date.now();

        setFlyingItems((prev) => [
            ...prev,
            {
                id,
                start: {
                    x: startRect.left,
                    y: startRect.top,
                    width: startRect.width,
                    height: startRect.height,
                },
                end: {
                    x: endRect.left + endRect.width / 2 - 20, // Center approx
                    y: endRect.top + endRect.height / 2 - 20,
                    width: 40,
                    height: 40,
                },
                src: imageSrc,
            },
        ]);

        // Remove item after animation
        setTimeout(() => {
            setFlyingItems((prev) => prev.filter((item) => item.id !== id));
            bumpCart();
        }, 800); // Animation duration
    };

    const bumpCart = () => {
        setIsCartBumping(true);
        setTimeout(() => setIsCartBumping(false), 300);
    };

    return (
        <CartAnimationContext.Provider value={{ registerCartIcon, animateAddToCart, isCartBumping }}>
            {children}
            {flyingItems.map((item) => (
                <motion.img
                    key={item.id}
                    src={item.src}
                    initial={{
                        position: 'fixed',
                        top: item.start.y,
                        left: item.start.x,
                        width: item.start.width,
                        height: item.start.height,
                        opacity: 1,
                        zIndex: 9999,
                        pointerEvents: 'none',
                    }}
                    animate={{
                        top: item.end.y,
                        left: item.end.x,
                        width: item.end.width,
                        height: item.end.height,
                        opacity: 0.5,
                        scale: 0.5,
                    }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
            ))}
        </CartAnimationContext.Provider>
    );
};
