// Tooltip.jsx
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const Tooltip = ({ children, content, placement = "top" }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const timeoutRef = useRef(null);

  const handleClick = () => {
    setVisible(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
    }, 5000);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const tooltipStyles = {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "4px",
    whiteSpace: "nowrap",
    display: visible ? "block" : "none",
    zIndex: 1000,
  };

  const containerStyles = {
    position: "relative",
    display: "inline-block",
  };

  const placementStyles = {
    top: {
      bottom: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      marginBottom: "5px",
    },
    bottom: {
      top: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      marginTop: "5px",
    },
    left: {
      right: "100%",
      top: "50%",
      transform: "translateY(-50%)",
      marginRight: "5px",
    },
    right: {
      left: "100%",
      top: "50%",
      transform: "translateY(-50%)",
      marginLeft: "5px",
    },
  };

  return (
    <div style={containerStyles} ref={ref}>
      <div onClick={handleClick} style={{ cursor: "pointer" }}>
        {children}
      </div>
      <div style={{ ...tooltipStyles, ...placementStyles[placement] }}>
        {content}
      </div>
    </div>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.string.isRequired,
  placement: PropTypes.oneOf(["top", "bottom", "left", "right"]),
};

export default Tooltip;
