export interface IEnderecoImportacao {
    tipo: string;        // Define o tipo do endereço
    cep: string;
    endereco: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    correspondencia?: string;
    aoscuidados?: string;
  }