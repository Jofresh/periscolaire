package com.projet.periscolaire.model;

import javax.persistence.Entity;

import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.persistence.DiscriminatorValue;

import java.util.Date;

@JsonTypeName("soir")
@Entity
@DiscriminatorValue("2")
public class AccueilSoir extends Activite {
	public AccueilSoir() { 
		super();
	}
	
	public AccueilSoir(String titre, String description, Date dateDebut, Date dateFin, Boolean status, int prix) {
		super(titre, description, dateDebut, dateFin, status, prix);
	}

	@Override
	public String toString() {
		return "AccueilSoir [toString()=" + super.toString() + "]";
	}
}
