import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BookedApartmentsList.css';

const BookedApartmentsList = ({ bookedApartments, onCancelBooking, currentUser }) => {
    if (!currentUser) {
        return (
            <div className="no-bookings-message">
                <p>Будь ласка, увійдіть для перегляду бронювань</p>
                <Link to="/login" className="btn">
                    Увійти
                </Link>
            </div>
        );
    }

    const handleCancelClick = (bookingId, e) => {
        e.preventDefault(); // Запобігаємо дії за замовчуванням
        if (typeof onCancelBooking === 'function') {
            onCancelBooking(bookingId); // Тепер передаємо тільки ID
        }
    };

    return (
        <div className="booked-apartments-container">
            {bookedApartments.length === 0 ? (
                <div className="no-bookings-message">
                    <p>У вас немає активних бронювань</p>
                    <Link to="/Apartment" className="btn">
                        Переглянути доступні квартири
                    </Link>
                </div>
            ) : (
                <div className="bookings-grid">
                    {bookedApartments.map((booking) => (
                        <div key={booking.id} className="booking-card">
                            <div className="booking-image">
                                <img src={booking.apartment.image} alt={booking.apartment.title} />
                            </div>
                            <div className="booking-details">
                                <h3>{booking.apartment.title}</h3>
                                <p className="booking-period">
                                    {booking.startDate.toLocaleDateString()} -{' '}
                                    {booking.endDate.toLocaleDateString()}
                                </p>
                                <p className="booking-price">Ціна: {booking.totalPrice} грн</p>
                                <div className="booking-actions">
                                    <button
                                        className="btn cancel-btn"
                                        onClick={(e) => handleCancelClick(booking.id, e)}
                                    >
                                        Скасувати бронювання
                                    </button>
                                    <Link
                                        to={`/apartment/${booking.apartment.id}`}
                                        className="btn details-btn"
                                    >
                                        Деталі квартири
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookedApartmentsList;