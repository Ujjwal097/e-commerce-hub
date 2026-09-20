package com.lumina.ecommerce.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lumina.ecommerce.dto.ProductDto;
import com.lumina.ecommerce.entity.ProductEntity;
import com.lumina.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductDto> getProducts(String category, Double minPrice, Double maxPrice, String search) {
        boolean hasFilter = (category != null && !category.isEmpty() && !"All".equalsIgnoreCase(category))
                || minPrice != null
                || maxPrice != null
                || (search != null && !search.trim().isEmpty());

        List<ProductEntity> entities;
        if (hasFilter) {
            String queryCategory = (category != null && !"All".equalsIgnoreCase(category)) ? category : null;
            String querySearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
            entities = productRepository.filterProducts(queryCategory, minPrice, maxPrice, querySearch);
        } else {
            entities = productRepository.findAllByOrderByCreatedAtDesc();
        }

        return entities.stream().map(ProductDto::new).collect(Collectors.toList());
    }

    public Optional<ProductDto> getProductById(String id) {
        return productRepository.findById(id).map(ProductDto::new);
    }

    public ProductDto createProduct(ProductDto dto) {
        ProductEntity entity = new ProductEntity();

        String id = (dto.getId() != null && !dto.getId().trim().isEmpty())
                ? dto.getId().trim()
                : "prod_" + System.currentTimeMillis();
        entity.setId(id);

        entity.setName(dto.getName());
        entity.setBrand(dto.getBrand() != null ? dto.getBrand() : "Lumina Craft");
        entity.setCategory(dto.getCategory() != null ? dto.getCategory() : "Audio");

        String slug = dto.getSlug();
        if (slug == null || slug.trim().isEmpty()) {
            slug = (dto.getName() != null ? dto.getName() : "product")
                    .toLowerCase()
                    .replaceAll("[^a-z0-9]+", "-")
                    .replaceAll("^-+|-+$", "");
        }
        entity.setSlug(slug);

        entity.setPrice(dto.getPrice() != null ? dto.getPrice() : 0.0);
        entity.setOriginalPrice(dto.getOriginalPrice() != null ? dto.getOriginalPrice() : dto.getPrice());

        if (dto.getDiscountPercent() != null) {
            entity.setDiscountPercent(dto.getDiscountPercent());
        } else if (entity.getOriginalPrice() != null && entity.getOriginalPrice() > entity.getPrice()) {
            int calcDiscount = (int) Math.round(((entity.getOriginalPrice() - entity.getPrice()) / entity.getOriginalPrice()) * 100);
            entity.setDiscountPercent(calcDiscount);
        } else {
            entity.setDiscountPercent(0);
        }

        entity.setRating(dto.getRating() != null ? dto.getRating() : 5.0);
        entity.setReviewCount(dto.getReviewCount() != null ? dto.getReviewCount() : 1);
        entity.setInStock(dto.getInStock() != null ? dto.getInStock() : true);
        entity.setStockQuantity(dto.getStockQuantity() != null ? dto.getStockQuantity() : 50);
        entity.setDescription(dto.getDescription() != null ? dto.getDescription() : "");
        entity.setIsFeatured(dto.getIsFeatured() != null ? dto.getIsFeatured() : false);
        entity.setIsTrending(dto.getIsTrending() != null ? dto.getIsTrending() : false);
        entity.setBadge(dto.getBadge());
        entity.setCreatedAt(Instant.now().toString());

        try {
            entity.setImagesJson(dto.getImages() != null ? objectMapper.writeValueAsString(dto.getImages()) : "[]");
            entity.setFeaturesJson(dto.getFeatures() != null ? objectMapper.writeValueAsString(dto.getFeatures()) : "[]");
            entity.setSpecsJson(dto.getSpecs() != null ? objectMapper.writeValueAsString(dto.getSpecs()) : "{}");
            entity.setColorsJson(dto.getColors() != null ? objectMapper.writeValueAsString(dto.getColors()) : "[]");
            entity.setTagsJson(dto.getTags() != null ? objectMapper.writeValueAsString(dto.getTags()) : "[]");
        } catch (Exception e) {
            entity.setImagesJson("[]");
            entity.setFeaturesJson("[]");
            entity.setSpecsJson("{}");
            entity.setColorsJson("[]");
            entity.setTagsJson("[]");
        }

        ProductEntity saved = productRepository.save(entity);
        return new ProductDto(saved);
    }

    public Optional<ProductDto> updateProduct(String id, ProductDto dto) {
        return productRepository.findById(id).map(entity -> {
            if (dto.getName() != null) entity.setName(dto.getName());
            if (dto.getBrand() != null) entity.setBrand(dto.getBrand());
            if (dto.getCategory() != null) entity.setCategory(dto.getCategory());
            if (dto.getSlug() != null) entity.setSlug(dto.getSlug());
            if (dto.getPrice() != null) entity.setPrice(dto.getPrice());
            if (dto.getOriginalPrice() != null) entity.setOriginalPrice(dto.getOriginalPrice());
            if (dto.getDiscountPercent() != null) entity.setDiscountPercent(dto.getDiscountPercent());
            if (dto.getRating() != null) entity.setRating(dto.getRating());
            if (dto.getReviewCount() != null) entity.setReviewCount(dto.getReviewCount());
            if (dto.getInStock() != null) entity.setInStock(dto.getInStock());
            if (dto.getStockQuantity() != null) entity.setStockQuantity(dto.getStockQuantity());
            if (dto.getDescription() != null) entity.setDescription(dto.getDescription());
            if (dto.getIsFeatured() != null) entity.setIsFeatured(dto.getIsFeatured());
            if (dto.getIsTrending() != null) entity.setIsTrending(dto.getIsTrending());
            if (dto.getBadge() != null) entity.setBadge(dto.getBadge());

            try {
                if (dto.getImages() != null) entity.setImagesJson(objectMapper.writeValueAsString(dto.getImages()));
                if (dto.getFeatures() != null) entity.setFeaturesJson(objectMapper.writeValueAsString(dto.getFeatures()));
                if (dto.getSpecs() != null) entity.setSpecsJson(objectMapper.writeValueAsString(dto.getSpecs()));
                if (dto.getColors() != null) entity.setColorsJson(objectMapper.writeValueAsString(dto.getColors()));
                if (dto.getTags() != null) entity.setTagsJson(objectMapper.writeValueAsString(dto.getTags()));
            } catch (Exception ignored) {}

            ProductEntity saved = productRepository.save(entity);
            return new ProductDto(saved);
        });
    }

    public boolean deleteProduct(String id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public long count() {
        return productRepository.count();
    }
}
