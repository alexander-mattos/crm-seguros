
export interface IResultadoSucesso {
    sucesso: true;
    clienteId: number;
    mensagem: string;
  }
  
  export interface IResultadoErro {
    sucesso: false;
    clienteNome: string;
    mensagem: string;
    erro: string;
  }
  
  export type ResultadoImportacao = IResultadoSucesso | IResultadoErro;
  
  export interface IRespostaImportacao {
    sucesso: boolean;
    resultados: ResultadoImportacao[];
  }