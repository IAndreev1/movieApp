package com.example.backend.Entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

import java.util.List;


@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private String name;
    @Column
    private boolean sold;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column
    private Double price;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private ApplicationUser user;
    @Lob
    private byte[] imageData;
    @OneToMany(cascade = CascadeType.REMOVE)
    private List<Bet> bets;


    public void setSold(boolean sold) {
        this.sold = sold;
    }


    public Long getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public String getName() {
        return name;
    }

    public byte[] getImageData() {
        return imageData;
    }

    public Double getPrice() {
        return price;
    }

    public ApplicationUser getUser() {
        return user;
    }

    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setUser(ApplicationUser user) {
        this.user = user;
    }

    public List<Bet> getBets() {
        return bets;
    }
    public boolean getSold(){
        return sold;
    }
}
