package com.ftn.udd.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Prijava {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String ime;
    private String email;
    private String prezime;
    private String adresa;
    private Long strucnaSprema;
    private String cv;
    private String pismo;

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIme() {
        return this.ime;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPrezime() {
        return this.prezime;
    }

    public void setPrezime(String prezime) {
        this.prezime = prezime;
    }

    public String getAdresa() {
        return this.adresa;
    }

    public void setAdresa(String adresa) {
        this.adresa = adresa;
    }

    public Long getStrucnaSprema() {
        return this.strucnaSprema;
    }

    public void setStrucnaSprema(Long strucnaSprema) {
        this.strucnaSprema = strucnaSprema;
    }

    public String getCv() {
        return this.cv;
    }

    public void setCv(String cv) {
        this.cv = cv;
    }

    public String getPismo() {
        return this.pismo;
    }

    public void setPismo(String pismo) {
        this.pismo = pismo;
    }
}