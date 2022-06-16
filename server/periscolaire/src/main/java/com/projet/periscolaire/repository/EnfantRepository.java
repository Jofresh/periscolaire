package com.projet.periscolaire.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.projet.periscolaire.model.Activite;
import com.projet.periscolaire.model.Enfant;
import com.projet.periscolaire.model.Parent;

@Repository
public interface EnfantRepository extends JpaRepository<Enfant, Long> { 
	public List<Enfant> findByParent(Parent parent);
	
	@Query (value = "select e from Enfant e join e.inscriptions i where i.activite = :_activite")
	public List<Enfant> _findEnfantsByActivite(@Param("_activite") Activite _activite);
}
