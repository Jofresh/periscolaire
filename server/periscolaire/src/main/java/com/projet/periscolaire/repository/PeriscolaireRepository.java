package com.projet.periscolaire.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.projet.periscolaire.model.Periscolaire;

@Repository
public interface PeriscolaireRepository extends JpaRepository<Periscolaire, Long>{
	
}
