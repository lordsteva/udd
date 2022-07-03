package com.ftn.udd.controller;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/search")
public class Search {

    @PostMapping("/geo/")
    public ResponseEntity<String> geoCode(@RequestBody Map<String, String> searchData)
            throws JsonMappingException, JsonProcessingException {

        ObjectMapper objectMapper = new ObjectMapper();

        RestTemplate restTemplate = new RestTemplate();
        String url = "https://geocode.search.hereapi.com/v1/geocode?q=" + searchData.get("adresa")
                + "&apiKey=D_2BiIm6H_HmaAliNIUfl02zlmPQ6Zmee6CmI70w-hQ";
        ResponseEntity<String> response = restTemplate.getForEntity(url,
                String.class);
        JsonNode rootNode = objectMapper.readTree(response.getBody());
        System.out.println(rootNode);
        JsonNode loc = rootNode.path("items");
        JsonNode locatedNode = (loc.get(0)).path("position");
        double lat = locatedNode.get("lat").doubleValue();
        double lng = locatedNode.get("lng").doubleValue();
        String query = "{\"query\":{\"bool\":{\"must\":{\"match_all\":{}},\"filter\":{\"geo_distance\":{\"distance\":\""
                + searchData.get("km") + "km\",\"geoPoint\":{\"lat\":" + lat + ",\"lon\":" + lng + "}}}}}}";

        String res = searchQuery(query);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/")
    public ResponseEntity<String> apply(@RequestBody Map<String, Object> searchData) throws JsonProcessingException {

        List<String> operators = (List<String>) searchData.get("operators");
        List<String> attributes = (List<String>) searchData.get("attributes");

        List<String> queries = attributes.stream().map(attr -> generateQuery(attr, searchData))
                .collect(Collectors.toList());

        String query = queries.get(0);

        for (int i = 0; i < operators.size(); i++) {
            String operator = operators.get(i);
            query = generateBoolQuery(query, queries.get(i + 1), operator);
        }

        String fields = "";
        List<String> ha = new LinkedList<String>();
        ha.add("ime");
        ha.add("prezime");
        ha.add("pismo");

        for (int i = 0; i < ha.size(); i++) {
            String a = ha.get(i);
            if (i != 0)
                fields += ",";
            fields += "\"" + a + "\":{}";

        }

        String hihglight = "\"highlight\": {\"fields\": {" + fields + "}}";
        query = "{\"query\":" + query + "," + hihglight + "}";
        System.out.println(query);
        String res = searchQuery(query);
        return ResponseEntity.ok(res);
    }

    private String generateBoolQuery(String query1, String query2, String operator) {
        String o = operator.equals("OR") ? "should" : "must";
        return "{\"bool\":{\"" + o + "\":[" + query1 + "," + query2 + "]}}";
    }

    private String generateQuery(String attribute, Map<String, Object> searchData) {
        if (attribute.equals("pismo"))
            return getPismoQuery((String) searchData.get("pismo"));
        else if (attribute.equals("ime"))
            return getNameQuery((String) searchData.get("ime"), (String) searchData.get("prezime"));
        else
            return getSpremaQuery(Long.parseLong((String) searchData.get("min")),
                    Long.parseLong((String) searchData.get("max")));

    }

    private String removeQuotes(String s) {
        String trimmed = s.substring(1);
        trimmed = trimmed.substring(0, trimmed.length() - 1);
        return trimmed;
    }

    public String searchQuery(String query) throws JsonProcessingException {

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonquery = objectMapper.readTree(query);

        RestTemplate restTemplate = new RestTemplate();
        HttpEntity<JsonNode> request = new HttpEntity<>(jsonquery);
        String url = "http://localhost:9200/prijava/_search?pretty";
        ResponseEntity<String> response = restTemplate.postForEntity(url, request,
                String.class);
        JsonNode rootNode = objectMapper.readTree(response.getBody());
        JsonNode locatedNode = rootNode.path("hits").path("hits");

        return locatedNode.toString();
    }

    private String getNameQuery(String ime, String prezime) {
        String matchOrPhraseIme = "match";
        if (ime.startsWith("\"") && ime.endsWith("\"")) {
            ime = removeQuotes(ime);
            matchOrPhraseIme = "match_phrase";
        }
        String matchOrPhrasePrezime = "match";
        if (prezime.startsWith("\"") && prezime.endsWith("\"")) {
            prezime = removeQuotes(prezime);
            matchOrPhrasePrezime = "match_phrase";
        }
        return "{\"bool\": {\"must\": [{\"" + matchOrPhraseIme
                + "\": {\"ime\": {\"zero_terms_query\": \"all\",\"query\":\"" + ime
                + "\"}}},{\"" + matchOrPhrasePrezime + "\": {\"prezime\": {\"zero_terms_query\": \"all\",\"query\":\""
                + prezime + "\"}}}]}}";
    }

    private String getPismoQuery(String tekst) {
        String matchOrPhrase = "match";
        if (tekst.startsWith("\"") && tekst.endsWith("\"")) {
            tekst = removeQuotes(tekst);
            matchOrPhrase = "match_phrase";
        }

        return "{\"" + matchOrPhrase + "\": {\"pismo\": \"" + tekst + "\"}}";
    }

    private String getSpremaQuery(Long min, Long max) {
        return "{\"range\": {\"strucnaSprema\": {\"gte\": " + min + ",\"lte\": " + max + "}}}";
    }

}