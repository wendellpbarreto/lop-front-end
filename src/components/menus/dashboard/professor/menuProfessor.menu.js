/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-03 22:00:20
 */

// Referência para icones: https://preview.tabler.io/icons.html

import React, { Component } from "react";

import { Link } from "react-router-dom";

export default class MenuProfessor extends Component {
  render() {
    console.log('props do menu');
    console.log(this.props.active);
    return (
      <div className="header collapse d-lg-flex p-0" id="headerMenuCollapse">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg order-lg-first">
              <ul className="nav nav-tabs border-0 flex-column flex-lg-row">
                <li className="nav-item">
                  <Link to="/professor" className={`nav-link ${this.props.active==='home'?'active':''}`}>
                    <i className="fe fe-home" />
                    Início
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/professor/novasturmas" className={`nav-link ${this.props.active==='criarTurma'?'active':''}`}>
                    <i className="fe fe-plus" /> <i className="fe fe-users" />
                    Criar turma
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/professor/listas" className={`nav-link ${this.props.active==='listas'?'active':''}`}>
                    <i className="fe fe-file-text" />
                    Listas
                  </Link>
                </li>
               <li className="nav-item">
                  <Link to="/professor/criarlista" className={`nav-link ${this.props.active==='criarLista'?'active':''}`}>
                    <i className="fe fe-file-plus" />
                    Criar listas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/professor/exercicios" className={`nav-link ${this.props.active==='ecercicios'?'active':''}`}>
                    <i className="fa fa-file-code-o" />
                    Exercicios
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/professor/criarExercicio" className={`nav-link ${this.props.active==='criarExercicio'?'active':''}`}>
                    <i className="fe fe-file-plus" />
                    Criar exercicios
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/professor/provas" className={`nav-link ${this.props.active==='prova'?'active':''}`}>
                    <i className="fe fe-file" />
                    Provas
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}