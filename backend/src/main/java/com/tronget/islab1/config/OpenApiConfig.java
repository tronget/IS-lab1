package com.tronget.islab1.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI isLab1OpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("IS-lab1 API")
                        .description("REST API for LabWork management with related entities (Discipline, Person, Coordinates, Location)")
                        .version("0.0.1-SNAPSHOT")
                        .license(new License().name("MIT").url("https://opensource.org/licenses/MIT")))
                .externalDocs(new ExternalDocumentation()
                        .description("Github")
                        .url("https://github.com/tronget/IS-lab1"))
                .externalDocs(new ExternalDocumentation()
                        .description("UML Diagrams and Report")
                        .url("https://github.com/tronget/IS-lab1/docs"));
    }
}

