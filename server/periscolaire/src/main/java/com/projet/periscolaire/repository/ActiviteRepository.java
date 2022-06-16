package com.projet.periscolaire.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.projet.periscolaire.model.Activite;
import com.projet.periscolaire.model.Enfant;

@Repository
public interface ActiviteRepository extends JpaRepository<Activite, Long> {
	@Query(value = "select a from Activite a join a.inscriptions i where i.enfant = :_enfant")
	public List<Activite> _findActivitesByEnfant(@Param("_enfant") Enfant _enfant);
}
