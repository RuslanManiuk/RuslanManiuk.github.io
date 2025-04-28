import React from "react";
import '../styles/HomePage.css';

function HomePage() {
    return (
        <div className="main-content">
            <div className="intro">
                <div className="container">
                    <div className="intro_inner">
                        <h1 className="intro_title">Орендна компанія "RuMa"</h1>
                        <p className="intro_content">Орендуй житло у будь-якій точці світу</p>
                    </div>
                </div>
            </div>

            <section className="about_us">
                <div className="container_about_us">
                    <div className="about_us_inner">
                        <div className="about_us_left">
                            <h2 className="about_us_title">Про наc</h2>
                            <h3 className="about_us_company">Орендна компанія RuMa</h3>
                            <p>Ми — компанія RuMa, яка спеціалізується на наданні якісних орендних послуг. Наш досвід та
                                професійний підхід дозволяють нам задовольняти потреби наших клієнтів у різних сферах,
                                будь то оренда обладнання, транспорту чи нерухомості.</p>
                            <p>Наша мета — забезпечити вас надійними та зручними рішеннями, які допоможуть реалізувати
                                ваші плани та завдання. Ми прагнемо стати вашим надійним партнером, пропонуючи
                                індивідуальний підхід, прозорі умови співпраці та високу якість обслуговування.</p>
                            <p>З RuMa ви можете бути впевнені, що отримуєте найкращі умови оренди та підтримку на
                                кожному етапі співпраці. Довіртеся нам, і ми зробимо все для вашого комфорту та
                                успіху!</p>
                        </div>
                        <div className="about_us_right">
                            <img src="/images/img_about_us_page_main.png" alt="Про нас"/>
                        </div>
                    </div>
                </div>
            </section>

            <section className="latest_projects">
                <div className="container_latest_projects">
                    <h2 className="section_title">Останні пропозиції</h2>
                    <div className="projects_gallery">
                        <div className="project_item large">
                            <a href="#">
                                <img src="/images/pexels-heyho-6489123.jpg" alt="Основний проект"/>
                            </a>
                        </div>
                        <div className="project_item small">
                            <a href="#">
                                <img src="/images/pexels-ekrulila-19050708.jpg" alt="Проект 1"/>
                            </a>
                        </div>
                        <div className="project_item small">
                            <a href="#">
                                <img src="/images/pexels-heyho-6580372.jpg" alt="Проект 2"/>
                            </a>
                        </div>
                        <div className="project_item small">
                            <a href="#">
                                <img src="/images/pexels-heyho-7546561.jpg" alt="Проект 3"/>
                            </a>
                        </div>
                        <div className="project_item small">
                            <a href="#">
                                <img src="/images/pexels-fotoaibe-10758467.jpg" alt="Проект 4"/>
                            </a>
                        </div>
                    </div>
                    <button className="view_all">
                        <a className="view_all_btn" href="/Apartment">ДИВИТИСЬ ВСЕ</a>
                    </button>
                </div>
            </section>
        </div>
    )
}

export default HomePage;