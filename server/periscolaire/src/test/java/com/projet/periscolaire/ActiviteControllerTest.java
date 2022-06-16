package com.projet.periscolaire;

import static org.hamcrest.CoreMatchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class ActiviteControllerTest {
	@Autowired
	public MockMvc mockMvc;
	
	@Test
	public void testGetActivites() throws Exception {
		mockMvc.perform(get("/activites"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$[0].id", is(1)));
	}
}
