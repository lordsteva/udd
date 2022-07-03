package com.ftn.udd.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Path;
import java.rmi.server.UID;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Optional;
import java.util.Random;

import org.apache.pdfbox.cos.COSDocument;
import org.apache.pdfbox.io.RandomAccessFile;
import org.apache.pdfbox.pdfparser.PDFParser;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.elasticsearch.common.geo.GeoPoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ftn.udd.model.Prijava;
import com.ftn.udd.model.PrijavaIndexed;
import com.ftn.udd.repository.PrijavaElasticRepository;
import com.ftn.udd.repository.PrijavaJpaRepository;
import com.ftn.udd.services.FileService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class Indexing {

    private static final Logger logger = LoggerFactory.getLogger(Indexing.class);

    @Autowired
    private FileService fileService;
    @Autowired
    private PrijavaJpaRepository prijavaJpaRepository;
    @Autowired
    private PrijavaElasticRepository prijavaElasticRepository;

    private String[] cities = { "NoviSad", "Beograd", "Subotica", "Nis", "Sombor", "Kragujevac", "Kraljevo", "Valjevo",
            "Vranje", "KosovskaMitrovica", "Krusevac", "Sid", "Leskovac", "Vrbas", "Ruma" };

    private Random rand = new Random();

    @GetMapping("/log")
    public ResponseEntity<Boolean> log() {
        logger.info("Example log from {}", Indexing.class.getSimpleName());
        int city = rand.nextInt(cities.length);
        Calendar c = Calendar.getInstance();
        c.setTime(new Date());
        c.add(Calendar.HOUR_OF_DAY, rand.nextInt(24));
        c.getTime().toString();
        SimpleDateFormat DateFor = new SimpleDateFormat("HH:mm:ss");
        logger.info("PRISTUP " + DateFor.format(c.getTime()) + " " + cities[city]);
        return ResponseEntity.ok(true);
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<Prijava> formView(@PathVariable("id") Long id) {
        Optional<Prijava> p = prijavaJpaRepository.findById(id);
        return ResponseEntity.ok(p.get());
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<InputStreamResource> downloadPdf(@PathVariable("id") String id) throws FileNotFoundException {

        File file = fileService.load(id);
        HttpHeaders respHeaders = new HttpHeaders();
        MediaType mediaType = MediaType.parseMediaType("application/pdf");
        respHeaders.setContentType(mediaType);
        respHeaders.setContentLength(file.length());
        InputStreamResource isr = new InputStreamResource(new FileInputStream(file));
        return new ResponseEntity<InputStreamResource>(isr, respHeaders, HttpStatus.OK);
    }

    @PostMapping("/cv/")
    public ResponseEntity<String> apply(
            @RequestParam("ime") String ime,
            @RequestParam("prezime") String prezime,
            // @RequestParam("dateOfBirth") Date dateOfBirth,
            @RequestParam("adresa") String adresa,
            @RequestParam("email") String email,
            @RequestParam("sprema") Long sprema,
            // @RequestParam("workingExperience") Integer workingExperience,
            @RequestParam("cv") MultipartFile cv,
            @RequestParam("pismo") MultipartFile pismo) {

        try {
            Prijava prijava = new Prijava();
            prijava.setIme(ime);
            prijava.setPrezime(prezime);
            prijava.setAdresa(adresa);
            prijava.setEmail(email);
            prijava.setStrucnaSprema(sprema);

            // GeoPoint geoPoint = new GeoPoint(Double.parseDouble(geoPointLat),
            // Double.parseDouble(geoPointLon));

            String pismoFile = new UID().toString() + ".pdf";
            String cvFile = new UID().toString() + ".pdf";

            fileService.save(pismo, pismoFile);
            fileService.save(cv, cvFile);

            String pismoText = getText(pismoFile);

            ObjectMapper objectMapper = new ObjectMapper();

            RestTemplate restTemplate = new RestTemplate();
            String url = "https://geocode.search.hereapi.com/v1/geocode?q=" + adresa
                    + "&apiKey=D_2BiIm6H_HmaAliNIUfl02zlmPQ6Zmee6CmI70w-hQ";
            ResponseEntity<String> response = restTemplate.getForEntity(url,
                    String.class);
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            System.out.println(rootNode);
            JsonNode loc = rootNode.path("items");
            JsonNode locatedNode = (loc.get(0)).path("position");
            double lat = locatedNode.get("lat").doubleValue();
            double lng = locatedNode.get("lng").doubleValue();

            Prijava p = new Prijava();
            p.setAdresa(adresa);
            p.setCv(cvFile);
            p.setEmail(email);
            p.setIme(ime);
            p.setPismo(pismoFile);
            p.setPrezime(prezime);
            p.setStrucnaSprema(sprema);

            prijavaJpaRepository.saveAndFlush(p);

            PrijavaIndexed prijavaIndexed = new PrijavaIndexed();

            prijavaIndexed.setGeoPoint(new GeoPoint(lat, lng));
            prijavaIndexed.setId(p.getId());
            prijavaIndexed.setIme(ime);
            prijavaIndexed.setPrezime(prezime);
            prijavaIndexed.setStrucnaSprema(sprema);
            prijavaIndexed.setPismo(pismoText);
            prijavaElasticRepository.save(prijavaIndexed);

            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    private String getText(String file) throws FileNotFoundException, IOException {

        Path filepath = Path.of("files");

        File f = new File(filepath + "/" + file);
        PDFParser parser = new PDFParser(new RandomAccessFile(f, "r"));
        parser.parse();
        COSDocument cosDoc = parser.getDocument();
        PDFTextStripper pdfStripper = new PDFTextStripper();
        PDDocument pdDoc = new PDDocument(cosDoc);
        String parsedText = pdfStripper.getText(pdDoc);
        cosDoc.close();
        return parsedText;
    }

}