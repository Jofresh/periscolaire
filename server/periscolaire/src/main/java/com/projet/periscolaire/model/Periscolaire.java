package com.projet.periscolaire.model;

import javax.persistence.Entity;
import javax.persistence.DiscriminatorValue;

@Entity
@DiscriminatorValue("2")
public class Periscolaire extends User {
	
	public Periscolaire() { 
		super();
	}

	public Periscolaire(String username, String password, String prenom, String nom, String mail, String address) {
		super(username, password, prenom, nom, mail, address);
	}

	@Override
	public String toString() {
		return "Periscolaire [toString()=" + super.toString() + "]";
	}
	
}
