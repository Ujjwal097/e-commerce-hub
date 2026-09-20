package com.lumina.ecommerce.dto;

import java.util.List;

public class AdminStatsDto {
    private Double totalRevenue;
    private Long totalOrders;
    private Long totalProducts;
    private Long totalCustomers;
    private List<OrderDto> recentOrders;

    public AdminStatsDto() {}

    public AdminStatsDto(Double totalRevenue, Long totalOrders, Long totalProducts, Long totalCustomers, List<OrderDto> recentOrders) {
        this.totalRevenue = totalRevenue;
        this.totalOrders = totalOrders;
        this.totalProducts = totalProducts;
        this.totalCustomers = totalCustomers;
        this.recentOrders = recentOrders;
    }

    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }

    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }

    public Long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(Long totalProducts) { this.totalProducts = totalProducts; }

    public Long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(Long totalCustomers) { this.totalCustomers = totalCustomers; }

    public List<OrderDto> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<OrderDto> recentOrders) { this.recentOrders = recentOrders; }
}
