/* Wardenclyffe legal proceedings directory: informational catalogue, NOT a filing service. */
(()=>{
'use strict';
const groups=[
['mx','civil',['Civil claims & contracts','Reclamaciones civiles y contratos','Actions civiles et contrats','民事诉讼与合同'],
['Breach of contract; Contract termination or rescission; Damages and compensation; Unjust enrichment; Debt collection; Nullity of juridical acts; Declaratory civil actions; Enforcement of judgment; Civil injunctions where available',
'Incumplimiento de contrato; Rescisión o terminación contractual; Daños y perjuicios; Enriquecimiento ilegítimo; Cobro de adeudos; Nulidad de actos jurídicos; Acciones declarativas; Ejecución de sentencia; Medidas precautorias civiles cuando procedan',
'Inexécution contractuelle; Résiliation ou résolution; Dommages-intérêts; Enrichissement injustifié; Recouvrement de créances; Nullité des actes juridiques; Actions déclaratoires; Exécution des jugements; Mesures conservatoires civiles',
'违约诉讼; 合同解除或终止; 损害赔偿; 不当得利; 债务追偿; 法律行为无效; 确认之诉; 判决执行; 适用时的民事保全措施']],
['mx','property',['Real estate, possession & leases','Inmuebles, posesión y arrendamiento','Immobilier, possession et baux','不动产、占有与租赁'],
['Eviction and lease disputes; Recovery of possession; Ownership and reivindicación actions; Adverse possession (usucapión); Mortgage foreclosure; Property partition; Boundary and survey disputes; Easements; Condominium disputes; Construction defects',
'Desahucio y controversias de arrendamiento; Recuperación de posesión; Acción reivindicatoria; Prescripción adquisitiva (usucapión); Juicio hipotecario; División de copropiedad; Deslinde y apeo; Servidumbres; Conflictos condominales; Defectos de construcción',
'Expulsion et litiges locatifs; Récupération de possession; Action en revendication; Prescription acquisitive; Procédure hypothécaire; Partage de copropriété; Bornage; Servitudes; Litiges de copropriété; Vices de construction',
'驱逐与租赁纠纷; 恢复占有; 物权返还之诉; 取得时效; 抵押权执行; 共有财产分割; 地界争议; 地役权; 公寓产权纠纷; 建筑缺陷']],
['mx','business',['Commercial litigation & collections','Juicios mercantiles y cobranza','Contentieux commercial et recouvrement','商业诉讼与债务催收'],
['Oral commercial proceedings; Ordinary commercial proceedings; Executory commercial actions; Promissory-note collection; Commercial contract breach; Collection on invoices; Preliminary commercial measures; Interim injunctions; Commercial arbitration enforcement',
'Juicio oral mercantil; Juicio ordinario mercantil; Juicio ejecutivo mercantil; Cobro de pagarés; Incumplimiento mercantil; Cobro de facturas; Medios preparatorios; Providencias precautorias; Ejecución de laudos arbitrales',
'Procédure commerciale orale; Action commerciale ordinaire; Procédure commerciale exécutoire; Recouvrement de billets à ordre; Inexécution commerciale; Recouvrement de factures; Mesures préparatoires; Mesures conservatoires; Exécution des sentences arbitrales',
'商事口头诉讼; 普通商事诉讼; 商事执行程序; 本票追偿; 商业合同违约; 发票欠款追收; 诉前准备程序; 保全措施; 仲裁裁决执行']],
['mx','business',['Corporate disputes & insolvency','Controversias societarias e insolvencia','Litiges sociétaires et insolvabilité','公司争议与破产'],
['Shareholder and partner disputes; Corporate resolution challenges; Director and officer liability; Commercial insolvency (concurso mercantil); Partnership dissolution; Company-related injunctions; Enforcement of commercial awards',
'Conflictos entre socios y accionistas; Impugnación de asambleas; Responsabilidad de administradores; Concurso mercantil; Disolución de sociedades; Medidas cautelares societarias; Ejecución de laudos mercantiles',
'Litiges entre associés; Contestation d’assemblées; Responsabilité des dirigeants; Procédure collective commerciale; Dissolution de société; Mesures conservatoires; Exécution de sentences commerciales',
'股东及合伙人争议; 股东会决议撤销; 董事高管责任; 商事破产程序; 公司解散; 公司保全措施; 商事仲裁裁决执行']],
['mx','family',['Divorce, children & family support','Divorcio, menores y alimentos','Divorce, enfants et obligations familiales','离婚、子女与家庭扶养'],
['No-fault divorce; Divorce by mutual agreement; Child support and arrears; Custody and parenting arrangements; Visitation or contact rights; Parentage recognition or challenge; Domestic protection proceedings; Modification of family orders; Child adoption',
'Divorcio incausado; Divorcio por mutuo consentimiento; Pensión alimenticia y adeudos; Guarda y custodia; Régimen de convivencias; Reconocimiento o impugnación de paternidad; Medidas de protección familiar; Modificación de resoluciones; Adopción',
'Divorce sans faute; Divorce par consentement mutuel; Pension alimentaire; Garde des enfants; Droit de visite; Reconnaissance ou contestation de filiation; Protection contre les violences familiales; Modification des décisions; Adoption',
'无过错离婚; 协议离婚; 子女抚养费及欠款; 抚养权; 探视权; 亲子关系确认或争议; 家庭保护程序; 家事裁定变更; 收养']],
['mx','family',['Inheritance, guardianship & family estate','Sucesiones, tutelas y patrimonio familiar','Successions, tutelle et patrimoine familial','继承、监护与家庭财产'],
['Intestate and testamentary succession; Estate administration; Will challenges; Probate disputes; Guardianship and legal-support measures; Family property disputes; Inheritance partition; Recognition of heirs',
'Juicios sucesorios intestamentarios y testamentarios; Administración de sucesión; Impugnación de testamento; Controversias hereditarias; Tutelas y medidas de apoyo; Conflictos patrimoniales familiares; Partición hereditaria; Declaración de herederos',
'Successions avec ou sans testament; Administration successorale; Contestation de testament; Litiges successoraux; Tutelle et mesures de soutien; Litiges patrimoniaux familiaux; Partage successoral; Reconnaissance d’héritiers',
'法定与遗嘱继承; 遗产管理; 遗嘱争议; 继承纠纷; 监护与法律支持措施; 家庭财产纠纷; 遗产分割; 继承人确认']],
['mx','labor',['Employment & social security','Trabajo y seguridad social','Travail et sécurité sociale','劳动与社会保障'],
['Unjustified dismissal; Unpaid salary and benefits; Employment reinstatement claims; Workplace discrimination; Workplace injury and occupational risk; Collective labor disputes; Social-security benefits appeals; Mandatory preliminary conciliation',
'Despido injustificado; Salarios y prestaciones pendientes; Reinstalación laboral; Discriminación laboral; Riesgos de trabajo; Conflictos colectivos; Impugnación de prestaciones de seguridad social; Conciliación prejudicial obligatoria',
'Licenciement injustifié; Salaires et prestations impayés; Réintégration; Discrimination; Accident du travail; Conflits collectifs; Recours en matière de sécurité sociale; Conciliation préalable obligatoire',
'不当解雇; 拖欠工资及福利; 恢复劳动关系; 职场歧视; 工伤及职业风险; 集体劳动争议; 社保待遇申诉; 强制诉前调解']],
['mx','government',['Administrative & tax disputes','Juicios administrativos y fiscales','Contentieux administratif et fiscal','行政与税务争议'],
['Nullity of administrative acts; Tax assessment challenges; Tax-authority appeals; Government sanctions; Permit and licensing disputes; Public procurement disputes; State liability claims; Enforcement of administrative judgments',
'Juicio de nulidad administrativa; Impugnación de créditos fiscales; Recursos ante autoridades fiscales; Multas y sanciones; Licencias y permisos; Contratación pública; Responsabilidad patrimonial del Estado; Cumplimiento de sentencias administrativas',
'Annulation d’actes administratifs; Contestation de redressements fiscaux; Recours fiscaux; Sanctions administratives; Litiges de permis; Marchés publics; Responsabilité de l’État; Exécution de décisions administratives',
'行政行为撤销; 税务核定争议; 税务行政复议; 行政罚款; 许可与执照争议; 政府采购争议; 国家赔偿; 行政裁判执行']],
['mx','government',['Amparo & constitutional protection','Amparo y protección constitucional','Amparo et protection constitutionnelle','宪法保护与安帕罗救济'],
['Indirect amparo; Direct amparo; Provisional or definitive suspension; Constitutional rights protection; Public-authority omission challenges; Constitutional appeals and enforcement',
'Amparo indirecto; Amparo directo; Suspensión provisional o definitiva; Protección de derechos constitucionales; Impugnación de omisiones de autoridad; Recursos y cumplimiento en amparo',
'Amparo indirect; Amparo direct; Suspension provisoire ou définitive; Protection des droits constitutionnels; Recours contre l’inaction administrative; Appels et exécution des décisions d’amparo',
'间接安帕罗程序; 直接安帕罗程序; 临时或最终停止执行; 宪法权利保护; 行政不作为救济; 宪法救济上诉与执行']],
['mx','property',['Agrarian & ejido rights','Derechos agrarios y ejidales','Droits agraires et ejidos','农业土地与埃希多共有地权利'],
['Ejido parcel disputes; Agrarian rights recognition; Restitution of communal land; Challenge of ejido assembly decisions; Agrarian succession; Boundaries and demarcation; Possession and usufruct disputes',
'Controversias parcelarias ejidales; Reconocimiento de derechos agrarios; Restitución de tierras; Nulidad de asambleas ejidales; Sucesión agraria; Deslinde de tierras; Conflictos de posesión y usufructo',
'Litiges de parcelles d’ejido; Reconnaissance de droits agraires; Restitution des terres collectives; Contestation d’assemblées d’ejido; Succession agraire; Bornage; Litiges de possession et d’usufruit',
'埃希多地块纠纷; 农地权利确认; 集体土地返还; 埃希多大会决议争议; 农地继承; 地界划定; 占有与用益权纠纷']],
['mx','civil',['Consumer protection & damages','Protección al consumidor y daños','Protection des consommateurs et dommages','消费者保护与侵权赔偿'],
['Consumer complaints and collective actions; Product-related damages; Medical civil liability; Contractual fraud remedies; Insurance claims; Data-protection disputes; Professional negligence claims',
'Reclamaciones ante PROFECO y acciones colectivas; Responsabilidad por productos; Responsabilidad civil médica; Acciones por fraude contractual; Controversias de seguros; Protección de datos personales; Responsabilidad profesional',
'Réclamations des consommateurs et actions collectives; Dommages liés aux produits; Responsabilité médicale; Fraude contractuelle; Litiges d’assurance; Protection des données; Responsabilité professionnelle',
'消费者投诉及集体诉讼; 产品责任; 医疗侵权责任; 合同欺诈救济; 保险理赔纠纷; 个人数据保护; 专业过失责任']],
['mx','criminal',['Criminal defense & victim procedures','Defensa penal y atención a víctimas','Défense pénale et droits des victimes','刑事辩护与受害人程序'],
['Criminal complaints (denuncias and querellas); Defense in criminal proceedings; Victim representation and restitution; Protective and precautionary measures; Appeals in criminal proceedings; Criminal amparo',
'Denuncias y querellas; Defensa en procesos penales; Asesoría y reparación del daño a víctimas; Medidas cautelares y de protección; Recursos en materia penal; Amparo penal',
'Plaintes pénales; Défense pénale; Représentation des victimes et réparation; Mesures de protection; Appels pénaux; Amparo pénal',
'刑事报案与告诉; 刑事辩护; 受害人代理与赔偿; 保护与强制措施; 刑事上诉; 刑事安帕罗救济']],
['mx','ip',['Intellectual property disputes','Controversias de propiedad intelectual','Contentieux de propriété intellectuelle','知识产权争议'],
['Trademark invalidation or infringement; Patent and industrial-design disputes; Copyright claims; Trade-secret misappropriation; IMPI administrative enforcement; Licensing and royalties disputes',
'Nulidad e infracción marcaria; Patentes y diseños industriales; Derechos de autor; Violación de secretos industriales; Procedimientos ante IMPI; Licencias y regalías',
'Nullité et contrefaçon de marque; Brevets et dessins industriels; Droit d’auteur; Secrets commerciaux; Procédures devant l’IMPI; Licences et redevances',
'商标无效与侵权; 专利及工业设计争议; 著作权索赔; 商业秘密侵权; 墨西哥工业产权局执法程序; 许可与版税争议']],
['mx','government',['Cross-border enforcement & recognition','Reconocimiento y ejecución internacional','Reconnaissance et exécution internationales','跨境判决承认与执行'],
['Recognition of foreign judgments; Enforcement of foreign court orders; Cross-border service of process; International family-order recognition; International arbitration enforcement',
'Homologación de sentencias extranjeras; Ejecución de resoluciones extranjeras; Notificación judicial internacional; Reconocimiento de resoluciones familiares; Ejecución de laudos internacionales',
'Reconnaissance de jugements étrangers; Exécution de décisions étrangères; Signification internationale; Reconnaissance de décisions familiales; Exécution de sentences arbitrales internationales',
'外国判决承认; 外国法院裁定执行; 跨境司法送达; 外国家事裁判承认; 国际仲裁裁决执行']],
['us','civil',['Small claims & consumer disputes','Reclamaciones menores y consumo','Petites créances et consommation','小额索赔与消费纠纷'],
['Small claims / justice court; Debt-collection defense; Consumer fraud; Warranty and defective goods; Credit reporting disputes; Property damage; Automobile purchase disputes; Consumer protection remedies',
'Juicios de cuantía menor; Defensa contra cobranza; Fraude al consumidor; Garantías y productos defectuosos; Historial crediticio; Daños materiales; Conflictos por compraventa de vehículos; Protección del consumidor',
'Petites créances; Défense en recouvrement de dettes; Fraude à la consommation; Garanties et produits défectueux; Litiges de crédit; Dommages matériels; Achat de véhicules; Protection des consommateurs',
'小额索赔; 债务追收抗辩; 消费欺诈; 质量保证与产品缺陷; 信用记录纠纷; 财产损害; 汽车买卖争议; 消费者保护救济']],
['us','civil',['Civil litigation & remedies','Controversias civiles y recursos','Contentieux civil et recours','民事诉讼与救济'],
['Contract breach; Negligence; Defamation; Fraud or misrepresentation; Unjust enrichment; Injunctions; Declaratory judgments; Class actions; Arbitration award enforcement; Judgment collection',
'Incumplimiento contractual; Negligencia; Difamación; Fraude o tergiversación; Enriquecimiento injusto; Medidas cautelares; Sentencias declarativas; Acciones colectivas; Ejecución de laudos; Cobro judicial',
'Inexécution contractuelle; Négligence; Diffamation; Fraude; Enrichissement injustifié; Injonctions; Jugements déclaratoires; Actions collectives; Exécution de sentences arbitrales; Recouvrement judiciaire',
'违约; 过失侵权; 诽谤; 欺诈或虚假陈述; 不当得利; 禁令; 确认判决; 集体诉讼; 仲裁裁决执行; 判决债权追偿']],
['us','civil',['Personal injury & professional liability','Lesiones y responsabilidad profesional','Préjudice corporel et responsabilité professionnelle','人身伤害与专业责任'],
['Motor vehicle injury; Premises liability; Medical malpractice; Product liability; Wrongful death; Professional negligence; Construction injury; Catastrophic injury; Insurance bad-faith litigation',
'Lesiones de tránsito; Responsabilidad por inmuebles; Negligencia médica; Responsabilidad por productos; Muerte injusta; Negligencia profesional; Accidentes de construcción; Lesiones graves; Mala fe de aseguradoras',
'Accidents de la route; Responsabilité des lieux; Faute médicale; Responsabilité du fait des produits; Décès injustifié; Faute professionnelle; Accidents de chantier; Préjudices graves; Mauvaise foi d’assurance',
'交通伤害; 场所责任; 医疗事故; 产品责任; 非正常死亡; 专业过失; 建筑伤害; 严重人身伤害; 保险恶意拒赔']],
['us','business',['Business, contracts & partnerships','Negocios, contratos y sociedades','Affaires, contrats et sociétés','商业、合同与合伙纠纷'],
['Commercial contract disputes; Partnership disputes; Shareholder and LLC member actions; Fiduciary-duty claims; Business fraud; Trade-secret theft; Non-compete disputes; Dissolution or receivership; Commercial collections; Business arbitration',
'Incumplimiento comercial; Disputas entre socios; Acciones de accionistas y miembros de LLC; Deberes fiduciarios; Fraude empresarial; Secretos comerciales; Pactos de no competencia; Disolución o intervención; Cobranza mercantil; Arbitraje comercial',
'Litiges contractuels commerciaux; Conflits entre associés; Actions d’actionnaires et de membres de LLC; Responsabilité fiduciaire; Fraude commerciale; Vol de secrets d’affaires; Non-concurrence; Dissolution ou administration judiciaire; Recouvrement; Arbitrage',
'商业合同争议; 合伙纠纷; 股东与有限责任公司成员诉讼; 信义义务索赔; 商业欺诈; 商业秘密盗窃; 竞业限制争议; 解散或接管; 商业债务催收; 商事仲裁']],
['us','family',['Divorce, parenting & protection','Divorcio, crianza y protección','Divorce, parentalité et protection','离婚、子女与保护令'],
['Contested or uncontested divorce; Legal separation where applicable; Child custody; Parenting plans and visitation; Child support; Spousal support; Paternity; Domestic violence protective orders; Adoption; Modification or enforcement of family orders',
'Divorcio contencioso o de mutuo acuerdo; Separación legal donde exista; Custodia; Planes de crianza y visitas; Manutención de menores; Pensión conyugal; Paternidad; Órdenes de protección; Adopción; Modificación o ejecución de resoluciones',
'Divorce contentieux ou amiable; Séparation légale; Garde d’enfants; Plans parentaux et visites; Pension alimentaire; Pension entre époux; Filiation; Ordonnances de protection; Adoption; Modification ou exécution des décisions',
'争议及协议离婚; 适用时的法律分居; 子女抚养权; 抚养计划与探视; 子女抚养费; 配偶扶养费; 亲子关系; 家暴保护令; 收养; 家事裁定变更与执行']],
['us','family',['Probate, trusts & guardianship','Sucesiones, fideicomisos y tutelas','Successions, fiducies et tutelle','遗嘱认证、信托与监护'],
['Probate proceedings; Intestate estate administration; Will contests; Trust litigation; Executor and trustee disputes; Guardianship; Conservatorship where applicable; Estate-property partition; Elder financial exploitation',
'Procesos sucesorios; Administración intestada; Impugnación de testamentos; Litigios de fideicomisos; Conflictos de albaceas y fiduciarios; Tutela; Curatela cuando proceda; División de herencias; Abuso financiero contra adultos mayores',
'Homologation successorale; Administration sans testament; Contestation de testament; Contentieux fiduciaire; Litiges d’exécuteurs; Tutelle; Curatelle; Partage successoral; Exploitation financière des aînés',
'遗嘱认证程序; 无遗嘱遗产管理; 遗嘱异议; 信托诉讼; 遗产执行人与受托人争议; 监护; 财产保护管理; 遗产财产分割; 老年人财务剥削']],
['us','property',['Housing, real estate & construction','Vivienda, inmuebles y construcción','Logement, immobilier et construction','住房、不动产与建筑'],
['Landlord–tenant eviction or defense; Lease enforcement; Foreclosure defense; Quiet title; Partition action; Boundary and easement disputes; Mechanic’s liens; Construction defects; Homeowner association disputes; Adverse possession',
'Desalojo o defensa de inquilinos; Cumplimiento de arrendamiento; Defensa hipotecaria; Acción de saneamiento de título; División de inmueble; Linderos y servidumbres; Gravámenes de contratistas; Defectos constructivos; Conflictos de HOA; Prescripción adquisitiva',
'Expulsion ou défense locative; Exécution du bail; Défense contre saisie immobilière; Action en confirmation de titre; Partage immobilier; Bornage et servitudes; Privilèges de construction; Malfaçons; Litiges de copropriété; Prescription acquisitive',
'房东房客驱逐及抗辩; 租约执行; 止赎抗辩; 产权确认; 不动产分割; 地界与地役权; 建筑留置权; 施工缺陷; 业主协会争议; 取得时效']],
['us','labor',['Employment & workplace rights','Empleo y derechos laborales','Emploi et droits des travailleurs','雇佣与职场权利'],
['Unpaid wages and overtime; Workplace discrimination; Retaliation or whistleblowing; Wrongful termination; Harassment; Employment contract disputes; Family and medical leave; Unemployment benefit appeals; Workplace injury benefits',
'Salarios y horas extras; Discriminación laboral; Represalias y denuncias; Despido ilegal; Acoso; Contratos de empleo; Permisos familiares y médicos; Apelaciones de desempleo; Prestaciones por accidentes',
'Salaires et heures supplémentaires; Discrimination; Représailles et lanceurs d’alerte; Licenciement abusif; Harcèlement; Contrats de travail; Congé familial et médical; Recours chômage; Indemnisation accidents du travail',
'拖欠工资与加班费; 就业歧视; 报复或举报人保护; 非法解雇; 职场骚扰; 雇佣合同; 家庭与医疗休假; 失业救济上诉; 工伤福利']],
['us','government',['Federal civil rights & public law','Derechos civiles federales y derecho público','Droits civils fédéraux et droit public','联邦民权与公法'],
['Civil rights claims (including Section 1983); Constitutional litigation; ADA/accessibility claims; Discrimination by public entities; Federal employment disputes; Federal government claims; FOIA litigation; Mandamus or extraordinary relief',
'Demandas de derechos civiles (incluida sección 1983); Litigios constitucionales; Accesibilidad ADA; Discriminación pública; Empleo federal; Reclamos contra gobierno federal; Litigios FOIA; Mandamus y remedios extraordinarios',
'Droits civils (dont section 1983); Contentieux constitutionnel; Accessibilité ADA; Discrimination publique; Emploi fédéral; Actions contre le gouvernement fédéral; Litiges FOIA; Mandamus',
'民权索赔（含第1983条）; 宪法诉讼; 美国残疾人法案无障碍诉讼; 公共机构歧视; 联邦雇佣纠纷; 联邦政府索赔; 信息自由法诉讼; 强制令等特别救济']],
['us','government',['Immigration, agencies & tax','移民、行政机关与税务','Immigration, administrations et fiscalité','移民、行政机构与税务'],
['Administrative agency appeals; Immigration removal defense; Asylum-related proceedings; Judicial review of agency decisions; Immigration mandamus where appropriate; U.S. Tax Court disputes; Licensing or regulatory appeals; Social Security benefits appeals',
'Apelaciones administrativas; Defensa en deportación; Procedimientos de asilo; Revisión judicial de decisiones de agencias; Mandamus migratorio cuando proceda; Tribunal Fiscal de EE. UU.; Apelaciones regulatorias; Seguridad Social',
'Recours administratifs; Défense contre l’éloignement; Procédures d’asile; Contrôle judiciaire des décisions administratives; Mandamus migratoire si applicable; Cour fiscale américaine; Recours réglementaires; Prestations de sécurité sociale',
'行政复议; 移民遣返抗辩; 庇护程序; 行政决定司法审查; 适用时的移民强制令; 美国税务法院争议; 监管许可上诉; 社会保障待遇上诉']],
['us','business',['Bankruptcy & creditor litigation','Quiebras y litigios de acreedores','Faillite et contentieux des créanciers','破产与债权人诉讼'],
['Chapter 7 bankruptcy; Chapter 13 repayment; Chapter 11 reorganization; Adversary proceedings; Dischargeability disputes; Creditor objections; Debt restructuring; Bankruptcy appeals',
'Quiebra capítulo 7; Plan de pagos capítulo 13; Reorganización capítulo 11; Procedimientos adversariales; Excepciones de descarga; Objeciones de acreedores; Reestructuración de deuda; Apelaciones concursales',
'Faillite chapitre 7; Remboursement chapitre 13; Réorganisation chapitre 11; Procédures adversaires; Litiges sur libération des dettes; Oppositions de créanciers; Restructuration; Appels',
'第7章破产清算; 第13章还款计划; 第11章重组; 破产对抗诉讼; 债务免责争议; 债权人异议; 债务重组; 破产上诉']],
['us','criminal',['Criminal defense & post-conviction','Defensa penal y recursos posteriores','Défense pénale et recours post-condamnation','刑事辩护与定罪后救济'],
['Misdemeanor defense; Felony defense; DWI/DUI proceedings; Bail and pretrial motions; Criminal appeals; Habeas corpus and post-conviction relief; Expunction or record sealing where eligible; Juvenile defense',
'Defensa de delitos menores; Defensa por delitos graves; Casos de conducción intoxicada; Fianzas y mociones preliminares; Apelaciones penales; Hábeas corpus y recursos posteriores; Cancelación o reserva de antecedentes; Defensa juvenil',
'Défense pour délits mineurs; Défense pour crimes; Conduite en état d’ivresse; Caution et requêtes préalables; Appels pénaux; Habeas corpus et recours; Effacement ou scellement de casier; Défense des mineurs',
'轻罪辩护; 重罪辩护; 酒驾程序; 保释与庭前动议; 刑事上诉; 人身保护令与定罪后救济; 合资格的犯罪记录清除或封存; 未成年人刑事辩护']],
['us','ip',['IP, technology & competition','Propiedad intelectual, tecnología y competencia','PI, technologie et concurrence','知识产权、科技与竞争'],
['Trademark infringement or opposition; Copyright infringement; Patent litigation; Trade-secret misappropriation; Licensing disputes; Domain-name disputes; Unfair competition; Software or technology contract actions',
'Infracción y oposición de marcas; Derechos de autor; Litigios de patentes; Secretos comerciales; Conflictos de licencias; Disputas de dominios; Competencia desleal; Contratos tecnológicos',
'Contrefaçon ou opposition de marque; Droit d’auteur; Brevets; Secrets d’affaires; Litiges de licences; Noms de domaine; Concurrence déloyale; Contrats technologiques',
'商标侵权与异议; 著作权侵权; 专利诉讼; 商业秘密侵权; 许可合同争议; 域名争议; 不正当竞争; 软件与技术合同诉讼']]
];
const language=['en','es','fr','zh'];
const ui={
en:{all:'All practice areas',civil:'Civil / Consumer',business:'Commercial / Business',family:'Family / Estates',labor:'Employment',property:'Property / Agrarian',government:'Government / Federal',criminal:'Criminal',ip:'Intellectual property',category:'Practice area',country:'Jurisdiction',search:'Search proceedings',searchPlaceholder:'E.g. eviction, divorce, amparo…',items:'Typical proceedings and claims',inquiry:'Ask about this area ↗',status:'Information & eligibility review only',count:'practice areas',none:'No matching practice areas. Adjust the filters.',mexico:'Mexico · state / federal rules vary',usa:'United States · state / federal rules vary'},
es:{all:'Todas las materias',civil:'Civil / Consumo',business:'Mercantil / Empresarial',family:'Familiar / Sucesiones',labor:'Laboral',property:'Inmuebles / Agrario',government:'Administrativo / Federal',criminal:'Penal',ip:'Propiedad intelectual',category:'Materia',country:'Jurisdicción',search:'Buscar procedimientos',searchPlaceholder:'Ej. desahucio, divorcio, amparo…',items:'Procedimientos y acciones frecuentes',inquiry:'Consultar sobre esta materia ↗',status:'Información y evaluación de procedencia solamente',count:'materias',none:'No hay materias coincidentes. Modifica los filtros.',mexico:'México · varía por entidad y competencia',usa:'Estados Unidos · varía por estado y competencia'},
fr:{all:'Tous les domaines',civil:'Civil / Consommation',business:'Commercial / Entreprises',family:'Famille / Successions',labor:'Travail',property:'Immobilier / Agraire',government:'Administratif / Fédéral',criminal:'Pénal',ip:'Propriété intellectuelle',category:'Domaine juridique',country:'Juridiction',search:'Rechercher une procédure',searchPlaceholder:'Ex. expulsion, divorce, amparo…',items:'Procédures et recours fréquents',inquiry:'Demander une évaluation ↗',status:'Information et vérification d’admissibilité uniquement',count:'domaines',none:'Aucun résultat. Modifiez les filtres.',mexico:'Mexique · règles variables selon les États',usa:'États-Unis · règles étatiques et fédérales'},
zh:{all:'所有法律领域',civil:'民事／消费者',business:'商事／企业',family:'家事／继承',labor:'劳动法',property:'不动产／农业土地',government:'行政／联邦',criminal:'刑事',ip:'知识产权',category:'法律领域',country:'司法辖区',search:'搜索诉讼与程序',searchPlaceholder:'例如：驱逐、离婚、宪法救济…',items:'常见诉讼与程序',inquiry:'咨询该法律领域 ↗',status:'仅供了解及资格评估',count:'个法律领域',none:'没有匹配结果，请调整筛选条件。',mexico:'墨西哥 · 各州及管辖规则不同',usa:'美国 · 州法及联邦法不同'}
};
const $=id=>document.getElementById(id),root=$('legal-category-grid'),country=$('legal-country'),topic=$('legal-topic'),search=$('legal-search');
if(!root||!country||!topic||!search)return;
let current='en';
function translateUi(){
 const v=ui[current];
 for(const [key,el] of [['legal-country-label',v.country],['legal-topic-label',v.category],['legal-search-label',v.search]]){
  const node=$(key);if(node)node.textContent=el;
 }
 search.placeholder=v.searchPlaceholder;
 for(const option of topic.options)option.textContent=v[option.value]||option.value;
 for(const option of country.options)option.textContent=v[option.value==='mx'?'mexico':'usa']||option.value;
}
function render(){
 const i=language.indexOf(current),v=ui[current],term=search.value.trim().toLocaleLowerCase(),selected=country.value;
 const filtered=groups.filter(g=>(g[0]===selected)&&(topic.value==='all'||g[1]===topic.value)&&
 (!term||g[2][i].toLocaleLowerCase().includes(term)||g[3][i].toLocaleLowerCase().includes(term)||g[2][0].toLowerCase().includes(term)||g[3][0].toLowerCase().includes(term)));
 const fragment=document.createDocumentFragment();
 for(const g of filtered){
  const article=document.createElement('article');article.className='legal-category';
  const top=document.createElement('div');top.className='legal-card-top';
  const tag=document.createElement('span');tag.className='legal-tag';tag.textContent=v[g[1]];top.append(tag);
  const heading=document.createElement('h3');heading.textContent=g[2][i];
  const kicker=document.createElement('p');kicker.className='legal-typology-label';kicker.textContent=v.items;
  const list=document.createElement('ul');list.className='legal-types';
  for(const name of g[3][i].split('; ')){const li=document.createElement('li');li.textContent=name;list.append(li)}
  const status=document.createElement('p');status.className='legal-availability';status.textContent=v.status;
  const action=document.createElement('a');const params=new URLSearchParams({topic:'Legal consultation: '+g[2][0],lang:current});
  action.href='contact.html?'+params.toString();action.textContent=v.inquiry;
  article.append(top,heading,kicker,list,status,action);fragment.append(article);
 }
 root.replaceChildren(fragment);$('legal-count').textContent=filtered.length+' '+v.count;
 $('legal-none').hidden=filtered.length!==0;
 if(!filtered.length)$('legal-none').textContent=v.none;
}
function setLang(value){current=language.includes(value)?value:'en';translateUi();render()}
country.addEventListener('change',render);topic.addEventListener('change',render);search.addEventListener('input',render);
window.addEventListener('wardenclyffe:shop-language',e=>setLang(e.detail?.lang));
setLang(new URLSearchParams(location.search).get('lang')||'en');
})();