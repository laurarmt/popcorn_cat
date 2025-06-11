package com.clase.dam.proyectofinal.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSummaryDto {
	
	@Schema(example = "Skadi", description = "Nickname del usuario")
    private String nickname;
	
	@Schema(example = "15", description = "Cantidad de partidas jugados")
    private Long gamesPlayed;
	
	@Schema(example = "30", description = "Puntuación total acumulada")
    private Long score;

    public UserSummaryDto() {}

    public UserSummaryDto(String nickname, Long gamesPlayed, Long score) {
        this.nickname = nickname;
        this.gamesPlayed = gamesPlayed;
        this.score = score;
    }

    
}

