import React, { Component } from "react";
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
import Swal from "sweetalert2";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import ParticioantesScreenfrom from "components/screens/participantes.componentes.screen";
import { CSVLink } from "react-csv";
import SwalModal from "components/ui/modal/swalModal.component";
import moment from "moment";

export default class Pagina extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participantes: [],
      showModal: false,
      loadingParticipantes: false,
      myClasses: JSON.parse(sessionStorage.getItem("myClasses")) || "",
      turma: "",
      loadingInfoTurma: true,
      docsPerPage: 15,
      numPageAtual: sessionStorage.getItem("pagePatcipants") || 1,
      totalItens: 0,
      totalPages: 0,
      csvData: []
    };
    this.handlePage = this.handlePage.bind(this);
  }

  async componentDidMount() {
    await this.getInfoTurma();
    this.getParticipantes();
    const { turma } = this.state;
    document.title = `${turma && turma.name} - participantes`;
  }
  async getInfoTurma() {
    const id = this.props.match.params.id;
    const { myClasses } = this.state;
    if (myClasses && typeof myClasses === "object") {
      const index = myClasses.map((c) => c.id).indexOf(id);
      if (index !== -1) {
        this.setState({
          turma: myClasses[index],
        });
      }
      this.setState({ loadingInfoTurma: false });
      return null;
    }
    try {
      const response = await api.get(`/class/${id}`);
      this.setState({
        turma: response.data,
        loadingInfoTurma: false,
      });
    } catch (err) {
      this.setState({ loadingInfoTurma: false });
      console.log(err);
    }
  }

  async getParticipantes(loading = true) {
    const { numPageAtual, docsPerPage } = this.state;
    const idClass = this.props.match.params.id;
    let query = `?idClass=${idClass}`;
    query += `&classes=yes`;
    query += `&docsPerPage=${docsPerPage}`;

    try {
      if (loading) this.setState({ loadingParticipantes: true });
      const response = await api.get(`/user/page/${numPageAtual}${query}`);
      this.setState({
        participantes: [...response.data.docs],
        totalItens: response.data.total,
        totalPages: response.data.totalPages,
        numPageAtual: response.data.currentPage,
        loadingParticipantes: false,
      });
      sessionStorage.setItem("pagePatcipants", response.data.currentPage);
    } catch (err) {
      this.setState({ loadingParticipantes: false });
      console.log(err);
    }
  }
  async removerParticipante(user) {
    const idUser = user.id;
    const idClass = this.props.match.params.id;
    let query = `?idClass=${idClass}`;
    query += `&idUser=${idUser}`;
    try {
      const { value } = await Swal.fire({
        title: `Tem certeza que quer remover "${user.email}" da turma?`,
        //text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, remover usuário!",
        cancelButtonText: "Não, cancelar!",
      });
      if (!value) return null;
      Swal.fire({
        title: "Removendo usuário",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      Swal.showLoading();
      await api.delete(`/classHasUser/delete${query}`);
      const { participantes } = this.state;
      this.setState({
        participantes: participantes.filter((p) => p.id !== idUser),
      });
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Usuário removido com sucesso!",
      });
    } catch (err) {
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "ops... Usuário não pôde ser removido",
      });
    }
  }
  handleCloseModal() {
    this.setState({ showModal: false });
  }
  handlePage(e, numPage) {
    e.preventDefault();
    //console.log(numPage);
    this.setState(
      {
        numPageAtual: numPage,
      },
      () => this.getParticipantes()
    );
  }
  handleSelectfildFilter(e) {
    this.setState(
      {
        fildFilter: e.target.value,
      },
      () => this.getParticipantes()
    );
  }

  handleContentInputSeach(e) {
    this.setState(
      {
        contentInputSeach: e.target.value,
      },
      () => this.getParticipantes()
    );
  }
  clearContentInputSeach() {
    this.setState(
      {
        contentInputSeach: "",
      },
      () => this.getParticipantes()
    );
  }

  async generateCsv(){
    const { id } = this.props.match.params;
    Swal.showLoading();
    try{
      const response = await api.get(`/dataScience/class/${id}/list`);
      this.setState({showModal: true})
      // console.log('csv',response.data);
      // console.log('formated csv',this.formatCsv(response.data));
      this.setState({
        csvData: this.formatCsv(response.data),
        //showModal: true
      })
    }
    catch(err){
      console.log(err);
    }
    Swal.hideLoading();
  }
  formatCsv(rows){
    let tableHeader  = rows[0].lists.map(row=>{
      const dateBegin = row.classHasListQuestion.createdAt;
      const dateEnd = row.classHasListQuestion.submissionDeadline;
      return `${row.title} (${dateBegin?moment(dateBegin).format("DD/MM/YYYY"):''}${dateEnd?` - ${moment(dateEnd).format("DD/MM/YYYY")}`:''})` ;
    })
    tableHeader = [
      'Nome',
      'Matrícula',
      ...tableHeader
    ]
    //console.log('tableHeader: ', tableHeader)
    const tableBody = rows.map(row=>{
      let colsLists = row.lists.map(colList=>
        Math.round((colList.questionsCompletedSumissionsCount/colList.questionsCount)*100)
      )
      return [
        row.name,
        row.enrollment,
        ...colsLists
      ];
    })
    //console.log('result: ',typeresult)
    const table = [tableHeader,...tableBody];
    //console.log('table: ',table);
    return table;
  }
  render() {
    const { turma, loadingInfoTurma, csvData, showModal } = this.state;
    return (
      <TemplateSistema
        {...this.props}
        active={"participantes"}
        submenu={"telaTurmas"}
      >
        <Row mb={15}>
          <Col xs={12}>
            {loadingInfoTurma ? (
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
              <h5 style={{ margin: "0px" }}>
                <i className="fa fa-users mr-2" aria-hidden="true" />
                {turma && turma.name} - {turma && turma.year}.
                {turma && turma.semester}
                <i className="fa fa-angle-left ml-2 mr-2" /> Participantes
              </h5>
            )}
          </Col>
        </Row>
        <Row  mb={15}>
          <Col xs={12}>
              <button
                className={'btn btn-primary'}
                onClick={()=>this.generateCsv()}
              >
                Gerar CSV

              </button>
              {/* <CSVLink
                data={csvData}
                className={'btn btn-primary'}
                asyncOnClick={true}
                onClick={this.generateCsv}
              >
                Baixar CSV
              </CSVLink> */}
          </Col> 
        </Row>
        <ParticioantesScreenfrom
          {...this.props}
          {...this.state}
          handlePage={this.handlePage.bind(this)}
          removerParticipante={this.removerParticipante.bind(this)}
        />
        <SwalModal
          show={showModal}
          handleModal={() =>  this.setState({showModal:false})}
        >
          <Row>
            <Col xs={12} textCenter>
              {csvData && <CSVLink
                data={csvData}
                filename={`${turma && turma.name}-${moment().local().format("YYYY-MM-DD-HH-mm")}.csv`}
                className={'btn btn-primary btn-lg'}
                onClick={()=>this.setState({showModal: false})}
              >
                Baixar CSV <i className=" fa fa-download ml-5" />
              </CSVLink>}
            </Col>
          </Row>
        </SwalModal>
      </TemplateSistema>
    );
  }
}