package com.clase.dam.proyectofinal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clase.dam.proyectofinal.entity.GameAnswer;
import com.clase.dam.proyectofinal.entity.GameSession;

public interface GameAnswerRepository  extends JpaRepository<GameAnswer, Long> {
}
