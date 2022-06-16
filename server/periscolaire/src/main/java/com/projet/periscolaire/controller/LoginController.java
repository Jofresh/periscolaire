package com.projet.periscolaire.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.projet.periscolaire.dto.LoginDTO;
import com.projet.periscolaire.model.User;
import com.projet.periscolaire.service.UserService;

//Errors not handled at all
// PASSWORD NOT ENCRYPTED
@RestController
@CrossOrigin(origins="http://localhost:8081")
public class LoginController {
	@Autowired
	private UserService userService;
	
	@PostMapping("/signin")
	public ResponseEntity<User> login(@RequestBody LoginDTO loginForm) {
		User u = userService.getUserByUsernameAndPassword(loginForm.getUsername(), loginForm.getPassword());
		return new ResponseEntity<>(u, (u != null) ? HttpStatus.OK : HttpStatus.NO_CONTENT);
	}
}
