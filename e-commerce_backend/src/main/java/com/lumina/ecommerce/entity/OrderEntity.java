package com.lumina.ecommerce.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class OrderEntity {

    @Id
    private String id;

    private String userId;

    @Column(nullable = false)
    private String date;

    @Lob
    @Column(columnDefinition = "CLOB", nullable = false)
    private String itemsJson;

    @Column(nullable = false)
    private Double subtotal;

    private Double discount;
    private Double shipping;
    private String shippingMethod;
    private Double tax;

    @Column(nullable = false)
    private Double total;

    @Lob
    @Column(columnDefinition = "CLOB", nullable = false)
    private String shippingAddressJson;

    private String paymentMethod;
    private String status;
    private String estimatedDelivery;
    private String trackingNumber;

    public OrderEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getItemsJson() { return itemsJson; }
    public void setItemsJson(String itemsJson) { this.itemsJson = itemsJson; }

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

    public String getShippingAddressJson() { return shippingAddressJson; }
    public void setShippingAddressJson(String shippingAddressJson) { this.shippingAddressJson = shippingAddressJson; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getEstimatedDelivery() { return estimatedDelivery; }
    public void setEstimatedDelivery(String estimatedDelivery) { this.estimatedDelivery = estimatedDelivery; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
}
