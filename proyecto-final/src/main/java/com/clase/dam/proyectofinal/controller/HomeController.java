package com.clase.dam.proyectofinal.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class HomeController {

    @RequestMapping("/home")
    public String home() {
        return "Contenido de la página de inicio protegido por autenticación";
    }
    
    
}
