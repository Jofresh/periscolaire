package com.projet.periscolaire.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.projet.periscolaire.model.Parent;

@Repository
public interface ParentRepository extends JpaRepository<Parent, Long> {

}
