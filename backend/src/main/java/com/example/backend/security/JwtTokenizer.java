package com.example.backend.security;

import com.example.backend.Config.SecurityProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;

@Component
public class JwtTokenizer {

    private final SecurityProperties securityProperties;

    public JwtTokenizer(SecurityProperties securityProperties) {
        this.securityProperties = securityProperties;
    }

    public String getAuthToken(String user, List<String> roles) {
        byte[] signingKey = securityProperties.getJwtSecret().getBytes();
        String token = Jwts.builder()
                .signWith(Keys.hmacShaKeyFor(signingKey), SignatureAlgorithm.HS512)
                .setHeaderParam("typ", securityProperties.getJwtType())
                .setIssuer(securityProperties.getJwtIssuer())
                .setAudience(securityProperties.getJwtAudience())
                .setSubject(user)
                .setExpiration(new Date(System.currentTimeMillis() + securityProperties.getJwtExpirationTime()))
                .claim("rol", roles)
                .compact();
        return securityProperties.getAuthTokenPrefix() + token;
    }

    public String getEmailFromToken(String authToken) {
        try {
            String tokenWithoutPrefix = authToken.replace(securityProperties.getAuthTokenPrefix(), "");
            Claims claims = Jwts.parser()
                    .setSigningKey(securityProperties.getJwtSecret().getBytes())
                    .build()
                    .parseClaimsJws(tokenWithoutPrefix)
                    .getBody();
            return claims.getSubject();
        } catch (JwtException | IllegalArgumentException e) {
            throw new RuntimeException("Failed to retrieve email from token", e);
        }
    }
}

