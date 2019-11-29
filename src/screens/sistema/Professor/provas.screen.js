import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import NavPagination from "components/ui/navs/navPagination";
import InputGroup from "components/ui/inputGroup/inputGroupo.component";
import { Modal } from "react-bootstrap";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
import formataData from "../../../util/funçoesAuxiliares/formataData";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardOptions from "components/ui/card/cardOptions.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";

const lista = {
  backgroundColor: "white"
};

const botao = {
  width: "100%"
};

export default class HomeProvasScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentInputSeach: "",
      listas: [],
      questions: [],
      showModal: false,
      loadingProvas: false,
      fieldFilter: "title",
      numPageAtual: 1,
      totalItens: 0,
      totalPages: 0,
      showModalInfo: false
    };
    this.handlePage = this.handlePage.bind(this);
  }

  componentDidMount() {
    document.title = "Provas - professor";
    this.getProvas();
  }

  async getProvas() {
    const { numPageAtual, contentInputSeach, fieldFilter } = this.state;
    let query = `include=${contentInputSeach.trim()}`;
    query += `&field=${fieldFilter}`;
    console.log(query);

    try {
      this.setState({ loadingProvas: true });
      const response = await api.get(`/test/page/${numPageAtual}?${query}`);
      console.log("provas");
      console.log(response.data);
      this.setState({
        listas: [...response.data.docs],
        totalItens: response.data.total,
        totalPages: response.data.totalPages,
        numPageAtual: response.data.currentPage,
        loadingProvas: false
      });
    } catch (err) {
      this.setState({ loadingProvas: false });
      console.log(err);
    }
  }
  handleShowModalInfo(questions) {
    this.setState({
      showModalInfo: true,
      questions: [...questions]
    });
  }
  handleCloseshowModalInfo(e) {
    this.setState({ showModalInfo: false });
  }
  handlePage(e, numPage) {
    e.preventDefault();
    //console.log(numPage);
    this.setState(
      {
        numPageAtual: numPage
      },
      () => this.getProvas()
    );
  }
  handleSelectFieldFilter(e) {
    console.log(e.target.value);
    this.setState(
      {
        fieldFilter: e.target.value
      } /*,()=>this.getProvas()*/
    );
  }

  handleContentInputSeach(e) {
    this.setState(
      {
        contentInputSeach: e.target.value
      } /*,()=>this.getProvas()*/
    );
  }
  filterSeash() {
    this.getProvas();
  }
  clearContentInputSeach() {
    this.setState(
      {
        contentInputSeach: ""
      },
      () => this.getProvas()
    );
  }

  render() {
    const {
      listas,
      fieldFilter,
      loadingProvas,
      contentInputSeach,
      numPageAtual,
      totalPages,
      showModalInfo,
      questions
    } = this.state;
    return (
      <TemplateSistema active="provas">
        <div className="row" style={{ marginBottom: "15px" }}>
          <div className="col-12">
            <h3 style={{ margin: "0px" }}> Listas de Exercícios</h3>
          </div>
        </div>
        <div className="row" style={{ marginBottom: "15px" }}>
          <div className="col-3">
            <Link to="/professor/criarProva">
              <button className="btn btn-primary" type="button" style={botao}>
                Criar Prova <i className="fe fe-file-plus" />
              </button>
            </Link>
          </div>
          <div className=" col-9">
            <InputGroup
              placeholder={`Perquise pelo ${
                fieldFilter === "title"
                  ? "Nome"
                  : fieldFilter === "code"
                  ? "Código"
                  : "..."
              }`}
              value={contentInputSeach}
              handleContentInputSeach={this.handleContentInputSeach.bind(this)}
              filterSeash={this.filterSeash.bind(this)}
              handleSelect={this.handleSelectFieldFilter.bind(this)}
              options={[
                { value: "title", content: "Nome" },
                { value: "code", content: "Código" }
              ]}
              clearContentInputSeach={this.clearContentInputSeach.bind(this)}
              loading={loadingProvas}
            />
          </div>
        </div>
        <div className="row" style={{ marginBottom: "15px" }}>
          <div className="col-12">
            <table style={lista} className="table table-hover">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Código</th>
                  <th>Criado em</th>
                  <th className="text-center"></th>
                </tr>
              </thead>
              <tbody>
                {loadingProvas ? (
                  <tr>
                    <td>
                      <div className="loader" />
                    </td>
                    <td>
                      <div className="loader" />
                    </td>
                    <td>
                      <div className="loader" />
                    </td>
                    <td>
                      <div className="loader" />
                    </td>
                  </tr>
                ) : (
                  listas.map((lista, index) => {
                    return (
                      <Fragment key={index}>
                        <tr>
                          <td>{lista.title}</td>
                          <td>{lista.code}</td>
                          <td>{formataData(lista.createdAt)}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-primary float-right"
                              onClick={() =>
                                this.handleShowModalInfo(lista.questions)
                              }
                            >
                              <i className="fa fa-info" />
                            </button>
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col-12 text-center">
            <NavPagination
              totalPages={totalPages}
              pageAtual={numPageAtual}
              handlePage={this.handlePage}
            />
          </div>
        </div>
        <Modal
          show={showModalInfo}
          onHide={this.handleCloseshowModalInfo.bind(this)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Questões
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              {questions.map((questao, index) => (
                <div key={index} className="col-6">
                  <Card style={{ marginBottom: "0" }}>
                    <CardHead style={{ marginBottom: "0" }}>
                      <CardTitle>{questao.title}</CardTitle>
                      <CardOptions>
                        <button
                          className="btn btn-primary"
                          data-toggle="collapse"
                          data-target={"#collapse" + questao.id}
                          style={{ position: "relative" }}
                        >
                          <i className={`fe fe-chevron-down`} />
                        </button>
                      </CardOptions>
                    </CardHead>
                    <div className="collapse" id={"collapse" + questao.id}>
                      <CardBody>
                        <b>Descrição: </b>
                        <p>{questao.description}</p>
                        <br />
                        <BlockMath>{questao.katexDescription || ""}</BlockMath>
                        <br />
                      </CardBody>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-primary"
              onClick={this.handleCloseshowModalInfo.bind(this)}
            >
              Fechar
            </button>
          </Modal.Footer>
        </Modal>
      </TemplateSistema>
    );
  }
}
