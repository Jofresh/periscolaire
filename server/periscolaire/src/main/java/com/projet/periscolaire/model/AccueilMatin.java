package com.projet.periscolaire.model;

import javax.persistence.Entity;

import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.persistence.DiscriminatorValue;

import java.util.Date;

@JsonTypeName("matin")
@Entity
@DiscriminatorValue("1")
public class AccueilMatin extends Activite {
	public AccueilMatin() {
		super();
	}
	
	public AccueilMatin(String titre, String description, Date dateDebut, Date dateFin, Boolean status, int prix) {
		super(titre, description, dateDebut, dateFin, status, prix);
	}

	@Override
	public String toString() {
		return "AccueilMatin [toString()=" + super.toString() + "]";
	}
}

