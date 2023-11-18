CREATE TABLE `appointment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int,
	`counselor_id` int,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `appointment_id` PRIMARY KEY(`id`)
);

CREATE TABLE `counselor` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(30) DEFAULT 'Anonymous',
	`password` varchar(256),
	`email` varchar(30),
	`contact` varchar(15),
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `counselor_id` PRIMARY KEY(`id`)
);

CREATE TABLE `student` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(30) DEFAULT 'Anonymous',
	`psuedonym` varchar(30),
	`password` varchar(256),
	`email` varchar(1024),
	`contact` varchar(1024),
	`chats` json,
	`reg_no` varchar(20),
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `student_id` PRIMARY KEY(`id`),
	CONSTRAINT `student_psuedonym_unique` UNIQUE(`psuedonym`)
);

CREATE TABLE `tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(36) NOT NULL,
	`is_valid` boolean DEFAULT true,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`user_id` int NOT NULL,
	`who` enum('counselor','student'),
	`type` enum('email_verification','password_reset','bearer') NOT NULL,
	CONSTRAINT `tokens_id` PRIMARY KEY(`id`)
);

ALTER TABLE `appointment` ADD CONSTRAINT `appointment_student_id_student_id_fk` FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `appointment` ADD CONSTRAINT `appointment_counselor_id_counselor_id_fk` FOREIGN KEY (`counselor_id`) REFERENCES `counselor`(`id`) ON DELETE no action ON UPDATE no action;