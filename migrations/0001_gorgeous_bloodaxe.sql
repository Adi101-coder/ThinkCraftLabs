CREATE TABLE `coupons` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`discount_type` text NOT NULL,
	`discount_value` real NOT NULL,
	`min_purchase` real DEFAULT 0 NOT NULL,
	`max_discount` real,
	`usage_limit` integer,
	`used_count` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`valid_from` integer NOT NULL,
	`valid_until` integer,
	`first_time_only` integer DEFAULT false NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `coupons_code_unique` ON `coupons` (`code`);--> statement-breakpoint
ALTER TABLE `orders` ADD `subtotal` real NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `discount` real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `coupon_code` text;