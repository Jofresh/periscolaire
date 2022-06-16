package com.projet.periscolaire.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projet.periscolaire.dto.UserDTO;
import com.projet.periscolaire.model.Periscolaire;
import com.projet.periscolaire.service.PeriscolaireService;

//Errors not handled at all
@RestController
@CrossOrigin(origins="http://localhost:8081")
@RequestMapping("/periscolaire")
public class PeriscolaireController {
	@Autowired
	private PeriscolaireService periscolaireService;
	
	@PostMapping // see dto.UserDTO
	public ResponseEntity<Periscolaire> createComptePeriscolaire(@RequestBody UserDTO periscolaireForm) {
		Periscolaire periscolaire = new Periscolaire(
				periscolaireForm.getUsername(), 
				periscolaireForm.getPassword(), 
				periscolaireForm.getFirstName(), 
				periscolaireForm.getName(), 
				periscolaireForm.getMail(), 
				periscolaireForm.getAddress()
		);
		
		return new ResponseEntity<>(periscolaireService.save(periscolaire), HttpStatus.OK);
	}
}
