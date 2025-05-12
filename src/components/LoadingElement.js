import React from 'react';
import '../styles/LoadingElement.css'; // Add styles for animation

const LoadingElement = () => {
    return (
        <div className="loading-element">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
        </div>
    );
};

export default LoadingElement;