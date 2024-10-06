"use client";

import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import gsap from "gsap";

type CustomCursorProps = {
    size?: number;
    color?: string;
};

const CustomCursor: React.FC<CustomCursorProps> = ({
    size = 12,
    color = "#fff",
}) => {
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const cursor = cursorRef.current;

            const moveCursor = (e: MouseEvent) => {
                gsap.to(cursor, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.5,
                    ease: "power3.out",
                    opacity: 1,
                });
            };

            const onMouseEnter = () => {
                gsap.to(cursor, {
                    scale: 4,
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    transparent: true,
                    duration: 0.2,
                    ease: "power3.out",
                    zIndex: 0,
                });
            };

            const onMouseLeave = () => {
                gsap.to(cursor, {
                    scale: 1,
                    backgroundColor: color,
                    duration: 0.2,
                    ease: "power3.out",
                });
            };

            window.addEventListener("mousemove", moveCursor);

            const hoverElements = document.querySelectorAll(
                "a, .custom-hover, iframe"
            );
            hoverElements.forEach((elem) => {
                elem.addEventListener("mouseenter", onMouseEnter);
                elem.addEventListener("mouseleave", onMouseLeave);
            });

            return () => {
                window.removeEventListener("mousemove", moveCursor);
                hoverElements.forEach((elem) => {
                    elem.removeEventListener("mouseenter", onMouseEnter);
                    elem.removeEventListener("mouseleave", onMouseLeave);
                });
            };
        }
    }, [color]);

    return (
        <div
            ref={cursorRef}
            style={{
                position: "fixed",
                top: -size / 2,
                left: -size / 2,
                width: size,
                height: size,
                backgroundColor: color,
                borderRadius: "50%",
                pointerEvents: "none",
                zIndex: 99,
                opacity: 0,
                transform: "scale(1)",
                mixBlendMode: "exclusion",
            }}
        ></div>
    );
};

CustomCursor.propTypes = {
    size: PropTypes.number,
    color: PropTypes.string,
};

export default CustomCursor;
