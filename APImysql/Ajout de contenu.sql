INSERT INTO `beavr_dev`.`Roles` (`idRoles`, `role`, `desc`) VALUES ('1', 'Administrateurs', 'Equipe qui développe le projet');
INSERT INTO `beavr_dev`.`Roles` (`idRoles`, `role`, `desc`) VALUES ('2', 'Modérateurs', 'Equipe qui valide les applications');
INSERT INTO `beavr_dev`.`Roles` (`idRoles`, `role`, `desc`) VALUES ('3', 'Développeurs', 'Utilisateurs qui soumette leurs applications sur le store');
INSERT INTO `beavr_dev`.`Roles` (`idRoles`, `role`, `desc`) VALUES ('4', 'Users', 'Utilisateurs qui utilise notre solution');

ALTER TABLE `Devices` ADD `image` VARCHAR(255) NOT NULL AFTER `name`;

INSERT INTO `beavr_dev`.`Devices` (`idDevices`, `name`) VALUES ('1', 'No Device');
INSERT INTO `beavr_dev`.`Devices` (`idDevices`, `name`) VALUES ('2', 'Leap Motion');
INSERT INTO `beavr_dev`.`Devices` (`idDevices`, `name`) VALUES ('3', 'Gant VR');
INSERT INTO `beavr_dev`.`Devices` (`idDevices`, `name`) VALUES ('4', 'Occulus Rift');
INSERT INTO `beavr_dev`.`Devices` (`idDevices`, `name`) VALUES ('5', 'Hololens');
INSERT INTO `beavr_dev`.`Devices` (`idDevices`, `name`) VALUES ('6', 'PlayStation VR');
INSERT INTO `beavr_dev`.`Devices` (`idDevices`, `name`) VALUES ('7', 'HTC Vive');
INSERT INTO `beavr_dev`.`Devices` (`idDevices`, `name`) VALUES ('8', 'Samsung Gear VR');

UPDATE `Devices` SET`image` = "";

CREATE TABLE IF NOT EXISTS `StatesApplications` (
`idState` int(11) NOT NULL,
  `state` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `StatesApplications`
 ADD PRIMARY KEY (`idState`);

ALTER TABLE `StatesApplications`
MODIFY `idState` int(11) NOT NULL AUTO_INCREMENT;

INSERT INTO `beavr_dev`.`StatesApplications` (`idState`, `state`) VALUES ('1', 'Validée');
INSERT INTO `beavr_dev`.`StatesApplications` (`idState`, `state`) VALUES ('2', 'Refusée');
INSERT INTO `beavr_dev`.`StatesApplications` (`idState`, `state`) VALUES ('3', 'En cours de validation');

INSERT INTO `beavr_dev`.`CategoryTypes` (`idCategoryTypes`, `description`) VALUES ('1', 'Sans catégorie');
INSERT INTO `beavr_dev`.`CategoryTypes` (`idCategoryTypes`, `description`) VALUES ('2', 'Science');
INSERT INTO `beavr_dev`.`CategoryTypes` (`idCategoryTypes`, `description`) VALUES ('3', 'Sport');
INSERT INTO `beavr_dev`.`CategoryTypes` (`idCategoryTypes`, `description`) VALUES ('4', 'Mécanique');

INSERT INTO `beavr_dev`.`Categories` (`idCategories`, `name`, `description`, `type`) VALUES ('1', 'Mathématique', 'Les chiffres vous parlent ? ', '2');
INSERT INTO `beavr_dev`.`Categories` (`idCategories`, `name`, `description`, `type`) VALUES ('2', 'Géologie', 'Les pierres ça vous dit ', '2');
INSERT INTO `beavr_dev`.`Categories` (`idCategories`, `name`, `description`, `type`) VALUES ('3', 'Astrologie', 'Un signe, un destin... ', '2');
INSERT INTO `beavr_dev`.`Categories` (`idCategories`, `name`, `description`, `type`) VALUES ('4', 'Jeux de cartes', 'Le poker c''est facile !', '3');
INSERT INTO `beavr_dev`.`Categories` (`idCategories`, `name`, `description`, `type`) VALUES ('5', 'Plomberie', 'Réparation de vos chiottes', '4');


INSERT INTO `beavr_dev`.`Applications` (`idApplications`, `name`, `description`, `creationdate`, `price`, `headdevice`, `handsdevice`, `state`, `author`, `category`, `url`) VALUES ('1', 'Application Test', 'Une application des plus complète...', '2015-10-29', '9.99', '2', '4', '0', '2', '2', 'beavr.fr');


ALTER TABLE `Applications` DROP INDEX headdevice
ALTER TABLE `Applications` ADD `headDevice` INT NOT NULL AFTER `price`;
ALTER TABLE `Applications` DROP `state`;
ALTER TABLE `Applications` ADD `handDevice` INT NOT NULL AFTER `headDevice`;
