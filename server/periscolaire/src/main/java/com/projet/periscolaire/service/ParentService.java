package com.projet.periscolaire.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projet.periscolaire.model.Enfant;
import com.projet.periscolaire.model.Parent;
import com.projet.periscolaire.repository.ParentRepository;

@Service
public class ParentService {
	@Autowired
	private ParentRepository parentRepository;
	
	// Read
	public Parent getById(Long id) {
		return parentRepository.getById(id);
	}	
	
	public List<Parent> findAll() {
		return parentRepository.findAll();
	}
	
	public List<Enfant> findEnfantsByParent(Long id) {
		return getById(id).getEnfants();
	}
	
	public Parent save(Parent parent) {
		return parentRepository.save(parent);
	}
}

