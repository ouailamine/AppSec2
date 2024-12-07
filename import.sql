INSERT INTO genres (`name`) VALUES ('Male'), ('Female');

INSERT INTO
    type_Ads (name)
VALUES ('Magasin'),
    ('Guardiennage'),
    ('Touts');

INSERT INTO
    posts (
        name,
        abbreviation,
        type_post_id,
        default_duration_minutes,
        default_duration_hours
    )
VALUES (
        'agent de sécurité jour',
        'ADJ',
        3,
        5,
        30
    ), -- ID pour 'Travail normal'
    (
        'Agent sécurité incendie 1 jour',
        'S1J',
        2,
        5,
        30
    ),
    (
        'Agent sécurité incendie 2 jour',
        'S2J',
        2,
        5,
        30
    ),
    (
        'Agent sécurité incendie 3 jour',
        'S3J',
        2,
        5,
        30
    ),
    (
        'Agent sécurité cynophile jour',
        'ACJ',
        2,
        5,
        30
    ), -- ID pour 'En Formation'
    (
        'agent de sécurité nuit',
        'ADN',
        3,
        5,
        30
    ), -- ID pour 'Congé payé'
    (
        'Agent sécurité incendie 1 nuit',
        'S1N',
        2,
        5,
        30
    ),
    (
        'Agent sécurité incendie 2 nuit',
        'S2N',
        2,
        5,
        30
    ),
    (
        'Agent sécurité incendie 3 nuit',
        'S3N',
        2,
        5,
        30
    ),
    (
        'Agent sécurité cynophile nuit',
        'ACN',
        2,
        5,
        30
    );
-- ID pour 'Congé parental'
INSERT INTO
    type_posts (name, default_duration)
VALUES ('Indisponible', false),
    ('Absence', true),
    ('Sécurité Incendie', false),
    ('Sureté', false);

INSERT INTO
    diplomas (
        name,
        validity_months,
        endDate
    )
VALUES ('Ads', 60, '2024-07-31'),
    ('SSIAP1', 36, '2024-07-31'),
    ('SSIAP2', 36, '2024-07-31'),
    ('SSIAP3', 36, '2024-07-31'),
    ('Cynophile', 36, '2024-07-31');

INSERT INTO
    `nationalities` (`id`, `name`)
