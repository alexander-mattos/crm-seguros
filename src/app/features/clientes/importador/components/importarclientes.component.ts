import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../../../../backend/src/environments/environment';
import * as XLSX from 'xlsx';
import { ClienteService } from '../../services/cliente.service';
import { HeaderComponent } from '../../../../components/header/header.component';
import { SidebarComponent } from '../../../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../../../components/footer/footer.component';
import { IClienteImportacao, ITelefoneImportacao } from '@/app/shared/interfaces/cliente.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IRespostaImportacao } from '../../,,/../../../shared/types/resultado.types';

@Component({
  selector: 'app-importarclientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  providers: [ClienteService],
  templateUrl: './importarclientes.component.html',
  styleUrl: './importarclientes.component.css'
})
export class ImportarclientesComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  form: FormGroup;
  arquivoSelecionado: File | null = null;
  todosClientesSelecionados = false;
  clientesParaImportar: IClienteImportacao[] = [];
  telefoneParaImportar: ITelefoneImportacao[] = [];
  loading = false;
  progress = 0;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      tipo: ['2'],
      arquivo: [null]
    });
  }

  // Método para tratar o upload do arquivo
  onFileChange(event: Event): void {
    const element = event.target as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      // Verificar se é um arquivo Excel
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel') {
        this.arquivoSelecionado = file;
      } else {
        alert('Por favor, selecione um arquivo Excel válido (.xlsx ou .xls)');
        this.fileInput.nativeElement.value = '';
        this.arquivoSelecionado = null;
      }
    } else {
      this.arquivoSelecionado = null;
    }
  }

  // Método para verificar o arquivo
  verificarArquivo(): void {
    if (!this.arquivoSelecionado) {
      alert('Por favor, selecione um arquivo.');
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = (e: any) => {
      try {
        const arrayBuffer = e.target.result;
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        if (workbook.SheetNames.length === 0) {
          throw new Error('Arquivo Excel não contém planilhas');
        }

        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const dados = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        if (dados.length <= 1) {
          throw new Error('A planilha não contém dados para importação');
        }

        // Processamos os dados após a leitura
        this.processarDados(dados);

      } catch (error) {
        console.error('Erro ao processar arquivo:', error);
        alert('Erro ao processar o arquivo. Verifique se o formato está correto.');
      }
    };

    fileReader.onerror = (error) => {
      console.error('Erro ao ler arquivo:', error);
      alert('Erro ao ler o arquivo. Por favor, tente novamente.');
    };

    fileReader.readAsArrayBuffer(this.arquivoSelecionado);
  }

  private processarDados(dados: any[]): void {
    try {
      const linhasValidas = dados.slice(1).filter(linha =>
        Array.isArray(linha) && linha.some(cell => cell != null && cell !== '')
      );

      this.clientesParaImportar = linhasValidas.map(linha => {
        // Primeiro processamos as datas para o formato correto
        const cliente: IClienteImportacao = {
          nome: this.formatarTexto(linha[0]?.toString() || ''),
          tipoPessoa: this.validarTipoPessoa(linha[14]),
          cnpjCpf: this.formatarDocumento(linha[15]?.toString()),
          status: linha[1] || '1',
          email: linha[10]?.toString().trim() || '',

          // Aqui devemos processar os endereços
          enderecos: [{
            tipo: '1', // Tipo padrão como residencial
            cep: this.formatarCep(linha[4]?.toString() || ''),
            endereco: this.formatarTexto(linha[2]?.toString() || ''),
            numero: linha[3]?.toString()?.trim() || 'S/N',
            complemento: linha[8]?.toString()?.trim(),
            bairro: this.formatarTexto(linha[7]?.toString() || ''),
            cidade: this.formatarTexto(linha[5]?.toString() || ''),
            estado: linha[6]?.toString()?.trim()?.toUpperCase(),
            correspondencia: 'S'  // Marca como endereço de correspondência por padrão
          }].filter(end =>
            // Filtra apenas endereços que tenham os campos obrigatórios preenchidos
            end.endereco && end.bairro && end.cidade && end.estado && end.cep
          ),

          // Processamento dos telefones (mantido como está)
          telefones: linha[9] ? [{
            tipo: '1',
            numero: this.formatarTelefone(linha[9].toString())
          }] : [],

          selecionado: false,
          valido: true
        };

        // Log para debug dos endereços
        console.log(`Endereços processados para ${cliente.nome}:`,
          JSON.stringify(cliente.enderecos, null, 2));

        cliente.valido = this.validarCliente(cliente);
        return cliente;
      });

      console.log('Total de clientes processados:', this.clientesParaImportar.length);
    } catch (error) {
      console.error('Erro no processamento:', error);
      this.clientesParaImportar = [];
    }
  }

  /**
   * Valida os dados do cliente antes da importação
   * @param cliente - Cliente a ser validado
   * @returns boolean indicando se o cliente é válido
   */
  private validarCliente(cliente: IClienteImportacao): boolean {
    // Validações básicas
    const dadosBasicosValidos = Boolean(
      cliente.nome &&
      ['F', 'J'].includes(cliente.tipoPessoa) &&
      cliente.cnpjCpf
    );

    // Valida CPF/CNPJ conforme o tipo de pessoa
    const documentoValido = cliente.tipoPessoa === 'F' ?
      cliente.cnpjCpf?.length === 11 :
      cliente.cnpjCpf?.length === 14;

    // Verifica se tem pelo menos um contato (telefone ou email)
    const temContato = Boolean(
      cliente.email?.trim() ||
      (cliente.telefones && cliente.telefones.length > 0)
    );

    // Log para debug da validação
    console.log('Validação do cliente:', {
      nome: cliente.nome,
      dadosBasicosValidos,
      documentoValido,
      temContato,
      qtdEnderecos: cliente.enderecos?.length || 0
    });

    return dadosBasicosValidos && documentoValido && temContato;
  }

  private formatarCep(cep: string): string {
    return cep.replace(/\D/g, '');
  }

  // Método auxiliar para exibir o tipo de telefone
  getTipoTelefone(tipo: string): string {
    const tipos = {
      '1': 'Residencial',
      '2': 'Comercial',
      '4': 'Celular',
      '5': 'Fax'
    };
    return tipos[tipo as keyof typeof tipos] || 'Outro';
  }

  // Método auxiliar para exibir o tipo de endereço
  getTipoEndereco(tipo: string): string {
    const tipos = {
      '1': 'Principal',
      '2': 'Cobrança',
      '3': 'Entrega',
      '4': 'Outro'
    };
    return tipos[tipo as keyof typeof tipos] || 'Outro';
  }

  // Método para formatar telefone para exibição
  formatarTelefoneExibicao(numero: string): string {
    const cleaned = numero.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
    }
    return numero;
  }

  // Funções auxiliares de formatação
  private formatarTelefone(telefone: string): string {
    return telefone.replace(/\D/g, '');
  }

  /**
   * Formata um documento (CPF/CNPJ) removendo caracteres especiais
   * @param doc - String do documento a ser formatada
   * @returns String contendo apenas números
   */
  private formatarDocumento(doc?: string): string {
    if (!doc) return '';
    return doc.replace(/\D/g, '');
  }

  private formatarTexto(texto: string): string {
    if (!texto) return '';
    return texto.trim()
      .toLowerCase()
      .replace(/(?:^|\s)\S/g, a => a.toUpperCase());
  }

  // Função para validar e padronizar o tipo de pessoa
  private validarTipoPessoa(tipo: string): string {
    if (!tipo) return 'F'; // Valor padrão se não houver tipo

    const tipoNormalizado = tipo.toString().trim().toUpperCase();

    // Mapeamento de diferentes valores possíveis
    const tiposValidos: { [key: string]: string } = {
      'F': 'F',
      'FISICA': 'F',
      'FÍSICA': 'F',
      'PF': 'F',
      'J': 'J',
      'JURIDICA': 'J',
      'JURÍDICA': 'J',
      'PJ': 'J'
    };

    return tiposValidos[tipoNormalizado] || 'F';
  }

  // Método para baixar o template
  baixarTemplate() {
    const url = `${environment.apiUrl}/clientes/template`;
    window.open(url, '_blank');
  }

  // Função para selecionar/deselecionar todos os clientes válidos
  selecionarTodos(event: any): void {
    const checked = event.target.checked;
    this.todosClientesSelecionados = checked;

    // Atualiza todos os itens válidos
    this.clientesParaImportar.forEach(cliente => {
      if (cliente.valido) {
        cliente.selecionado = checked;
      }
    });
  }

  hasClientesSelecionados(): boolean {
    return this.clientesParaImportar.some(cliente =>
      cliente.selecionado && cliente.valido
    );
  }

  // Função para importar apenas os clientes selecionados
  importarSelecionados(): void {
    if (!this.hasClientesSelecionados()) {
      this.mostrarMensagem('Selecione pelo menos um cliente para importar');
      return;
    }

    this.loading = true;
    const clientesSelecionados = this.clientesParaImportar
      .filter(cliente => cliente.selecionado && cliente.valido);

    // Log para verificar os dados antes do envio
    console.log('Dados a serem enviados:', JSON.stringify(clientesSelecionados, null, 2));

    this.clienteService.importarClientes(clientesSelecionados)
      .subscribe({
        next: (response: IRespostaImportacao) => {
          const sucessos = response.resultados.filter(r => r.sucesso).length;
          const falhas = response.resultados.filter(r => !r.sucesso).length;

          let mensagem = `Importação concluída: ${sucessos} clientes importados com sucesso`;
          if (falhas > 0) {
            mensagem += ` e ${falhas} falhas`;
          }

          this.snackBar.open(mensagem, 'Fechar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: falhas > 0 ? ['snackbar-warning'] : ['snackbar-success']
          });

          if (sucessos > 0) {
            this.limparDadosAposImportacao();
          }
        },
        error: (error) => {
          console.error('Erro na importação:', error);
          this.snackBar.open('Erro ao realizar a importação. Por favor, tente novamente.', 'Fechar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['snackbar-error']
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  private mostrarMensagem(mensagem: string): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: mensagem.includes('erro') ? ['snackbar-error'] : ['snackbar-success']
    });
  }

  private limparDadosAposImportacao(): void {
    this.clientesParaImportar = [];
    this.todosClientesSelecionados = false;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.arquivoSelecionado = null;
  }
}