package com.clase.dam.proyectofinal.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clase.dam.proyectofinal.dto.CreateSessionDto;
import com.clase.dam.proyectofinal.dto.GameAnswerDto;
import com.clase.dam.proyectofinal.dto.GameQuestionDto;
import com.clase.dam.proyectofinal.dto.GameResultDto;
import com.clase.dam.proyectofinal.dto.GameSessionResponseDto;
import com.clase.dam.proyectofinal.dto.GameSessionSummaryDto;
import com.clase.dam.proyectofinal.dto.SessionStatsDto;
import com.clase.dam.proyectofinal.dto.UserSummaryDto;
import com.clase.dam.proyectofinal.entity.Difficulty;
import com.clase.dam.proyectofinal.entity.GameSession;
import com.clase.dam.proyectofinal.entity.User;
import com.clase.dam.proyectofinal.repository.GameSessionRepository;
import com.clase.dam.proyectofinal.service.GameService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;


@Tag(name = "Game API", description = "Operaciones relacionadas con sesiones de juego")
@RestController
@RequestMapping("/api/game")
public class GameController {
	@Autowired
	private GameSessionRepository gameSessionRepository;
	
	@Autowired
    private GameService gameService;

	@Operation(
		    summary = "Crear una nueva sesión de juego",
		    description = "Crea una nueva sesión para un usuario con una dificultad especificada"
		)
		@ApiResponse(
		    responseCode = "200", 
		    description = "Sesión creada correctamente", 
		    content = @Content(
		        mediaType = "application/json",
		        examples = @ExampleObject(
		            value = """
		                {
		                  "id": 1,
		                  "difficulty": "FACIL"
		                }
		            """
		        )
		    )
		)
    @PostMapping("/session")
    public ResponseEntity<GameSessionResponseDto> createSession(
    	    @io.swagger.v3.oas.annotations.parameters.RequestBody(
    	            content = @Content(
    	                mediaType = "application/json",
    	                examples = @ExampleObject(
    	                    value = """
    	                        {
    	                          "userId": 1,
    	                          "difficulty": "FACIL"
    	                        }
    	                    """
    	                )
    	            )
    	        )
    	        @RequestBody CreateSessionDto dto) {
        GameSession session = gameService.createSession(dto.getDifficulty(), dto.getUserId());
        return ResponseEntity.ok(new GameSessionResponseDto(session.getId(), session.getDifficulty()));
    }

