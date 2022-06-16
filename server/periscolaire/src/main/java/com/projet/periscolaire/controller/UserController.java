package com.projet.periscolaire.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projet.periscolaire.model.User;
import com.projet.periscolaire.service.UserService;

//Errors not handled at all
@RestController
@CrossOrigin(origins="http://localhost:8081")
@RequestMapping("/users")
public class UserController {
	@Autowired
	private UserService userService;
	
	@PutMapping("/{id}")
	public ResponseEntity<User> updateUser(@PathVariable(value="id") Long id, @RequestBody User newUser) {
		userService.save(newUser);
		return new ResponseEntity<>(id == newUser.getId() ? newUser : null, HttpStatus.OK);
	}
}
