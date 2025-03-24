document.addEventListener('DOMContentLoaded', function() {
    const apartments = [
        {
            id: 1,
            title: "2-кімнатна квартира",
            image: "../images/pexels-heyho-6489123.jpg",
            area: "65 м²",
            location: "Київ, вул. Хрещатик, 22",
            price: "$120,000"
        },
        {
            id: 2,
            title: "3-кімнатна квартира",
            image: "../images/pexels-ekrulila-19050708.jpg",
            area: "85 м²",
            location: "Київ, вул. Льва Толстого, 10",
            price: "$160,000"
        },
        {
            id: 3,
            title: "1-кімнатна квартира",
            image: "../images/pexels-heyho-6580372.jpg",
            area: "45 м²",
            location: "Львів, вул. Франка, 7",
            price: "$90,000"
        },
        {
            id: 4,
            title: "4-кімнатна квартира",
            image: "../images/pexels-heyho-7546561.jpg",
            area: "110 м²",
            location: "Одеса, вул. Дерибасівська, 15",
            price: "$250,000"
        }
    ];

    const container = document.getElementById('apartmentsContainer');
    let i = 0;

    // Виведення квартир за допомогою do...while
    do {
        const apartment = apartments[i];
        const card = document.createElement('div');
        card.className = 'apartment-card';
        card.innerHTML = `
            <img src="${apartment.image}" alt="${apartment.title}">
            <div class="apartment-info">
                <h3>${apartment.title}</h3>
                <p>Площа: ${apartment.area} | ${apartment.location}</p>
                <p class="price">Ціна: ${apartment.price}</p>
                <button class="btn details-button" onclick="location.href='apartment_details.html?id=${apartment.id}'">
                    Детальніше
                </button>
            </div>
        `;
        container.appendChild(card);
        i++;
    } while (i < apartments.length);
});