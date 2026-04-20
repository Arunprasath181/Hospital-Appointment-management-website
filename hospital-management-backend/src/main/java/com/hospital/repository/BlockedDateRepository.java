package com.hospital.repository;

import com.hospital.entity.BlockedDate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface BlockedDateRepository extends JpaRepository<BlockedDate, Long> {
    List<BlockedDate> findByDoctorIdAndBlockedDate(Long doctorId, LocalDate date);

    List<BlockedDate> findByDoctorId(Long doctorId);
}
