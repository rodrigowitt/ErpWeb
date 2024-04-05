import { Component, ViewChild } from '@angular/core';
import { Clientes } from 'src/clientes';
import { ClientesConsulta } from 'src/clientesConsulta';
import { ClienteService } from '../cliente.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-editarclientes',
  templateUrl: './editarclientes.component.html',
  styleUrls: ['./editarclientes.component.css']
})
export class EditarclientesComponent {
  cnpjoucpf: string = '';
  cliente: ClientesConsulta | undefined; // Definido como opcional
  clienteApi!: Clientes; // Definido como opcional
  public numeroCliente ?: number
  public cnpj ?: string
  public razaosocial ?: string
  public telefone ?: string
  public email ?: string
  

  constructor(private clientesService: ClienteService) {
    
   }

   @ViewChild('addForm') addForm!: NgForm;

  

   public onAddCli(addForm: NgForm): void {
     const clienteApi: Clientes = {
       clienteid: 0,
       cnpjoucpf: addForm.value.cnpjoucpf || this.cliente?.cnpj || '',
       status: addForm.value.cnpjoucpf || this.cliente?.cnpj || '',
       nomeFantasia: addForm.value.nomeFantasia || this.cliente?.nome || '',
       cep: addForm.value.cep || this.cliente?.cep || '',
       email: addForm.value.email || this.cliente?.email || '',
       inscricaoEstadual: addForm.value.inscricaoEstadual || '',
       razaoSocial: addForm.value.razaoSocial || this.cliente?.nome || '',
       estado: addForm.value.estado || this.cliente?.uf || '',
       municipio: addForm.value.municipio || this.cliente?.municipio || '',
       bairro: addForm.value.bairro || this.cliente?.bairro || '',
       rua: addForm.value.rua || this.cliente?.logradouro || '',
       numero: addForm.value.numero || this.cliente?.numero || '',
       complemento: addForm.value.complemento || this.cliente?.complemento || '',
       telefone: addForm.value.telefone || this.cliente?.telefone || ''
     };
 
 
 
     if (addForm.valid) {
         this.clientesService.addCliente(clienteApi).subscribe(
             (response: Clientes) => {
               this.numeroCliente = response.clienteid
               this.cnpj = response.cnpjoucpf;
               this.razaosocial = response.razaoSocial;
               this.telefone = response.telefone;
               this.email = response.email;
               clienteApi.clienteid = response.clienteid;
                 this.openModal();
                 addForm.resetForm();
             },
             (error: HttpErrorResponse) => {
                 alert(error.message);
             }
         );
     } else {
         alert('Por favor, preencha todos os campos obrigatórios.');
     }
 }
 
 
 
 
   formatarDocumento(event: any) {
     let cnpjoucpf = event.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
 
     // Limita o tamanho do documento
     const maxLength = 14; // CNPJ: 14 dígitos + 3 caracteres de formatação
     if (cnpjoucpf.length > maxLength) {
       cnpjoucpf = cnpjoucpf.substring(0, maxLength);
     }
 
     if (cnpjoucpf.length <= 11) {
       this.cnpjoucpf = this.formatarCPF(cnpjoucpf);
     } else {
       this.cnpjoucpf = this.formatarCNPJ(cnpjoucpf);
     }
   }
 
   handleKeyPress(event: KeyboardEvent) {
     const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight']; // Teclas permitidas
 
     // Verifica se a tecla pressionada é uma das teclas permitidas ou um número
     if (!allowedKeys.includes(event.key) && isNaN(Number(event.key))) {
       event.preventDefault(); // Impede a entrada de caracteres não numéricos e não permitidos
     }
   }
 
   private formatarCPF(cpf: string): string {
     return cpf.replace(/(\d{3})(\d)/, '$1.$2')
       .replace(/(\d{3})(\d)/, '$1.$2')
       .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
   }
 
   private formatarCNPJ(cnpj: string): string {
     return cnpj.replace(/^(\d{2})(\d)/, '$1.$2')
       .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
       .replace(/\.(\d{3})(\d)/, '.$1/$2')
       .replace(/(\d{4})(\d)/, '$1-$2');
   }
 
   getBuscarCliente(cnpj: string): void {
     const cnpjNumerico = cnpj.replace(/\D/g, '');
 
     if (cnpjNumerico.length !== 14) {
       alert('CNPJ deve ter exatamente 14 dígitos');
       return;
     }
 
     this.clientesService.getClientesConsulta(cnpjNumerico).subscribe(
       (response: ClientesConsulta) => { // Corrigido para receber um único objeto, não um array
         this.cliente = response; // Armazenar o objeto retornado
         this.preencherCamposFormulario(); // Chamar a função para preencher os campos do formulário
       },
       (error: HttpErrorResponse) => {
         console.error('Erro ao buscar cliente:', error);
         alert('Erro ao buscar cliente: ' + error.message);
       }
     );
   }
 
   preencherCamposFormulario(): void {
     if (this.cliente) {
       const addFormValue = this.addForm.value;
   
       // Atualizar os valores do objeto associado ao formulário
       addFormValue.nomeFantasia = this.cliente.nome;
       addFormValue.razaoSocial = this.cliente.nome;
       addFormValue.cep = this.cliente.cep;
       addFormValue.municipio = this.cliente.municipio;
       addFormValue.estado = this.cliente.uf;
       addFormValue.bairro = this.cliente.bairro;
       addFormValue.rua = this.cliente.logradouro;
       addFormValue.numero = this.cliente.numero;
       addFormValue.complemento = this.cliente.complemento;
       addFormValue.email = this.cliente.email;
       addFormValue.telefone = this.cliente.telefone;
   
       // Atualizar os campos do formulário com os novos valores
       this.addForm.setValue(addFormValue);
     }
   }
 
   openModal() {
     const modal = document.getElementById('exampleModal');
     const body = document.body;
     const closeButton = document.querySelector('.btn-close');
     if (modal && body && closeButton) {
       modal.classList.add('show');
       modal.style.display = 'block';
       body.classList.add('modal-open');
       const backdrop = document.createElement('div');
       closeButton.addEventListener('click', this.closeModal.bind(this)); // Adiciona evento de clique ao botão fechar
     }
   }
   
   closeModal() {
     const modal = document.getElementById('exampleModal');
     const body = document.body;
     const backdrop = document.querySelector('.modal-backdrop');
     if (modal && body) {
       modal.classList.remove('show');
       modal.style.display = 'none';
       body.classList.remove('modal-open');
     }
   }
}
