package com.tronget.islab1.dto;

import com.tronget.islab1.models.ImportStatus;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ImportOperationDto {
    private Long id;
    private ImportStatus status;
    private String username;
    private String fileName;
    private int totalRecords;
    private int insertedRecords;
    private String errorMessage;
    private Instant createdAt;
    private Instant finishedAt;
}
