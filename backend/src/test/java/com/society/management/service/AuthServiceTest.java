package com.society.management.service;

import com.society.management.dto.AuthResponseDto;
import com.society.management.dto.LoginRequestDto;
import com.society.management.dto.RegisterRequestDto;
import com.society.management.entity.Role;
import com.society.management.entity.Society;
import com.society.management.entity.User;
import com.society.management.exception.BadRequestException;
import com.society.management.repository.SocietyRepository;
import com.society.management.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private SocietyRepository societyRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private ActivityService activityService;

    @Mock
    private OtpService otpService;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;
    private Society sampleSociety;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .name("Rajesh Sharma")
                .email("rajesh@greenvalleyresidency.in")
                .phone("+919825011223")
                .password("encoded_password")
                .role(Role.ROLE_ADMIN)
                .societyId("soc-grv")
                .flatNumber("A-101")
                .active(true)
                .build();

        sampleSociety = Society.builder()
                .id("soc-grv")
                .name("Green Valley Residency")
                .subscriptionStatus("ACTIVE")
                .build();
    }

    @Test
    @DisplayName("Login Success: Authenticate with valid email and password")
    void testLogin_Success_WithEmail() {
        LoginRequestDto request = new LoginRequestDto("rajesh@greenvalleyresidency.in", "admin123");

        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(sampleUser, null, sampleUser.getAuthorities());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authToken);
        when(societyRepository.findById("soc-grv")).thenReturn(Optional.of(sampleSociety));
        when(jwtService.generateToken(anyMap(), eq(sampleUser))).thenReturn("mocked.jwt.token");

        AuthResponseDto response = authService.login(request);

        assertNotNull(response);
        assertEquals("mocked.jwt.token", response.getToken());
        assertEquals("rajesh@greenvalleyresidency.in", response.getEmail());
        assertEquals("ROLE_ADMIN", response.getRole());
        assertEquals("Green Valley Residency", response.getSocietyName());
        assertEquals("Login successful", response.getMessage());

        verify(authenticationManager, times(1)).authenticate(any());
        verify(jwtService, times(1)).generateToken(anyMap(), eq(sampleUser));
        verify(activityService, times(1)).logActivity(anyString(), anyString(), anyString(), anyString());
    }

    @Test
    @DisplayName("Login Success: Authenticate with mobile number identifier")
    void testLogin_Success_WithPhone() {
        LoginRequestDto request = new LoginRequestDto("+919825011223", "admin123");

        when(userRepository.findByPhone("+919825011223")).thenReturn(Optional.of(sampleUser));

        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(sampleUser, null, sampleUser.getAuthorities());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authToken);
        when(societyRepository.findById("soc-grv")).thenReturn(Optional.of(sampleSociety));
        when(jwtService.generateToken(anyMap(), eq(sampleUser))).thenReturn("mocked.jwt.token.phone");

        AuthResponseDto response = authService.login(request);

        assertNotNull(response);
        assertEquals("mocked.jwt.token.phone", response.getToken());
        assertEquals("rajesh@greenvalleyresidency.in", response.getEmail());
        verify(userRepository, times(1)).findByPhone("+919825011223");
    }

    @Test
    @DisplayName("Login Failure: Bad credentials throws BadCredentialsException")
    void testLogin_Failure_BadCredentials() {
        LoginRequestDto request = new LoginRequestDto("rajesh@greenvalleyresidency.in", "wrongpass");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
        verify(jwtService, never()).generateToken(anyMap(), any(User.class));
    }

    @Test
    @DisplayName("Register Success: Register new resident with encoded password")
    void testRegister_Success() {
        RegisterRequestDto request = RegisterRequestDto.builder()
                .name("Priya Patel")
                .email("priya@example.com")
                .password("password123")
                .role("ROLE_RESIDENT")
                .flatNumber("B-302")
                .build();

        when(userRepository.existsByEmail("priya@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("bcrypt_encoded_hash");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(2L);
            return u;
        });
        when(jwtService.generateToken(anyMap(), any(User.class))).thenReturn("registered.jwt.token");

        AuthResponseDto response = authService.register(request);

        assertNotNull(response);
        assertEquals("registered.jwt.token", response.getToken());
        assertEquals("priya@example.com", response.getEmail());
        assertEquals("ROLE_RESIDENT", response.getRole());
        assertEquals("User registered successfully", response.getMessage());

        verify(userRepository, times(1)).save(any(User.class));
        verify(passwordEncoder, times(1)).encode("password123");
    }

    @Test
    @DisplayName("Register Failure: Duplicate email throws BadRequestException")
    void testRegister_Failure_DuplicateEmail() {
        RegisterRequestDto request = RegisterRequestDto.builder()
                .name("Priya Patel")
                .email("existing@example.com")
                .password("password123")
                .build();

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }
}
