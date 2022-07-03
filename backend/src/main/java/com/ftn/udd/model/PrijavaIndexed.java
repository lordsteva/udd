package com.ftn.udd.model;

import org.elasticsearch.common.geo.GeoPoint;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.GeoPointField;

@Document(indexName = "prijava")
public class PrijavaIndexed {
    @Id
    public Long id;
    @Field(analyzer = "serbian", type = FieldType.Text)
    public String ime;
    @Field(analyzer = "serbian", type = FieldType.Text)

    public String prezime;
    public Long strucnaSprema;

    @Field(analyzer = "serbian", type = FieldType.Text)

    public String pismo;
    @GeoPointField
    private GeoPoint geoPoint;

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

    public String getPrezime() {
        return this.prezime;
    }

    public void setPrezime(String prezime) {
        this.prezime = prezime;
    }

    public Long getStrucnaSprema() {
        return this.strucnaSprema;
    }

    public void setStrucnaSprema(Long strucnaSprema) {
        this.strucnaSprema = strucnaSprema;
    }

    public String getPismo() {
        return this.pismo;
    }

    public void setPismo(String pismo) {
        this.pismo = pismo;
    }

    public GeoPoint getGeoPoint() {
        return this.geoPoint;
    }

    public void setGeoPoint(GeoPoint geoPoint) {
        this.geoPoint = geoPoint;
    }

}