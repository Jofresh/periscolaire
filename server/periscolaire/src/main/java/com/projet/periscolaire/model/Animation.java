package com.projet.periscolaire.model;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.ManyToMany;
import javax.persistence.JoinTable;
import javax.persistence.JoinColumn;

import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name="ANIMATION")
public class Animation {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="ID")
	private Long id;

	@Column(name="TITRE")
	private String titre;

	@Column(name="DESCRIPTION")
	private String description;
	
	@JsonIgnore
	@ManyToMany(fetch=FetchType.LAZY)
	@JoinTable (name="ActiviteAnimationAssociation",
				joinColumns=@JoinColumn(name="ID_ANIMATION"),
				inverseJoinColumns=@JoinColumn(name="ID_ACTIVITE"))
	private List<Activite> activites = new ArrayList<>();
	
	public Animation() {
		
	}
	
	public Animation(String titre, String description) {
		this.titre = titre;
		this.description = description;
	}

	public Long getId() {
		return id;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public String getTitre() {
		return titre;
	}
	
	public void setTitre(String titre) {
		this.titre = titre;
	}
	
	public String getDescription() {
		return description;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}
	
	public List<Activite> getActivites() {
		return activites;
	}

	public void setActivites(List<Activite> activites) {
		this.activites = activites;
	}

	@Override
	public String toString() {
		return "Animation [id=" + id + ", titre=" + titre + ", description=" + description + "]";
	}
}

