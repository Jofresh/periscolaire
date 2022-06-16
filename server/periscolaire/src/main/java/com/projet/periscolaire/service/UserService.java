package com.projet.periscolaire.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projet.periscolaire.model.User;
import com.projet.periscolaire.repository.UserRepository;

@Service
public class UserService {
	@Autowired
	private UserRepository userRepository;
	
	// Read
	public User getUserByUsernameAndPassword(String username, String password) {
		return userRepository.findByUsernameAndPassword(username, password);
	}
	
	public User getUserByUsername(String username) {
		return userRepository.findByUsername(username);
	}
	
	public User getUserByMail(String mail) {
		return userRepository.findByMail(mail);
	}
	
	public User getById(Long id) {
		return userRepository.getById(id);
	}
	
	// Create/Update
	public User save(User user) {
		return userRepository.save(user);
	}
}
