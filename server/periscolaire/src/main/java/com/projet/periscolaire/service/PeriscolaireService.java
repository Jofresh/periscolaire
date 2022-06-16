package com.projet.periscolaire.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projet.periscolaire.model.Periscolaire;
import com.projet.periscolaire.repository.PeriscolaireRepository;

@Service
public class PeriscolaireService {
	@Autowired
	private PeriscolaireRepository periscolaireRepository;
	
	public Periscolaire save(Periscolaire periscolaire) {
		return periscolaireRepository.save(periscolaire);
	}
}
