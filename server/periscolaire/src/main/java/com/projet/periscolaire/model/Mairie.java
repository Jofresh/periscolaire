package com.projet.periscolaire.model;

import javax.persistence.Entity;
import javax.persistence.DiscriminatorValue;

@Entity
@DiscriminatorValue("1")
public class Mairie extends User {
	public Mairie() { 
		super();
	}
	
	public Mairie(String username, String password, String prenom, String nom, String mail, String address) {
		super(username, password, prenom, nom, mail, address);
	}

	@Override
	public String toString() {
		return "Mairie [toString()=" + super.toString() + "]";
	}
	
	
}
