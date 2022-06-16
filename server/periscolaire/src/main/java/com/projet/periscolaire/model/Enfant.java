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
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name="ENFANT")
public class Enfant {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="ID")
	private Long id;
	
	@Column(name="FIRST_NAME")
	private String firstName;
	
	@Column(name="NAME")
	private String name;
	
	@Column(name="DATE_BIRTH")
	@Temporal(TemporalType.DATE)
	private Date dateBirth;
	
	@JsonIgnore
	@ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="ID_PARENT", nullable=false)
	private Parent parent;
	
	@JsonIgnore
	@OneToMany (targetEntity=Inscription.class, mappedBy="enfant", fetch=FetchType.LAZY, cascade=CascadeType.ALL)
	private List<Inscription> inscriptions = new ArrayList<>();

	public Enfant() { }
	
	public Enfant(String firstName, String name, Date dateBirth) {
		this.firstName = firstName;
		this.name = name;
		this.dateBirth = dateBirth;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getDateBirth() {
		return dateBirth;
	}

	public void setDateBirth(Date dateBirth) {
		this.dateBirth = dateBirth;
	}
	
	public Parent getParent() {
		return parent;
	}

	public void setParent(Parent parent) {
		this.parent = parent;
	}

	public List<Inscription> getInscriptions() {
		return inscriptions;
	}

	public void setInscriptions(List<Inscription> inscriptions) {
		this.inscriptions = inscriptions;
	}
	
	@Override
	public String toString() {
		return "Enfant [id=" + id + ", firstName=" + firstName + ", name=" + name + ", dateBirth=" + dateBirth + "]";
	}
}
