package com.clase.dam.proyectofinal.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clase.dam.proyectofinal.entity.Movie;
import com.clase.dam.proyectofinal.entity.Review;
import com.clase.dam.proyectofinal.entity.Rol;
import com.clase.dam.proyectofinal.entity.User;
import com.clase.dam.proyectofinal.repository.MovieRepository;
import com.clase.dam.proyectofinal.repository.ReviewRepository;
import com.clase.dam.proyectofinal.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;

@RestController
@RequestMapping("/api/manage-users")
@CrossOrigin(origins = "http://localhost:3000") 
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private MovieRepository movieRepository;
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    //Review 
    @Operation(
            summary = "Crear una nueva reseña",
            description = "Permite a un usuario crear una reseña sobre una película, incluyendo una calificación y un texto."
        )
        @ApiResponse(
            responseCode = "200",
            description = "Reseña guardada con éxito",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = """
                            {
                              "message": "Reseña guardada con éxito.",
                              "status": "success"
                            }
                        """
                )
            )
        )
        @ApiResponse(
            responseCode = "400",
            description = "Usuario o película no encontrados",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = """
                            {
                              "message": "Usuario o película no encontrados.",
                              "status": "error"
                            }
                        """
                )
            )
        )
    @PostMapping("/reviews")
    public Map<String, Object> review(@RequestBody Review review) {
        Map<String, Object> response = new HashMap<>();

        User user = userRepository.findById(review.getUser().getId()).orElse(null);
        Movie movie = movieRepository.findById(review.getMovie().getId()).orElse(null);
        if (user == null || movie == null) {
            response.put("message", "Usuario o película no encontrados.");
            response.put("status", "error");
            return response;  
        }

        review.setUser(user);
        review.setMovie(movie);
        review.setRating(review.getRating());
        review.setText(review.getText());
        review.setCreatedAt(LocalDateTime.now());

        reviewRepository.save(review);

        response.put("message", "Reseña guardada con éxito.");
        response.put("status", "success");
        return response; 
    }
    
    
    @Operation(
            summary = "Crear un nuevo usuario",
            description = "Registra un nuevo usuario en el sistema, validando email, alias y aceptación de privacidad."
        )
        @ApiResponse(
            responseCode = "200",
            description = "Usuario creado con éxito",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = """
                            {
                              "message": "Usuario creado con éxito.",
                              "status": "success"
                            }
                        """
                )
            )
        )
        @ApiResponse(
            responseCode = "400",
            description = "Error al crear usuario",
            content = @Content(
                mediaType = "application/json",
                examples = {
                    @ExampleObject(
                        name = "Correo ya registrado",
                        value = """
                                {
                                  "message": "El correo electrónico ya está registrado.",
                                  "status": "error"
                                }
                            """
                    ),
                    @ExampleObject(
                        name = "Alias ya registrado",
                        value = """
                                {
                                  "message": "El alias ya está registrado.",
                                  "status": "error"
                                }
                            """
                    ),
                    @ExampleObject(
                        name = "Privacidad no aceptada",
                        value = """
                                {
                                  "message": "Debe aceptar la política de privacidad.",
                                  "status": "error"
                                }
                            """
                    )
                }
            )
        )
    private Map<String, Object> createUserInternal(User user, boolean isAdmin) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> existingEmail = userRepository.findByEmail(user.getEmail());
        if (existingEmail.isPresent()) {
            response.put("message", "El correo electrónico ya está registrado.");
            response.put("status", "error");
            return response;
        }
        Optional<User> existingNickname = userRepository.findByNickname(user.getNickname());
        if (existingNickname.isPresent()) {
            response.put("message", "El alias ya está registrado.");
            response.put("status", "error");
            return response;
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (!isAdmin) user.setRol(Rol.USER); // Si no es admin, forzar a USER
        if (!user.isAcceptPrivacity()) {
            response.put("message", "Debe aceptar la política de privacidad.");
            response.put("status", "error");
            return response;
        }

        userRepository.save(user);

        response.put("message", "Usuario creado con éxito.");
        response.put("status", "success");
        return response;
    }

 // Registrar 
    @Operation(
    	    summary = "Registrar un nuevo usuario",
    	    description = "Registra un nuevo usuario como rol USER, validando email, alias y aceptación de privacidad."
    	)
    	@ApiResponse(
    	    responseCode = "200",
    	    description = "Usuario registrado con éxito",
    	    content = @Content(
    	        mediaType = "application/json",
    	        examples = @ExampleObject(
    	            value = """
    	                    {
    	                      "message": "Usuario creado con éxito.",
    	                      "status": "success"
    	                    }
    	                """
    	        )
    	    )
    	)
    	@ApiResponse(
    	    responseCode = "400",
    	    description = "Error de validación al registrar el usuario",
    	    content = @Content(
    	        mediaType = "application/json",
    	        examples = {
    	            @ExampleObject(
    	                name = "Correo ya registrado",
    	                value = """
    	                        {
    	                          "message": "El correo electrónico ya está registrado.",
    	                          "status": "error"
    	                        }
    	                    """
    	            ),
    	            @ExampleObject(
    	                name = "Alias ya registrado",
    	                value = """
    	                        {
    	                          "message": "El alias ya está registrado.",
    	                          "status": "error"
    	                        }
    	                    """
    	            ),
    	            @ExampleObject(
    	                name = "Privacidad no aceptada",
    	                value = """
    	                        {
    	                          "message": "Debe aceptar la política de privacidad.",
    	                          "status": "error"
    	                        }
    	                    """
    	            )
    	        }
    	    )
    	)
    @PostMapping("/register")
    public Map<String, Object> register(
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Datos del nuevo usuario",
            required = true,
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = """
                            {
                              "name": "Carlos",
                              "surname": "Ramírez",
                              "birthDate": "1990-07-15",
                              "email": "carlos.ramirez@example.com",
                              "password": "claveSegura123",
                              "nickname": "carlitos90",
                              "acceptPrivacity": true
                            }
                        """
                )
            )
        )
        @RequestBody User user
    ) {
        return createUserInternal(user, false);
    }

    @Operation(
    	    summary = "Crear un nuevo usuario administrador",
    	    description = "Crea un nuevo usuario con rol ADMIN. Requiere aceptación de privacidad y validaciones."
    	)
    	@ApiResponse(
    	    responseCode = "200",
    	    description = "Usuario administrador creado con éxito",
    	    content = @Content(
    	        mediaType = "application/json",
    	        examples = @ExampleObject(
    	            value = """
    	                    {
    	                      "message": "Usuario creado con éxito.",
    	                      "status": "success"
    	                    }
    	                """
    	        )
    	    )
    	)
    	@ApiResponse(
    	    responseCode = "400",
    	    description = "Error al crear usuario administrador",
    	    content = @Content(
    	        mediaType = "application/json",
    	        examples = {
    	            @ExampleObject(
    	                name = "Correo ya registrado",
    	                value = """
    	                        {
    	                          "message": "El correo electrónico ya está registrado.",
    	                          "status": "error"
    	                        }
    	                    """
    	            ),
    	            @ExampleObject(
    	                name = "Alias ya registrado",
    	                value = """
    	                        {
    	                          "message": "El alias ya está registrado.",
    	                          "status": "error"
    	                        }
    	                    """
    	            ),
    	            @ExampleObject(
    	                name = "Privacidad no aceptada",
    	                value = """
    	                        {
    	                          "message": "Debe aceptar la política de privacidad.",
    	                          "status": "error"
    	                        }
    	                    """
    	            )
    	        }
    	    )
    	)
    	@PostMapping
    	public Map<String, Object> createUser(
    	    @io.swagger.v3.oas.annotations.parameters.RequestBody(
    	        description = "Datos del usuario administrador a crear",
    	        required = true,
    	        content = @Content(
    	            mediaType = "application/json",
    	            examples = @ExampleObject(
    	                value = """
    	                        {
    	                          "name": "Jose",
    	                      "surname": "Campos",
    	                      "birthDate": "19904-06-14",
    	                      "email": "jose.campos@gmail.com",
    	                          "password": "pruebaSwagger",
    	                          "nickname": "Sek",,
    	                          "acceptPrivacity": true,
    	                          "rol": "USER"
    	                          "id": 4,
    	                        }
    	                    """
    	            )
    	        )
    	    )
    	    @RequestBody User user
    	) {
        return createUserInternal(user, true);
    }

    
    //Login
    @Operation(
    	    summary = "Iniciar sesión",
    	    description = "Permite a un usuario iniciar sesión con su correo y contraseña."
    	)
    	@ApiResponse(
    	    responseCode = "200",
    	    description = "Inicio de sesión exitoso",
    	    content = @Content(
    	        mediaType = "application/json",
    	        examples = @ExampleObject(
    	            value = """
    	                {
    	                  "message": "Login exitoso",
    	                  "status": "success",
    	                  "token": "sample-token",
    	                  "role": "ADMIN",
    	                  "id": 1
    	                }
    	            """
    	        )
    	    )
    	)
    	@io.swagger.v3.oas.annotations.parameters.RequestBody(
    	    content = @Content(
    	        mediaType = "application/json",
    	        examples = @ExampleObject(
    	            value = """
    	                {
    	                  "email": "l@gmail.com",
    	                  "password": "1234"
    	                }
    	            """
    	        )
    	    )
    	)
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<User> userOptional = userRepository.findByEmail(email);
        Map<String, Object> response = new HashMap<>();

      
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            System.out.println("Usuario encontrado: " + user.getEmail());

            // Verificar contraseña
            if (passwordEncoder.matches(password, user.getPassword())) {
                response.put("message", "Login exitoso");
                response.put("status", "success");
                response.put("token", "sample-token");
                response.put("role", user.getRol().name());
                response.put("id", user.getId()); 
            } else {
                response.put("message", "Contraseña incorrecta");
                response.put("status", "error");
            }
        } else {
            response.put("message", "Usuario no encontrado");
            response.put("status", "error");
        }
        return response;
    }
    
    @Operation(
    	    summary = "Obtener todos los usuarios paginados",
    	    description = "Devuelve una lista paginada de usuarios."
    	)
    	@ApiResponse(
    	    responseCode = "200",
    	    description = "Lista de usuarios",
    	    content = @Content(
    	        mediaType = "application/json",
    	        examples = @ExampleObject(
    	            value = """
    	                {
    	                  "content": [
    	                    {
    	                      "id": 4,
    	                      "name": "Jose",
    	                      "surname": "Campos",
    	                      "birthDate": "19904-06-14",
    	                      "email": "jose.campos@gmail.com",
    	                      "nickname": "Sek",
    	                      "score": 100,
    	                      "acceptPrivacity": true,
    	                      "rol": "USER"
    	                    }
    	                  ],
    	                  "totalPages": 1,
    	                  "totalElements": 1
    	                }
    	            """
    	        )
    	    )
    	)
    @GetMapping
    public Page<User> getAllUsers(
            @RequestParam(defaultValue = "0") int page, 
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findAll(pageable);
    }

    @Operation(
    	    summary = "Obtener usuario por ID",
    	    description = "Devuelve los datos de un usuario específico por su ID."
    	)
    	@ApiResponse(
    	    responseCode = "200",
    	    description = "Usuario encontrado",
    	    content = @Content(
    	        mediaType = "application/json",
    	        examples = @ExampleObject(
    	            value = """
    	                {
    	                  "id": 4,
    	                  "name": "Jose",
    	                  "surname": "Campos",
    	                  "birthDate": "19904-06-14",
    	                  "email": "jose.campos@hotmal.com",
    	                  "nickname": "Sek",
    	                  "score": 100,
    	                  "acceptPrivacity": true,
    	                  "rol": "USER"
    	                }
    	            """
    	        )
    	    )
    	)
    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id);
    }

    @Operation(
    	    summary = "Actualizar usuario",
    	    description = "Actualiza la información de un usuario existente."
    	)
    	@ApiResponse(
    	    responseCode = "200",
    	    description = "Usuario actualizado correctamente",
    	    content = @Content(
    	        mediaType = "application/json",
    	        examples = @ExampleObject(
    	            value = """
    	                {
    	                  "message": "Usuario actualizado correctamente.",
    	                  "status": "success"
    	                }
    	            """
    	        )
    	    )
    	)
    	@io.swagger.v3.oas.annotations.parameters.RequestBody(
    	    content = @Content(
    	        mediaType = "application/json",
    	        examples = @ExampleObject(
    	            value = """
    	                {
    	                  "name": "Juan",
    	                  "surname": "Pérez",
    	                  "birthDate": "1990-01-01",
    	                  "email": "nuevo.correo@example.com",
    	                  "nickname": "juanitoNuevo",
    	                  "password": "nuevoPass123",
    	                  "rol": "USER",
    	                  "acceptPrivacity": true
    	                }
    	            """
    	        )
    	    )
    	)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        Map<String, Object> response = new HashMap<>();

        // Verificar si el email ya existe y no pertenece al mismo usuario
        Optional<User> existingEmail = userRepository.findByEmail(userDetails.getEmail());
        if (existingEmail.isPresent() && !existingEmail.get().getId().equals(id)) {
            response.put("message", "El correo electrónico ya está registrado.");
            response.put("status", "error");
            return ResponseEntity.badRequest().body(response);
        }

        // Verificar si el nickname ya existe y no pertenece al mismo usuario
        Optional<User> existingNickname = userRepository.findByNickname(userDetails.getNickname());
        if (existingNickname.isPresent() && !existingNickname.get().getId().equals(id)) {
            response.put("message", "El alias ya está registrado.");
            response.put("status", "error");
            return ResponseEntity.badRequest().body(response);
        }

        return userRepository.findById(id).map(user -> {
            user.setName(userDetails.getName());
            user.setSurname(userDetails.getSurname());
            user.setEmail(userDetails.getEmail());
            user.setBirthDate(userDetails.getBirthDate());
            user.setNickname(userDetails.getNickname());
            
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            }

            if (userDetails.getRol() != null) {
                user.setRol(userDetails.getRol());
            }

            userRepository.save(user); // Guarda los cambios

            response.put("message", "Usuario actualizado correctamente.");
            response.put("status", "success");
            return ResponseEntity.ok(response);

        }).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    }
    
    @Operation(
    	    summary = "Actualizar puntuación de usuario",
    	    description = "Actualiza el score de un usuario."
    	)
    	@ApiResponse(
    	    responseCode = "200",
    	    description = "Puntuación actualizada correctamente",
    	    content = @Content(
    	        mediaType = "application/json",
    	        examples = @ExampleObject(
    	            value = """
    	                {
    	                  "message": "Score actualizado correctamente",
    	                  "score": 250
    	                }
    	            """
    	        )
    	    )
    	)
    	@io.swagger.v3.oas.annotations.parameters.RequestBody(
    	    content = @Content(
    	        mediaType = "application/json",
    	        examples = @ExampleObject(
    	            value = """
    	                {
    	                  "score": 250
    	                }
    	            """
    	        )
    	    )
    	)
    @PutMapping("/{id}/score")
    public ResponseEntity<?> updateUserScore(@PathVariable Long id, @RequestBody Map<String, Long> scoreMap) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Usuario no encontrado"));
        }
        User user = optionalUser.get();

        Long newScore = scoreMap.get("score");
        if (newScore == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Score no proporcionado"));
        }

        user.setScore(newScore);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Score actualizado correctamente", "score", newScore));
    }

    @Operation(
    	    summary = "Eliminar usuario",
    	    description = "Elimina un usuario por su ID."
    	)
    	@ApiResponse(
    	    responseCode = "204",
    	    description = "Usuario eliminado exitosamente"
    	)
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }
}
