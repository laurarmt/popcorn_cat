import Footer from "../components/Footer";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../styles/Credits.css';
import HeaderMinimalist from "../components/HeaderMinimalist";

const Credits = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    useEffect(() => {
        fetch(`http://localhost:8080/api/movies/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setMovie(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching credits:", err);
                setLoading(false);
            });
    }, [id]);

    //Botón para scroll hacia arriba
    const [showScrollButton, setShowScrollButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollButton(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);



    if (loading) return <p>Cargando créditos...</p>;
    if (!movie) return <p>No se encontró la película.</p>;

    return (
        <div className="app">

            {!token ? <HeaderMinimalist /> : <Header />}
            <div className="credits-container">
                <h2 className="credits-title">Créditos de {movie.title}</h2>
                <div className="credits-columns">
                        <div className="credits-column">

                            <h3 className="credits-section-title">Reparto (Cast)</h3>
                            <ul className="credits-list">
                                {movie.cast?.sort((a, b) => a.name.localeCompare(b.name)).map((actor) => (
                                    <li key={actor.id} className="credits-list-item">
                                        <span className="credits-actor-name">{actor.name}</span>
                                        <span className="credits-character">
                                            {actor.character ? "como " + actor.character : " - Nombre del personaje no disponible"}
                                        </span>
                                        <span className="credits-department"> (Departamento: {actor.known_for_department})</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="credits-column">

                            <h3 className="credits-section-title">Equipo (Crew)</h3>
                            <ul className="credits-list">
                                {movie.crew?.sort((a, b) => a.job.localeCompare(b.job)).map((crewMember) => (
                                    <li key={crewMember.id} className="credits-list-item">
                                        <span className="credits-job">{crewMember.job}</span> -{" "}
                                        <span className="credits-crew-name">{crewMember.name}</span> {" "}
                                        <span className="credits-department">(Departamento: {crewMember.department})</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
        
                </div>
            </div>
            {showScrollButton && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="scroll-to-top"
                >
                    ↑ Subir
                </button>
            )}

            <Footer />
        </div>

    );
};

export default Credits;
