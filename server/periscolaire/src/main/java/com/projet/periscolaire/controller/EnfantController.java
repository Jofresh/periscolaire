package com.projet.periscolaire.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projet.periscolaire.dto.EnfantDTO;
import com.projet.periscolaire.model.Activite;
import com.projet.periscolaire.model.Enfant;
//import com.projet.periscolaire.model.Parent;
import com.projet.periscolaire.service.ActiviteService;
import com.projet.periscolaire.service.EnfantService;
//import com.projet.periscolaire.service.ParentService;

//Errors not handled at all
@RestController
@CrossOrigin(origins="http://localhost:8081")
@RequestMapping("/enfants")
public class EnfantController {
	@Autowired
	private EnfantService enfantService;
	
	@Autowired
	private ActiviteService activiteService;
	
	@GetMapping // unused
	public ResponseEntity<List<Enfant>> getEnfants() {
		return new ResponseEntity<>(enfantService.getEnfants(), HttpStatus.OK);
	}
	
	@GetMapping("/{id}/activites")
	public ResponseEntity<List<Activite>> getActivitesByEnfant(@PathVariable(value="id") Long id) {
		return new ResponseEntity<>(activiteService.getActivitesByEnfant(enfantService.getById(id)), HttpStatus.OK);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Long> deleteEnfant(@PathVariable(value="id") Long id) {
		if (enfantService.getById(id) != null) {
			enfantService.deleteById(id);
			return new ResponseEntity<>(id, HttpStatus.OK);
		}
		
		return new ResponseEntity<>(id, HttpStatus.NOT_FOUND);
	}
	
	@PutMapping("/{id}") // voir dto.EnfantDTO
	public ResponseEntity<Enfant> updateEnfant(@PathVariable(value="id") Long id, @RequestBody EnfantDTO enfantForm) {
		Enfant enfant = enfantService.getById(id);
		enfant.setName(enfantForm.getName());
		enfant.setFirstName(enfantForm.getFirstName());
		enfant.setDateBirth(enfantForm.getDateBirth());
		
		return new ResponseEntity<>(enfantService.save(enfant), HttpStatus.OK);
	}
}
