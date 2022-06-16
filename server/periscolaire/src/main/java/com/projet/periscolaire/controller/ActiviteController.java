package com.projet.periscolaire.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projet.periscolaire.model.Activite;
import com.projet.periscolaire.model.Enfant;
import com.projet.periscolaire.model.Inscription;
import com.projet.periscolaire.service.ActiviteService;
import com.projet.periscolaire.service.EnfantService;
import com.projet.periscolaire.service.InscriptionService;

// Errors not handled at all
@RestController
@CrossOrigin(origins="http://localhost:8081")
@RequestMapping("/activites")
public class ActiviteController {
	@Autowired
	private ActiviteService activiteService;
	
	@Autowired
	private EnfantService enfantService;
	
	@Autowired
	private InscriptionService inscriptionService;
	
	@GetMapping // unused
	public ResponseEntity<List<Activite>> getActivites() {
		List<Activite> activites = activiteService.findAll();
		
		
		return new ResponseEntity<>(activites, !activites.isEmpty() ? HttpStatus.OK : HttpStatus.NO_CONTENT);
	}
	
	@GetMapping("/{id}/enfants")
	public ResponseEntity<List<Enfant>> getEnfantsByActivite(@PathVariable(value="id") Long id) {
		return new ResponseEntity<>(enfantService.getEnfantsByActivite(activiteService.getById(id)), HttpStatus.OK);
	}
	
	// Empty body but still POST method
	@PostMapping("/{idActivite}/enfants/{idEnfant}")
	public ResponseEntity<Inscription> inscrireEnfant(
			@PathVariable(value="idActivite") Long idActivite, 
			@PathVariable(value="idEnfant") Long idEnfant) {
		return new ResponseEntity<>(inscriptionService.save(activiteService.getById(idActivite), enfantService.getById(idEnfant)), HttpStatus.OK);
	}
	
	@DeleteMapping("/{idActivite}/enfants/{idEnfant}")
	public ResponseEntity<Long> desinscrireEnfant(
			@PathVariable(value="idActivite") Long idActivite, 
			@PathVariable(value="idEnfant") Long idEnfant) {
		Activite a = activiteService.getById(idActivite);
		Enfant e = enfantService.getById(idEnfant);
		
		Inscription i = inscriptionService.find(a, e);
		long id = i.getId();
		inscriptionService.deleteById(id);
		
		return new ResponseEntity<>(id, HttpStatus.OK);
	}
	
	@PostMapping
	public ResponseEntity<Activite> addActivite(@RequestBody Activite activite) {
		Activite a = activiteService.addActivite(activite);
		return new ResponseEntity<>(a, HttpStatus.OK);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Activite> updateActivite(@RequestBody Activite activite) {
		Activite a = activiteService.addActivite(activite);
		return new ResponseEntity<>(a, HttpStatus.OK);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Long> deleteActivite(@PathVariable(value="id") Long id) {
		activiteService.deleteById(id);
		return new ResponseEntity<>(id, HttpStatus.OK);
	}
}
