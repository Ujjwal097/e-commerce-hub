package com.lumina.ecommerce.controller;

import com.lumina.ecommerce.dto.AdminStatsDto;
import com.lumina.ecommerce.dto.OrderDto;
import com.lumina.ecommerce.repository.UserRepository;
import com.lumina.ecommerce.service.OrderService;
import com.lumina.ecommerce.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final OrderService orderService;
    private final ProductService productService;
    private final UserRepository userRepository;

    public AdminController(OrderService orderService, ProductService productService, UserRepository userRepository) {
        this.orderService = orderService;
        this.productService = productService;
        this.userRepository = userRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDto> getAdminStats() {
        double totalRevenue = orderService.calculateTotalRevenue();
        long totalOrders = orderService.count();
        long totalProducts = productService.count();
        long totalCustomers = userRepository.count();
        List<OrderDto> recentOrders = orderService.getAllOrders().stream().limit(5).collect(Collectors.toList());

        AdminStatsDto stats = new AdminStatsDto(
                totalRevenue,
                totalOrders,
                totalProducts,
                totalCustomers,
                recentOrders);

        return ResponseEntity.ok(stats);
    }
}
