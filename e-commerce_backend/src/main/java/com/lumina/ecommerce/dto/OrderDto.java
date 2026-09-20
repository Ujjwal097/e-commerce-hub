package com.lumina.ecommerce.dto;

import java.util.List;

public class OrderDto {
    private String id;
    private String userId;
    private String date;
    private Object items; // Can be List<CartItem> or List<Map<String, Object>>
    private Double subtotal;
    private Double discount;
    private Double shipping;
    private String shippingMethod;
    private Double tax;
    private Double total;
    private Object shippingAddress;
    private String paymentMethod;
    private String status;
    private String estimatedDelivery;
    private String trackingNumber;

    public OrderDto() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Object getItems() { return items; }
    public void setItems(Object items) { this.items = items; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public Double getDiscount() { return discount; }
    public void setDiscount(Double discount) { this.discount = discount; }

    public Double getShipping() { return shipping; }
    public void setShipping(Double shipping) { this.shipping = shipping; }

    public String getShippingMethod() { return shippingMethod; }
    public void setShippingMethod(String shippingMethod) { this.shippingMethod = shippingMethod; }

    public Double getTax() { return tax; }
    public void setTax(Double tax) { this.tax = tax; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public Object getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(Object shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getEstimatedDelivery() { return estimatedDelivery; }
    public void setEstimatedDelivery(String estimatedDelivery) { this.estimatedDelivery = estimatedDelivery; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
}
