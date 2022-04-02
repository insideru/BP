CREATE TABLE `timesheets` (
    `id` int(10) UNSIGNED NOT NULL,
    `collab_id` int(10) UNSIGNED NOT NULL,
    `date` date NOT NULL,
    `project_id` int(10) UNSIGNED NOT NULL,
    `activity_id` int(10) UNSIGNED NOT NULL,
    `time` float(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `timesheets`
  ADD PRIMARY KEY (`id`);

  ALTER TABLE `timesheets`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

 -- -------------------------------------------------------------

  CREATE TABLE `attendance` (
    `id` int(10) UNSIGNED NOT NULL,
    `collab_id` int(10) UNSIGNED NOT NULL,
    `date` date NOT NULL,
    `start` varchar(5) NOT NULL,
    `end` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`);

  ALTER TABLE `attendance`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;