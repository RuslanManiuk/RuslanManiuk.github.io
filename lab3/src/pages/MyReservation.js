import React, { useState, useEffect } from "react";
import BookedApartmentsList from "../components/BookedApartmentsList";
import { useAuth } from "../contexts/AuthContext";
import '../styles/MyReservation.css';
import '../styles/BookedApartmentsList.css';
import {query, collection, where, getDocs, doc, deleteDoc, updateDoc} from "firebase/firestore";
import { db } from "../firebase";

function MyReservation() {
    const [bookedApartments, setBookedApartments] = useState([]);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchBookings = async () => {
            if (!currentUser) return;

            try {
                const q = query(
                    collection(db, "bookings"),
                    where("userId", "==", currentUser.uid),
                    where("status", "in", ["confirmed", "completed"])
                );
                const querySnapshot = await getDocs(q);

                const bookings = [];
                querySnapshot.forEach((doc) => {
                    bookings.push({
                        id: doc.id,
                        ...doc.data(),
                        startDate: doc.data().startDate.toDate(),
                        endDate: doc.data().endDate.toDate()
                    });
                });

                setBookedApartments(bookings);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        fetchBookings();
    }, [currentUser]);

    const handleCancelBooking = (bookingId) => {
        if (!bookingId) return;
        setBookingToCancel(bookingId);
        setShowCancelModal(true);
    };

    const confirmCancel = async () => {
        if (!bookingToCancel || !currentUser) return;

        try {
            await updateDoc(doc(db, "bookings", bookingToCancel), {
                status: "canceled"
            });

            // Оновлюємо локальний стан
            setBookedApartments(prev => prev.filter(b => b.id !== bookingToCancel));

            // Відправляємо подію для оновлення списку квартир
            const canceledBooking = bookedApartments.find(b => b.id === bookingToCancel);
            if (canceledBooking) {
                window.dispatchEvent(new CustomEvent('bookingCanceled', {
                    detail: { apartmentId: canceledBooking.apartment.id }
                }));
            }

            // Закриваємо модальне вікно
            setShowCancelModal(false);
            setBookingToCancel(null); // Очищаємо ID бронювання
        } catch (error) {
            console.error("Error canceling booking:", error);
        }
    };

    return (
        <div className="main-content">
            <section className="my-reservations">
                <div className="container">
                    <h2 className="section-title">Мої бронювання</h2>
                    <BookedApartmentsList
                        bookedApartments={bookedApartments}
                        onCancelBooking={handleCancelBooking}
                        currentUser={currentUser}
                    />
                </div>
            </section>

            {showCancelModal && (
                <div className="modal show">
                    <div className="modal-content">
                        <span
                            className="close-modal"
                            onClick={() => setShowCancelModal(false)}
                        >
                            &times;
                        </span>
                        <h2>Підтвердження скасування</h2>
                        <p>Ви впевнені, що хочете скасувати це бронювання?</p>
                        <div className="modal-buttons">
                            <button
                                className="btn confirm-btn"
                                onClick={confirmCancel}
                            >
                                Так, скасувати
                            </button>
                            <button
                                className="btn cancel-btn"
                                onClick={() => setShowCancelModal(false)}
                            >
                                Ні, залишити
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyReservation;