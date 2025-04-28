import { db } from "./src/firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { apartmentsData } from "./src/data/apartments.js";

const importData = async () => {
    try {
        for (const apartment of apartmentsData) {
            // Конвертуємо ціну з "$120" до "120$" (або залишаємо як є, якщо потрібно)
            const priceString = apartment.price.startsWith('$')
                ? apartment.price.substring(1) + '$'
                : apartment.price;

            // Готуємо об'єкт квартири для Firebase
            const apartmentData = {
                title: apartment.title,
                type: apartment.type,
                price: priceString, // Зберігаємо як рядок
                area: apartment.area,
                floor: apartment.floor,
                material: apartment.material,
                class: apartment.class,
                balconies: apartment.balconies || 0,
                ceilingHeight: apartment.ceilingHeight || "н/д",
                parking: apartment.parking || "н/д",
                finishing: apartment.finishing || "н/д",
                builtYear: apartment.builtYear ? apartment.builtYear.toString() : "н/д",
                address: apartment.address,
                metro: apartment.metro,
                shops: apartment.shops,
                medicine: apartment.medicine,
                image: apartment.image,
                video: apartment.video === "none" ? "" : apartment.video,
                videoDescription: apartment.videoDescription || "",
                owner: apartment.owner,
                phone: apartment.phone,
                socialLink: "https://web.telegram.org/k/#@EhPhBekPivEwN2Uy", // Приклад посилання
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            // Додаємо квартиру до колекції apartments
            const docRef = await addDoc(collection(db, "apartments"), apartmentData);
            console.log(`Додано квартиру з ID: ${docRef.id} - ${apartment.title}`);
        }
        console.log("✅ Усі квартири успішно імпортовано до Firebase!");
    } catch (error) {
        console.error("🚨 Помилка імпорту даних:", error);
    }
};

// Викликаємо функцію імпорту
importData();