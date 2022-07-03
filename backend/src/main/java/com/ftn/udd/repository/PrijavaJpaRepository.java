package com.ftn.udd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ftn.udd.model.Prijava;

@Repository
public interface PrijavaJpaRepository extends JpaRepository<Prijava, Long> {

}
