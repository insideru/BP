  CREATE TABLE `daysoff` (
  `id` int(10) UNSIGNED NOT NULL,
  `collab_id` int(10) UNSIGNED NOT NULL,
  `startdate` date NOT NULL,
  `enddate` date NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

  ALTER TABLE `daysoff`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `daysoff`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

  -- ------------------------------------------------------------------

  CREATE TABLE `holidays` (
  `id` int(10) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `name` varchar(255) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

  ALTER TABLE `holidays`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `date` (`date`);

ALTER TABLE `holidays`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;