	@Operation(
		    summary = "Guardar respuesta del usuario",
		    description = "Guarda una respuesta dada por el usuario durante una sesión de juego.",
		    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
		        required = true,
		        content = @Content(
		            mediaType = "application/json",
		            examples = @ExampleObject(
		                name = "Ejemplo de respuesta de juego",
		                value = """
		                    {
		                      "sessionId": 1,
		                      "correct": true,
		                      "selectedAnswer": "Sinner",
		                      "correctAnswer": "Sinner"
		                    }
		                """
		            )
		        )
		    )
		)
		@ApiResponse(
		    responseCode = "200",
		    description = "Respuesta guardada correctamente"
		)
    @PostMapping("/answer")
    public ResponseEntity<?> saveAnswer(@RequestBody GameAnswerDto dto) {
    	gameService.saveAnswer(
            dto.getSessionId(),
            dto.isCorrect(),
            dto.getSelectedAnswer(),
            dto.getCorrectAnswer()
        );
        return ResponseEntity.ok().build();
    }
	
	@Operation(
		    summary = "Obtener resultados de una sesión",
		    description = "Devuelve una lista de respuestas (GameResultDto) asociadas a la sesión de juego con el ID proporcionado."
		)
		@ApiResponse(
		    responseCode = "200",
		    description = "Lista de resultados de la sesión",
		    content = @Content(
		        mediaType = "application/json",
		        examples = @ExampleObject(
		            name = "Ejemplo de resultados de sesión",
		            value = """
		                [
		                  {
		                    "difficulty": "FACIL",
		                    "correct": true,
		                    "selectedAnswer": "Sinner",
		                    "correctAnswer": "Sinner",
		                    "userId": 1
		                  },
		                  {
		                    "difficulty": "FACIL",
		                    "correct": false,
		                    "selectedAnswer": "Laila",
		                    "correctAnswer": "Lilo & Stitch",
		                    "userId": 1
		                  },
		                  {
		                    "difficulty": "FACIL",
		                    "correct": true,
		                    "selectedAnswer": "Lilo & Stitch",
		                    "correctAnswer": "Lilo & Stitch",
		                    "userId": 1
		                  },
		                  {
		                    "difficulty": "FACIL",
		                    "correct": false,
		                    "selectedAnswer": "Captain America: Brave New World",
		                    "correctAnswer": "Warfare",
		                    "userId": 1
		                  },
		                  {
		                    "difficulty": "FACIL",
		                    "correct": true,
		                    "selectedAnswer": "Last Bullet",
		                    "correctAnswer": "Last Bullet",
		                    "userId": 1
		                  }
		                ]
		            """
		        )
		    )
		)
    @GetMapping("/session/{id}")
    public ResponseEntity<List<GameResultDto>> getSessionResults(@PathVariable Long id) {
        GameSession session = gameSessionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Sesión no encontrada"));

        List<GameResultDto> results = session.getAnswers().stream()
            .map(answer -> {
                GameResultDto dto = new GameResultDto();
                dto.setDifficulty(session.getDifficulty());
                dto.setCorrect(answer.isCorrect());
                dto.setSelectedAnswer(answer.getSelectedAnswer());
                dto.setCorrectAnswer(answer.getCorrectAnswer());
                dto.setUserId(session.getUser().getId());
                return dto;
            })
            .toList();

        return ResponseEntity.ok(results);
    }
    
	@Operation(
		    summary = "Obtener estadísticas de sesiones de un usuario",
		    description = "Devuelve la lista de estadísticas de sesiones jugadas por el usuario identificado por su ID."
		)
		@ApiResponse(
		    responseCode = "200",
		    description = "Lista de estadísticas de sesiones del usuario",
		    content = @Content(
		        mediaType = "application/json",
		        examples = @ExampleObject(
		            name = "Ejemplo de estadísticas de sesiones de usuario",
		            value = """
		                [
		                  {
		                    "sessionId": 1,
		                    "difficulty": "MEDIA",
		                    "correctCount": 7,
		                    "wrongCount": 3,
		                    "total": 10
		                  },
		                  {
		                    "sessionId": 2,
		                    "difficulty": "FACIL",
		                    "correctCount": 3,
		                    "wrongCount": 2,
		                    "total": 5
		                  }
		                ]
		            """
		        )
		    )
		)
    @GetMapping("/user-sessions/{userId}")
    public ResponseEntity<List<SessionStatsDto>> getUserSessions(@PathVariable Long userId) {
        List<SessionStatsDto> stats = gameService.getUserSessionStats(userId);
        return ResponseEntity.ok(stats);
    }
	
	@Operation(
		    summary = "Obtener resumen de todas las sesiones",
		    description = "Devuelve un resumen con estadísticas generales para todas las sesiones de juego."
		)
		@ApiResponse(
		    responseCode = "200",
		    description = "Lista de resumen de sesiones",
		    content = @Content(
		        mediaType = "application/json",
		        examples = @ExampleObject(
		            name = "Ejemplo de resumen de sesiones",
		            value = """
		                [
		                  {
		                    "sessionId": 1,
		                    "difficulty": "DIFICIL",
		                    "userNickname": "Skadi",
		                    "correctAnswers": 17,
		                    "incorrectAnswers": 3,
		                    "totalQuestions": 20
		                  },
		                  {
		                    "sessionId": 2,
		                    "difficulty": "MEDIA",
		                    "userNickname": "Jugador1",
		                    "correctAnswers": 5,
		                    "incorrectAnswers": 5,
		                    "totalQuestions": 10
		                  }
		                ]
		            """
		        )
		    )
		)
    @GetMapping("/sessions/summary")
    public ResponseEntity<List<GameSessionSummaryDto>> getAllSessionSummaries() {
        return ResponseEntity.ok(gameService.getAllSessionsWithSummary());
    }


	@Operation(
		    summary = "Obtener pregunta del quiz",
		    description = "Devuelve una pregunta del juego para la sesión dada y dificultad especificada"
		)
	@ApiResponse(
		    responseCode = "200",
		    description = "Pregunta de quiz",
		    content = @Content(
		        mediaType = "application/json",
		        examples = @ExampleObject(
		            name = "Ejemplo de pregunta de quiz",
		            value = """
		                {
		                  "id": 1,
		                  "overview": "As Stitch, a runaway genetic experiment...",
		                  "options": ["Lilo & Stitch", "Final Destination", "Final Destination Bloodlines", "Lilo & Stitch 2: Stitch Has a Glitch"],
		                  "correctAnswer": "Lilo & Stitch",
		                  "difficulty": "MEDIA"
		                }
		            """
		        )
		    )
		)
    @GetMapping
    public ResponseEntity<GameQuestionDto> getQuizQuestion(
        @RequestParam Long sessionId,
        @RequestParam(defaultValue = "MEDIA") Difficulty difficulty
    ) {
        return ResponseEntity.ok(gameService.getQuizQuestion(sessionId, difficulty));
    }

	@Operation(
		    summary = "Obtener resumen de usuarios",
		    description = "Devuelve un listado con resumenes estadísticos de todos los usuarios"
		)
		@ApiResponse(
		    responseCode = "200",
		    description = "Lista de resúmenes de usuarios",
		    content = @Content(
		        mediaType = "application/json",
		        examples = @ExampleObject(
		            name = "Ejemplo de resumen de usuarios",
		            value = """
		                [
		                  {
		                    "nickname": "Skadi",
		                    "gamesPlayed": 15,
		                    "score": 30
		                  },
		                  {
		                    "nickname": "Jugador1",
		                    "gamesPlayed": 20,
		                    "score": 3
		                  }
		                ]
		            """
		        )
		    )
		)
    @GetMapping("/summary")
    public ResponseEntity<List<UserSummaryDto>> getUsersSummary() {
        List<UserSummaryDto> summaries = gameService.getAllUserSummaries();
        return ResponseEntity.ok(summaries);
    }

}
