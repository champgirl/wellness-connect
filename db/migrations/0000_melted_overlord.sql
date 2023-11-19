CREATE TABLE `appointment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int,
	`counselor_id` int,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `appointment_id` PRIMARY KEY(`id`)
);

CREATE TABLE `chats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`chats` json,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `chats_id` PRIMARY KEY(`id`)
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

CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(30) NOT NULL,
	`description` varchar(30),
	`schedule_date` date NOT NULL,
	`schedule_time` time NOT NULL,
	`venue` varchar(30),
	`counselor` int NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);

CREATE TABLE `student` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(30) DEFAULT 'Anonymous',
	`pseudonym` varchar(30),
	`password` varchar(256),
	`email` varchar(1024),
	`contact` varchar(1024),
	`reg_no` varchar(20),
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `student_id` PRIMARY KEY(`id`),
	CONSTRAINT `student_pseudonym_unique` UNIQUE(`pseudonym`)
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
ALTER TABLE `chats` ADD CONSTRAINT `chats_student_id_student_id_fk` FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `events` ADD CONSTRAINT `events_counselor_counselor_id_fk` FOREIGN KEY (`counselor`) REFERENCES `counselor`(`id`) ON DELETE no action ON UPDATE no action;