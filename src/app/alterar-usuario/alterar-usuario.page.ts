import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Usuario } from '../models/Usuario';
import { UsuariosService } from '../services/usuarios.service';
import { CpfValidator } from '../validators/cpf-validators';

@Component({
  selector: 'app-alterar-usuario',
  templateUrl: './alterar-usuario.page.html',
  styleUrls: ['./alterar-usuario.page.scss'],
})
export class AlterarUsuarioPage implements OnInit {

  public formAlterar: FormGroup;

  public mensagens_validacao = {
    nome: [
      { tipo: 'required', mensagem: 'O campo nome é obrigatório!' },
      { tipo: 'minlength', mensagem: 'o nome deve ter pelo menos 3 caracteres!' }
    ],
    cpf: [
      { tipo: 'required', mensagem: 'O campo CPF é obrigatório!' },
      { tipo: 'minlength', mensagem: 'o CPF deve ter pelo menos 11 caracteres!' },
      { tipo: 'maxlength', mensagem: 'o CPF deve ter no maximo 14 caracteres!' },
      { tipo: 'invalido', mensagem: 'CPF invalido!' }
    ],
    dataNascimento: [
      { tipo: 'required', mensagem: 'O campo Data de Nascimento é obrigatório!' }
    ],
    genero: [
      { tipo: 'required', mensagem: 'O campo genero é obrigatório!' }
    ],
    celular: [
      { tipo: 'required', mensagem: 'O campo celular é obrigatório!' },
      { tipo: 'maxlength', mensagem: 'o celular deve ter no maximo 16 caracteres!' }
    ],
    email: [
      { tipo: 'required', mensagem: 'O campo E-mail é obrigatório!' },
      { tipo: 'email', mensagem: 'E-mail inválido!' }
    ]
  };

  private usuario:Usuario;
  private manterLogadoTemp: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    public alertController: AlertController,
    public router: Router
    ) {

      this.formAlterar = formBuilder.group({
        nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
        cpf: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(14), CpfValidator.cpfValido])],
        dataNascimento: ['', Validators.compose([Validators.required])],
        genero: ['', Validators.compose([Validators.required])],
        celular: ['', Validators.compose([Validators.required, Validators.maxLength(16)])],
        email: ['', Validators.compose([Validators.required, Validators.email])]
      });

      this.preencherFormulario();

     }

  ngOnInit() {
  }

  public async preencherFormulario(){
    this.usuario = await this.usuariosService.buscarUsuarioLogado();
    this.manterLogadoTemp = this.usuario.manterLogado;
    delete this.usuario.manterLogado;

    this.formAlterar.setValue(this.usuario);
    this.formAlterar.patchValue({dataNascimento: this.usuario.dataNascimento.toISOString() });
  }

  public async salvar(){ // Cria a função salvar 
    if(this.formAlterar.valid){ // Verifica se é valido o formulario

      this.usuario.nome = this.formAlterar.value.nome; // Altera o valor do nome do usuario para o novo dado inserido
      this.usuario.dataNascimento = new Date(this.formAlterar.value.dataNascimento); // Altera o valor da data de nascimento do usuario para o novo dado inserido
      this.usuario.genero = this.formAlterar.value.genero; // Altera o valor do genero do usuario para o novo dado inserido
      this.usuario.celular = this.formAlterar.value.celular; // Altera o valor do celular do usuario para o novo dado inserido
      this.usuario.email = this.formAlterar.value.email; // Altera o valor do email do usuario para o novo dado inserido

      if(await this.usuariosService.alterar(this.usuario)){ // Chama a função alterar do usuarios.service.ts
        this.usuario.manterLogado = this.manterLogadoTemp; // Devolve a propriedade de manter logado ao usuario
        this.usuariosService.salvarUsuarioLogado(this.usuario); // Chama a função salvar do usuarios.service.ts
        this.exibirAlerta("SUCESSO!", "Usuário alterado com sucesso!"); // Exibi uma alerta para mostrar que deu certo
        this.router.navigateByUrl('/configuracoes'); // Retorna para a tela de configuracoes
      }

    }else{
      this.exibirAlerta('ADVERTENCIA!', 'Formulário inválido<br>Verifique os campos do seu formulário'); //Caso o formulario esteja errado mostra alerta de erro
    }
  }

  async exibirAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }

}
