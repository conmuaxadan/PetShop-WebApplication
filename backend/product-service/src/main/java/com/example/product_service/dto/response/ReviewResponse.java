package com.example.product_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewResponse implements Serializable {
    long id_review;
    String content;
    int rating;
    String username;
    String avatar;
}
