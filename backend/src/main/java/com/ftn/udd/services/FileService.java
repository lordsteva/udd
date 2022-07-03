package com.ftn.udd.services;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileService {
    private final Path root = Paths.get("files");

    public void init() {
        try {
            Files.createDirectory(root);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    public void save(MultipartFile file, String name) {
        try {
            InputStream p1 = file.getInputStream();
            var p3 = this.root.resolve(name);
            Files.copy(p1, p3, StandardCopyOption.REPLACE_EXISTING);
            p1 = file.getInputStream();
            Files.copy(p1, p3, StandardCopyOption.REPLACE_EXISTING);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    public File load(String filename) {
        return root.resolve(filename).toFile();
    }

}
