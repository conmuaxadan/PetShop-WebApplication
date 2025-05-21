package com.example.product_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PageResponse<T>  implements Serializable {
    int currentPage;
    int totalPages;
    long totalElements;
    List<T> elements;
}
