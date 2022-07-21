  CREATE TABLE `permissions` (
  `id` int(10) UNSIGNED NOT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT 0,
  `bonus` tinyint(1) NOT NULL DEFAULT 0,
  `external` tinyint(1) NOT NULL DEFAULT 0,
  `holiday` tinyint(1) NOT NULL DEFAULT 0,
  `timesheet` tinyint(1) NOT NULL DEFAULT 0,
  `raport` tinyint(1) NOT NULL DEFAULT 0,
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `permissions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

INSERT INTO `permissions` (admin, bonus, external, holiday, timesheet) VALUES (1, 1, 1, 1, 1, 1);