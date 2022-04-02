  CREATE TABLE `income` (
  `id` int(10) UNSIGNED NOT NULL,
  `sum` int(10) UNSIGNED NOT NULL,
  `project` int(10) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `income`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `income`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

-- ---------------------------------------------------------------------

  CREATE TABLE `expense` (
  `id` int(10) UNSIGNED NOT NULL,
  `sum` int(10) UNSIGNED NOT NULL,
  `project` int(10) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `expense`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `expense`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

  -- ------------------------------------------------------------------

    CREATE TABLE `expense_groups` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `color` int(10) UNSIGNED NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

  ALTER TABLE `expense_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

ALTER TABLE `expense_groups`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;