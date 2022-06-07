  CREATE TABLE `salaries` (
  `id` int(10) UNSIGNED NOT NULL,
  `collab_id` int(10) NOT NULL,
  `hourly` int(10) NOT NULL DEFAULT 0,
  `monthly` int(10) NOT NULL DEFAULT 0,
  `date` DATE NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

  ALTER TABLE `salaries`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `salaries`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;