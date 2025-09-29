package com.tronget.islab1.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tronget.islab1.dto.LabWorkRequestDto;
import com.tronget.islab1.dto.LabWorkResponseDto;
import com.tronget.islab1.mappers.LabWorkMapper;
import com.tronget.islab1.models.LabWork;
import com.tronget.islab1.service.LabWorkService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LabWorkController.class)
class LabWorkControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private LabWorkService service;

    @MockitoBean
    private LabWorkMapper mapper;

    @Test
    void getAllLabWorks_returnsList() throws Exception {
        LabWork entity = new LabWork();
        entity.setId(1L);

        LabWorkResponseDto dto = new LabWorkResponseDto();
        dto.setId(1L);

        Mockito.when(service.findAll()).thenReturn(List.of(entity));
        Mockito.when(mapper.toResponse(entity)).thenReturn(dto);

        mockMvc.perform(get("/api/labworks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void getLabWork_returnsEntity() throws Exception {
        LabWork entity = new LabWork();
        entity.setId(10L);

        LabWorkResponseDto dto = new LabWorkResponseDto();
        dto.setId(10L);

        Mockito.when(service.findById(10L)).thenReturn(entity);
        Mockito.when(mapper.toResponse(entity)).thenReturn(dto);

        mockMvc.perform(get("/api/labworks/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10));
    }

    @Test
    void getLabWork_notFound() throws Exception {
        Mockito.when(service.findById(999L)).thenReturn(null);

        mockMvc.perform(get("/api/labworks/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createLabWork_returnsSaved() throws Exception {
        LabWorkRequestDto requestDto = new LabWorkRequestDto();
        LabWork entity = new LabWork();
        entity.setId(1L);
        LabWork saved = new LabWork();
        saved.setId(1L);

        LabWorkResponseDto responseDto = new LabWorkResponseDto();
        responseDto.setId(1L);

        Mockito.doAnswer(inv -> {
            // имитация setEntityValues: копирование значений
            return null;
        }).when(mapper).setEntityValues(any(LabWork.class), eq(requestDto));

        Mockito.when(service.save(any(LabWork.class))).thenReturn(saved);
        Mockito.when(mapper.toResponse(saved)).thenReturn(responseDto);

        mockMvc.perform(post("/api/labworks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void updateLabWork_returnsUpdated() throws Exception {
        LabWorkRequestDto requestDto = new LabWorkRequestDto();
        LabWork updated = new LabWork();
        updated.setId(5L);

        LabWorkResponseDto responseDto = new LabWorkResponseDto();
        responseDto.setId(5L);

        Mockito.when(service.update(eq(5L), eq(requestDto))).thenReturn(updated);
        Mockito.when(mapper.toResponse(updated)).thenReturn(responseDto);

        mockMvc.perform(put("/api/labworks/5")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5));
    }

    @Test
    void updateLabWork_notFound() throws Exception {
        LabWorkRequestDto requestDto = new LabWorkRequestDto();

        Mockito.when(service.update(eq(123L), eq(requestDto))).thenReturn(null);

        mockMvc.perform(put("/api/labworks/123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteLabWork_returnsNoContent() throws Exception {
        Mockito.when(service.delete(7L)).thenReturn(true);

        mockMvc.perform(delete("/api/labworks/7"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteLabWork_notFound() throws Exception {
        Mockito.when(service.delete(8L)).thenReturn(false);

        mockMvc.perform(delete("/api/labworks/8"))
                .andExpect(status().isNotFound());
    }
}
