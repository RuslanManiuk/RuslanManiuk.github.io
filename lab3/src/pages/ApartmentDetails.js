import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import '../styles/ApartmentDetails.css';
import { apartmentsData } from "../data/apartments";
import InteractiveMap from "../components/InteractiveMap";
import { useAuth } from "../contexts/AuthContext";
import '../styles/InteractiveMap.css';
import {collection, addDoc, serverTimestamp, doc, getDoc, where, query, orderBy, getDocs} from "firebase/firestore";
import { db } from "../firebase";

function ApartmentDetails() {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingDates, setBookingDates] = useState({
        startDate: '',
        endDate: ''
    });

    const [isBooked, setIsBooked] = useState(false);
    const [showPhone, setShowPhone] = useState(false);
    const [apartment, setApartment] = useState(null);
    const [loading, setLoading] = useState(true);

    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

    // Завантаження відгуків (з обробкою помилок)
    useEffect(() => {
        const fetchReviews = async () => {
            if (!id) return;

            try {
                const q = query(
                    collection(db, "reviews"),
                    where("apartmentId", "==", id),
                    orderBy("createdAt", "desc")
                );
                const querySnapshot = await getDocs(q);
                setReviews(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching reviews:", error);
                if (error.code === 'failed-precondition') {
                    alert("Please create the required Firestore index");
                    window.open(error.message.match(/https:\/\/[^\s]+/)[0], '_blank');
                }
            }
        };

        fetchReviews();
    }, [id]);

// Додавання відгуку (з покращеною обробкою помилок)
    const handleAddReview = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            alert("Будь ласка, увійдіть в систему");
            return;
        }

        try {
            await addDoc(collection(db, "reviews"), {
                apartmentId: id,
                userId: currentUser.uid,
                userName: currentUser.displayName || "Анонім",
                rating: newReview.rating,
                comment: newReview.comment.trim(),
                createdAt: serverTimestamp()
            });

            setNewReview({ rating: 5, comment: '' });
            // Оновлюємо відгуки
            const q = query(
                collection(db, "reviews"),
                where("apartmentId", "==", id),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            setReviews(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Помилка додавання відгуку:", error);
            if (error.code === 'permission-denied') {
                alert("Недостатньо прав. Перевірте правила Firestore");
            } else {
                alert("Помилка: " + error.message);
            }
        }
    };

// Перевірка, чи користувач орендував цю квартиру
    const [hasBooked, setHasBooked] = useState(false);

    useEffect(() => {
        const checkIfBooked = async () => {
            if (!currentUser || !id) return;

            try {
                const q = query(
                    collection(db, "bookings"),
                    where("apartmentId", "==", id),
                    where("userId", "==", currentUser.uid),
                    where("status", "in", ["confirmed", "completed"])
                );
                const querySnapshot = await getDocs(q);
                setHasBooked(!querySnapshot.empty);
            } catch (error) {
                console.error("Error checking bookings:", error);
            }
        };

        checkIfBooked();
    }, [currentUser, id]);

    // Завантаження даних квартири
    useEffect(() => {
        const fetchApartment = async () => {
            try {
                const docRef = doc(db, "apartments", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setApartment({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setApartment(null);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching apartment:", error);
                setLoading(false);
            }
        };

        fetchApartment();
    }, [id]);

    // Перевірка, чи квартира вже заброньована
    useEffect(() => {
        const checkBooking = async () => {
            if (!currentUser || !id) return;

            try {
                const bookingsQuery = query(
                    collection(db, "bookings"),
                    where("apartmentId", "==", id),
                    where("userId", "==", currentUser.uid),
                    where("status", "==", "confirmed")
                );
                const querySnapshot = await getDocs(bookingsQuery);
                setIsBooked(!querySnapshot.empty);
            } catch (error) {
                console.error("Error checking booking:", error);
            }
        };

        checkBooking();
    }, [currentUser, id, isBooked]);

    const handleBookApartment = () => {
        setShowBookingModal(true);
    };

    // Заміни весь блок handleBookingSubmit на цей:
    const handleBookingSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            alert("Будь ласка, увійдіть в систему");
            return;
        }

        // Перевірка дат
        if (!bookingDates.startDate || !bookingDates.endDate) {
            alert("Будь ласка, вкажіть дати заселення та виселення");
            return;
        }

        const startDate = new Date(bookingDates.startDate);
        const endDate = new Date(bookingDates.endDate);

        if (startDate >= endDate) {
            alert("Дата виселення повинна бути пізніше дати заселення");
            return;
        }

        try {
            await addDoc(collection(db, "bookings"), {
                userId: currentUser.uid,
                userEmail: currentUser.email,
                userName: currentUser.displayName || "Користувач",
                userPhone: currentUser.phoneNumber || "Не вказано",
                apartmentId: apartment.id,
                apartment: {
                    id: apartment.id,
                    title: apartment.title,
                    image: apartment.image,
                    price: apartment.price
                },
                startDate: startDate,
                endDate: endDate,
                totalPrice: calculateTotalPrice(),
                createdAt: serverTimestamp(),
                status: "confirmed"
            });

            setIsBooked(true);
            setHasBooked(true)
            setShowBookingModal(false);
        } catch (error) {
            console.error("Помилка бронювання:", error);
            alert("Сталася помилка: " + error.message);
        }
    };

    const calculateTotalPrice = () => {
        if (!bookingDates.startDate || !bookingDates.endDate) return 0;

        const days = (new Date(bookingDates.endDate) - new Date(bookingDates.startDate)) / (1000 * 60 * 60 * 24);

        // Отримуємо числове значення ціни незалежно від формату
        const priceValue = typeof apartment.price === 'string'
            ? parseInt(apartment.price.replace(/\D/g, '')) || 0
            : apartment.price || 0;

        return days * priceValue;
    };

    // Функції для контактних кнопок
    const handleCallClick = () => {
        setShowPhone(!showPhone); // Перемикаємо відображення номера
    };

    const handleMessageClick = () => {
        // Переходимо на соцмережу власника (наприклад, Telegram)
        window.open(apartment.socialLink || 'https://web.telegram.org/k/#@EhPhBekPivEwN2Uy', '_blank');
    };

    // Функція для форматування дати для відображення
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';

        // Якщо дата вже у форматі ISO (YYYY-MM-DD)
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString;
        }

        // Спроба перетворити з формату ДД.ММ.РРРР
        const parts = dateString.split('.');
        if (parts.length === 3) {
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2];
            return `${year}-${month}-${day}`;
        }

        return dateString;
    };

