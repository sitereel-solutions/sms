package com.society.management.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.society.management.dto.AuthResponseDto;
import com.society.management.dto.LoginRequestDto;
import com.society.management.dto.RegisterRequestDto;
import com.society.management.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("API Test: POST /api/auth/login returns 200 OK with valid credentials")
    void testLoginEndpoint_Success() throws Exception {
        LoginRequestDto request = new LoginRequestDto("admin@greenvalleyresidency.in", "admin123");

        AuthResponseDto mockResponse = AuthResponseDto.builder()
                .token("jwt.sample.token")
                .id(1L)
                .name("Admin User")
                .email("admin@greenvalleyresidency.in")
                .role("ROLE_ADMIN")
                .societyId("soc-grv")
                .societyName("Green Valley Residency")
                .message("Login successful")
                .build();

        when(authService.login(any(LoginRequestDto.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt.sample.token"))
                .andExpect(jsonPath("$.email").value("admin@greenvalleyresidency.in"))
                .andExpect(jsonPath("$.role").value("ROLE_ADMIN"))
                .andExpect(jsonPath("$.message").value("Login successful"));

        verify(authService, times(1)).login(any(LoginRequestDto.class));
    }

    @Test
    @DisplayName("API Test: POST /api/auth/login returns 400 Bad Request when password is blank")
    void testLoginEndpoint_MissingPassword_ReturnsBadRequest() throws Exception {
        LoginRequestDto request = new LoginRequestDto("admin@greenvalleyresidency.in", "");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        verify(authService, never()).login(any());
    }

    @Test
    @DisplayName("API Test: POST /api/auth/register returns 201 Created")
    void testRegisterEndpoint_Success() throws Exception {
        RegisterRequestDto request = RegisterRequestDto.builder()
                .name("Kavita Rao")
                .email("kavita@greenvalleyresidency.in")
                .password("securePass123")
                .role("ROLE_RESIDENT")
                .flatNumber("C-401")
                .build();

        AuthResponseDto mockResponse = AuthResponseDto.builder()
                .token("jwt.sample.token")
                .id(2L)
                .name("Kavita Rao")
                .email("kavita@greenvalleyresidency.in")
                .role("ROLE_RESIDENT")
                .message("User registered successfully")
                .build();

        when(authService.register(any(RegisterRequestDto.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("jwt.sample.token"))
                .andExpect(jsonPath("$.email").value("kavita@greenvalleyresidency.in"))
                .andExpect(jsonPath("$.role").value("ROLE_RESIDENT"));

        verify(authService, times(1)).register(any(RegisterRequestDto.class));
    }
}
