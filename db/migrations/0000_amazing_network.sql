CREATE TABLE `users` (
	`user_id` varchar(32) NOT NULL,
	`name` varchar(20) DEFAULT 'Anonymous',
	`password` varchar(256),
	`email` varchar(30),
	`is_ephemeral` boolean DEFAULT true,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`is_admin` boolean DEFAULT false,
	CONSTRAINT `users_user_id` PRIMARY KEY(`user_id`)
);