VALUES ('1', 'Afghane'),
    ('2', 'Sud-africaine'),
    ('3', 'Albanaise'),
    ('4', 'Algérienne'),
    ('5', 'Allemande'),
    ('6', 'Andorrane'),
    ('7', 'Angolaise'),
    (
        '8',
        'Antiguaise et barbudienne'
    ),
    ('9', 'Saoudienne'),
    ('10', 'Argentine'),
    ('11', 'Arménienne'),
    ('12', 'Australienne'),
    ('13', 'Autrichienne'),
    ('14', 'Azerbaïdjanaise'),
    ('15', 'Bahamienne'),
    ('16', 'Bahreinienne'),
    ('17', 'Bangladaise'),
    ('18', 'Barbadienne'),
    ('19', 'Biélorusse'),
    ('20', 'Belge'),
    ('21', 'Bélizienne'),
    ('22', 'Béninoise'),
    ('23', 'Bhoutanaise'),
    ('24', 'Bolivienne'),
    ('25', 'Bosnienne'),
    ('26', 'Botswanaise'),
    ('27', 'Brésilienne'),
    ('28', 'Bruneienne'),
    ('29', 'Bulgare'),
    ('30', 'Burkinabé'),
    ('31', 'Burundaise'),
    ('32', 'Cap-verdienne'),
    ('33', 'Cambodgienne'),
    ('34', 'Camerounaise'),
    ('35', 'Canadienne'),
    ('36', 'Chilienne'),
    ('37', 'Chinoise'),
    ('38', 'Chypriote'),
    ('39', 'Colombienne'),
    ('40', 'Comorienne'),
    ('41', 'Congolaise'),
    ('42', 'Congolaise (Kinshasa)'),
    ('43', 'Sud-coréenne'),
    ('44', 'Nord-coréenne'),
    ('45', 'Costaricaine'),
    ('46', 'Ivoirienne'),
    ('47', 'Croate'),
    ('48', 'Cubaine'),
    ('49', 'Danoise'),
    ('50', 'Djiboutienne'),
    ('51', 'Dominicaine'),
    ('52', 'Dominiquaise'),
    ('53', 'Egyptienne'),
    ('54', 'Salvadorienne'),
    ('55', 'Emirienne'),
    ('56', 'Equatorienne'),
    ('57', 'Erythréenne'),
    ('58', 'Espagnole'),
    ('59', 'Estonienne'),
    ('60', 'Américaine'),
    ('61', 'Ethiopienne'),
    ('62', 'Fidjienne'),
    ('63', 'Finlandaise'),
    ('64', 'Française'),
    ('65', 'Gabonaise'),
    ('66', 'Gambienne'),
    ('67', 'Georgienne'),
    ('68', 'Ghanéenne'),
    ('69', 'Hellénique'),
    ('70', 'Grenadienne'),
    ('71', 'Guatemaltèque'),
    ('72', 'Guinéenne'),
    ('73', 'Equato-guinéenne'),
    ('74', 'Bissau-Guinéenne'),
    ('75', 'Guyanaise (Guyana)'),
    ('76', 'Guyanienne'),
    ('77', 'Haïtienne'),
    ('78', 'Hondurienne'),
    ('79', 'Hongroise'),
    ('80', 'Indienne'),
    ('81', 'Indonésienne'),
    ('82', 'Iranienne'),
    ('83', 'Irakienne'),
    ('84', 'Irlandaise'),
    ('85', 'Islandaise'),
    ('86', 'Israélienne'),
    ('87', 'Italienne'),
    ('88', 'Jamaïcaine'),
    ('89', 'Japonaise'),
    ('90', 'Jordanienne'),
    ('91', 'Kazakhstanaise'),
    ('92', 'Kenyane'),
    ('93', 'Kirghize'),
    ('94', 'Kiribatienne'),
    ('95', 'Koweitienne'),
    ('96', 'Laotienne'),
    ('97', 'Lesothane'),
    ('98', 'Lettone'),
    ('99', 'Libanaise'),
    ('100', 'Libérienne'),
    ('101', 'Libyenne'),
    ('102', 'Liechtensteinoise'),
    ('103', 'Lituanienne'),
    ('104', 'Luxembourgeoise'),
    ('105', 'Macédonienne'),
    ('106', 'Malgache'),
    ('107', 'Malaisienne'),
    ('108', 'Malawienne'),
    ('109', 'Maldivienne'),
    ('110', 'Malienne'),
    ('111', 'Maltaise'),
    ('112', 'Marocaine'),
    ('113', 'Marshallaise'),
    ('114', 'Mauricienne'),
    ('115', 'Mauritanienne'),
    ('116', 'Mexicaine'),
    ('117', 'Micronésienne'),
    ('118', 'Moldave'),
    ('119', 'Monégasque'),
    ('120', 'Mongole'),
    ('121', 'Monténégrine'),
    ('122', 'Mozambicaine'),
    ('123', 'Birmane'),
    ('124', 'Namibienne'),
    ('125', 'Nauruane'),
    ('126', 'Népalaise'),
    ('127', 'Nicaraguayenne'),
    ('128', 'Nigérienne'),
    ('129', 'Nigériane'),
    ('130', 'Norvégienne'),
    ('131', 'Neo-zélandaise'),
    ('132', 'Omanaise'),
    ('133', 'Ougandaise'),
    ('134', 'Ouzbeke'),
    ('135', 'Pakistanaise'),
    ('136', 'Palau'),
    ('137', 'Palestinienne'),
    ('138', 'Panaméenne'),
    (
        '139',
        'Papouane-neoguinéenne'
    ),
    ('140', 'Paraguayenne'),
    ('141', 'Néerlandaise'),
    ('142', 'Péruvienne'),
    ('143', 'Philippine'),
    ('144', 'Polonaise'),
    ('145', 'Portoricaine'),
    ('146', 'Portugaise'),
    ('147', 'Qatarienne'),
    ('148', 'Syrienne'),
    ('149', 'Centrafricaine'),
    ('150', 'Roumaine'),
    ('151', 'Britannique (RU)'),
    ('152', 'Russe'),
    ('153', 'Rwandaise'),
    ('154', 'Saint-Lucienne'),
    (
        '155',
        'Kittitienne-et-névicienne'
    ),
    ('156', 'Saint-Marinaise'),
    (
        '157',
        'Saint-Vincentaise-et-Grenadine'
    ),
    ('158', 'Salomonaise'),
    ('159', 'Samoane'),
    ('160', 'Santoméenne'),
    ('161', 'Sénégalaise'),
    ('162', 'Serbe'),
    ('163', 'Seychelloise'),
    ('164', 'Sierra-leonaise'),
    ('165', 'Singapourienne'),
    ('166', 'Slovaque'),
    ('167', 'Slovène'),
    ('168', 'Somalienne'),
    ('169', 'Soudanaise'),
    ('170', 'Sud soudanaise'),
    ('171', 'Sri-lankaise'),
    ('172', 'Suédoise'),
    ('173', 'Suisse'),
    ('174', 'Surinamaise'),
    ('175', 'Tadjike'),
    ('176', 'Taiwanaise'),
    ('177', 'Tanzanienne'),
    ('178', 'Tchadienne'),
    ('179', 'Tchèque'),
    ('180', 'Thaïlandaise'),
    ('181', 'Est-timoraise'),
    ('182', 'Togolaise'),
    ('183', 'Tongienne'),
    ('184', 'Trinidadienne'),
    ('185', 'Tunisienne'),
    ('186', 'Turkmène'),
    ('187', 'Turque'),
    ('188', 'Tuvaluane'),
    ('189', 'Ukrainienne'),
    ('190', 'Uruguayenne'),
    ('191', 'Vanuatuane'),
    ('192', 'Vénézuélienne'),
    ('193', 'Vietnamienne'),
    ('194', 'Yéménite'),
    ('195', 'Zambienne'),
    ('196', 'Zimbabwéenne');

