package com.example.Identity_Service;

import com.example.Identity_Service.exception.AppException;
import com.example.Identity_Service.exception.ErrorCode;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

public class FileUtils {
    private static final String UPLOAD_DIR = "C:/agriculture/uploads/avatar/";

    public static String saveImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_FILE);
        }

        if (file.getSize() > 5 * 1024 * 1024) { // Giới hạn 5MB
            throw new AppException(ErrorCode.FILE_TOO_LARGE);
        }

        if (!List.of("image/png", "image/jpeg").contains(file.getContentType())) {
            throw new AppException(ErrorCode.INVALID_FILE_TYPE);
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

            return "/avatar/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }
}
