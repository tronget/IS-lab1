package com.tronget.islab1.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tronget.islab1.dto.ImportOperationDto;
import com.tronget.islab1.dto.LabWorkRequestDto;
import com.tronget.islab1.exceptions.UniqueConstraintViolationException;
import com.tronget.islab1.mappers.LabWorkMapper;
import com.tronget.islab1.models.ImportOperation;
import com.tronget.islab1.models.UserAccount;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@Service
public class ImportService {

    private final ObjectMapper objectMapper;
    private final LabWorkMapper labWorkMapper;
    private final LabWorkService labWorkService;
    private final ImportOperationService importOperationService;
    private final UserAccountService userAccountService;
    private final Validator validator;
    private final TransactionTemplate transactionTemplate;

    public ImportService(ObjectMapper objectMapper,
                         LabWorkMapper labWorkMapper,
                         LabWorkService labWorkService,
                         ImportOperationService importOperationService,
                         UserAccountService userAccountService,
                         Validator validator,
                         PlatformTransactionManager transactionManager) {
        this.objectMapper = objectMapper.copy()
                .enable(DeserializationFeature.FAIL_ON_TRAILING_TOKENS)
                .enable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        this.labWorkMapper = labWorkMapper;
        this.labWorkService = labWorkService;
        this.importOperationService = importOperationService;
        this.userAccountService = userAccountService;
        this.validator = validator;
        this.transactionTemplate = new TransactionTemplate(transactionManager);
        this.transactionTemplate.setIsolationLevel(TransactionDefinition.ISOLATION_SERIALIZABLE);
    }

    public ImportOperationDto importLabWorks(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }
        List<LabWorkRequestDto> payload = parse(file);
        UserAccount user = userAccountService.getCurrentAccount();
        String filename = file.getOriginalFilename() != null
                ? file.getOriginalFilename()
                : "import.json";
        ImportOperation operation =
                importOperationService.start(user, filename, payload.size());
        try {
            transactionTemplate.executeWithoutResult(
                    status -> payload.forEach(this::processSingle));
            importOperationService.markSuccess(operation.getId(), payload.size());
        } catch (RuntimeException ex) {
            importOperationService.markFailure(operation.getId(), ex.getMessage());
            throw ex;
        }
        ImportOperation refreshed =
                importOperationService.getOne(operation.getId(), user);
        return importOperationService.toDto(refreshed);
    }

    private void processSingle(LabWorkRequestDto dto) {
        com.tronget.islab1.models.LabWork entity =
                new com.tronget.islab1.models.LabWork();
        labWorkMapper.setEntityValues(entity, dto);
        validateEntity(entity);
        labWorkService.save(entity);
    }

    private void validateEntity(com.tronget.islab1.models.LabWork entity) {
        Set<ConstraintViolation<com.tronget.islab1.models.LabWork>> violations =
                validator.validate(entity);
        if (!violations.isEmpty()) {
            String message = violations.iterator().next().getMessage();
            throw new UniqueConstraintViolationException("validation", message);
        }
    }

    private List<LabWorkRequestDto> parse(MultipartFile file) {
        try {
            byte[] bytes = file.getBytes();
            if (bytes.length == 0) {
                throw new IllegalArgumentException("File is empty");
            }
            return objectMapper.readValue(
                    bytes, new TypeReference<List<LabWorkRequestDto>>() {
                    });
        } catch (IOException e) {
            throw new IllegalArgumentException("Failed to parse file: " + e.getMessage(), e);
        }
    }
}
