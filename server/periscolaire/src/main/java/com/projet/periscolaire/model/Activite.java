package com.projet.periscolaire.model;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Column;
import javax.persistence.OneToMany;
import javax.persistence.ManyToMany;
import javax.persistence.JoinTable;
import javax.persistence.JoinColumn;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
    @JsonSubTypes.Type(value = AccueilMatin.class, name = "matin"),
    @JsonSubTypes.Type(value = AccueilSoir.class, name = "soir")
})
@Entity
@Inheritance(strategy=InheritanceType.SINGLE_TABLE )
@DiscriminatorColumn(name="ID_TYPE_ACTIVITE", discriminatorType=DiscriminatorType.INTEGER)
@Table(name="ACTIVITE")
public abstract class Activite {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="ID")
	private Long id;
	
	@Column(name="TITRE")
	private String titre;
	
	@Column(name="DESCRIPTION")
	private String description;
	
	@Column(name="DATE_DEBUT")
	private Date dateDebut;
	
	@Column(name="DATE_FIN")
	private Date dateFin;
	
	@Column(name="STATUS")
	private Boolean status;
	
	@Column(name="PRIX")
	private int prix;
	
	@JsonIgnore
	@OneToMany(targetEntity=Inscription.class, mappedBy="activite", fetch=FetchType.LAZY)
	private List<Inscription> inscriptions = new ArrayList<>();
	
	@JsonIgnore
	@ManyToMany(fetch=FetchType.LAZY)
	@JoinTable (name="ActiviteAnimationAssociation",
				joinColumns=@JoinColumn(name="ID_ACTIVITE"),
				inverseJoinColumns=@JoinColumn(name="ID_ANIMATION"))
	private List<Animation> animations = new ArrayList<>();
	
	public Activite() {
		
	}
	
	public Activite(String titre, String description, Date dateDebut, Date dateFin, Boolean status, int prix) {
		this.titre = titre;
		this.description = description;
		this.dateDebut = dateDebut;
		this.dateFin = dateFin;
		this.status = status;
		this.prix = prix;
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

	public Date getDateDebut() {
		return dateDebut;
	}

	public void setDateDebut(Date dateDebut) {
		this.dateDebut = dateDebut;
	}

	public Date getDateFin() {
		return dateFin;
	}

	public void setDateFin(Date dateFin) {
		this.dateFin = dateFin;
	}
	
	public Boolean getStatus() {
		return status;
	}

	public void setStatus(Boolean status) {
		this.status = status;
	}

	public int getPrix() {
		return prix;
	}

	public void setPrix(int prix) {
		this.prix = prix;
	}

	public List<Inscription> getInscriptions() {
		return inscriptions;
	}

	public void setInscriptions(List<Inscription> inscriptions) {
		this.inscriptions = inscriptions;
	}

	public List<Animation> getAnimations() {
		return animations;
	}

	public void setAnimations(List<Animation> animations) {
		this.animations = animations;
	}
	
	@Override
	public String toString() {
		return "Activite [id=" + id + ", titre=" + titre + ", description=" + description + ", dateDebut=" + dateDebut
				+ ", dateFin=" + dateFin + ", status=" + status + ", prix=" + prix + "]";
	}
}

