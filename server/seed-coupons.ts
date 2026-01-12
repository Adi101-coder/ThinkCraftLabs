import { db } from "./db";
import { coupons } from "@shared/schema";

async function seedCoupons() {
  console.log("Seeding coupons...");

  const sampleCoupons = [
    {
      code: "FIRST10",
      discountType: "percentage",
      discountValue: 10,
      minPurchase: 0,
      maxDiscount: 50,
      usageLimit: null,
      isActive: true,
      firstTimeOnly: true,
      description: "10% off for first-time customers (max $50)",
    },
    {
      code: "WELCOME20",
      discountType: "percentage",
      discountValue: 20,
      minPurchase: 100,
      maxDiscount: 100,
      usageLimit: 100,
      isActive: true,
      firstTimeOnly: true,
      description: "20% off on orders over $100 for new customers",
    },
    {
      code: "SAVE15",
      discountType: "fixed",
      discountValue: 15,
      minPurchase: 50,
      maxDiscount: null,
      usageLimit: null,
      isActive: true,
      firstTimeOnly: false,
      description: "$15 off on orders over $50",
    },
    {
      code: "MEGA25",
      discountType: "percentage",
      discountValue: 25,
      minPurchase: 200,
      maxDiscount: 150,
      usageLimit: 50,
      isActive: true,
      firstTimeOnly: false,
      description: "25% off on orders over $200 (max $150)",
    },
    {
      code: "FREESHIP",
      discountType: "fixed",
      discountValue: 10,
      minPurchase: 30,
      maxDiscount: null,
      usageLimit: null,
      isActive: true,
      firstTimeOnly: false,
      description: "$10 off shipping on orders over $30",
    },
  ];

  for (const coupon of sampleCoupons) {
    try {
      await db.insert(coupons).values(coupon);
      console.log(`✓ Created coupon: ${coupon.code}`);
    } catch (error) {
      console.log(`✗ Coupon ${coupon.code} already exists or error occurred`);
    }
  }

  console.log("Coupon seeding complete!");
  process.exit(0);
}

seedCoupons().catch((error) => {
  console.error("Error seeding coupons:", error);
  process.exit(1);
});
