package com.example.product_service.controller;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class FileUtils {
    private static final String UPLOAD_DIR = "C:/agriculture/uploads/image-product/";

    public static String saveImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            // Tạo thư mục nếu chưa có
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath, file.getBytes());

            return  fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }
    public static void deleteImage(String filename) {
        Path imagePath = Paths.get(UPLOAD_DIR, filename);
        try {
            if (Files.exists(imagePath)) {
                Files.delete(imagePath);
                System.out.println("Deleted old image: " + imagePath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete old image file: " + filename, e);
        }
    }
}
