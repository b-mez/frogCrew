package main.java.edu.tcu.cs.frogcrew.config;

import edu.tcu.cs.frogcrew.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private final CustomUserDetailsService customUserDetailsService;

    private final CustomBasicAuthenticationEntryPoint basicEntryPoint;

    private final CustomBearerTokenAuthenticationEntryPoint bearerEntryPoint;

    private final CustomBearerTokenAccessDeniedHandler bearerAccessDeniedHandler;

    public SecurityConfiguration(CustomUserDetailsService customUserDetailsService,
                                 CustomBasicAuthenticationEntryPoint basicEntryPoint,
                                 CustomBearerTokenAuthenticationEntryPoint bearerEntryPoint,
                                 CustomBearerTokenAccessDeniedHandler bearerAccessDeniedHandler) {
        this.customUserDetailsService = customUserDetailsService;
        this.basicEntryPoint = basicEntryPoint;
        this.bearerEntryPoint = bearerEntryPoint;
        this.bearerAccessDeniedHandler = bearerAccessDeniedHandler;
    }



    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(bearerEntryPoint)
                        .accessDeniedHandler(bearerAccessDeniedHandler)
                )
                .authorizeHttpRequests(authz -> authz
                        // open/free endpoints
                        .requestMatchers(HttpMethod.POST,  "/crew").permitAll()
                        .requestMatchers(HttpMethod.GET,   "/invite/**").permitAll()
                        .requestMatchers(HttpMethod.POST,  "/invite").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST,  "/crewMember").permitAll()

                        // viewing for both roles
                        .requestMatchers(HttpMethod.GET,   "/crewMember/**").hasAnyRole("ADMIN","USER")
                        .requestMatchers(HttpMethod.GET,   "/schedule/**").hasAnyRole("ADMIN","USER")
                        .requestMatchers(HttpMethod.GET,   "/crewSchedule/**").hasAnyRole("ADMIN","USER")

                        // admin-only modifications
                        .requestMatchers(HttpMethod.DELETE,"/crewMember/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST,  "/schedule").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/schedule/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,   "/crewSchedule/**").hasRole("ADMIN")

                        // everything else authenticated
                        .anyRequest().authenticated()
                )
                .httpBasic(b -> b.authenticationEntryPoint(basicEntryPoint))
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(Customizer.withDefaults())
                        .authenticationEntryPoint(bearerEntryPoint)
                        .accessDeniedHandler(bearerAccessDeniedHandler)
                );

        return http.build();
    }

    //Tell Spring Security to use your CustomUserDetailsService + BCrypt for Basic auth.
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }


     //Expose an AuthenticationManager that uses your DaoAuthenticationProvider.
     //This is what httpBasic() will delegate to under the hood.
    @Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        return http
                .getSharedObject(AuthenticationManagerBuilder.class)
                .authenticationProvider(authenticationProvider())
                .build();
    }

//    @Bean
//    public JwtDecoder jwtDecoder(RSAPublicKey publicKey) {
//        return NimbusJwtDecoder.withPublicKey(publicKey).build();
//    }

}