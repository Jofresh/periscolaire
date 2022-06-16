package com.projet.periscolaire.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projet.periscolaire.dto.EnfantDTO;
import com.projet.periscolaire.dto.UserDTO;
import com.projet.periscolaire.model.Enfant;
import com.projet.periscolaire.model.Parent;
import com.projet.periscolaire.service.EnfantService;
import com.projet.periscolaire.service.ParentService;

//Errors not handled at all
@RestController
@CrossOrigin(origins="http://localhost:8081")
@RequestMapping("/parents")
public class ParentController {
	@Autowired
	private ParentService parentService;
	
	@Autowired
	private EnfantService enfantService;
	
	@GetMapping // unused
	public ResponseEntity<List<Parent>> getParents() {
		return new ResponseEntity<>(parentService.findAll(), HttpStatus.OK);
	}
	
	@GetMapping("/{id}/enfants")
	public ResponseEntity<List<Enfant>> getEnfantsByParent(@PathVariable(value="id") Long id) {
		return new ResponseEntity<>(parentService.findEnfantsByParent(id), HttpStatus.OK);
	}
	
	@PostMapping("/{id}/enfants")
	public ResponseEntity<Enfant> saveEnfant(@PathVariable(value="id") Long id, @RequestBody EnfantDTO enfantDTO) {
		Enfant enfant = new Enfant(
				enfantDTO.getFirstName(),
				enfantDTO.getName(),
				enfantDTO.getDateBirth());
		
		Parent parent = parentService.getById(id);
		enfant.setParent(parent);
		
		return new ResponseEntity<>(enfantService.save(enfant), HttpStatus.OK);
	}
	
	@PostMapping // see dto.UserDTO
	public ResponseEntity<Parent> createCompteParent(@RequestBody UserDTO parentForm) {
		Parent parent = new Parent(
				parentForm.getUsername(), 
				parentForm.getPassword(), 
				parentForm.getFirstName(), 
				parentForm.getName(), 
				parentForm.getMail(), 
				parentForm.getAddress());
		
		return new ResponseEntity<>(parentService.save(parent), HttpStatus.OK);
	}
	
	
}
