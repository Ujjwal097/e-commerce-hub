package com.lumina.ecommerce.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lumina.ecommerce.dto.OrderDto;
import com.lumina.ecommerce.entity.OrderEntity;
import com.lumina.ecommerce.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final EmailService emailService;
    private final SmsService smsService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public OrderService(
            OrderRepository orderRepository,
            EmailService emailService,
            SmsService smsService
    ) {
        this.orderRepository = orderRepository;
        this.emailService = emailService;
        this.smsService = smsService;
    }

    public OrderDto createOrder(OrderDto dto) {
        OrderEntity entity = new OrderEntity();

        String id = (dto.getId() != null && !dto.getId().trim().isEmpty())
                ? dto.getId().trim()
                : "ORD-" + (100000 + (System.currentTimeMillis() % 900000));
        entity.setId(id);

        entity.setUserId(dto.getUserId() != null ? dto.getUserId() : "guest");
        entity.setDate(dto.getDate() != null ? dto.getDate() : LocalDate.now().toString());
        entity.setSubtotal(dto.getSubtotal() != null ? dto.getSubtotal() : 0.0);
        entity.setDiscount(dto.getDiscount() != null ? dto.getDiscount() : 0.0);
        entity.setShipping(dto.getShipping() != null ? dto.getShipping() : 0.0);
        entity.setShippingMethod(dto.getShippingMethod() != null ? dto.getShippingMethod() : "Standard Delivery");
        entity.setTax(dto.getTax() != null ? dto.getTax() : 0.0);
        entity.setTotal(dto.getTotal() != null ? dto.getTotal() : 0.0);
        entity.setPaymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : "card");
        entity.setStatus(dto.getStatus() != null ? dto.getStatus() : "Processing");
        entity.setEstimatedDelivery(dto.getEstimatedDelivery() != null ? dto.getEstimatedDelivery() : "Within 3-5 business days");
        entity.setTrackingNumber(dto.getTrackingNumber() != null ? dto.getTrackingNumber() : "LUM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        try {
            entity.setItemsJson(dto.getItems() != null ? objectMapper.writeValueAsString(dto.getItems()) : "[]");
        } catch (Exception e) {
            entity.setItemsJson("[]");
        }

        try {
            entity.setShippingAddressJson(dto.getShippingAddress() != null ? objectMapper.writeValueAsString(dto.getShippingAddress()) : "{}");
        } catch (Exception e) {
            entity.setShippingAddressJson("{}");
        }

        OrderEntity saved = orderRepository.save(entity);

        // Extract recipient details for live SMS and Email confirmation
        String phone = null;
        String email = null;
        String recipientName = "Customer";

        if (dto.getShippingAddress() != null) {
            try {
                com.fasterxml.jackson.databind.JsonNode node = objectMapper.valueToTree(dto.getShippingAddress());
                if (node.hasNonNull("phone")) phone = node.get("phone").asText();
                if (node.hasNonNull("email")) email = node.get("email").asText();
                if (node.hasNonNull("fullName")) recipientName = node.get("fullName").asText();
            } catch (Exception ignored) {}
        }

        // 1. Order confirmation SMS is disabled (User requested Email confirmation only)
        // smsService.sendOrderSuccessSms(phone, saved.getId(), saved.getTotal());

        // 2. Dispatch real order confirmation HTML Email
        if (email != null && !email.trim().isEmpty()) {
            emailService.sendOrderSuccessEmail(email, saved.getId(), saved.getTotal(), recipientName);
        }

        return toDto(saved);
    }

    public List<OrderDto> getAllOrders() {
        return orderRepository.findAllByOrderByIdDesc()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<OrderDto> getOrdersByUser(String userId) {
        return orderRepository.findByUserIdOrderByIdDesc(userId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Optional<OrderDto> getOrderById(String id) {
        return orderRepository.findById(id).map(this::toDto);
    }

    public Optional<OrderDto> updateOrderStatus(String id, String status) {
        return orderRepository.findById(id).map(order -> {
            order.setStatus(status);
            OrderEntity saved = orderRepository.save(order);
            return toDto(saved);
        });
    }

    public long count() {
        return orderRepository.count();
    }

    public double calculateTotalRevenue() {
        Double rev = orderRepository.calculateTotalRevenue();
        return rev != null ? rev : 0.0;
    }

    public OrderDto toDto(OrderEntity entity) {
        OrderDto dto = new OrderDto();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUserId());
        dto.setDate(entity.getDate());
        dto.setSubtotal(entity.getSubtotal());
        dto.setDiscount(entity.getDiscount());
        dto.setShipping(entity.getShipping());
        dto.setShippingMethod(entity.getShippingMethod());
        dto.setTax(entity.getTax());
        dto.setTotal(entity.getTotal());
        dto.setPaymentMethod(entity.getPaymentMethod());
        dto.setStatus(entity.getStatus());
        dto.setEstimatedDelivery(entity.getEstimatedDelivery());
        dto.setTrackingNumber(entity.getTrackingNumber());

        try {
            if (entity.getItemsJson() != null) {
                dto.setItems(objectMapper.readValue(entity.getItemsJson(), Object.class));
            }
        } catch (Exception e) {
            dto.setItems(Collections.emptyList());
        }

        try {
            if (entity.getShippingAddressJson() != null) {
                dto.setShippingAddress(objectMapper.readValue(entity.getShippingAddressJson(), Object.class));
            }
        } catch (Exception e) {
            dto.setShippingAddress(Collections.emptyMap());
        }

        return dto;
    }
}
