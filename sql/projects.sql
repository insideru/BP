CREATE TABLE `projects` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `client_id` int(10) NOT NULL,
  `type_id` int(10) NOT NULL,
  `external` tinyint(1) NOT NULL DEFAULT 1,
  `budget` INT(10) NOT NULL DEFAULT '100',
  `date_added` DATE NOT NULL DEFAULT (DATE_ADD(NOW())),
  `deadline` DATE NOT NULL DEFAULT (DATE_ADD(NOW())),
  `active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

ALTER TABLE `projects`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

-- ----------------------------------------------------------------

  CREATE TABLE `project_types` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `project_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

ALTER TABLE `project_types`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;