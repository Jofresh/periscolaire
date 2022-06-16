package com.projet.periscolaire.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projet.periscolaire.model.Enfant;
import com.projet.periscolaire.model.Inscription;
import com.projet.periscolaire.model.Parent;
import com.projet.periscolaire.model.Activite;
import com.projet.periscolaire.repository.EnfantRepository;

@Service
public class EnfantService {
	@Autowired
	private EnfantRepository enfantRepository;
	
	// Read
	public List<Enfant> getEnfants() {
		return enfantRepository.findAll();
	}
	
	public List<Enfant> getEnfantsByParent(Parent parent) {
		return enfantRepository.findByParent(parent);
	}
	
	public List<Enfant> getEnfantsByActivite(Activite activite) {
		return enfantRepository._findEnfantsByActivite(activite);
	}
	
	public Enfant getById(Long id) {
		return enfantRepository.getById(id);
	}
	
	public List<Activite> getActivitesByEnfant(Long id) {
		List<Inscription> inscriptions = getById(id).getInscriptions();
		List<Activite> activites = new ArrayList<>();
		for (Inscription i: inscriptions)
			activites.add(i.getActivite());
		
		return activites;
	}
	
	// Create
	public Enfant save(Enfant enfant) {
		return enfantRepository.save(enfant);
	}
	
	// Update
	
	// Delete
	public void deleteById(Long id) {
		enfantRepository.deleteById(id);
	}
}
