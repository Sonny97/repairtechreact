import React from 'react';
import '../styles/Loader.css';

const Loader = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div id="loader">
            <div className="spinner"></div>
        </div>
    );
};

export default Loader;
