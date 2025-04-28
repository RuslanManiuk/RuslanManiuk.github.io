import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApartmentCard from "../components/ApartmentCard";
import '../styles/Apartment.css';
import {
    collection,
    getDocs,
    query,
    where,
    onSnapshot
} from "firebase/firestore";
import { db } from "../firebase";

function Apartment() {
    const [filters, setFilters] = useState({
        priceRange: [0, 25000],
        rooms: '',
        type: '',
        expandedFilters: false
    });

    const [apartments, setApartments] = useState([]);
    const [bookedApartmentIds, setBookedApartmentIds] = useState([]);
    const [loading, setLoading] = useState(true);

    // Завантаження квартир
    useEffect(() => {
        const fetchApartments = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "apartments"));
                const apartmentsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setApartments(apartmentsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching apartments:", error);
                setLoading(false);
            }
        };

        fetchApartments();
    }, []);

    // Підписка на зміни бронювань
    useEffect(() => {
        const q = query(
            collection(db, "bookings"),
            where("status", "==", "confirmed")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const bookedIds = snapshot.docs.map(doc => doc.data().apartmentId);
            setBookedApartmentIds(bookedIds);
        }, (error) => {
            console.error("Error listening to bookings:", error);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleBookingCanceled = (e) => {
            const { apartmentId } = e.detail;
            setBookedApartmentIds(prev => prev.filter(id => id !== apartmentId));
        };

        window.addEventListener('bookingCanceled', handleBookingCanceled);

        return () => {
            window.removeEventListener('bookingCanceled', handleBookingCanceled);
        };
    }, []);

    // Функція для отримання кількості кімнат з заголовку
    const getRoomsCount = (title) => {
        const match = title.match(/(\d+)-кімнатна/);
        return match ? parseInt(match[1]) : 0;
    };

    // Оновлена функція для конвертації ціни
    const parsePrice = (price) => {
        // Якщо price вже число - повертаємо його
        if (typeof price === 'number') return price;

        // Якщо price - рядок, обробляємо його
        if (typeof price === 'string') {
            return parseInt(price.replace(/[^0-9]/g, '')) || 0;
        }

        // У всіх інших випадках повертаємо 0
        return 0;
    };

// Функція для фільтрації квартир
    const filteredApartments = apartments.filter(apartment => {
        const price = parsePrice(apartment.price);
        const rooms = getRoomsCount(apartment.title);

        return (
            price >= filters.priceRange[0] &&
            price <= filters.priceRange[1] &&
            (filters.rooms === '' || rooms.toString() === filters.rooms) &&
            (filters.type === '' || apartment.type.toLowerCase().includes(filters.type.toLowerCase())) &&
            !bookedApartmentIds.includes(apartment.id)  // Виключаємо заброньовані
        );
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handlePriceChange = (newPriceRange) => {
        setFilters(prev => ({ ...prev, priceRange: newPriceRange }));
    };

    return (
        <section className="available-apartments">
            <div className="container">
                <h2 className="section-title">Доступні квартири</h2>

                {/* Блок фільтрів */}
                <div className={`filters-container ${filters.expandedFilters ? 'expanded' : ''}`}>
                    <button
                        className="toggle-filters"
                        onClick={() => setFilters(prev => ({...prev, expandedFilters: !prev.expandedFilters}))}
                    >
                        {filters.expandedFilters ? (
                            <>
                                <span className="icon">×</span> Закрити фільтри
                            </>
                        ) : (
                            <>
                                <span className="icon">+</span> Показати фільтри
                            </>
                        )}
                    </button>

                    <div className="filters-content">
                        {/* Фільтр за ціною */}
                        <div className="filter-group price-filter">
                            <h3 className="filter-title">
                                <span className="filter-icon">💰</span>
                                Діапазон цін ($)
                            </h3>
                            <div className="price-inputs">
                                <div className="price-input-group">
                                    <input
                                        type="number"
                                        placeholder="Від"
                                        value={filters.priceRange[0] === 0 ? '' : filters.priceRange[0]}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const newMin = value === '' ? 0 : parseInt(value) || 0;
                                            handlePriceChange([newMin, filters.priceRange[1]]);
                                        }}
                                        min="0"
                                        className={filters.priceRange[0] > filters.priceRange[1] ? 'invalid' : ''}
                                    />
                                </div>
                                <div className="price-input-group">
                                    <input
                                        type="number"
                                        placeholder="До"
                                        value={filters.priceRange[1] === 250000 ? '' : filters.priceRange[1]}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const newMax = value === '' ? 250000 : parseInt(value) || 250000;
                                            handlePriceChange([filters.priceRange[0], newMax]);
                                        }}
                                        min="0"
                                        className={filters.priceRange[1] < filters.priceRange[0] ? 'invalid' : ''}
                                    />
                                </div>
                            </div>
                            {filters.priceRange[0] > filters.priceRange[1] && (
                                <p className="price-error">Мінімальна ціна не може бути більшою за максимальну!</p>
                            )}
                        </div>

                        {/* Фільтр за кількістю кімнат */}
                        <div className="filter-group">
                            <h3 className="filter-title">
                                <span className="filter-icon">🚪</span>
                                Кімнати
                            </h3>
                            <div className="room-options">
                                {['Всі', '1', '2', '3', '4+'].map(option => (
                                    <button
                                        key={option}
                                        className={`room-option ${filters.rooms === (option === 'Всі' ? '' : option.replace('+', '')) ? 'active' : ''}`}
                                        onClick={() => setFilters(prev => ({
                                            ...prev,
                                            rooms: option === 'Всі' ? '' : option.replace('+', '')
                                        }))}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Фільтр за типом */}
                        <div className="filter-group">
                            <h3 className="filter-title">
                                <span className="filter-icon">🏠</span>
                                Тип житла
                            </h3>
                            <div className="type-options">
                                {['Всі', ...new Set(apartments.map(apt => apt.type))].map(type => (
                                    <label key={type} className="type-option">
                                        <input
                                            type="radio"
                                            name="type"
                                            value={type === 'Всі' ? '' : type}
                                            checked={filters.type === (type === 'Всі' ? '' : type)}
                                            onChange={handleFilterChange}
                                        />
                                        <span className="custom-radio"></span>
                                        {type}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Список квартир */}
                <div className="apartments-flex">
                    {filteredApartments.length > 0 ? (
                        filteredApartments.map(apartment => (
                            <ApartmentCard
                                key={apartment.id}
                                apartment={apartment}
                            />
                        ))
                    ) : (
                        <div className="no-results">
                            <p>Не знайдено квартир за обраними критеріями</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Apartment;