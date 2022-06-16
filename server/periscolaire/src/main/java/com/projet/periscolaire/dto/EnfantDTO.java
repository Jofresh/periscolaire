package com.projet.periscolaire.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

//Figured out that I could use model instead of creating DTO
public class EnfantDTO {
	private String firstName;
	
	private String name;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	private Date dateBirth;

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
	
	
}
