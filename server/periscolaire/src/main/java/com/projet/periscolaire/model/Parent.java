package com.projet.periscolaire.model;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.CascadeType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;
import java.util.ArrayList;

@Entity
@DiscriminatorValue("3")
public class Parent extends User {
	@JsonIgnore
	@OneToMany(targetEntity=Enfant.class, mappedBy="parent", fetch=FetchType.LAZY, cascade=CascadeType.ALL)
	private List<Enfant> enfants = new ArrayList<>();
	
	public Parent() { 
		super(); 
	}

	public Parent(String username, String password, String prenom, String nom, String mail, String address) {
		super(username, password, prenom, nom, mail, address);
	}
	
	public List<Enfant> getEnfants() {
		return enfants;
	}

	public void setEnfants(ArrayList<Enfant> enfants) {
		this.enfants = enfants;
	}

	@Override
	public String toString() {
		return "Parent [toString()=" + super.toString() + "]";
	}
}

