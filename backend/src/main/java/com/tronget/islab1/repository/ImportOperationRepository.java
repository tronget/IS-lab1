package com.tronget.islab1.repository;

import com.tronget.islab1.models.ImportOperation;
import com.tronget.islab1.models.UserAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImportOperationRepository extends JpaRepository<ImportOperation, Long> {
    Page<ImportOperation> findAllByUser(UserAccount user, Pageable pageable);
}
