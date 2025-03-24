document.addEventListener("DOMContentLoaded", function () {
    console.log("Скрипт apartment_details.js завантажено");

    const urlParams = new URLSearchParams(window.location.search);
    const apartmentId = urlParams.get("id") || "1"; // ✅ Якщо не знайдено ID, використовуємо 1

    // ✅ Оголошуємо об'єкт ДО використання
    const apartmentsData = {
        "1": {
            id: "1",
            title: "2-кімнатна квартира, 65 м², Хрещатик, 22",
            price: "$120,000",
            image: "../images/pexels-heyho-6489123.jpg",
            owner: "Іван Петров",
            phone: "+380 67 123 45 67",
            type: "Квартира",
            area: "65 м²",
            floor: "5/10",
            material: "Цегла",
            extra: "Балкон, мебльована, Wi-Fi",
            address: "Київ, вул. Хрещатик, 22",
            location: "Київ, вул. Хрещатик, 22",
            coordinates: { lat: 50.449916, lng: 30.522975 },
            video: "https://www.youtube.com/embed/DrNPRGHhdoc",
            videoDescription: "Повний відеоогляд квартири з детальним показом всіх приміщень та особливостей.",
            description: "Стильна 2-кімнатна квартира в історичному центрі Києва з видом на Хрещатик. Простора вітальня з сучасним ремонтом, окрема спальня з гардеробною зоною.",
            metro: "«Хрещатик» - 5 хв пішки",
            shops: "Novus - 3 хв, Silpo - 7 хв",
            medicine: "Клініка «Борис» - 10 хв"
        },
        "2": {
            id: "2",
            title: "3-кімнатна квартира, 85 м², Льва Толстого, 10",
            price: "$160,000",
            image: "../images/pexels-ekrulila-19050708.jpg",
            owner: "Марина Коваль",
            phone: "+380 50 987 65 43",
            type: "Квартира",
            area: "85 м²",
            floor: "7/12",
            material: "Моноліт",
            extra: "Тераса, кондиціонер, панорамні вікна",
            address: "Київ, вул. Льва Толстого, 10",
            location: "Київ, вул. Льва Толстого, 10",
            coordinates: { lat: 50.439397, lng: 30.514930 },
            video: "https://www.youtube.com/embed/DrNPRGHhdoc",
            videoDescription: "Повний відеоогляд квартири з детальним показом всіх приміщень та особливостей.",
            description: "Престижна 3-кімнатна квартира з терасою та панорамними вікнами. Просторий санвузол з сучасною сантехнікою, кухня-студія з островом.",
            metro: "«Палац Спорту» - 7 хв пішки",
            shops: "АТБ - 5 хв, MegaMarket - 10 хв",
            medicine: "Лікарня №17 - 12 хв"
        },
        "3": {
            id: "3",
            title: "1-кімнатна квартира, 45 м², Франка, 7",
            price: "$90,000",
            image: "../images/pexels-heyho-6580372.jpg",
            owner: "Олександр Вербицький",
            phone: "+380 63 222 33 44",
            type: "Квартира",
            area: "45 м²",
            floor: "3/9",
            material: "Цегла",
            extra: "Мебльована, тепла підлога, паркінг",
            address: "Львів, вул. Франка, 7",
            location: "Львів, вул. Франка, 7",
            coordinates: { lat: 49.854270, lng: 23.987113 },
            video: "https://www.youtube.com/embed/DrNPRGHhdoc",
            videoDescription: "Повний відеоогляд квартири з детальним показом всіх приміщень та особливостей.",
            description: "Затишна 1-кімнатна квартира в центрі Львова. Сучасний євроремонт, тепла підлога в усіх приміщеннях. Ідеально підходить для молодих пар або відряджених.",
            metro: "«Площа Ринок» - 8 хв пішки",
            shops: "Рукосвєт - 2 хв, Арсен - 5 хв",
            medicine: "Медцентр «Авіценна» - 8 хв"
        },
        "4": {
            id: "4",
            title: "4-кімнатна квартира, 110 м², Дерибасівська, 15",
            price: "$250,000",
            image: "../images/pexels-heyho-7546561.jpg",
            owner: "Світлана Дорошенко",
            phone: "+380 97 555 66 77",
            type: "Квартира",
            area: "110 м²",
            floor: "9/16",
            material: "Моноліт",
            extra: "Дизайнерський ремонт, гараж, охорона",
            address: "Одеса, вул. Дерибасівська, 15",
            location: "Одеса, вул. Дерибасівська, 15",
            coordinates: { lat: 46.483869, lng: 30.739199 },
            video: "none",
            videoDescription: "Повний відеоогляд квартири з детальним показом всіх приміщень та особливостей.",
            description: "Елітна 4-кімнатна квартира в Одесі з дизайнерським ремонтом. Велика вітальня з каміном, окрема кухня, 2 санвузли. Закритий дворик з дитячим майданчиком.",
            metro: "«Дерибасівська» - 3 хв пішки",
            shops: "Таврія В - 1 хв, Metro - 15 хв",
            medicine: "Поліклініка №3 - 7 хв"
        }
    };

    console.log("Apartment IDshnik:", apartmentId);
    console.log("Apartment Data:", apartmentsData[apartmentId]); // ✅ Перевіримо, чи знайдено квартиру

    console.log("Отримано ID квартири:", apartmentId);

    // Перевіряємо чи є квартира з таким ID
    if (apartmentsData[apartmentId]) {
        const apartment = apartmentsData[apartmentId];
        console.log("Знайдено квартиру:", apartment);

        // Функція для безпечного встановлення тексту
        function setText(elementId, text) {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = text;
                console.log(`Встановлено ${elementId}:`, text);
            } else {
                console.error(`Елемент ${elementId} не знайдено`);
            }
        }

        // Заповнюємо основні дані
        setText("apartment-title", apartment.title);
        setText("apartment-price", apartment.price);
        document.getElementById("apartment-image").src = apartment.image;
        setText("apartment-type", apartment.type);
        setText("apartment-area", apartment.area);
        setText("apartment-floor", apartment.floor);
        setText("apartment-material", apartment.material);
        setText("apartment-extra", apartment.extra);
        setText("owner-name", apartment.owner);
        setText("location-address", apartment.address);
        setText("location-metro", apartment.metro);
        setText("location-shops", apartment.shops);
        setText("location-medicine", apartment.medicine);
        setText("apartment-info", `Квартира: ${apartment.title}, Ціна: ${apartment.price}, Адреса: ${apartment.address}, Власник: ${apartment.owner}. Опис: ${apartment.description}`);

        // Обробка відео
        const videoSection = document.querySelector(".apartment-video");
        if (apartment.video && apartment.video !== "none") {
            const videoIframe = document.getElementById("apartment-video");
            videoIframe.src = apartment.video;
            document.querySelector(".video-description p").textContent = apartment.videoDescription;
            videoSection.style.display = "block";
        } else {
            videoSection.style.display = "none";
        }

        // Обробка мапи (OpenStreetMap)
        if (apartment.coordinates) {
            const { lat, lng } = apartment.coordinates;
            const mapIframe = document.getElementById("apartment-map");
            mapIframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;

            // Додаємо посилання під мапою
            const mapLink = document.createElement('a');
            mapLink.href = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
            mapLink.textContent = 'Відкрити мапу у новій вкладці';
            mapLink.target = '_blank';
            mapLink.style.display = 'block';
            mapLink.style.textAlign = 'center';
            mapLink.style.marginTop = '10px';
            mapLink.style.color = '#a08a69';
            mapIframe.parentNode.appendChild(mapLink);
        }

        if (apartmentsData[apartmentId]) {
            const apartment = apartmentsData[apartmentId];
            currentApartment = apartment; // Зберігаємо поточну квартиру в глобальну змінну

            // Заповнюємо основні дані на сторінці
            document.getElementById("apartment-title").textContent = apartment.title;
            document.getElementById("apartment-price").textContent = apartment.price;
            document.getElementById("apartment-image").src = apartment.image;
            document.getElementById("apartment-type").textContent = apartment.type;
            document.getElementById("apartment-area").textContent = apartment.area;
            document.getElementById("apartment-floor").textContent = apartment.floor;
            document.getElementById("apartment-material").textContent = apartment.material;
            document.getElementById("apartment-extra").textContent = apartment.extra;
            document.getElementById("owner-name").textContent = apartment.owner;
            document.getElementById("location-address").textContent = apartment.address;
            document.getElementById("location-metro").textContent = apartment.metro;
            document.getElementById("location-shops").textContent = apartment.shops;
            document.getElementById("location-medicine").textContent = apartment.medicine;
            document.getElementById("apartment-info").textContent = `Квартира: ${apartment.title}, Ціна: ${apartment.price}, Адреса: ${apartment.address}, Власник: ${apartment.owner}. Опис: ${apartment.description}`;

        } else {
            console.error("Квартиру з ID", apartmentId, "не знайдено");
            alert("Вибачте, інформація про цю квартиру тимчасово недоступна");
        }

        // Ініціалізація модального вікна
        const modal = document.getElementById('booking-modal');
        const bookBtn = document.getElementById('book-btn');
        const closeBtn = document.querySelector('.close');
        const bookingForm = document.getElementById('booking-form');

        // Перевіряємо стан бронювання при завантаженні
        if (checkIfBooked(apartment.id)) {
            updateButtonState(true);
        }

        // Відкриття модального вікна
        bookBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Якщо вже заброньовано - не відкриваємо модалку
            if (checkIfBooked(apartment.id)) {
                showAlert('Ця квартира вже заброньована', 'warning');
                return;
            }

            modal.classList.remove('hidden');
            modal.classList.add('show');
        });

        // Закриття модального вікна
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('show');
            modal.classList.add('hidden');
        });

        // Закриття при кліку поза вікном
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.classList.remove('show');
                modal.classList.add('hidden');
            }
        });

        // Обробка форми бронювання
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                checkin: document.getElementById('checkin').value,
                checkout: document.getElementById('checkout').value,
                guests: document.getElementById('guests').value,
                comments: document.getElementById('comments').value,
                apartmentId: currentApartment.id,
                apartmentTitle: currentApartment.title
            };

            bookApartment(currentApartment, formData);
            modal.classList.remove('show');
            modal.classList.add('hidden');
            bookingForm.reset();
        });
    } else {
        console.error("Квартиру з ID", apartmentId, "не знайдено");
        alert("Вибачте, інформація про цю квартиру тимчасово недоступна");
        document.getElementById("apartment-info").textContent = "Інформація недоступна.";
    }

    function bookApartment(apartment, formData = {}) {
        try {
            let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

            const bookingData = {
                id: apartment.id,
                title: apartment.title,
                image: apartment.image,
                area: apartment.area,
                location: apartment.location,
                price: apartment.price,
                bookingDate: new Date().toLocaleDateString('uk-UA'),
                address: apartment.address,
                bookingDetails: formData
            };

            bookings.push(bookingData);
            localStorage.setItem('bookings', JSON.stringify(bookings));

            showAlert('Квартиру успішно заброньовано!', 'success');
            updateBookingCounter();
            updateButtonState(true);

        } catch (error) {
            console.error('Помилка при бронюванні:', error);
            showAlert('Сталася помилка при бронюванні', 'error');
        }
    }

    function checkIfBooked(apartmentId) {
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        return bookings.some(b => b.id === apartmentId);
    }

    function updateButtonState(isBooked) {
        const bookBtn = document.getElementById('book-btn');
        if (isBooked) {
            bookBtn.innerHTML = '<span class="icon">✓</span> Заброньовано';
            bookBtn.classList.add('booked');
            bookBtn.disabled = true;
        } else {
            bookBtn.innerHTML = '<span class="icon">🏠</span> Забронювати';
            bookBtn.classList.remove('booked');
            bookBtn.disabled = false;
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
        const alert = document.createElement('div');
        alert.className = `booking-alert alert-${type}`;
        alert.textContent = message;
        document.body.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
});

