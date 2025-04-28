/* eslint-disable no-undef */

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ApartmentCard.css';

const ApartmentCard = ({ apartment }) => {
    return (
        <div className="apartment-card">
            <img src={apartment.image} alt={apartment.title} />
            <div className="apartment-info">
                <h3>{apartment.title}</h3>
                <p>Площа: {apartment.area} | {apartment.location}</p>
                <p className="price">Ціна: {apartment.price}</p>
                <Link
                    to={`/apartment/${apartment.id}`}
                    className="btn details-button"
                >
                    Детальніше
                </Link>
            </div>
        </div>
    );
};

export default ApartmentCard;