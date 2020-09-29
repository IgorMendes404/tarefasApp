import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CpfValidator } from '../validators/cpf-validators';
import { ComparacaoValidator } from '../validators/comparacao-validator';
import { UsuariosService } from '../services/usuarios.service';
import { AlertController } from '@ionic/angular';
import { Usuario } from '../models/Usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  public formRegister: FormGroup;

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
    ],
    senha: [
      { tipo: 'required', mensagem: 'O campo senha é obrigatório!' },
      { tipo: 'minlength', mensagem: 'A senha deve ter pelo menos 6 caracteres!' }
    ],
    confirmaSenha: [
      { tipo: 'required', mensagem: 'O campo Confirmar senha é obrigatório!' },
      { tipo: 'minlength', mensagem: 'Confirmar a senha deve ter pelo menos 6 caracteres!' },
      { tipo: 'comparacao', mensagem: 'Deve ser igual a Senha!' }
    ]
  };

  constructor(private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    public alertController: AlertController,
    public router: Router
  ) {
    this.formRegister = formBuilder.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      cpf: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(14), CpfValidator.cpfValido])],
      dataNascimento: ['', Validators.compose([Validators.required])],
      genero: ['', Validators.compose([Validators.required])],
      celular: ['', Validators.compose([Validators.required, Validators.maxLength(16)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmaSenha: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    }, {
      validator: ComparacaoValidator('senha', 'confirmaSenha')
    });

  }

  async ngOnInit() {
   await this.usuariosService.buscarTodos();
   console.log(this.usuariosService.listaUsuarios);
  }

  public registro() {
    if (this.formRegister.valid) {
      console.log('Formulário Válido');
    } else {
      console.log('Formulário Inválido')
    }
  }

  public async salvarFormulario() {
    if (this.formRegister.valid) {

      let usuario = new Usuario();
      usuario.nome = this.formRegister.value.nome;
      usuario.cpf = this.formRegister.value.cpf;
      usuario.dataNascimento = new Date(this.formRegister.value.dataNascimento);
      usuario.genero = this.formRegister.value.genero;
      usuario.celular = this.formRegister.value.celular;
      usuario.email = this.formRegister.value.email;
      usuario.senha = this.formRegister.value.senha;
    
      if(await this.usuariosService.salvar(usuario)){
        this.exibirAlerta('SUCESSO!', 'Usuário salvo com sucesso!')
        this.router.navigateByUrl('/login');
      }else{
        this.exibirAlerta('ERRO!', 'Erro ao salvar o Usuário!');
      }

    } else {
      this.exibirAlerta('ADVERTENCIA!', 'Formulário inválido<br>Verifique os campos do seu formulário');
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