let currentApartment = {};

// if (apartmentsData[apartmentId]) {
//     const apartment = apartmentsData[apartmentId];
//     currentApartment = apartment; // Зберігаємо поточну квартиру в глобальну змінну
//
//     // Заповнюємо основні дані на сторінці
//     document.getElementById("apartment-title").textContent = apartment.title;
//     document.getElementById("apartment-price").textContent = apartment.price;
//     document.getElementById("apartment-image").src = apartment.image;
//     document.getElementById("apartment-type").textContent = apartment.type;
//     document.getElementById("apartment-area").textContent = apartment.area;
//     document.getElementById("apartment-floor").textContent = apartment.floor;
//     document.getElementById("apartment-material").textContent = apartment.material;
//     document.getElementById("apartment-extra").textContent = apartment.extra;
//     document.getElementById("owner-name").textContent = apartment.owner;
//     document.getElementById("location-address").textContent = apartment.address;
//     document.getElementById("location-metro").textContent = apartment.metro;
//     document.getElementById("location-shops").textContent = apartment.shops;
//     document.getElementById("location-medicine").textContent = apartment.medicine;
//     document.getElementById("apartment-info").textContent = `Квартира: ${apartment.title}, Ціна: ${apartment.price}, Адреса: ${apartment.address}, Власник: ${apartment.owner}. Опис: ${apartment.description}`;
//
// } else {
//     console.error("Квартиру з ID", apartmentId, "не знайдено");
//     alert("Вибачте, інформація про цю квартиру тимчасово недоступна");
// }