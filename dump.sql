CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(10) unsigned NOT NULL,
  `level` int(10) unsigned NOT NULL,
  `left_key` int(10) unsigned NOT NULL,
  `right_key` int(10) unsigned NOT NULL,
  `author` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

ALTER TABLE `comments`
 ADD PRIMARY KEY (`id`), ADD KEY `left_key` (`left_key`), ADD KEY `right_key` (`right_key`);

ALTER TABLE `comments`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;