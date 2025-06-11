package com.clase.dam.proyectofinal.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clase.dam.proyectofinal.dto.GameQuestionDto;
import com.clase.dam.proyectofinal.dto.GameSessionSummaryDto;
import com.clase.dam.proyectofinal.dto.SessionStatsDto;
import com.clase.dam.proyectofinal.dto.UserSummaryDto;
import com.clase.dam.proyectofinal.entity.Difficulty;
import com.clase.dam.proyectofinal.entity.GameAnswer;
import com.clase.dam.proyectofinal.entity.GameSession;
import com.clase.dam.proyectofinal.entity.Movie;
import com.clase.dam.proyectofinal.entity.User;
import com.clase.dam.proyectofinal.repository.GameAnswerRepository;
import com.clase.dam.proyectofinal.repository.GameSessionRepository;
import com.clase.dam.proyectofinal.repository.MovieRepository;
import com.clase.dam.proyectofinal.repository.UserRepository;

@Service
public class GameService {

	@Autowired
    private UserRepository userRepository;

    @Autowired
    private GameSessionRepository gameSessionRepository;

    @Autowired
    private GameAnswerRepository gameAnswerRepository;

    public GameSession createSession(String difficulty, Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        GameSession session = new GameSession();
        session.setDifficulty(difficulty);
        session.setUser(user);

        return gameSessionRepository.save(session);
    }

    public void saveAnswer(Long sessionId, boolean correct, String selectedAnswer, String correctAnswer) {
        GameSession session = gameSessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Sesión no encontrada"));

        GameAnswer answer = new GameAnswer();
        answer.setCorrect(correct);
        answer.setSelectedAnswer(selectedAnswer);
        answer.setCorrectAnswer(correctAnswer);
        answer.setSession(session);

        gameAnswerRepository.save(answer);
    }
    
    @Autowired
    private MovieRepository movieRepository;

    public GameQuestionDto getQuizQuestion(Long sessionId, Difficulty difficulty) {
        // Traemos la sesión actual para saber qué respuestas tiene
        GameSession session = gameSessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Sesión no encontrada"));

        // Obtenemos los títulos de películas que ya se usaron en esta sesión (en respuestas previas)
        Set<String> usedMovieTitles = session.getAnswers().stream()
            .map(GameAnswer::getCorrectAnswer)
            .collect(Collectors.toSet());

        List<Movie> allMovies = movieRepository.findAll();

        // Filtramos las que no se usaron
        List<Movie> availableMovies = allMovies.stream()
            .filter(movie -> !usedMovieTitles.contains(movie.getTitle()))
            .collect(Collectors.toList());

        // Filtrar las películas con sinopsis no vacía
        List<Movie> moviesWithOverview = availableMovies.stream()
            .filter(movie -> movie.getOverview() != null && !movie.getOverview().trim().isEmpty())
            .collect(Collectors.toList());

        int optionCount = difficulty.getOptionCount();

        if (moviesWithOverview.size() < optionCount) {
            throw new IllegalStateException("No hay suficientes películas nuevas con sinopsis para esta dificultad.");
        }

        Collections.shuffle(moviesWithOverview);
        Movie correctMovie = moviesWithOverview.get(0);

        Set<String> options = new HashSet<>();
        options.add(correctMovie.getTitle());

        int index = 1;
        while (options.size() < optionCount && index < moviesWithOverview.size()) {
            options.add(moviesWithOverview.get(index).getTitle());
            index++;
        }

        List<String> optionsList = new ArrayList<>(options);
        Collections.shuffle(optionsList);

        GameQuestionDto dto = new GameQuestionDto();
        dto.setOverview(correctMovie.getOverview());
        dto.setOptions(optionsList);
        dto.setCorrectAnswer(correctMovie.getTitle());
        dto.setDifficulty(difficulty);

        return dto;
    }


    
    public List<SessionStatsDto> getUserSessionStats(Long userId) {


        List<GameSession> sessions = gameSessionRepository.findByUserId(userId);

        List<SessionStatsDto> result = new ArrayList<>();

        for (GameSession session : sessions) {
            int correct = 0;
            int wrong = 0;
            for (GameAnswer answer : session.getAnswers()) {
                if (answer.isCorrect()) correct++;
                else wrong++;
            }

            SessionStatsDto dto = new SessionStatsDto();
            dto.setSessionId(session.getId());
            dto.setDifficulty(session.getDifficulty());
            dto.setCorrectCount(correct);
            dto.setWrongCount(wrong);
            dto.setTotal(session.getAnswers().size());

            result.add(dto);
        }

        return result;
    }
    
    public List<GameSessionSummaryDto> getAllSessionsWithSummary() {
        List<GameSession> sessions = gameSessionRepository.findAll();

        return sessions.stream().map(session -> {
            int correct = (int) session.getAnswers().stream().filter(GameAnswer::isCorrect).count();
            int total = session.getAnswers().size();
            int incorrect = total - correct;

            return new GameSessionSummaryDto(
                session.getId(),
                session.getDifficulty(),
                session.getUser().getNickname(),
                correct,
                incorrect,
                total
            );
        }).collect(Collectors.toList());
    }
    
    public List<UserSummaryDto> getAllUserSummaries() {
        List<User> users = userRepository.findAll();

        return users.stream().map(user -> {
            Long gamesPlayed = gameSessionRepository.countByUserId(user.getId());
            Long score = user.getScore() != null ? user.getScore() : 0L;
            return new UserSummaryDto(user.getNickname(), gamesPlayed, score);
        }).toList();
    }

}

