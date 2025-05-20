package com.example.product_service.service;

import com.example.event.dto.UpdateStockRequest;
import com.example.product_service.controller.FileUtils;
import com.example.product_service.dto.request.FilterRequest;
import com.example.product_service.dto.request.OrderItemRequest;
import com.example.product_service.dto.request.ProductRequest;
import com.example.product_service.dto.response.PageResponse;
import com.example.product_service.dto.response.ProductResponse;
import com.example.product_service.entity.Category;
import com.example.product_service.entity.Product;
import com.example.product_service.entity.WeightProduct;
import com.example.product_service.exception.AppException;
import com.example.product_service.exception.ErrorCode;
import com.example.product_service.mapper.ProductMapper;
import com.example.product_service.repository.CategoryRepository;
import com.example.product_service.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService {
    ProductRepository productRepository;
    ProductMapper productMapper;
    CategoryRepository categoryRepository;

    String urlImagePath = "http://localhost:8082/products/image-product/";

    // ===== USER APIs =====

    public ProductResponse getProductByIdForUser(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (!product.isActive()) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }

        ProductResponse response = productMapper.toProductResponse(product);
        response.setImage(response.getImage() != null ? urlImagePath + response.getImage() : null);
        return response;
    }

    public PageResponse<ProductResponse> getAllProductsForUser(int page, int size) {
        Specification<Product> spec = (root, query, cb) -> cb.isTrue(root.get("active"));
        Page<Product> productPage = productRepository.findAll(spec, PageRequest.of(page - 1, size));
        return getListProductResponses(productPage, page);
    }

    public PageResponse<ProductResponse> getProductsByCategoryForUser(long categoryId, int page, int size) {
        Specification<Product> spec = (root, query, cb) -> cb.and(
                cb.equal(root.get("category").get("id"), categoryId),
                cb.isTrue(root.get("isActive"))
        );
        Page<Product> productPage = productRepository.findAll(spec, PageRequest.of(page - 1, size));
        return getListProductResponses(productPage, page);
    }
    public PageResponse<ProductResponse> getProductsByFilter(FilterRequest filter, int page, int size) {
        Specification<Product> spec = filterProductsForUser(filter);
        Page<Product> productPage = productRepository.findAll(spec, PageRequest.of(page - 1, size));
        return getListProductResponses(productPage, page);
    }
    public PageResponse<ProductResponse> searchProductsByUser(String query, int page, int size) {
        Specification<Product> spec = (root, q, cb) -> cb.and(
                cb.isTrue(root.get("active")),
                cb.like(cb.lower(root.get("name")), "%" + query.trim().toLowerCase() + "%")
        );

        Page<Product> productPage = productRepository.findAll(spec, PageRequest.of(page - 1, size));
        return getListProductResponses(productPage, page);
    }

    // ===== ADMIN APIs =====

    public ProductResponse getProductById(Long productId) {
        ProductResponse response = productMapper.toProductResponse(
                productRepository.findById(productId)
                        .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND)));
        response.setImage(response.getImage() != null ? urlImagePath + response.getImage() : null);
        return response;
    }

    public ProductResponse createProduct(ProductRequest productRequest, MultipartFile file) {
        Product product = productMapper.toProduct(productRequest);
        Category category = categoryRepository.findById(productRequest.getId_category())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        product.setCategory(category);

        if (file != null && !file.isEmpty()) {
            String imageFilename = FileUtils.saveImage(file);
            product.setImage(imageFilename);
        }

        Product savedProduct = productRepository.save(product);
        ProductResponse response = productMapper.toProductResponse(savedProduct);
        response.setImage(response.getImage() != null ? urlImagePath + response.getImage() : null);
        return response;
    }

    public ProductResponse updateProduct(Long productId, ProductRequest productRequest, MultipartFile file) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        productMapper.updateProduct(product, productRequest);

        Category category = categoryRepository.findById(productRequest.getId_category())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        product.setCategory(category);

        if (file != null && !file.isEmpty()) {
            FileUtils.deleteImage(product.getImage());
            String imageFilename = FileUtils.saveImage(file);
            product.setImage(imageFilename);
        }

        Product savedProduct = productRepository.save(product);
        ProductResponse response = productMapper.toProductResponse(savedProduct);
        response.setImage(response.getImage() != null ? urlImagePath + response.getImage() : null);
        return response;
    }

    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        product.setActive(false); // Soft delete
        productRepository.save(product);
    }

    public void restoreProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        product.setActive(true); // Restore
        productRepository.save(product);
    }

    public PageResponse<ProductResponse> getAllProducts(int page, int size) {
        Page<Product> productPage = productRepository.findAll(PageRequest.of(page - 1, size));
        return getListProductResponses(productPage, page);
    }

    public PageResponse<ProductResponse> getProductsByCategory(long categoryId, int page, int size) {
        Page<Product> productPage = productRepository.findByCategoryId(categoryId, PageRequest.of(page - 1, size));
        return getListProductResponses(productPage, page);
    }

    public PageResponse<ProductResponse> searchProducts(String query, int page, int size) {
        Page<Product> productPage = productRepository.searchProducts(query, PageRequest.of(page - 1, size));
        return getListProductResponses(productPage, page);
    }


    // ===== SHARED METHODS =====

    private PageResponse<ProductResponse> getListProductResponses(Page<Product> productPage, int page) {
        List<ProductResponse> productResponses = productPage.getContent()
                .stream()
                .map(product -> {
                    ProductResponse response = productMapper.toProductResponse(product);
                    response.setImage(response.getImage() != null ? urlImagePath + response.getImage() : null);
                    return response;
                })
                .toList();

        return PageResponse.<ProductResponse>builder()
                .currentPage(page)
                .totalPages(productPage.getTotalPages())
                .totalElements(productPage.getTotalElements())
                .elements(productResponses)
                .build();
    }

    private Specification<Product> filterProductsForUser(FilterRequest filter) {
        return (root, queryObj, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Chỉ lấy sản phẩm đang active
            predicates.add(criteriaBuilder.isTrue(root.get("active")));

            if (filter.getOrganic() != null) {
                predicates.add(criteriaBuilder.equal(root.get("organic"), filter.getOrganic()));
            }
            if (filter.getMinPrice() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), filter.getMinPrice()));
            }
            if (filter.getMaxPrice() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), filter.getMaxPrice()));
            }
            if (filter.getCategoryId() != null && filter.getCategoryId() > 0) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("id"), filter.getCategoryId()));
            }
            if (filter.getBrand() != null && !filter.getBrand().trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("brand"), "%" + filter.getBrand().trim() + "%"));
            }
            if (filter.getOrigin() != null && !filter.getOrigin().trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("origin"), "%" + filter.getOrigin().trim() + "%"));
            }
            if (filter.getQuery() != null && !filter.getQuery().trim().isEmpty()) {
                String searchPattern = "%" + filter.getQuery().trim().toLowerCase() + "%";
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
    public void updateStock(UpdateStockRequest request) {
        request.getItems().forEach(req -> {
            Optional<Product> productOp = productRepository.findById(req.getProductId());
            if (productOp.isPresent()) {
                Product p = productOp.get();
                for (WeightProduct o : p.getWeightProducts()) {
                    if (o.getWeightType().getValue() == req.getWeight()) {
                        o.setStock(o.getStock() + req.getQuantity());
                        break;
                    }
                }
                productRepository.save(p);
            } else {
                log.error("Product not found for ID {}", req.getProductId());
            }
        });
    }

    public List<String> checkStock(List<OrderItemRequest> request) {
        List<String> outOfStockProducts = new ArrayList<>();

        for (OrderItemRequest item : request) {
            Optional<Product> productOpt = productRepository.findById(Long.valueOf(item.getProductCode()));
            if (productOpt.isPresent()) {
                Product product = productOpt.get();
                for (WeightProduct weightProduct : product.getWeightProducts()) {
                    if (weightProduct.getWeightType().getValue() == item.getWeight()) {
                        if (weightProduct.getStock() < item.getQuantity()) {
                            outOfStockProducts.add(product.getName() +
                                    " (" + weightProduct.getWeightType().getValue() + "kg)");
                        }
                    }
                }
            } else {
                outOfStockProducts.add("Sản phẩm có mã " + item.getProductCode() + " không tồn tại");
            }
        }

        return outOfStockProducts;
    }
}