INSERT INTO
    `departements` (
        id,
        `region_code`,
        `departement_code`,
        `name`
    )
VALUES (1, 84, 01, 'Ain'),
    (2, 32, 02, 'Aisne'),
    (3, 84, 03, 'Allier'),
    (
        4,
        93,
        04,
        'Alpes-de-Haute-Provence'
    ),
    (5, 93, 05, 'Hautes-Alpes'),
    (6, 93, 06, 'Alpes-Maritimes'),
    (7, 84, 07, 'Ardèche'),
    (8, 44, 08, 'Ardennes'),
    (9, 76, 09, 'Ariège'),
    (10, 44, 10, 'Aube'),
    (11, 76, 11, 'Aude'),
    (12, 76, 12, 'Aveyron'),
    (
        13,
        93,
        13,
        'Bouches-du-Rhône'
    ),
    (14, 28, 14, 'Calvados'),
    (15, 84, 15, 'Cantal'),
    (16, 75, 16, 'Charente'),
    (
        17,
        75,
        17,
        'Charente-Maritime'
    ),
    (18, 24, 18, 'Cher'),
    (19, 75, 19, 'Corrèze'),
    (20, 27, 21, 'Côte-dOr'),
    (21, 53, 22, 'Côtes-dArmor'),
    (22, 75, 23, 'Creuse'),
    (23, 75, 24, 'Dordogne'),
    (24, 27, 25, 'Doubs'),
    (25, 84, 26, 'Drôme'),
    (26, 28, 27, 'Eure'),
    (27, 24, 28, 'Eure-et-Loir'),
    (28, 53, 29, 'Finistère'),
    (31, 76, 30, 'Gard'),
    (32, 76, 31, 'Haute-Garonne'),
    (33, 76, 32, 'Gers'),
    (34, 75, 33, 'Gironde'),
    (35, 76, 34, 'Hérault'),
    (36, 53, 35, 'Ille-et-Vilaine'),
    (37, 24, 36, 'Indre'),
    (38, 24, 37, 'Indre-et-Loire'),
    (39, 84, 38, 'Isère'),
    (40, 27, 39, 'Jura'),
    (41, 75, 40, 'Landes'),
    (42, 24, 41, 'Loir-et-Cher'),
    (43, 84, 42, 'Loire'),
    (44, 84, 43, 'Haute-Loire'),
    (
        45,
        52,
        44,
        'Loire-Atlantique'
    ),
    (46, 24, 45, 'Loiret'),
    (47, 76, 46, 'Lot'),
    (48, 75, 47, 'Lot-et-Garonne'),
    (49, 76, 48, 'Lozère'),
    (50, 52, 49, 'Maine-et-Loire'),
    (51, 28, 50, 'Manche'),
    (52, 44, 51, 'Marne'),
    (53, 44, 52, 'Haute-Marne'),
    (54, 52, 53, 'Mayenne'),
    (
        55,
        44,
        54,
        'Meurthe-et-Moselle'
    ),
    (56, 44, 55, 'Meuse'),
    (57, 53, 56, 'Morbihan'),
    (58, 44, 57, 'Moselle'),
    (59, 27, 58, 'Nièvre'),
    (60, 32, 59, 'Nord'),
    (61, 32, 60, 'Oise'),
    (62, 28, 61, 'Orne'),
    (63, 32, 62, 'Pas-de-Calais'),
    (64, 84, 63, 'Puy-de-Dôme'),
    (
        65,
        75,
        64,
        'Pyrénées-Atlantiques'
    ),
    (66, 76, 65, 'Hautes-Pyrénées'),
    (
        67,
        76,
        66,
        'Pyrénées-Orientales'
    ),
    (68, 44, 67, 'Bas-Rhin'),
    (69, 44, 68, 'Haut-Rhin'),
    (70, 84, 69, 'Rhône'),
    (71, 27, 70, 'Haute-Saône'),
    (72, 27, 71, 'Saône-et-Loire'),
    (73, 52, 72, 'Sarthe'),
    (74, 84, 73, 'Savoie'),
    (75, 84, 74, 'Haute-Savoie'),
    (76, 11, 75, 'Paris'),
    (77, 28, 76, 'Seine-Maritime'),
    (78, 11, 77, 'Seine-et-Marne'),
    (79, 11, 78, 'Yvelines'),
    (80, 75, 79, 'Deux-Sèvres'),
    (81, 32, 80, 'Somme'),
    (82, 76, 81, 'Tarn'),
    (83, 76, 82, 'Tarn-et-Garonne'),
    (84, 93, 83, 'Var'),
    (85, 93, 84, 'Vaucluse'),
    (86, 52, 85, 'Vendée'),
    (87, 75, 86, 'Vienne'),
    (88, 75, 87, 'Haute-Vienne'),
    (89, 44, 88, 'Vosges'),
    (90, 27, 89, 'Yonne'),
    (
        91,
        27,
        90,
        'Territoire de Belfort'
    ),
    (92, 11, 91, 'Essonne'),
    (93, 11, 92, 'Hauts-de-Seine'),
    (
        94,
        11,
        93,
        'Seine-Saint-Denis'
    ),
    (95, 11, 94, 'Val-de-Marne'),
    (96, 11, 95, 'Val-dOise'),
    (97, 01, 971, 'Guadeloupe'),
    (98, 02, 972, 'Martinique'),
    (99, 03, 973, 'Guyane'),
    (100, 04, 974, 'La Réunion'),
    (101, 06, 976, 'Mayotte');

