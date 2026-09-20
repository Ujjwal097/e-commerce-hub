package com.lumina.ecommerce.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lumina.ecommerce.entity.ProductEntity;

import java.util.Collections;
import java.util.List;
import java.util.Map;

public class ProductDto {
    private static final ObjectMapper MAPPER = new ObjectMapper();

    private String id;
    private String name;
    private String slug;
    private String brand;
    private String category;
    private Double price;
    private Double originalPrice;
    private Integer discountPercent;
    private Double rating;
    private Integer reviewCount;
    private Boolean inStock;
    private Integer stockQuantity;
    private List<String> images;
    private String description;
    private List<String> features;
    private Map<String, String> specs;
    private List<Map<String, String>> colors;
    private List<String> tags;
    private Boolean isFeatured;
    private Boolean isTrending;
    private String badge;

    public ProductDto() {}

    public ProductDto(ProductEntity entity) {
        this.id = entity.getId();
        this.name = entity.getName();
        this.slug = entity.getSlug();
        this.brand = entity.getBrand();
        this.category = entity.getCategory();
        this.price = entity.getPrice();
        this.originalPrice = entity.getOriginalPrice();
        this.discountPercent = entity.getDiscountPercent();
        this.rating = entity.getRating();
        this.reviewCount = entity.getReviewCount();
        this.inStock = entity.getInStock();
        this.stockQuantity = entity.getStockQuantity();
        this.description = entity.getDescription();
        this.isFeatured = entity.getIsFeatured();
        this.isTrending = entity.getIsTrending();
        this.badge = entity.getBadge();

        try {
            this.images = entity.getImagesJson() != null 
                ? MAPPER.readValue(entity.getImagesJson(), new TypeReference<List<String>>() {}) 
                : Collections.emptyList();
        } catch (Exception e) { this.images = Collections.emptyList(); }

        try {
            this.features = entity.getFeaturesJson() != null 
                ? MAPPER.readValue(entity.getFeaturesJson(), new TypeReference<List<String>>() {}) 
                : Collections.emptyList();
        } catch (Exception e) { this.features = Collections.emptyList(); }

        try {
            this.specs = entity.getSpecsJson() != null 
                ? MAPPER.readValue(entity.getSpecsJson(), new TypeReference<Map<String, String>>() {}) 
                : Collections.emptyMap();
        } catch (Exception e) { this.specs = Collections.emptyMap(); }

        try {
            this.colors = entity.getColorsJson() != null 
                ? MAPPER.readValue(entity.getColorsJson(), new TypeReference<List<Map<String, String>>>() {}) 
                : Collections.emptyList();
        } catch (Exception e) { this.colors = Collections.emptyList(); }

        try {
            this.tags = entity.getTagsJson() != null 
                ? MAPPER.readValue(entity.getTagsJson(), new TypeReference<List<String>>() {}) 
                : Collections.emptyList();
        } catch (Exception e) { this.tags = Collections.emptyList(); }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(Double originalPrice) { this.originalPrice = originalPrice; }

    public Integer getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(Integer discountPercent) { this.discountPercent = discountPercent; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getFeatures() { return features; }
    public void setFeatures(List<String> features) { this.features = features; }

    public Map<String, String> getSpecs() { return specs; }
    public void setSpecs(Map<String, String> specs) { this.specs = specs; }

    public List<Map<String, String>> getColors() { return colors; }
    public void setColors(List<Map<String, String>> colors) { this.colors = colors; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public Boolean getIsTrending() { return isTrending; }
    public void setIsTrending(Boolean isTrending) { this.isTrending = isTrending; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }
}
