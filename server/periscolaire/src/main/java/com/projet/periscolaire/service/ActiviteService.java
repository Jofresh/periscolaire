package com.projet.periscolaire.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projet.periscolaire.model.Activite;
import com.projet.periscolaire.model.Enfant;
import com.projet.periscolaire.repository.ActiviteRepository;

@Service
public class ActiviteService {
	@Autowired
	private ActiviteRepository activiteRepository;
	
	// Read
	public List<Activite> findAll() {
		return activiteRepository.findAll();
	}
	
	public List<Activite> getActivitesByEnfant(Enfant enfant) {
		return activiteRepository._findActivitesByEnfant(enfant);
	}
	
	public Activite getById(Long id) {
		return activiteRepository.getById(id);
	}
	
	// Create
	public Activite addActivite(Activite activite) {
		return activiteRepository.save(activite);
	}
	
	// Delete
	public void deleteById(Long id) {
		activiteRepository.deleteById(id);;
	}
}
