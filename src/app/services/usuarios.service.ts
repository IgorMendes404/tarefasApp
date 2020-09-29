import { Injectable } from '@angular/core';
import { ArmazenamentoService } from './armazenamento.service';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  public listaUsuarios = [];

  constructor(private armazenamentoService: ArmazenamentoService) { }

  public async buscarTodos() {
    this.listaUsuarios =  await this.armazenamentoService.pegarDados('usuarios');
  
    if(!this.listaUsuarios){
      this.listaUsuarios = [];
    }
  }

  public async salvar(usuario: Usuario) {
    await this.buscarTodos();

    if(!usuario) {
      return false;
    }

    if(!this.listaUsuarios){
      this.listaUsuarios = [];
    }

    this.listaUsuarios.push(usuario);

    return await this.armazenamentoService.salvarDados('usuarios', this.listaUsuarios);
  }

  public async login(email: string, senha: string){
    let usuario: Usuario;

    await this.buscarTodos();

    const listaTemporaria = this.listaUsuarios.filter(usuarioArmazenado => {
      return (usuarioArmazenado.email == email && usuarioArmazenado.senha == senha);
    }); // retorna um array;

    if(listaTemporaria.length > 0){
      usuario = listaTemporaria.reduce(item => item);
    }

    return usuario;
  }

  public salvarUsuarioLogado(usuario: Usuario){
    delete usuario.senha;
    this.armazenamentoService.salvarDados('usuarioLogado', usuario);
  }

  public async buscarUsuarioLogado(){
    return await this.armazenamentoService.pegarDados('usuarioLogado');
  }

  public async removerUsuarioLogado(){
    return await this.armazenamentoService.removerDados('usuarioLogado');
  }

  public async alterar(usuario:Usuario){ // Cria o metodo de alterar 
    if(!usuario) {   
      return false;  // Faz com que qualcquer coisa que n seja considerado usuario retorne falso
    }

    await this.buscarTodos(); // Faz um pesquisa para pegar os usuarios

    const index = this.listaUsuarios.findIndex(usuarioArmazenado =>{
      return usuarioArmazenado.email == usuario.email; // Cria uma constante, para o usuario com o mesmo email que está logado
    });

    const usuarioTemporario = this.listaUsuarios[index] as Usuario; // Cria uma constante para receber os dados da constante index

    usuario.senha = usuarioTemporario.senha; // Adiciona a senha do usuario para a constante 

    this.listaUsuarios[index] = usuario; // Tranforma os dados da constante em um usuario

    return await this.armazenamentoService.salvarDados('usuarios', this.listaUsuarios); // Salva os dados alterados no usuario

  }

}
