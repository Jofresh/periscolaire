package com.projet.periscolaire.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.projet.periscolaire.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	User findByUsernameAndPassword(String username, String password);
	User findByUsername(String username);
	User findByMail(String mail);
}
