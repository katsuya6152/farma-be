CREATE TABLE `todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`todo` text NOT NULL,
	`score` integer DEFAULT 0,
	`isDone` integer DEFAULT false,
	`create_at` text DEFAULT CURRENT_TIMESTAMP
);