INSERT INTO
    `regions` (id, `region_code`, `name`)
VALUES (1, 01, 'Guadeloupe'),
    (2, 02, 'Martinique'),
    (3, 03, 'Guyane'),
    (4, 04, 'La Réunion'),
    (5, 06, 'Mayotte'),
    (6, 11, 'Île-de-France'),
    (7, 24, 'Centre-Val de Loire'),
    (
        8,
        27,
        'Bourgogne-Franche-Comté'
    ),
    (9, 28, 'Normandie'),
    (10, 32, 'Hauts-de-France'),
    (11, 44, 'Grand Est'),
    (12, 52, 'Pays de la Loire'),
    (13, 53, 'Bretagne'),
    (14, 75, 'Nouvelle-Aquitaine'),
    (15, 76, 'Occitanie'),
    (
        16,
        84,
        'Auvergne-Rhône-Alpes'
    ),
    (
        17,
        93,
        'Provence-Alpes-Côte dAzur'
    ),
    (18, 94, 'Corse'),
    (
        19,
        'COM',
        'Collectivités Outre-Mer'
    );

INSERT INTO
    sites (
        name,
        manager_name,
        address,
        email,
        phone,
        created_at,
        updated_at
    )
VALUES (
        'Univ Paul Valery',
        'John Doe',
        '123 University Ave, City',
        'contact@univpaulvalery.edu',
        '123-456-7890',
        NOW(),
        NOW()
    ),
    (
        'Apple',
        'Jane Smith',
        '1 Apple Park Way, Cupertino, CA',
        'contact@apple.com',
        '987-654-3210',
        NOW(),
        NOW()
    );

