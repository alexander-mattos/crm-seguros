-- CreateTable
CREATE TABLE `clientes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(50) NOT NULL,
    `nomeSocial` VARCHAR(30) NULL,
    `tipoPessoa` VARCHAR(8) NOT NULL,
    `cnpjCpf` VARCHAR(14) NULL,
    `status` VARCHAR(20) NOT NULL,
    `clienteDesde` VARCHAR(7) NULL,
    `email` VARCHAR(70) NULL,
    `site` VARCHAR(100) NULL,
    `faturamento` DECIMAL(15, 2) NULL,
    `atividade` VARCHAR(100) NULL,
    `instagram` VARCHAR(100) NULL,
    `facebook` VARCHAR(100) NULL,
    `nrFuncionarios` VARCHAR(20) NULL,
    `dtNascimento` DATE NULL,
    `sexo` CHAR(9) NULL,
    `rg` VARCHAR(20) NULL,
    `dtExpedicao` DATE NULL,
    `emissor` VARCHAR(10) NULL,
    `cnh` VARCHAR(20) NULL,
    `emissorCnh` VARCHAR(10) NULL,
    `dtvencCnh` DATE NULL,
    `estadoCivil` VARCHAR(20) NULL,
    `conjuge` VARCHAR(40) NULL,
    `lgpd` CHAR(1) NULL DEFAULT 'S',
    `dtInclusao` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dtAlteracao` DATETIME(3) NULL,
    `origem` VARCHAR(20) NULL,
    `responsavel` VARCHAR(30) NULL,
    `unidadeNegocio` VARCHAR(30) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `telefones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clienteId` INTEGER NOT NULL,
    `tipo` VARCHAR(1) NOT NULL,
    `numero` VARCHAR(11) NOT NULL,
    `ramal` VARCHAR(10) NULL,
    `contato` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enderecos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clienteId` INTEGER NOT NULL,
    `tipo` VARCHAR(1) NOT NULL,
    `cep` VARCHAR(9) NOT NULL,
    `endereco` VARCHAR(100) NOT NULL,
    `numero` VARCHAR(11) NOT NULL,
    `complemento` VARCHAR(100) NULL,
    `bairro` VARCHAR(30) NOT NULL,
    `cidade` VARCHAR(20) NOT NULL,
    `estado` CHAR(2) NOT NULL,
    `correspondencia` VARCHAR(5) NULL,
    `aoscuidados` VARCHAR(20) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contatos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clienteId` INTEGER NOT NULL,
    `tipo` VARCHAR(1) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `sexo` VARCHAR(15) NULL,
    `cargo` VARCHAR(30) NULL,
    `tratamento` VARCHAR(5) NULL,
    `email` VARCHAR(50) NULL,
    `dtNascimento` VARCHAR(8) NULL,
    `cpf` CHAR(12) NULL,
    `telefone` VARCHAR(10) NULL,
    `celular` VARCHAR(11) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clienteId` INTEGER NOT NULL,
    `notas` VARCHAR(200) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `apolices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` VARCHAR(30) NOT NULL,
    `clienteId` INTEGER NOT NULL,
    `seguradoraId` INTEGER NOT NULL,
    `produtoId` INTEGER NOT NULL,
    `ramoId` INTEGER NOT NULL,
    `dataInicio` DATETIME(3) NOT NULL,
    `dataFim` DATETIME(3) NOT NULL,
    `valorPremio` DECIMAL(15, 2) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `propostaId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `propostas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` VARCHAR(30) NOT NULL,
    `tipoDocumento` VARCHAR(1) NOT NULL,
    `motivoEndosso` VARCHAR(100) NULL,
    `dataProposta` DATETIME(3) NOT NULL,
    `vigenciaInicio` DATETIME(3) NOT NULL,
    `vigenciaFim` DATETIME(3) NOT NULL,
    `clienteId` INTEGER NOT NULL,
    `seguradoraId` INTEGER NOT NULL,
    `produtoId` INTEGER NOT NULL,
    `ramoId` INTEGER NOT NULL,
    `apoliceRenovadaId` INTEGER NULL,
    `formaPagamento` VARCHAR(20) NOT NULL,
    `numeroParcelas` INTEGER NOT NULL,
    `vencimentoPrimeira` DATETIME(3) NOT NULL,
    `valorPrimeira` DECIMAL(15, 2) NULL,
    `premioLiquido` DECIMAL(15, 2) NOT NULL,
    `adicional` DECIMAL(15, 2) NULL,
    `desconto` DECIMAL(15, 2) NULL,
    `custoApolice` DECIMAL(15, 2) NULL,
    `iof` DECIMAL(15, 2) NULL,
    `premioTotal` DECIMAL(15, 2) NOT NULL,
    `comissaoBase` DECIMAL(15, 2) NULL,
    `comissaoPercentual` DECIMAL(5, 2) NULL,
    `comissaoValor` DECIMAL(15, 2) NULL,
    `status` VARCHAR(20) NOT NULL,
    `criadoPor` VARCHAR(100) NOT NULL,
    `alteradoPor` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dados_bancarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `propostaId` INTEGER NOT NULL,
    `banco` VARCHAR(3) NOT NULL,
    `agencia` VARCHAR(10) NOT NULL,
    `conta` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parcelas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `propostaId` INTEGER NOT NULL,
    `apoliceId` INTEGER NULL,
    `numero` INTEGER NOT NULL,
    `vencimento` DATETIME(3) NOT NULL,
    `valor` DECIMAL(15, 2) NOT NULL,
    `status` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `repasses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `propostaId` INTEGER NOT NULL,
    `corretorId` INTEGER NOT NULL,
    `percentual` DECIMAL(5, 2) NOT NULL,
    `valor` DECIMAL(15, 2) NOT NULL,
    `status` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ramos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(10) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `descricao` TEXT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produtos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `codigo` VARCHAR(20) NOT NULL,
    `descricao` TEXT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `ramoId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seguradoras` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `cnpj` VARCHAR(14) NULL,
    `susep` VARCHAR(20) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `ddd` VARCHAR(2) NULL,
    `ddd2` VARCHAR(2) NULL,
    `observacao` TEXT NULL,
    `telefone` VARCHAR(15) NULL,
    `telefone2` VARCHAR(15) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sinistros` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` VARCHAR(30) NOT NULL,
    `clienteId` INTEGER NOT NULL,
    `apoliceId` INTEGER NOT NULL,
    `data` DATETIME(3) NOT NULL,
    `valor` DECIMAL(15, 2) NOT NULL,
    `status` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comissoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `apoliceId` INTEGER NULL,
    `corretorId` INTEGER NOT NULL,
    `valor` DECIMAL(15, 2) NOT NULL,
    `dataPagamento` DATETIME(3) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `percentual` DECIMAL(5, 2) NOT NULL,
    `propostaId` INTEGER NULL,
    `tipoComissao` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `corretores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `susep` VARCHAR(20) NULL,
    `email` VARCHAR(100) NULL,
    `telefone` VARCHAR(15) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `atividades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clienteId` INTEGER NOT NULL,
    `tipo` VARCHAR(50) NOT NULL,
    `descricao` TEXT NOT NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `responsavel` VARCHAR(100) NOT NULL,
    `assunto` VARCHAR(200) NOT NULL,
    `concluida` CHAR(1) NOT NULL,
    `criadoPor` VARCHAR(100) NOT NULL,
    `dtAlteracao` DATETIME(3) NOT NULL,
    `dtConclusao` DATETIME(3) NULL,
    `dtInclusao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `hora` VARCHAR(5) NOT NULL,
    `local` VARCHAR(100) NULL,
    `recorrente` CHAR(1) NULL,
    `referente` VARCHAR(2) NOT NULL,
    `resultado` TEXT NULL,
    `status` VARCHAR(20) NOT NULL,
    `departamento` VARCHAR(50) NULL,
    `oportunidade` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historicoapolice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `apoliceId` INTEGER NOT NULL,
    `campo` VARCHAR(50) NOT NULL,
    `valorAntigo` VARCHAR(255) NULL,
    `valorNovo` VARCHAR(255) NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historicocliente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clienteId` INTEGER NOT NULL,
    `campo` VARCHAR(50) NOT NULL,
    `valorAntigo` VARCHAR(255) NULL,
    `valorNovo` VARCHAR(255) NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
