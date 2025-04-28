import React from "react";
import '../styles/Contacts.css'

function Contacts() {
    return (
        <div className="main-content">
            <section className="contacts-section">
                <div className="container">
                    <h2 className="section-title">Контакти</h2>
                    <div className="contacts-grid">
                        <div className="contact-card address-card">
                            <div className="address-content">
                                <h3>Адреса</h3>
                                <p>вул. Хрещатик, 22, Київ, Україна</p>
                            </div>

                            <div className="map-container" onClick={() => console.log('Map clicked')}>
                                <iframe
                                    src="https://www.google.com/maps?q=вул.+Хрещатик,+22,+Київ,+Україна&output=embed"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy">
                                </iframe>
                            </div>


                        </div>
                        <div className="contact-card">
                            <h3><i className="fas fa-phone"> Телефон</i></h3>
                            <p>+38 044 123 45 67</p>
                        </div>
                        <div className="contact-card">
                            <h3><i className="fas fa-envelope"> Email</i></h3>
                            <p>info@mysite.ua</p>
                        </div>
                        <div className="contact-card">
                            <h3><i className="fas fa-clock"> Графік роботи</i></h3>
                            <p>Пн-Пт: 09:00 - 18:00</p>
                            <p>Сб-Нд: Вихідний</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="contact-form-section">
                <div className="container">
                    <h2 className="section-title">Зв'яжіться з нами</h2>
                    <form className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">Ім'я</label>
                            <input id="name" type="text" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Ел. адреса</label>
                            <input id="email" type="email" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Повідомлення</label>
                            <textarea id="message" rows="4" required></textarea>
                        </div>
                        <button type="submit" className="submit-btn">Надіслати</button>
                    </form>
                </div>
            </section>
        </div>
    )
}

export default Contacts;