// Функція для перетворення введеного тексту у дату
    const formatInputToDate = (input) => {
        // Видаляємо всі символи, крім цифр і роздільників
        const cleaned = input.replace(/[^\d./-]/g, '');

        // Спроба розпарсити різні формати
        if (cleaned.includes('.')) {
            const parts = cleaned.split('.');
            if (parts.length === 3) {
                const day = parts[0].padStart(2, '0');
                const month = parts[1].padStart(2, '0');
                const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
                return `${year}-${month}-${day}`;
            }
        } else if (cleaned.includes('/')) {
            const parts = cleaned.split('/');
            if (parts.length === 3) {
                const day = parts[0].padStart(2, '0');
                const month = parts[1].padStart(2, '0');
                const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
                return `${year}-${month}-${day}`;
            }
        } else if (cleaned.includes('-')) {
            const parts = cleaned.split('-');
            if (parts.length === 3) {
                const day = parts[0].padStart(2, '0');
                const month = parts[1].padStart(2, '0');
                const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
                return `${year}-${month}-${day}`;
            }
        } else if (cleaned.length >= 6) {
            // Формат ДДММРР або ДДММРРРР
            const day = cleaned.substring(0, 2).padStart(2, '0');
            const month = cleaned.substring(2, 4).padStart(2, '0');
            const year = cleaned.length === 6 ? `20${cleaned.substring(4, 6)}` : cleaned.substring(4, 8);
            return `${year}-${month}-${day}`;
        }

        return null;
    };

    // Якщо квартиру не знайдено
    if (!apartment) {
        return (
            <div className="not-found-container">
                <div className="not-found-card">
                    <div className="not-found-border"></div>
                    <div className="not-found-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#a08a69" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </div>
                    <h1 className="not-found-title">404</h1>
                    <h2 className="not-found-subtitle">Квартиру не знайдено</h2>
                    <p className="not-found-text">
                        На жаль, квартира з ID <strong>{id}</strong> не існує в нашій базі даних.
                        <br />Можливо, вона була видалена або ви ввели неправильний ідентифікатор.
                    </p>
                    <div className="not-found-actions">
                        <Link to="/Apartment" className="not-found-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            До списку квартир
                        </Link>
                        <Link to="/HomePage" className="not-found-button secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 12l9-9 9 9M5 10v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10"></path>
                            </svg>
                            На головну сторінку
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return(
        <div className="main-content">
            <section className="apartment-container">
                <div className="apartment-main">
                    <section className="apartment-details">
                        <div className="container">
                            <h2 id="apartment-title">{apartment.title}</h2>
                            <div className="image-gallery">
                                <img
                                    id="apartment-image"
                                    src={apartment.image}
                                    alt="Зображення квартири"
                                    className="apartment-image"/>
                            </div>
                        </div>
                    </section>

                    <section className="apartment-description">
                        <div className="container">
                            <h3>Опис квартири</h3>
                            <div className="description-table">
                                <div className="table-row">
                                    <div className="table-cell table-label">Тип:</div>
                                    <div className="table-cell table-value" id="apartment-type">{ apartment.type }</div>
                                </div>
                                <div className="table-row">
                                    <div className="table-cell table-label">Загальна площа:</div>
                                    <div className="table-cell table-value" id="apartment-area"> { apartment.area} </div>
                                </div>
                                <div className="table-row">
                                    <div className="table-cell table-label">Поверх:</div>
                                    <div className="table-cell table-value" id="apartment-floor"> { apartment.floor} </div>
                                </div>
                                <div className="table-row">
                                    <div className="table-cell table-label">Матеріал стін:</div>
                                    <div className="table-cell table-value" id="apartment-material"> { apartment.material} </div>
                                </div>
                                <div className="table-row">
                                    <div className="table-cell table-label">Клас:</div>
                                    <div className="table-cell table-value"> { apartment.class} </div>
                                </div>
                                <div className="table-row">
                                    <div className="table-cell table-label">Балконів:</div>
                                    <div className="table-cell table-value">{apartment.balconies}</div>
                                </div>
                                <div className="table-row">
                                    <div className="table-cell table-label">Висота стель:</div>
                                    <div className="table-cell table-value">{apartment.ceilingHeight}</div>
                                </div>
                                <div className="table-row">
                                    <div className="table-cell table-label">Парковка:</div>
                                    <div className="table-cell table-value">{apartment.parking}</div>
                                </div>
                                <div className="table-row">
                                    <div className="table-cell table-label">Оздоблення:</div>
                                    <div className="table-cell table-value">{apartment.finishing}</div>
                                </div>
                                <div className="table-row">
                                    <div className="table-cell table-label">Рік побудови:</div>
                                    <div className="table-cell table-value">{apartment.builtYear}</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="apartment-reviews">
                        <div className="container">
                            <h3>Відгуки ({reviews.length})</h3>

                            {currentUser && hasBooked && (
                                <div className="add-review">
                                    <h4>Залишити відгук</h4>
                                    <form onSubmit={handleAddReview}>
                                        <div className="rating-input">
                                            <label>Оцінка:</label>
                                            <div className="rating-stars">
                                                {[5, 4, 3, 2, 1].map((star) => (
                                                    <React.Fragment key={star}>
                                                        <input
                                                            type="radio"
                                                            id={`star-${star}`}
                                                            name="rating"
                                                            value={star}
                                                            checked={newReview.rating === star}
                                                            onChange={() => setNewReview({...newReview, rating: star})}
                                                        />
                                                        <label htmlFor={`star-${star}`}></label>
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </div>
                                        <textarea
                                            placeholder="Ваш відгук..."
                                            value={newReview.comment}
                                            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                            required
                                        />
                                        <button type="submit" className="btn submit-review-btn">
                                            Надіслати відгук
                                        </button>
                                    </form>
                                </div>
                            )}

                            {reviews.length > 0 ? (
                                <div className="reviews-list">
                                    {reviews.map(review => (
                                        <div key={review.id} className="review-item">
                                            <div className="review-header">
                                                <span className="review-author">{review.userName}</span>
                                                <div className="review-rating">
                                                    {[5, 4, 3, 2, 1].map((star) => (
                                                        <span
                                                            key={star}
                                                            className="star"
                                                            style={{
                                                                color: star <= review.rating ? '#FFD700' : '#3d3d3d'
                                                            }}
                                                        >
                                                            ★
                                                         </span>
                                                    ))}
                                                </div>
                                                <span className="review-date">
                                {review.createdAt?.toDate().toLocaleDateString()}
                            </span>
                                            </div>
                                            <div className="review-comment">
                                                {review.comment}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-reviews">Ще немає відгуків про цю квартиру.</p>
                            )}
                        </div>
                    </section>

                    {apartment.video && apartment.video !== "none" && (
                        <section className="apartment-video">
                            <div className="container">
                                <h3>Відео-огляд квартири</h3>
                                <div className="video-container">
                                    <iframe
                                        src={apartment.video}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title="Apartment video"
                                    ></iframe>
                                </div>
                                <div className="video-description">
                                    <p>{apartment.videoDescription}</p>
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                <section className="apartment-pricing">
                    <div className="container pricing-container">
                        <div className="price-block">
                            <h3 id="apartment-price">{apartment.price}</h3>
                        </div>
                        <div className="owner-info">
                            <img
                                className="owner-avatar"
                                src="/images/logo/Untitled_logo_1_free-file-Photoroom.png"
                                alt="Фото власника"/>
                            <div>
                                <p className="owner-name">{apartment.owner}</p>
                                <p className="owner-status">Власник</p>
                                {showPhone && (
                                    <div className="owner-phone">
                                        <p>Телефон: <strong>{apartment.phone || '+380XXXXXXXXX'}</strong></p>
                                        <button
                                            className="btn call-now-btn"
                                            onClick={() => window.location.href = `tel:${apartment.phone || '+380XXXXXXXXX'}`}
                                        >
                                            Зателефонувати
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="contact-buttons">
                            <button
                                className={`btn call-btn ${showPhone ? 'active' : ''}`}
                                onClick={handleCallClick}
                            >
                                📞 {showPhone ? 'Приховати номер' : 'Дзвонити'}
                            </button>
                            <button
                                className="btn message-btn"
                                onClick={handleMessageClick}
                            >
                                ✉ Написати власнику
                            </button>
                        </div>
                        <p className="update-info">Останнє оновлення: 03 березня</p>
                    </div>
                </section>

                {showBookingModal && (
                    <div className="booking-modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setShowBookingModal(false)}>&times;</span>
                            <h2>Бронювання квартири</h2>
                            <form onSubmit={handleBookingSubmit}>
                                <div className="form-group">
                                    <label>Ваше ім'я:</label>
                                    <input
                                        type="text"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Електронна пошта:</label>
                                    <input
                                        type="email"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Телефон:</label>
                                    <input
                                        type="tel"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Дата заселення:</label>
                                    <div className="date-input-field">
                                        <input
                                            type="date"
                                            value={bookingDates.startDate}
                                            onChange={(e) => setBookingDates({...bookingDates, startDate: e.target.value})}
                                            min={new Date().toISOString().split('T')[0]} // Не можна бронювати на минулі дати
                                            required
                                        />
                                    </div>
                                    <div className="date-format-hint">Формат: ДД.ММ.РРРР</div>
                                </div>

                                <div className="form-group">
                                    <label>Дата виселення:</label>
                                    <div className="date-input-field">
                                        <input
                                            type="date"
                                            value={bookingDates.endDate}
                                            onChange={(e) => setBookingDates({...bookingDates, endDate: e.target.value})}
                                            min={bookingDates.startDate || new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>
                                    <div className="date-format-hint">Формат: ДД.ММ.РРРР</div>
                                </div>
                                <div className="form-group">
                                    <label>Кількість гостей:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Додаткові побажання:</label>
                                    <textarea rows="3"></textarea>
                                </div>
                                <div className="price-summary">
                                    <p>Загальна вартість: {calculateTotalPrice()} грн</p>
                                </div>
                                <button type="submit" className="btn submit-btn">
                                    Підтвердити бронювання
                                </button>
                            </form>
                        </div>
                    </div>
                )}

            </section>

            <section className="apartment-location">
                <div className="container">
                    <h3>Розташування</h3>
                    <div className="location-content">
                        <div className="location-info">
                            <div className="location-item">
                                <span className="location-icon">📍</span>
                                <div>
                                    <h4>Адреса</h4>
                                    <p>{apartment.address}</p>
                                </div>
                            </div>
                            <div className="location-item">
                                <span className="location-icon">🚇</span>
                                <div>
                                    <h4>Метро</h4>
                                    <p>{apartment.metro}</p>
                                </div>
                            </div>
                            <div className="location-item">
                                <span className="location-icon">🛒</span>
                                <div>
                                    <h4>Магазини</h4>
                                    <p>{apartment.shops}</p>
                                </div>
                            </div>
                            <div className="location-item">
                                <span className="location-icon">🏥</span>
                                <div>
                                    <h4>Медицина</h4>
                                    <p>{apartment.medicine}</p>
                                </div>
                            </div>
                        </div>
                        <div className="map-wrapper">
                            <InteractiveMap
                                apartments={[apartment]}
                                selectedApartment={apartment}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <div className="fixed-booking-btn-container">
                <button
                    className={`fixed-book-btn ${isBooked ? 'booked' : ''}`}
                    onClick={isBooked ? null : handleBookApartment}
                >
                    <span className="check-icon">
                        {isBooked ? '✓' : ''}
                    </span>
                    {isBooked ? 'Заброньовано' : 'Забронювати'}
                </button>
            </div>

        </div>
    )
}

export default ApartmentDetails;