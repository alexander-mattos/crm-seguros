/*
  Warnings:

  - You are about to drop the column `notas` on the `notas` table. All the data in the column will be lost.
  - Added the required column `content` to the `notas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `notas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notas` DROP COLUMN `notas`,
    ADD COLUMN `content` VARCHAR(200) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `propostas` ADD COLUMN `dadosBancariosId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `telefones` ADD CONSTRAINT `telefones_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enderecos` ADD CONSTRAINT `enderecos_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contatos` ADD CONSTRAINT `contatos_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notas` ADD CONSTRAINT `notas_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propostas` ADD CONSTRAINT `propostas_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propostas` ADD CONSTRAINT `propostas_seguradoraId_fkey` FOREIGN KEY (`seguradoraId`) REFERENCES `seguradoras`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propostas` ADD CONSTRAINT `propostas_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `produtos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propostas` ADD CONSTRAINT `propostas_ramoId_fkey` FOREIGN KEY (`ramoId`) REFERENCES `ramos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propostas` ADD CONSTRAINT `propostas_dadosBancariosId_fkey` FOREIGN KEY (`dadosBancariosId`) REFERENCES `dados_bancarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parcelas` ADD CONSTRAINT `parcelas_propostaId_fkey` FOREIGN KEY (`propostaId`) REFERENCES `propostas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repasses` ADD CONSTRAINT `repasses_propostaId_fkey` FOREIGN KEY (`propostaId`) REFERENCES `propostas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comissoes` ADD CONSTRAINT `comissoes_propostaId_fkey` FOREIGN KEY (`propostaId`) REFERENCES `propostas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `atividades` ADD CONSTRAINT `atividades_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
