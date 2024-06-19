CREATE TABLE `shipping` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`father` text,
	`mothers_father` text,
	`mothers_grandfather` text,
	`grandmothers_grandfather` text,
	`mating_date` text,
	`expected_birth_date` text,
	`birth_date` text,
	`auction_date` text,
	`weight` integer DEFAULT 0,
	`days_old` integer DEFAULT 0,
	`sex` text,
	`price` integer DEFAULT 0,
	`buyer` text,
	`memo` text
);
--> statement-breakpoint
CREATE TABLE `todoss` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`todo` text NOT NULL,
	`score` integer DEFAULT 0,
	`isDone` integer DEFAULT false,
	`create_at` text DEFAULT CURRENT_TIMESTAMP
);
