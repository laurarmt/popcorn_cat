package com.clase.dam.proyectofinal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.clase.dam.proyectofinal.entity.Crew;

public interface CrewRepository extends JpaRepository<Crew, Integer> {
	Crew findCrewById(Integer id);
}
