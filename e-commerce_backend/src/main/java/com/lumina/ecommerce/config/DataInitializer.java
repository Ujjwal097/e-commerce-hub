package com.lumina.ecommerce.config;

import com.lumina.ecommerce.entity.OrderEntity;
import com.lumina.ecommerce.entity.ProductEntity;
import com.lumina.ecommerce.entity.UserEntity;
import com.lumina.ecommerce.repository.OrderRepository;
import com.lumina.ecommerce.repository.ProductRepository;
import com.lumina.ecommerce.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(
            UserRepository userRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository
    ) {
        return args -> {
            // 1. Seed Super Admin (pandditujjwaltiwari@gmail.com / 9889933097)
            Optional<UserEntity> existingAdmin = userRepository.findByEmail("pandditujjwaltiwari@gmail.com")
                    .or(() -> userRepository.findByEmail("panditujjwaltiwari@gmail.com"))
                    .or(() -> userRepository.findByIdentifier("pandditujjwaltiwari@gmail.com"))
                    .or(() -> userRepository.findByPhoneNumber("9889933097"));

            if (existingAdmin.isEmpty()) {
                UserEntity superAdmin = new UserEntity(
                        "usr_superadmin",
                        "pandditujjwaltiwari@gmail.com",
                        "9889933097",
                        "pandditujjwaltiwari",
                        "Ujjwal Tiwari (Super Admin)",
                        "admin",
                        Instant.now().toString()
                );
                userRepository.save(superAdmin);
                System.out.println(">> [SEED] Super Admin initialized: pandditujjwaltiwari@gmail.com | Phone: 9889933097");
            } else {
                UserEntity admin = existingAdmin.get();
                admin.setEmail("pandditujjwaltiwari@gmail.com");
                admin.setUsername("pandditujjwaltiwari");
                admin.setRole("admin");
                userRepository.save(admin);
                System.out.println(">> [SEED] Super Admin synced: pandditujjwaltiwari@gmail.com | Phone: 9889933097");
            }

            // Also seed demo customer if not present
            if (userRepository.findByEmail("customer@lumina.com").isEmpty()
                    && userRepository.findByIdentifier("customer@lumina.com").isEmpty()) {
                UserEntity customer = new UserEntity(
                        "usr_customer",
                        "customer@lumina.com",
                        "9876543210",
                        "alexmorgan",
                        "Alex Morgan",
                        "customer",
                        Instant.now().toString()
                );
                userRepository.save(customer);
            }

            // 2. Seed Products if repository is empty
            if (productRepository.count() == 0) {
                System.out.println(">> [SEED] Seeding initial product catalog into H2 database...");

                ProductEntity p1 = new ProductEntity();
                p1.setId("prod-1");
                p1.setName("AuraPulse Pro Noise-Cancelling Headphones");
                p1.setSlug("aurapulse-pro-headphones");
                p1.setBrand("AuraSound");
                p1.setCategory("Audio");
                p1.setPrice(299.99);
                p1.setOriginalPrice(379.99);
                p1.setDiscountPercent(21);
                p1.setRating(4.9);
                p1.setReviewCount(428);
                p1.setInStock(true);
                p1.setStockQuantity(18);
                p1.setImagesJson("[\"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80\",\"https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80\",\"https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80\"]");
                p1.setDescription("Experience pure sonic brilliance with hybrid active noise cancellation, custom 45mm titanium drivers, and up to 60 hours of wireless playback.");
                p1.setFeaturesJson("[\"Adaptive Active Noise Cancellation with Transparency Mode\",\"Custom 45mm dynamic titanium biocellulose drivers\",\"Ultra-plush memory foam magnetic ear cushions\",\"Up to 60 hours battery life with quick-charge\"]");
                p1.setSpecsJson("{\"Driver Size\":\"45 mm\",\"Frequency Response\":\"10 Hz – 40,000 Hz\",\"Weight\":\"265 grams\",\"Connectivity\":\"Bluetooth 5.4 & 3.5mm Aux / USB-C Audio\"}");
                p1.setColorsJson("[{\"name\":\"Matte Obsidian\",\"hex\":\"#1e1e24\"},{\"name\":\"Silver Lunar\",\"hex\":\"#d1d5db\"},{\"name\":\"Deep Midnight Navy\",\"hex\":\"#1e293b\"}]");
                p1.setTagsJson("[\"audio\",\"wireless\",\"noise-cancelling\",\"premium\"]");
                p1.setIsFeatured(true);
                p1.setIsTrending(true);
                p1.setBadge("HOT");
                p1.setCreatedAt(Instant.now().toString());
                productRepository.save(p1);

                ProductEntity p2 = new ProductEntity();
                p2.setId("prod-2");
                p2.setName("Vanguard Ultra Smartwatch Series X");
                p2.setSlug("vanguard-ultra-smartwatch");
                p2.setBrand("Vanguard");
                p2.setCategory("Wearables");
                p2.setPrice(349.00);
                p2.setOriginalPrice(429.00);
                p2.setDiscountPercent(19);
                p2.setRating(4.8);
                p2.setReviewCount(312);
                p2.setInStock(true);
                p2.setStockQuantity(24);
                p2.setImagesJson("[\"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80\",\"https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80\"]");
                p2.setDescription("Precision-engineered titanium aerospace casing with sapphire crystal glass, advanced dual-frequency GPS, and 100m water resistance.");
                p2.setFeaturesJson("[\"2.04\\\" Always-On Super Retina AMOLED display with 3000 nits peak brightness\",\"Grade 5 Aerospace Titanium chassis with ceramic back\",\"BioTrack 4.0: ECG, SpO2, Sleep Stages, and Temperature sensing\",\"Dual-frequency L1/L5 GPS\"]");
                p2.setSpecsJson("{\"Case Material\":\"Grade 5 Titanium\",\"Display\":\"2.04\\\" AMOLED 480x520 px\",\"Water Resistance\":\"10 ATM (100 meters)\"}");
                p2.setColorsJson("[{\"name\":\"Titanium Raw\",\"hex\":\"#9ca3af\"},{\"name\":\"Midnight Black\",\"hex\":\"#111827\"},{\"name\":\"Alpine Orange\",\"hex\":\"#ea580c\"}]");
                p2.setTagsJson("[\"smartwatch\",\"fitness\",\"wearables\",\"gps\"]");
                p2.setIsFeatured(true);
                p2.setIsTrending(false);
                p2.setBadge("BESTSELLER");
                p2.setCreatedAt(Instant.now().toString());
                productRepository.save(p2);

                ProductEntity p3 = new ProductEntity();
                p3.setId("prod-3");
                p3.setName("Lumina Lumos Mirrorless Camera 4K");
                p3.setSlug("lumina-lumos-mirrorless-camera");
                p3.setBrand("Lumina Optics");
                p3.setCategory("Photography");
                p3.setPrice(1199.00);
                p3.setOriginalPrice(1399.00);
                p3.setDiscountPercent(14);
                p3.setRating(4.9);
                p3.setReviewCount(185);
                p3.setInStock(true);
                p3.setStockQuantity(9);
                p3.setImagesJson("[\"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80\",\"https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80\"]");
                p3.setDescription("A creator powerhouse featuring a 33MP Full-Frame Exmor sensor, 4K 120p video recording, 5-axis IBIS, and instant real-time AI eye tracking.");
                p3.setFeaturesJson("[\"33MP BSI Full-Frame CMOS Sensor\",\"4K 60p 10-bit 4:2:2 internal recording\",\"759-point phase-detection autofocus with AI eye-AF\"]");
                p3.setSpecsJson("{\"Sensor\":\"33 MP Full-Frame BSI CMOS\",\"ISO Range\":\"100 – 51,200\",\"Video\":\"4K at 60fps / 1080p at 120fps\"}");
                p3.setColorsJson("[{\"name\":\"Carbon Matte\",\"hex\":\"#18181b\"},{\"name\":\"Vintage Silver\",\"hex\":\"#cbd5e1\"}]");
                p3.setTagsJson("[\"camera\",\"photography\",\"4k\",\"video\"]");
                p3.setIsFeatured(true);
                p3.setIsTrending(true);
                p3.setBadge("NEW");
                p3.setCreatedAt(Instant.now().toString());
                productRepository.save(p3);

                ProductEntity p4 = new ProductEntity();
                p4.setId("prod-4");
                p4.setName("CyberKey Studio Mechanical Keyboard");
                p4.setSlug("cyberkey-studio-mechanical-keyboard");
                p4.setBrand("CyberKey");
                p4.setCategory("Computer & Office");
                p4.setPrice(169.50);
                p4.setOriginalPrice(199.00);
                p4.setDiscountPercent(15);
                p4.setRating(4.7);
                p4.setReviewCount(520);
                p4.setInStock(true);
                p4.setStockQuantity(32);
                p4.setImagesJson("[\"https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80\",\"https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80\"]");
                p4.setDescription("Custom gasket-mounted 75% wireless keyboard with hot-swappable pre-lubed tactile switches and south-facing RGB.");
                p4.setFeaturesJson("[\"CNC milled aluminum body with acoustic sound-dampening foam\",\"Pre-lubricated Gateron Pro Oil King switches\",\"Tri-mode connectivity: Bluetooth 5.2, 2.4GHz dongle, and USB-C\"]");
                p4.setSpecsJson("{\"Layout\":\"75% (82 keys)\",\"Switches\":\"Hot-swappable 5-pin mechanical\",\"Battery\":\"4,000 mAh Rechargeable\"}");
                p4.setColorsJson("[{\"name\":\"Retro Industrial\",\"hex\":\"#374151\"},{\"name\":\"Frost White\",\"hex\":\"#f3f4f6\"}]");
                p4.setTagsJson("[\"keyboard\",\"mechanical\",\"office\",\"wireless\"]");
                p4.setIsFeatured(false);
                p4.setIsTrending(true);
                p4.setBadge("SALE");
                p4.setCreatedAt(Instant.now().toString());
                productRepository.save(p4);

                ProductEntity p5 = new ProductEntity();
                p5.setId("prod-5");
                p5.setName("ErgoSphere Executive Ergonomic Mesh Chair");
                p5.setSlug("ergosphere-executive-ergonomic-chair");
                p5.setBrand("ErgoSphere");
                p5.setCategory("Computer & Office");
                p5.setPrice(489.00);
                p5.setOriginalPrice(599.00);
                p5.setDiscountPercent(18);
                p5.setRating(4.8);
                p5.setReviewCount(240);
                p5.setInStock(true);
                p5.setStockQuantity(12);
                p5.setImagesJson("[\"https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=800&q=80\"]");
                p5.setDescription("Engineered for all-day comfort, featuring responsive self-adjusting lumbar support and breathable 3D woven mesh.");
                p5.setFeaturesJson("[\"Dynamic weight-activated synchro-tilt mechanism (90° – 135°)\",\"Adaptive lumbar cushion tracks spine motion in real-time\",\"Breathable temperature-regulating Korean elastomeric mesh\"]");
                p5.setSpecsJson("{\"Max Load\":\"350 lbs (158 kg)\",\"Tilt Range\":\"90° to 135°\",\"Frame\":\"Cast Aluminum Base\"}");
                p5.setColorsJson("[{\"name\":\"Shadow Black\",\"hex\":\"#1f2937\"},{\"name\":\"Platinum Grey\",\"hex\":\"#9ca3af\"}]");
                p5.setTagsJson("[\"chair\",\"furniture\",\"ergonomic\",\"office\"]");
                p5.setIsFeatured(true);
                p5.setIsTrending(false);
                p5.setCreatedAt(Instant.now().toString());
                productRepository.save(p5);

                ProductEntity p6 = new ProductEntity();
                p6.setId("prod-6");
                p6.setName("Apex Horizon Curved Gaming Monitor 34\"");
                p6.setSlug("apex-horizon-curved-gaming-monitor");
                p6.setBrand("ApexVision");
                p6.setCategory("Computer & Office");
                p6.setPrice(649.99);
                p6.setOriginalPrice(799.99);
                p6.setDiscountPercent(19);
                p6.setRating(4.9);
                p6.setReviewCount(390);
                p6.setInStock(true);
                p6.setStockQuantity(15);
                p6.setImagesJson("[\"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80\"]");
                p6.setDescription("Immerse your senses with a 1000R curved QD-OLED display, 175Hz refresh rate, and 0.03ms response time.");
                p6.setFeaturesJson("[\"34-inch UWQHD (3440 x 1440) 21:9 UltraWide OLED panel\",\"175Hz ultra-fast refresh rate and 0.03ms GtG pixel response\",\"USB-C 90W Power Delivery Hub with integrated KVM switch\"]");
                p6.setSpecsJson("{\"Resolution\":\"3440 x 1440 (UWQHD)\",\"Panel Type\":\"QD-OLED\",\"Refresh Rate\":\"175 Hz\",\"Curve\":\"1000R\"}");
                p6.setColorsJson("[]");
                p6.setTagsJson("[\"monitor\",\"gaming\",\"oled\",\"ultrawide\"]");
                p6.setIsFeatured(false);
                p6.setIsTrending(true);
                p6.setBadge("HOT");
                p6.setCreatedAt(Instant.now().toString());
                productRepository.save(p6);

                System.out.println(">> [SEED] Successfully seeded 6 catalog products!");
            }

            // Testing price override: Set all products to ₹1.00 for live Razorpay testing
            productRepository.findAll().forEach(p -> {
                p.setPrice(1.00);
                p.setOriginalPrice(1.00);
                p.setDiscountPercent(0);
                productRepository.save(p);
            });
            System.out.println(">> [TESTING] All products successfully updated to ₹1.00 for live Razorpay testing!");

            // 3. Seed sample orders if empty
            if (orderRepository.count() == 0) {
                OrderEntity o1 = new OrderEntity();
                o1.setId("ORD-892401");
                o1.setUserId("usr_customer");
                o1.setDate(LocalDate.now().minusDays(1).toString());
                o1.setSubtotal(299.99);
                o1.setDiscount(0.0);
                o1.setShipping(0.0);
                o1.setShippingMethod("Express Next-Day Air");
                o1.setTax(24.00);
                o1.setTotal(323.99);
                o1.setPaymentMethod("card");
                o1.setStatus("Shipped");
                o1.setEstimatedDelivery("Tomorrow by 7:00 PM");
                o1.setTrackingNumber("LUM-TRK-789012");
                o1.setItemsJson("[{\"quantity\":1,\"selectedColor\":\"Matte Obsidian\",\"product\":{\"id\":\"prod-1\",\"name\":\"AuraPulse Pro Noise-Cancelling Headphones\",\"price\":299.99,\"images\":[\"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80\"]}}]");
                o1.setShippingAddressJson("{\"fullName\":\"Alex Morgan\",\"email\":\"customer@lumina.com\",\"phone\":\"+1 555-0199\",\"addressLine1\":\"742 Evergreen Terrace\",\"city\":\"Springfield\",\"state\":\"OR\",\"postalCode\":\"97477\",\"country\":\"USA\"}");
                orderRepository.save(o1);

                OrderEntity o2 = new OrderEntity();
                o2.setId("ORD-941122");
                o2.setUserId("usr_customer");
                o2.setDate(LocalDate.now().toString());
                o2.setSubtotal(169.50);
                o2.setDiscount(0.0);
                o2.setShipping(15.0);
                o2.setShippingMethod("Standard Delivery");
                o2.setTax(13.56);
                o2.setTotal(198.06);
                o2.setPaymentMethod("upi");
                o2.setStatus("Processing");
                o2.setEstimatedDelivery("3-5 Business Days");
                o2.setTrackingNumber("LUM-TRK-334190");
                o2.setItemsJson("[{\"quantity\":1,\"selectedColor\":\"Retro Industrial\",\"product\":{\"id\":\"prod-4\",\"name\":\"CyberKey Studio Mechanical Keyboard\",\"price\":169.50,\"images\":[\"https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80\"]}}]");
                o2.setShippingAddressJson("{\"fullName\":\"Alex Morgan\",\"email\":\"customer@lumina.com\",\"phone\":\"+1 555-0199\",\"addressLine1\":\"742 Evergreen Terrace\",\"city\":\"Springfield\",\"state\":\"OR\",\"postalCode\":\"97477\",\"country\":\"USA\"}");
                orderRepository.save(o2);

                System.out.println(">> [SEED] Successfully seeded initial demo orders!");
            }
        };
    }
}
