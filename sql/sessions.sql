CREATE TABLE `sessions` (
  `session_id` varchar(255) NOT NULL,
  `account_token` varchar(255) NULL,
  `account_id` int(10) UNSIGNED NOT NULL,
  `login_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);