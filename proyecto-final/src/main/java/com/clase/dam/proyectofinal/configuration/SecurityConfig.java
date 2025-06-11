package com.clase.dam.proyectofinal.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
public class SecurityConfig {
	
	//Cors
	 	@Bean
	    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	        http
	            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Configuración CORS
	            .csrf(csrf -> csrf.disable()) // Deshabilita CSRF si es necesario
	            .authorizeHttpRequests(auth -> auth
	                .requestMatchers("/api/manage-users/register", "/api/manage-users/login", "/api/manage-users/{id}", "/home", "/api/manage-users", "/api/movies", "/api/movies/{id}", "/api/genres", "/api/movies/filter", "/api/reviews/movie/{id}", "/api/manage-users/reviews", "/api/reviews", "/api/reviews/{id}", "/api/reviews/user/{id}", "/api/game/session", "/api/game/answer", "/api/game", "/api/game?sessionId=${sessionId}&difficulty=${difficulty}", "/api/game/session/**", "/api/game/user-sessions/**", "/api/game/sessions/summary", "/api/manage-users/**", "/api/game/summary"
	                        ,"/swagger-ui/**",
	                        "/v3/api-docs/**",
	                        "/swagger-ui.html").permitAll() // Permitir rutas específicas sin autenticación
	                .requestMatchers(HttpMethod.POST, "/api/reviews").permitAll()
	                .anyRequest().authenticated()
	            );

	        return http.build();
	    }

	    @Bean
	    public CorsConfigurationSource corsConfigurationSource() {
	        CorsConfiguration configuration = new CorsConfiguration();
	        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // Orígenes permitidos
	        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Métodos HTTP permitidos
	        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
	        configuration.setAllowCredentials(true); // Habilita credenciales (tokens, cookies)

	        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	        source.registerCorsConfiguration("/**", configuration);
	        return source;
	    }

	// Codifica contraseñas
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
