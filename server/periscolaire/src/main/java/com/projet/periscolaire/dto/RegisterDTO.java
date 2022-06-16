package com.projet.periscolaire.dto;

//Figured out that I could use model instead of creating DTO
public class RegisterDTO {
	private String username;
	private String mail;
	private String password;
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getMail() {
		return mail;
	}
	public void setMail(String email) {
		this.mail = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	
}
