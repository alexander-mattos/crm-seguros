/*
  Warnings:

  - A unique constraint covering the columns `[cnpjCpf]` on the table `clientes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `clientes_cnpjCpf_key` ON `clientes`(`cnpjCpf`);
