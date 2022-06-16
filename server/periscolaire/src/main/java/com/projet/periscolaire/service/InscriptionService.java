package com.projet.periscolaire.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projet.periscolaire.model.Activite;
import com.projet.periscolaire.model.Enfant;
import com.projet.periscolaire.model.Inscription;
import com.projet.periscolaire.repository.InscriptionRepository;

@Service
public class InscriptionService {
	@Autowired
	private InscriptionRepository inscriptionRepository;
	
	public Inscription save(Activite activite, Enfant enfant) {
		return inscriptionRepository.save(new Inscription(enfant, activite));
	}
	
	public Inscription find(Activite activite, Enfant enfant) {
		return inscriptionRepository.findByActiviteAndEnfant(activite, enfant);
	}
	
	public void deleteById(Long id) {
		inscriptionRepository.deleteById(id);
	}
}
