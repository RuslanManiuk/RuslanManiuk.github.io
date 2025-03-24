document.addEventListener('DOMContentLoaded', function() {
    // Завантажуємо бронювання з localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const container = document.getElementById('bookings-container');
    const noBookingsMsg = document.getElementById('no-bookings-message');

    // // Оновлюємо лічильник у хедері
    // updateBookingCounter();

    // Елементи модального вікна
    const cancelModal = document.getElementById('cancel-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const confirmCancelBtn = document.getElementById('confirm-cancel');
    const cancelActionBtn = document.getElementById('cancel-action');

    let currentApartmentId = null;

    if (bookings.length === 0) {
        noBookingsMsg.style.display = 'block';
        container.innerHTML = '';
    } else {
        noBookingsMsg.style.display = 'none';
        renderBookings(bookings);
    }

    // Відкриття модального вікна при кліку на кнопку скасування
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('cancel-btn') && !e.target.id) {
            e.preventDefault();
            currentApartmentId = e.target.dataset.id;
            cancelModal.classList.remove('hidden');
            cancelModal.classList.add('show');
        }
    });

    // Закриття модального вікна
    closeModalBtn.addEventListener('click', closeModal);
    cancelActionBtn.addEventListener('click', closeModal);

    // Клік поза модального вікна
    window.addEventListener('click', function(e) {
        if (e.target === cancelModal) {
            closeModal();
        }
    });

    // Підтвердження скасування
    confirmCancelBtn.addEventListener('click', function() {
        if (currentApartmentId) {
            cancelBooking(currentApartmentId);
            closeModal();
        }
    });

    function closeModal() {
        cancelModal.classList.remove('show');
        cancelModal.classList.add('hidden');
        currentApartmentId = null;
    }

    function renderBookings(bookings) {
        const container = document.getElementById('bookings-container');
        container.innerHTML = bookings.map(booking => `
            <div class="reservation-card">
                <img src="${booking.image}" alt="${booking.title}">
                <div class="reservation-info">
                    <h3>${booking.title}</h3>
                    <p>${booking.address}</p>
                    <p class="booking-meta">
                        <span>${booking.area}</span>
                        <span>${booking.price}</span>
                    </p>
                    <p class="booking-date">Заброньовано: ${booking.bookingDate}</p>
                    ${booking.bookingDetails ? `
                    <div class="booking-details">
                        <p><strong>Ім'я:</strong> ${booking.bookingDetails.name}</p>
                        <p><strong>Дата заселення:</strong> ${booking.bookingDetails.checkin}</p>
                        <p><strong>Дата виселення:</strong> ${booking.bookingDetails.checkout}</p>
                    </div>
                    ` : ''}
                    <button class="btn cancel-btn" data-id="${booking.id}">
                        Скасувати бронювання
                    </button>
                </div>
            </div>
        `).join('');
    }

    function cancelBooking(apartmentId) {
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings = bookings.filter(b => String(b.id) !== String(apartmentId));

        localStorage.setItem('bookings', JSON.stringify(bookings));
        renderBookings(bookings);
        updateBookingCounter();
        showAlert('Бронювання скасовано', 'success');

        if (bookings.length === 0) {
            document.getElementById('no-bookings-message').style.display = 'block';
        }
    }

    function updateBookingCounter() {
        const counter = document.getElementById('booking-counter');
        if (counter) {
            const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            counter.textContent = bookings.length;
            counter.style.display = bookings.length ? 'flex' : 'none';
        }
    }

    function showAlert(message, type = 'info') {
        const alert = document.getElementById('booking-alert');
        alert.textContent = message;
        alert.className = `booking-alert alert-${type}`;
        alert.classList.remove('hidden');

        setTimeout(() => {
            alert.classList.add('hidden');
        }, 3000);
    }
});