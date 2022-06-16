package com.projet.periscolaire.model;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Column;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;

import java.util.Date;

@Entity
@Table(name="INSCRIPTION")
public class Inscription {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="ID")
	private Long id;
	
	@JsonIgnore
	@ManyToOne (fetch=FetchType.LAZY) @JoinColumn(name="ID_ENFANT", nullable=false)
	private Enfant enfant;
	
	@JsonIgnore
	@ManyToOne (fetch=FetchType.LAZY) @JoinColumn(name="ID_ACTIVITE", nullable=false)
	private Activite activite;
	
	@Column(name="DATE")
	@Temporal(TemporalType.DATE)
	private Date date;
	
	public Inscription() {
		
	}
	
	public Inscription(Enfant enfant, Activite activite) {
		this.enfant = enfant;
		this.activite = activite;
		this.date = new Date();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Enfant getEnfant() {
		return enfant;
	}

	public void setEnfant(Enfant enfant) {
		this.enfant = enfant;
	}

	public Activite getActivite() {
		return activite;
	}

	public void setActivite(Activite activite) {
		this.activite = activite;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	@Override
	public String toString() {
		return "Inscription [id=" + id + ", enfant=" + enfant + ", activite=" + activite + ", date=" + date + "]";
	}
}

