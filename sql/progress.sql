CREATE TABLE `progress` (
  `id` int(10) UNSIGNED NOT NULL,
  `collab_id` int(10) UNSIGNED NOT NULL,
  `project_id` int(10) UNSIGNED NOT NULL,
  `phase_id` int(10) UNSIGNED NOT NULL,
  `milestone_id` int(10) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `progress` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `progress`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `progress`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;