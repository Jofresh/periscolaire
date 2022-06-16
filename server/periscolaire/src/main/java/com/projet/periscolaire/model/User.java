package com.projet.periscolaire.model;

import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Column;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
    @JsonSubTypes.Type(value = Parent.class, name = "parent"),
    @JsonSubTypes.Type(value = Mairie.class, name = "mairie"),
    @JsonSubTypes.Type(value = Periscolaire.class, name = "periscolaire"),
})
@Entity
@Inheritance(strategy=InheritanceType.SINGLE_TABLE )
@DiscriminatorColumn(name="ID_TYPE_USER", discriminatorType=DiscriminatorType.INTEGER)
@Table(name="user")
public abstract class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id")
	private Long id;
	
	@Column(name="username", unique=true)
	private String username;
	
	@Column(name="password")
	private String password;
	
	@Column(name="first_name")
	private String firstName;
	
	@Column(name="name")
	private String name;
	
	@Column(name="mail", unique=true)
	private String mail;
	
	@Column(name="address") 
	private String address;
	
	public User() { }
	
	public User(String username, String password, String firstName, String nom, String mail, String address) {
		this.username = username;
		this.password = password;
		this.firstName = firstName;
		this.name = nom;
		this.mail = mail;
		this.address = address;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
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

	public void setNom(String name) {
		this.name = name;
	}

	public String getMail() {
		return mail;
	}

	public void setMail(String mail) {
		this.mail = mail;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
	
	// used in svelte to print good components : (1 = <Mairie>, 2 = <Parent>, 3 = <Periscolaire>)
	@Transient
	public String getDiscriminatorValue() {
		return this.getClass().getAnnotation(DiscriminatorValue.class).value();
	}

	@Override
	public String toString() {
		return "Utilisateur [id=" + id + ", username=" + username + ", password=" + password + ", prenom=" + firstName
				+ ", nom=" + name + ", mail=" + mail + ", address=" + address + "]";
	}
}
