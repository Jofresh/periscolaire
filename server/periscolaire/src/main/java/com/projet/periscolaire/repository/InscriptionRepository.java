package com.projet.periscolaire.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.projet.periscolaire.model.Activite;
import com.projet.periscolaire.model.Enfant;
import com.projet.periscolaire.model.Inscription;

@Repository
public interface InscriptionRepository extends JpaRepository<Inscription, Long> {
	public Inscription findByActiviteAndEnfant(Activite activite, Enfant enfant);
}
