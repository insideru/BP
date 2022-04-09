CREATE TABLE `accounts` (
  `account_id` int(10) UNSIGNED NOT NULL,
  `collab_id` int(10) UNSIGNED NOT NULL,
  `guid` varchar(255) NOT NULL,
  `account_group` tinyint(1) UNSIGNED NOT NULL,
  `account_username` varchar(255) NOT NULL,
  `account_passwd` varchar(255) NOT NULL,
  `account_reg_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `account_enabled` tinyint(1) UNSIGNED NOT NULL DEFAULT '1',
  `zile_concediu` int(10) UNSIGNED NOT NULL DEFAULT '20',
  `zile_report` int(10) NOT NULL DEFAULT '0',
  `zile_ramase` int(10) NOT NULL DEFAULT '20'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `accounts`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `account_username` (`account_username`);
  ADD UNIQUE KEY `collab_id` (`collab_id`);

ALTER TABLE `accounts`
  MODIFY `account_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;