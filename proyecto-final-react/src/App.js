import './styles/Styles.css';
import { Routes, Route, Navigate } from "react-router-dom"; 
import Home from "./pages/Home";
import UserManagement from './user/UserManagement';
import UserPage from './user/UserPage';
import Register from './user/Register';
import Login from './user/Login';
import MovieList from './movie/Movies';
import Movie from './movie/MovieDetails';
import Credits from './movie/Credits';
import UserReviews from './movie/UserReviews';
import ReviewsList from './movie/ReviewsList';
import MovieComparator from './movie/MoviesComparator';
import Game from './game/Game';
import GameRanking from './game/GameRanking';
import UserGameRanking from './game/UserGameRanking';
import Privacity from './components/Privacity';
import GameInfo from './game/GameInfo';

function App() {
  const isAuthenticated = localStorage.getItem('token');  
  return (
    <Routes> 
      <Route path="/" element={<Home />} />
      <Route path='/user-register' element={<Register />} />
      <Route path='/user-login' element={<Login />} />
      <Route path='/privacity' element={<Privacity />} />
      <Route path='/credits/:id' element={ <Credits/>}/>
      <Route path='/movies/:id' element={<Movie/> }/>
      <Route path='/movies' element={<MovieList/>}/>
      

{/*Páginas protegidas */}
      <Route path="/user-management" element={isAuthenticated ? <UserManagement /> : <Navigate to="/" />}  />
      <Route path='/user-page' element={isAuthenticated ? <UserPage /> : <Navigate to="/" />}  />
      <Route path='/my-reviews' element={isAuthenticated ? <UserReviews/> : <Navigate to="/"/>}/>
      <Route path='/reviews' element={isAuthenticated ? <ReviewsList/> : <Navigate to="/"/>}/>
      <Route path='/movies-comparator' element={isAuthenticated ? <MovieComparator/> : <Navigate to="/"/>}/>
      <Route path='/game' element={isAuthenticated ? <Game/> : <Navigate to="/"/>}/>
      <Route path='/ranking-general' element={isAuthenticated ? <GameRanking/> : <Navigate to="/"/>}/>
      <Route path='/mi-ranking' element={isAuthenticated ? <UserGameRanking/> : <Navigate to="/"/>}/>
      <Route path='/game-info' element={isAuthenticated ? <GameInfo/> : <Navigate to="/"/>}/>
      
    </Routes>
  );
}

export default App;