-- Insérer les jours fériés pour 2024
INSERT INTO
    holidays (
        name,
        date,
        created_at,
        updated_at
    )
VALUES (
        'Jour de l\'An',
        '2024-01-01',
        NOW(),
        NOW()
    ),
    (
        'Lundi de Pâques',
        '2024-04-01',
        NOW(),
        NOW()
    ),
    (
        'Fête du Travail',
        '2024-05-01',
        NOW(),
        NOW()
    ),
    (
        'Victoire 1945',
        '2024-05-08',
        NOW(),
        NOW()
    ),
    (
        'Ascension',
        '2024-05-30',
        NOW(),
        NOW()
    ),
    (
        'Lundi de Pentecôte',
        '2024-06-10',
        NOW(),
        NOW()
    ),
    (
        'Fête Nationale',
        '2024-07-14',
        NOW(),
        NOW()
    ),
    (
        'Assomption',
        '2024-08-15',
        NOW(),
        NOW()
    ),
    (
        'Toussaint',
        '2024-11-01',
        NOW(),
        NOW()
    ),
    (
        'Armistice',
        '2024-11-11',
        NOW(),
        NOW()
    ),
    (
        'Noël',
        '2024-12-25',
        NOW(),
        NOW()
    );

-- Insérer les jours fériés pour 2025
INSERT INTO
    holidays (
        name,
        date,
        created_at,
        updated_at
    )
VALUES (
        'Jour de l\'An',
        '2025-01-01',
        NOW(),
        NOW()
    ),
    (
        'Lundi de Pâques',
        '2025-04-21',
        NOW(),
        NOW()
    ),
    (
        'Fête du Travail',
        '2025-05-01',
        NOW(),
        NOW()
    ),
    (
        'Victoire 1945',
        '2025-05-08',
        NOW(),
        NOW()
    ),
    (
        'Ascension',
        '2025-05-29',
        NOW(),
        NOW()
    ),
    (
        'Lundi de Pentecôte',
        '2025-06-09',
        NOW(),
        NOW()
    ),
    (
        'Fête Nationale',
        '2025-07-14',
        NOW(),
        NOW()
    ),
    (
        'Assomption',
        '2025-08-15',
        NOW(),
        NOW()
    ),
    (
        'Toussaint',
        '2025-11-01',
        NOW(),
        NOW()
    ),
    (
        'Armistice',
        '2025-11-11',
        NOW(),
        NOW()
    ),
    (
        'Noël',
        '2025-12-25',
        NOW(),
        NOW()
    );

-- Insérer les jours fériés pour 2026
INSERT INTO
    holidays (
        name,
        date,
        created_at,
        updated_at
    )
VALUES (
        'Jour de l\'An',
        '2026-01-01',
        NOW(),
        NOW()
    ),
    (
        'Lundi de Pâques',
        '2026-04-06',
        NOW(),
        NOW()
    ),
    (
        'Fête du Travail',
        '2026-05-01',
        NOW(),
        NOW()
    ),
    (
        'Victoire 1945',
        '2026-05-08',
        NOW(),
        NOW()
    ),
    (
        'Ascension',
        '2026-05-14',
        NOW(),
        NOW()
    ),
    (
        'Lundi de Pentecôte',
        '2026-05-25',
        NOW(),
        NOW()
    ),
    (
        'Fête Nationale',
        '2026-07-14',
        NOW(),
        NOW()
    ),
    (
        'Assomption',
        '2026-08-15',
        NOW(),
        NOW()
    ),
    (
        'Toussaint',
        '2026-11-01',
        NOW(),
        NOW()
    ),
    (
        'Armistice',
        '2026-11-11',
        NOW(),
        NOW()
    ),
    (
        'Noël',
        '2026-12-25',
        NOW(),
        NOW()
    );