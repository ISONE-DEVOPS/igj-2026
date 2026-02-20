import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, Pagination, Button, Modal } from "react-bootstrap";
import BTable from "react-bootstrap/Table";
import toast from 'react-hot-toast';
import jsPDF from "jspdf";
import "jspdf-autotable";

import Excel from 'exceljs';
import { saveAs } from 'file-saver';

import { Link } from "react-router-dom";
import { GlobalFilter } from "./GlobalFilter";

import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";

import api from "../../../../services/api";

import useAuth from "../../../../hooks/useAuth";

import Select from "react-select";

import { useHistory, useParams } from "react-router-dom";

import {
  pageEnable,
  taskEnable,
  taskEnableIcon,
  taskEnableTitle,
  convertToPrice,
  makedate,
  formatCurrency,
  formatDate
} from "../../../../functions";

import CriarPessoa from "../../../../components/Custom/CriarPessoa";
import Documentos from "../../../../components/Custom/Documentos";

const pageAcess = "/entidades/entidades/detalhes"

const columns2 = [
  { header: 'CODIGO', key: 'CODIGO' },
  { header: 'PESSAO', key: 'PESSOA2' },
  { header: 'ENTIDADE', key: "ENTIDADE" },
  { header: 'VALOR', key: 'VALOR2' },
  { header: 'DATA', key: 'DATA2' }
];

function Table({ uploadList, columns, data, modalOpen, exportPDF, saveExcel }) {
  const [DATA_DE, setDATA_DE] = useState("");
  const [DATA_PARA, setDATA_PARA] = useState("");
  const tableRef = useRef(null);
  const { permissoes } = useAuth();
  const [values, setValues] = useState()
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,

    globalFilter,
    setGlobalFilter,

    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const resetForm = () => {
    setValues("")
  }
  function filterDataInicio(e) {
    setDATA_DE(e)
    console.log(e)
    uploadList(e, DATA_PARA)
  }
  function filterDataFim(e) {
    setDATA_PARA(e)
    uploadList(DATA_DE, e)
  }
  function reloadList() {
    setDATA_DE("")
    setDATA_PARA("")
    uploadList()

  }
  function optionDownload(value) {
    if (value === "1") {
      exportPDFHandpay();
      resetForm()
    } else if (value === "2") {
      saveExcel();
      resetForm()
    }
  }
  async function exportPDFHandpay() {
    try {

      const response = await api.get(`/casosuspeito/exportPdf`, { responseType: "blob" });

      if (response.status == '200') {
        const file = new Blob([response.data], { type: "application/pdf" });
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        //Open the URL on new Window
        const pdfWindow = window.open();
        pdfWindow.location.href = fileURL;
      }

      console.log(response)

    } catch (err) {

      console.error(err.response)
    }


  }
  return (
    <>
      <Row className="mb-3">
        <Col md={3} className="d-flex align-items-center">
          Mostrar
          <select
            className="form-control w-auto mx-2"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          entradas
        </Col>
        <Col md={9} className="d-flex justify-content-end">
          {/* <div className="form-group fill">
            <label className="floating-label" htmlFor="Name">
              Data Início<span style={{ color: "red" }}>*</span>
            </label>
           
          </div> */}

          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />

          {taskEnable(pageAcess, permissoes, "Criar") == false ? null : (
            <Button
              variant="primary"
              className="btn-sm btn-round has-ripple ml-2"
              onClick={modalOpen}
            >
              <i className="feather icon-plus" /> Adicionar
            </Button>
          )}

          <select
            style={{ marginLeft: "10px" }}
            value={values}
            onChange={(e) => { optionDownload(e.target.value) }}
          >
            <option value=""> Download </option>
            <option value="1"> PDF </option>
            <option value="2"> EXCEL </option>
          </select>
        </Col>

      </Row>
      <BTable ref={tableRef} striped bordered hover responsive {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <span className="feather icon-arrow-down text-muted float-right" />
                      ) : (
                        <span className="feather icon-arrow-up text-muted float-right" />
                      )
                    ) : (
                      ""
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  const isCentered = cell.column.centered;
                  return (
                    <td  {...cell.getCellProps()} className={isCentered ? 'text-center' : 'text-right'}>{cell.render('Cell')}</td>
                  )
                })}
              </tr>
            );
          })}
        </tbody>
      </BTable>
      <Row className="justify-content-between">
        <Col>
          <span className="d-flex align-items-center">
            Página{" "}
            <strong>
              {" "}
              {pageIndex + 1} de {pageOptions.length}{" "}
            </strong>{" "}
            | Ir para a página:{" "}
            <input
              type="number"
              className="form-control ml-2"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </span>
        </Col>
        <Col>
          <Pagination className="justify-content-end">
            <Pagination.First
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            />
            <Pagination.Prev
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            />
            <Pagination.Next
              onClick={() => nextPage()}
              disabled={!canNextPage}
            />
            <Pagination.Last
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            />
          </Pagination>
        </Col>
      </Row>
    </>
  );
}

const CasoSuspeito = () => {
  const params = useParams();

  const workbook = new Excel.Workbook();
  const { permissoes } = useAuth();
  const history = useHistory();

  const { popUp_removerItem, popUp_alertaOK } = useAuth();

  const columns = React.useMemo(
    () => [
      {
        Header: "Interveniente",
        accessor: "INTERVENIENTE",
        centered: true

      },
      {
        Header: "Nif",
        accessor: "NIF_INTERVENIENTE",
        centered: false
      },
      {
        Header: "Responsável",
        accessor: "RESPONSAVEL",
        centered: true
      },
      {
        Header: "DT Operação",
        accessor: "DATA_OPERACAO",
        centered: true
      },
      {
        Header: "Montante",
        accessor: "MONTANTE",
        centered: false
      },

      {
        Header: "Divisa",
        accessor: "divisa.DESIGNACAO",
        centered: true
      },
      {
        Header: "Meio Pagamento",
        accessor: "meiopagamento.NOME",
        centered: true
      },
      {
        Header: "Modalidade Pagamento",
        accessor: "modalidade.DESIGNACAO",
        centered: true
      },
      {
        Header: "Ações",
        accessor: "action",
        centered: true
      },
    ],
    []
  );

  const [ID_C, setID_C] = useState("");
  var todayDate = new Date().toJSON().slice(0, 10);
  const [DATA_DE, setDATA_DE] = useState("");
  const [DATA_PARA, setDATA_PARA] = useState("");
  const [PESSOA_ID, setPESSOA_ID] = useState("");
  const [ENTIDADE_ID, setENTIDADE_ID] = useState("");
  const [VALOR, setVALOR] = useState("");
  const [DATA, setDATA] = useState("");
  const [DESCR, setDESCR] = useState("");
  const [OBS_INTERNA, setOBS_INTERNA] = useState("");
  const [newdata, setnewdata] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  const [itemSelected, setitemSelected] = useState({});
  const [previewSelected, setPreviewSelected] = useState(null);

  const [documentosgeral_lista, setdocumentosgeral_lista] = useState([]);
  const [documentosgeral_lista_save, setdocumentosgeral_lista_save] =
    useState(false);

  const [documentosgeral_item, setdocumentosgeral_item] = useState({ ID: "", ENTIDADE: "HANDPAY_ID", });
  const [REFERENCIA, setREFERENCIA] = useState("");
  const [DT, setDT] = useState("");
  const [DT_OPERACAO, setDT_OPERACAO] = useState("");
  const [DIVISA_ID, setDIVISA_ID] = useState("");
  const [MEIOPAGAMENTO_ID, setMEIOPAGAMENTO_ID] = useState("");
  const [TIPO_BEM, setTIPO_BEM] = useState("");
  const [MOTIVO, setMOTIVO] = useState("");
  const [OBS, setOBS] = useState("");
  const [MODALIDADE_ID, setMODALIDADE_ID] = useState("");
  const [PROFISSAO_ID, setPROFISSAO_ID] = useState("");
  var novosDocs

  const [singulares, setSingulares] = useState({
    PESSOA_ID: "",
    PROFISSAO_ID: "",
    LOCAL_TRABALHO: "",
    ENTIDADE_PATRONAL: "",
    COLETIVO: "1",
  });

  const [coletivo, setColetivo] = useState({
    PESSOA_ID: "",
    TELEFONE: "",
    NIF: 0,
    MORADA: "",
    NOME: "",
    ATIVIDADE: "",
    COLETIVO: "0",
  });
  const [pessoaSelected, setPessoaSelected] = useState({
    NIF: "",
    DATA_NASCIMENTO: "",
    NUMERO: "",
    TELEFONE: "",
    MORADA: "",
    DOC_IDENTIFICACAO: "",
    NACIONALIDADE: "",

  });
  var exportEx = []
  newdata?.forEach((dat, i) => {
    exportEx.push({
      "CODIGO": dat.CODIGO,
      "PESSOA2": dat.PESSOA2,
      "ENTIDADE": dat.sgigjentidade.DESIG,
      "VALOR2": dat.VALOR2,
      "DATA2": dat.DATA2,
    })
  })

  const data = exportEx;

  function exportPDF() {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "Lista de Handpay";
    const headers = [["CODIGO", "PESSOA", "ENTIDADE", "VALOR", "DATA"]];

    const data = exportEx?.map(c => [c.CODIGO, c.PESSOA2, c.ENTIDADE, c.VALOR2, c.DATA2]);

    let content = {
      startY: 50,
      head: headers,
      body: data
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("hanpay.pdf")
  }

  const workSheetName = 'Worksheet-1';
  const saveExcel = async () => {
    try {
      const fileName = "handpay";

      // creating one worksheet in workbook
      const worksheet = workbook.addWorksheet(workSheetName);

      // add worksheet columns
      // each columns contains header and its mapping key from data
      worksheet.columns = columns2;

      // updated the font for first row.
      worksheet.getRow(1).font = { bold: true };

      // loop through all of the columns and set the alignment with width.
      worksheet.columns.forEach(column => {
        column.width = column.header.length + 5;
        column.alignment = { horizontal: 'center' };
      });

      // loop through data and add each one to worksheet
      data.forEach(singleData => {
        worksheet.addRow(singleData);
      });

      // loop through all of the rows and set the outline style.
      worksheet.eachRow({ includeEmpty: false }, row => {
        // store each cell to currentCell
        const currentCell = row._cells;

        // loop through currentCell to apply border only for the non-empty cell of excel
        currentCell.forEach(singleCell => {
          // store the cell address i.e. A1, A2, A3, B1, B2, B3, ...
          const cellAddress = singleCell._address;

          // apply border
          worksheet.getCell(cellAddress).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      });

      // write the content using writeBuffer
      const buf = await workbook.xlsx.writeBuffer();

      // download the processed file
      saveAs(new Blob([buf]), `${fileName}.xlsx`);
    } catch (error) {
      console.error('<<<ERRROR>>>', error);
      console.error('Something Went Wrong', error.message);
    } finally {
      // removing worksheet's instance to create new one
      workbook.removeWorksheet(workSheetName);
    }
  };

  function createDate1(data) {
    if (data == null) return;

    let res = new Date(data)
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
      .split(" ")
      .join("-");

    res = res.replace("/", "-");

    return res.replace("/", "-");
  }

  function createDate2(data) {
    if (data == null) return "";

    return new Date(data).toISOString().slice(0, 10);
  }
  const updateSingularObj = (property, value) => {
    setSingulares(prevObj => ({
      ...prevObj,
      [property]: value,
    }));
  };
  const updateColetivoObj = (property, value) => {
    setColetivo(prevObj => ({
      ...prevObj,
      [property]: value,
    }));
  };
  const updatePessoaObj = (property, value) => {
    setPessoaSelected(prevObj => ({
      ...prevObj,
      [property]: value,
    }));
  };
  //-------------------------- UPLOAD -----------------


  async function uploadlist() {

    console.log(params)
    let response
    try {
      response = await api.get(`/casosuspeito?ENTIDADE_ID=${params.id}`);
      if (response.status == "200") {
        for (var i = 0; i < response.data.length; i++) {
          const idx = response.data[i].ID;

          response.data[i].id = response.data[i].ID;
          response.data[i].MONTANTE = formatCurrency(response.data[i].VALOR);
          response.data[i].DATA_OPERACAO = formatDate(response.data[i].DT_OPERACAO);
          for (let j = 0; j < response.data[i].intervenientes.length; j++) {
            if (response.data[i].intervenientes[j].COLETIVO === "0") {
              response.data[i].RESPONSAVEL = response.data[i].intervenientes[j].NOME

            } else {
              response.data[i].INTERVENIENTE = response.data[i].intervenientes[j].pessoa.NOME
              response.data[i].NIF_INTERVENIENTE = response.data[i].intervenientes[j].pessoa.NIF


            }
          }
          const itemx = response.data[i];

          response.data[i].action = (
            <React.Fragment>
              {taskEnable(pageAcess, permissoes, "Ler") == false ? null : (
                <Link
                  to="#"
                  title={taskEnableTitle(pageAcess, permissoes, "Ler")}
                  onClick={() => openVerHandler(itemx)}
                  className="text-primary mx-1"
                >
                  <i
                    className={
                      "text-primary " +
                      taskEnableIcon(pageAcess, permissoes, "Ler")
                    }
                  />
                </Link>
              )}

              {taskEnable(pageAcess, permissoes, "Editar") == false ? null : (
                <Link
                  to="#"
                  title={taskEnableTitle(pageAcess, permissoes, "Editar")}
                  onClick={() => openEditHandler(itemx)}
                  className="text-primary mx-1"
                >
                  <i
                    className={
                      "text-primary " +
                      taskEnableIcon(pageAcess, permissoes, "Editar")
                    }
                  />
                </Link>
              )}
              {taskEnable(pageAcess, permissoes, "DocDecisaoTribunal") == false ? null : (
                <Link
                  to="#"
                  title={taskEnableTitle(pageAcess, permissoes, "DocDecisaoTribunal")}
                  onClick={() => downloadDoc(idx)}
                  className="text-primary"
                >
                  <i
                    className={
                      "" + taskEnableIcon(pageAcess, permissoes, "DocDecisaoTribunal")
                    }
                  />
                </Link>
              )}
              {taskEnable(pageAcess, permissoes, "Eliminar") == false ? null : (
                <Link
                  to="#"
                  title={taskEnableTitle(pageAcess, permissoes, "Eliminar")}
                  onClick={() => removeItem(idx)}
                  className="text-danger"
                >
                  <i
                    className={
                      "" + taskEnableIcon(pageAcess, permissoes, "Eliminar")
                    }
                  />
                </Link>
              )}
            </React.Fragment>
          );
        }
        setENTIDADE_ID(params.id)

        setnewdata(response.data);
      }
    } catch (err) {
      console.error(err.response);
    }
  }

  const [activeProfileTab, setActiveProfileTab] = useState("dados");

  const profileTabClass = "nav-link text-reset";
  const profileTabActiveClass = "nav-link text-reset active";

  const [pessoalist, setpessoalist] = useState([]);
  const [entidadelist, setentidadelist] = useState([]);
  var pessoasList
  async function uploadpessoa() {
    try {
      const response = await api.get("/sgigjpessoa");

      if (response.status == "200") {
        for (var i = 0; i < response.data.length; i++) {
          response.data[i].value = response.data[i].ID;
          response.data[i].label = response.data[i].NOME;
        }
        pessoasList = response.data
        setpessoalist(response.data);
      }
    } catch (err) {
      console.error(err.response);
    }
  }

  const [profissaolist, setprofissaolist] = useState([]);

  async function uploadprofissaolist() {

    try {

      const response = await api.get('/sgigjprprofissao');
      if (response.status == '200') {
        const selectOptions = response.data.map(option => ({
          value: option.ID,
          label: option.DESIG,
        }));

        setprofissaolist(selectOptions)
      }

    } catch (err) {

      console.error(err.response)


    }

  }

  const [divisaslist, setdivisaslist] = useState([]);

  async function uploaddivisaslist() {

    try {

      const response = await api.get('/divisa');
      if (response.status == '200') {
        const selectOptions = response.data.map(option => ({
          value: option.ID,
          label: option.DESIGNACAO,
        }));

        setdivisaslist(selectOptions)
      }

    } catch (err) {

      console.error(err.response)


    }

  }
  const [meiopagamentolist, setmeiopagamentolist] = useState([]);

  async function uploadmeiopagamentolist() {

    try {

      const response = await api.get('/meiospagamento');
      if (response.status == '200') {
        const selectOptions = response.data.map(option => ({
          value: option.ID,
          label: option.NOME,
        }));

        setmeiopagamentolist(selectOptions)
      }

    } catch (err) {

      console.error(err.response)


    }

  }

  const [modalidadepagamentolist, setmodalidadepagamentolist] = useState([]);

  async function uploadmodalidadepagamentolist() {

    try {

      const response = await api.get('/modalidadepagamento');
      if (response.status == '200') {
        const selectOptions = response.data.map(option => ({
          value: option.ID,
          label: option.DESIGNACAO,
        }));

        setmodalidadepagamentolist(selectOptions)
      }

    } catch (err) {

      console.error(err.response)


    }

  }


  const [generolist, setgenerolist] = useState([]);

  async function uploadgenerolist() {
    try {
      const response = await api.get("/sgigjprgenero");

      if (response.status == "200") {
        setgenerolist(response.data);
      }
    } catch (err) {
      console.error(err.response);
    }
  }

  const [estadocivillist, setestadocivillist] = useState([]);

  async function uploadestadocivil() {
    try {
      const response = await api.get("/sgigjprestadocivil");

      if (response.status == "200") {
        setestadocivillist(response.data);
      }
    } catch (err) {
      console.error(err.response);
    }
  }

  const [glbgeografialist, setglbgeografia] = useState([]);

  async function uploadglbgeografia() {
    try {
      const response = await api.get("/glbgeografia");

      if (response.status == "200") {
        setglbgeografia(response.data);
      }
    } catch (err) {
      console.error(err.response);
    }
  }

  const [documentolist, setdocumentolist] = useState([]);

  async function uploaddocumentolist() {
    try {
      const response = await api.get("/sgigjprdocumentotp");

      if (response.status == "200") {
        setdocumentolist(response.data);
      }
    } catch (err) {
      console.error(err.response);
    }
  }

  const [contactolist, setcontactolist] = useState([]);
  const [urlDOC, seturlDOC] = useState(null);
  const [hasDOC, sethasDOC] = useState(false);
  const [loadGenerte, setLoadGenerate] = useState(false)

  async function uploadcontactolist() {
    try {
      const response = await api.get("/sgigjprcontactotp");

      if (response.status == "200") {
        setcontactolist(response.data);
      }
    } catch (err) {
      console.error(err.response);
    }
  }

  //-------------- Ver -------------------------

  const [imgprev, setimgprev] = useState();

  const openVerHandler = async (idx) => {
    idx.VALOR = formatCurrency(idx.VALOR)
    let newitemler = idx;

    setimgprev("");
    setActiveProfileTab("dados");
    setREFERENCIA(idx.REFERENCIA)
    idx.DT = createDate2(idx.DT)
    idx.DATA = createDate2(idx.DATA)
    idx.DT_OPERACAO = createDate2(idx.DT_OPERACAO)
    setDIVISA_ID(idx.DIVISA_ID)
    setMEIOPAGAMENTO_ID(idx.MEIOPAGAMENTO_ID)
    setMODALIDADE_ID(idx.MODALIDADE_ID)
    setMOTIVO(idx.MOTIVO)
    setTIPO_BEM(idx.TIPO_BEM)
    setOBS(idx.OBS)
    console.log(pessoasList)
    setPESSOA_ID(idx.intervenientes.length > 0 ? idx.intervenientes[0].PESSOA_ID : "")

    for (let index = 0; index < idx.intervenientes.length; index++) {
      if (idx.intervenientes[index].COLETIVO == "0") {
        updateColetivoObj("NOME", idx.intervenientes[index].NOME)
        updateColetivoObj("ATIVIDADE", idx.intervenientes[index].ATIVIDADE)
        updateColetivoObj("MORADA", idx.intervenientes[index].MORADA)
        updateColetivoObj("NIF", idx.intervenientes[index].NIF)
        updateColetivoObj("TELEFONE", idx.intervenientes[index].TELEFONE)
        updateColetivoObj("PESSOA_ID", idx.intervenientes[index].PESSOA_ID)
        continue
      } else {
        updateSingularObj("PROFISSAO_ID", idx.intervenientes[index].profissao.ID)
        updateSingularObj("PESSOA_ID", idx.intervenientes[index].PESSOA_ID)
        updateSingularObj("ENTIDADE_PATRONAL", idx.intervenientes[index].ENTIDADE_PATRONAL)
        updateSingularObj("LOCAL_TRABALHO", idx.intervenientes[index].LOCAL_TRABALHO)
        onChangePessoaSingular("PESSOA_ID", idx.intervenientes[index].PESSOA_ID)
        continue
      }

    }
    try {
      const response = await api.get("/casosuspeito/" + idx.id);

      console.log(response);

      if (response.status == "200") {
        if (response.data.length > 0) {
          let doclist = [];

          for (
            let ix = 0;
            ix < response.data[0].sgigjreldocumento.length;
            ix++
          ) {
            doclist.push({
              id: response.data[0].sgigjreldocumento[ix].ID,
              nome: response.data[0].sgigjreldocumento[ix].sgigjprdocumentotp
                .DESIG,
              url: response.data[0].sgigjreldocumento[ix].DOC_URL,
            });
          }

          setVerOpen(true);
          setIsEditarOpen(false);
          setIsOpen(false);
          newitemler.doclist = doclist;
          setitemSelected(newitemler);
        }

        console.log(newitemler);
      }
    } catch (err) {
      console.error(err.response);
    }
  };
  function selectedImg(preview) {
    if (preview != undefined) {
      setimgprev(preview?.url)
      setPreviewSelected(preview)
    }

  }

  //-----------------------------------------------'

  //-------------- EDITAR -------------------------

  const openEditHandler = async (idx) => {
    setActiveProfileTab("dados");
    setIsEditarOpen(true);
    setIsOpen(false);
    setVerOpen(false);
    setREFERENCIA(idx.REFERENCIA)
    idx.DT = createDate2(idx.DT)
    idx.DATA = createDate2(idx.DATA)
    idx.DT_OPERACAO = createDate2(idx.DT_OPERACAO)
    setDIVISA_ID(idx.DIVISA_ID)
    setMEIOPAGAMENTO_ID(idx.MEIOPAGAMENTO_ID)
    setMODALIDADE_ID(idx.MODALIDADE_ID)
    setMOTIVO(idx.MOTIVO)
    setTIPO_BEM(idx.TIPO_BEM)
    setOBS(idx.OBS)
    console.log(pessoasList)
    setPESSOA_ID(idx.intervenientes.length > 0 ? idx.intervenientes[0].PESSOA_ID : "")

    for (let index = 0; index < idx.intervenientes.length; index++) {
      if (idx.intervenientes[index].COLETIVO == "0") {
        updateColetivoObj("NOME", idx.intervenientes[index].NOME)
        updateColetivoObj("ATIVIDADE", idx.intervenientes[index].ATIVIDADE)
        updateColetivoObj("MORADA", idx.intervenientes[index].MORADA)
        updateColetivoObj("NIF", idx.intervenientes[index].NIF)
        updateColetivoObj("TELEFONE", idx.intervenientes[index].TELEFONE)
        updateColetivoObj("PESSOA_ID", idx.intervenientes[index].PESSOA_ID)
        continue
      } else {
        updateSingularObj("PROFISSAO_ID", idx.intervenientes[index].profissao.ID)
        updateSingularObj("PESSOA_ID", idx.intervenientes[index].PESSOA_ID)
        updateSingularObj("ENTIDADE_PATRONAL", idx.intervenientes[index].ENTIDADE_PATRONAL)
        updateSingularObj("LOCAL_TRABALHO", idx.intervenientes[index].LOCAL_TRABALHO)

        onChangePessoaSingular("PESSOA_ID", idx.intervenientes[index].PESSOA_ID)
        // updatePessoaObj("NIF", idx.intervenientes[index].pessoa.NIF)
        // updatePessoaObj("NACIONALIDADE", idx.intervenientes[index].pessoa.NACIONALIDADE_ID)
        // updatePessoaObj("TELEFONE", idx.intervenientes[index].pessoa.TELEFONE)
        // updatePessoaObj("MORADA", idx.intervenientes[index].pessoa.ENDERECO)
        // updatePessoaObj("DATA_NASCIMENTO", idx.intervenientes[index].pessoa.DATA_NASCIMENTO)
        continue
      }

    }

    // setPROFISSAO_ID()
    // setPESSOA_ID(idx.PESSOA_ID);
    setENTIDADE_ID(idx.ENTIDADE_ID)
    setVALOR(idx.VALOR);
    setDESCR(idx.DESCR);
    setOBS_INTERNA(idx.OBS_INTERNA);
    //setESTADO_C(idx.ID)
    setitemSelected(idx);

    try {
      const response3 = await api.get(
        "/sgigjreldocumento?PROCESSO_CASOSUSPEITO_ID=" + idx.ID
      );

      if (response3.status == "200") {
        console.log(response3.data)

        setdocumentosgeral_lista(response3.data);
      }
    } catch (err) {
      console.error(err.response3);
    }
  };
  async function getDocuments(receivedValue) {
    let documentos = []

    if (documentosgeral_lista.length > 0 && receivedValue[0].tipodocumento === "") {
      documentosgeral_lista.map(res => {

        return documentos.push({
          PR_DOCUMENTO_TP_ID: res.PR_DOCUMENTO_TP_ID,
          NUMERO: res.NUMERO,
          DOC_URL: res.DOC_URL,
          DT_EMISSAO: res.DT_EMISSAO,
          DT_VALIDADE: res.DT_VALIDADE,
          MAIN: res.MAIN,
          ESTADO: res.ESTADO,
        })
      })
    }
    else {
      for (let i = 0; i < receivedValue.length; i++) {
        if (
          receivedValue[i].tipodocumento != "" &&
          receivedValue[i].numero != ""
        ) {
          var anexofile = "";

          if (receivedValue[i].anexo.type == "1") {
            anexofile = receivedValue[i].anexo.file;
          }

          if (receivedValue[i].anexo.type == "2") {
            const img = await onFormSubmitImage(
              receivedValue[i].anexo.file
            );

            anexofile = img.file.data;
          }
          documentos.push({
            PR_DOCUMENTO_TP_ID: receivedValue[i].tipodocumento,
            NUMERO: receivedValue[i].numero,
            DOC_URL: anexofile,
            DT_EMISSAO: receivedValue[i].dataemissao,
            DT_VALIDADE: receivedValue[i].datavalidade,
            MAIN: "0",
            ESTADO: "1",
          })
        }
      }
    }
    novosDocs = documentos

  }
  async function editarItemGO(event) {
    event.preventDefault();
    setIsLoading(true)
    getDocuments(receivedValue)
    setdocumentosgeral_lista_save(!documentosgeral_lista_save);
    const upload = {
      REFERENCIA: REFERENCIA,
      DT: DT,
      DT_OPERACAO: DT_OPERACAO,
      VALOR: parseInt(VALOR),
      DIVISA_ID: DIVISA_ID.value,
      MEIOPAGAMENTO_ID: MEIOPAGAMENTO_ID.value,
      TIPO_BEM: TIPO_BEM,
      MOTIVO: MOTIVO,
      OBS: OBS,
      MODALIDADE_ID: MODALIDADE_ID.value,
      ENTIDADE_ID: params.id,
      intervenientes: [singulares, coletivo],
      documentos: novosDocs
    };
    console.log(upload)
    try {
      const response = await api.put(
        "/casosuspeito/" + itemSelected.ID,
        upload
      );

      if (response.status == "200") {
        // setdocumentosgeral_lista_save(!documentosgeral_lista_save);

        uploadlist();
        setIsLoading(false)
        setIsEditarOpen(false);
        toast.success('Todos os dados foram atualizadas com sucesso!', { duration: 4000 })
        // toast("");

      }
    } catch (err) {
      setIsLoading(false)
      console.error(err.response);
    }
  }


  //----------------------------------------------

  //-------------- CRIAR -------------------------

  const openHandler = () => {
    setIsOpen(true);
    setIsEditarOpen(false);
    setVerOpen(false);
    setThumnail("")

    setPESSOA_ID("");
    setENTIDADE_ID("");
    setVALOR("");
    setDATA("");
    setDESCR("");
    setOBS_INTERNA("");

    setdocumentosgeral_lista([]);
    setID_C("");
  };

  async function criarItemGO(event) {
    event.preventDefault();

    // if (PESSOA_ID == null || PESSOA_ID == "")
    //   popUp_alertaOK("Escolha uma Pessoa");

    // if (thumnail == null) {
    //   return popUp_alertaOK("Escolha uma imagem");
    // }
    setIsLoading(true)
    let documentos = []
    console.log(params)
    // setdocumentosgeral_lista_save(!documentosgeral_lista_save);

    console.log(documentolist, "documentolist")
    console.log(documentosgeral_lista_save)
    console.log(singulares)
    console.log(coletivo)
    console.log(receivedValue)
    console.log(documentos)

    setdocumentosgeral_lista_save(!documentosgeral_lista_save);

    for (let i = 0; i < receivedValue.length; i++) {
      if (
        receivedValue[i].tipodocumento != "" &&
        receivedValue[i].numero != ""
      ) {
        var anexofile = "";

        if (receivedValue[i].anexo.type == "1") {
          anexofile = receivedValue[i].anexo.file;
        }

        if (receivedValue[i].anexo.type == "2") {
          const img = await onFormSubmitImage(
            receivedValue[i].anexo.file
          );

          anexofile = img.file.data;
        }
        documentos.push({
          PR_DOCUMENTO_TP_ID: receivedValue[i].tipodocumento,
          NUMERO: receivedValue[i].numero,
          DOC_URL: anexofile,
          DT_EMISSAO: receivedValue[i].dataemissao,
          DT_VALIDADE: receivedValue[i].datavalidade,
          MAIN: "0",
          ESTADO: "1",
        })
      }
    }


    const upload = {
      REFERENCIA: REFERENCIA,
      DT: DT,
      DT_OPERACAO: DT_OPERACAO,
      VALOR: parseInt(VALOR),
      DIVISA_ID: DIVISA_ID.value,
      MEIOPAGAMENTO_ID: MEIOPAGAMENTO_ID.value,
      TIPO_BEM: TIPO_BEM,
      MOTIVO: MOTIVO,
      OBS: OBS,
      MODALIDADE_ID: MODALIDADE_ID.value,
      ENTIDADE_ID: params.id,
      intervenientes: [singulares, coletivo],
      documentos: documentos
    };
    console.log(upload)


    try {
      const response = await api.post("/casosuspeito", upload);
      if (response.status == "200") {
        uploadlist()
        //console.log("response", response)
        // setID_C(response.data.ID);
        // setdocumentosgeral_lista_save(!documentosgeral_lista_save);
        toast.success('Todos os dados foram gravados com sucesso!', { duration: 4000 })
        // addToast("Todos os dados foram gravados com sucesso!", {
        //   appearance: "success",
        // });
        setIsLoading(false)
        setIsOpen(false);
      }
    } catch (err) {
      setIsLoading(false)

      console.error(err.response);
    }
  }


  async function gerarHandpay() {
    try {
      setLoadGenerate(true)
      const responseDoc = await api.post("/gerarhandpay", itemSelected);

      if (responseDoc.status == "200") {
        const upload = {
          PESSOA_ID: itemSelected.PESSOA_ID,
          URL_DOC: responseDoc.data,

          VALOR: itemSelected.VALOR,
          DATA: itemSelected.DATA,
          DESCR: itemSelected.DESCR,
          OBS_INTERNA: itemSelected.OBS_INTERNA,
          ENTIDADE_ID: params.id,
        };

        try {
          const response = await api.put("/sgigjhandpay/" + itemSelected.ID, upload);
          if (response.status == "200") {
            setdocumentosgeral_lista_save(!documentosgeral_lista_save);
            itemSelected.URL_DOC = responseDoc.data + "?alt=media&token=0"

            setLoadGenerate(false)
            toast.success('Documento gerado com sucesso!', { duration: 4000 })
            // addToast("Documento gerado com sucesso!", {
            //   appearance: "success",
            // });
            window.open(responseDoc.data + "?alt=media&token=0", '_blank');
            // <a href={`${itemSelected.URL_DOC}?alt=media&token=0'`} target="_blank">

          }
        } catch (err) {
          setLoadGenerate(false)
          console.error(err.response);
        }

      }
    } catch (err) {
      console.error(err.response);
    }
  }

  //-------------- Remover -------------------------
  const removeItemFunction = async (idx) => {
    let res = true;

    try {
      const response = await api.delete("/casosuspeito/" + idx);
    } catch (err) {
      res = false;
      console.error(err.response);
      popUp_alertaOK("Falha. Tente mais tarde");
    }

    uploadlist();

    return res;
  };

  const removeItem = async (idx) => {
    popUp_removerItem({
      delete: removeItemFunction,
      id: idx,
    });
  };
  const removeItemFileFunction = async (idx) => {

    let res = true;

    try {
      const response = await api.delete("/sgigjreldocumento/" + idx);
      setVerOpen(false)
      uploadlist();

    } catch (err) {
      res = false;
      console.error(err.response);
      popUp_alertaOK("Falha. Tente mais tarde");
    }
    localStorage.setItem("showAlert", false)

    return res;
  };

  const removeItemFile = async (idx) => {
    popUp_removerItem({
      delete: removeItemFileFunction,
      id: idx,
    });
  };
  const downloadDoc = async (idx) => {
    try {

      const response = await api.get("/documento/casosuspeito/" + idx, { responseType: "blob" });

      if (response.status == '200') {
        const file = new Blob([response.data], { type: "application/pdf" });
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        //Open the URL on new Window
        const pdfWindow = window.open();
        pdfWindow.location.href = fileURL;
      }

      console.log(response)

    } catch (err) {

      console.error(err.response)
    }
  }
  async function onFormSubmitImage(thumnail) {
    var res = {
      status: false,
      file: null,
    };

    try {
      const formData = new FormData();

      formData.append("file", thumnail);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      const uploadResponse = await api.post("/upload", formData, config);

      res = {
        status: true,
        file: uploadResponse,
      };
    } catch (err) {
      console.error(err.response);

      res = {
        status: false,
        file: null,
      };
    }

    return res;
  }
  const [receivedValue, setReceivedValue] = useState('');
  const handleDocumentData = (data) => {
    setReceivedValue(data);
  };
  function onChangePessoaSingular(property, value) {
    updateSingularObj(property, value)
    let pessoa
    pessoa = pessoalist.length === 0 ? pessoasList.find(p => p.ID === value) : pessoalist.find(p => p.ID === value)
    updatePessoaObj("NIF", pessoa.NIF)
    updatePessoaObj("NACIONALIDADE", pessoa.nacionalidade.NACIONALIDADE)
    updatePessoaObj("TELEFONE", pessoa.sgigjrelcontacto.length > 0 ? pessoa.sgigjrelcontacto[0].CONTACTO : "")
    updatePessoaObj("MORADA", pessoa.ENDERECO)
    updatePessoaObj("DATA_NASCIMENTO", pessoa.DT_NASC)
  }

  useEffect(() => {
    if (typeof itemSelected.doclist != "undefined") {
      setimgprev(itemSelected?.doclist[0]?.url)
      selectedImg(itemSelected?.doclist[0])
    }

    // if (pageEnable(pageAcess, permissoes) == false) history.push("/");
    // else {
    uploadlist();
    uploadpessoa();
    uploadcontactolist()
    uploaddivisaslist();
    uploadmeiopagamentolist();
    uploadprofissaolist();
    uploadmodalidadepagamentolist();
    uploaddocumentolist();
    uploadglbgeografia()
    uploadestadocivil()
    uploadgenerolist()
    // }
  }, [itemSelected]);

  const [isOpen, setIsOpen] = useState(false);
  const [isEditarOpen, setIsEditarOpen] = useState(false);
  const [isVerOpen, setVerOpen] = useState(false);
  const [isNewentidade, setisNewentidade] = useState(false);
  const [thumnail, setThumnail] = useState(null);


  const preview = React.useMemo(() => {
    return thumnail ? URL.createObjectURL(thumnail) : null;
  },

    [thumnail]
  );
  //---------------- cria pessoa ------------

  const [pessoaopen, setpessoaopen] = useState({ code: 0, value: false });
  const openpessoafunction = () => {
    setpessoaopen({ code: pessoaopen.code + 1, value: true });
  };

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <Card>
            {/* <div style={{ gap: "10px" }} className="mt-2 d-flex justify-content-end align-items-center">
              <span> DOWNLOAD</span>
              <Button
                style={{ cursor: "pointer" }}
                onClick={exportPDF}
                variant="primary"
                className="btn-sm btn-round has-ripple ml-2"
              >
                <i class="fa fa-file-pdf" aria-hidden="true"></i>
              </Button>
              <Button
                style={{ cursor: "pointer" }}
                onClick={saveExcel}
                variant="primary"
                className="btn-sm btn-round has-ripple ml-2 mr-4"
              >
                <i class="fa fa-file-excel" aria-hidden="true"></i>
              </Button>
            </div> */}
            <Card.Body>
              <Table uploadList={uploadlist} columns={columns} saveExcel={saveExcel} exportPDF={exportPDF} data={newdata} modalOpen={openHandler} />
            </Card.Body>
          </Card>

          {/* --------------------Criar Item------------------- */}

          <Modal size="lg" show={isOpen} onHide={() => setIsOpen(false)}>
            <Modal.Header style={{ border: "0" }} closeButton>
              <Modal.Title as="h5">Criar</Modal.Title>
            </Modal.Header>

            <ul
              className="nav nav-tabs profile-tabs nav-fill"
              id="myTab"
              role="tablist"
            >
              <li className="nav-item">
                <Link
                  to="#"
                  className={
                    activeProfileTab === "dados"
                      ? profileTabActiveClass
                      : profileTabClass
                  }
                  onClick={() => {
                    setActiveProfileTab("dados");
                  }}
                  id="profile-tab"
                >
                  <i className="feather icon-server mr-2" />
                  Comunicado
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="#"
                  className={
                    activeProfileTab === "interveniente"
                      ? profileTabActiveClass
                      : profileTabClass
                  }
                  onClick={() => {
                    setActiveProfileTab("interveniente");
                  }}
                  id="interveniente-tab"
                >
                  <i className="feather icon-file-text mr-2" />
                  Interveniente
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="#"
                  className={
                    activeProfileTab === "documentos"
                      ? profileTabActiveClass
                      : profileTabClass
                  }
                  onClick={() => {
                    setActiveProfileTab("documentos");
                  }}
                  id="contact-tab"
                >
                  <i className="feather icon-file-text mr-2" />
                  Documentos
                </Link>
              </li>
            </ul>

            <Modal.Body
              style={
                activeProfileTab === "documentos" ? {} : { display: "none" }
              }
            >
              <Documentos
                documentolist={documentolist}
                list={documentosgeral_lista}
                save={documentosgeral_lista_save}
                item={{ ID: ID_C, ENTIDADE: "HANDPAY_ID" }}
                onSendData={handleDocumentData}
              />
            </Modal.Body>
            <Modal.Body
              style={activeProfileTab === "dados" ? {} : { display: "none" }}
            >
              <form id="criarItem" onSubmit={criarItemGO}>
                <Row>

                  <Col sm={2}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Código <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        disabled
                        type="text"
                        className="form-control"
                        id="Name"
                        value="*"
                        required
                      />
                    </div>
                  </Col>

                  <Col sm={5}>

                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Data <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="date"
                        max={todayDate}
                        onChange={(event) => {
                          setDT(event.target.value);
                        }}
                        defaultValue={""}
                        className="form-control"
                        placeholder="Data..."
                        required
                      />
                    </div>

                  </Col>

                  <Col sm={5}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Referência <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        onChange={(event) => {
                          setREFERENCIA(event.target.value);
                        }}
                        defaultValue={""}
                        className="form-control"
                        placeholder="Referência..."
                        required
                      />
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="d-flex flex-column " >
                      <span className="gray-bold-title">Descrição da operação</span>
                      <div className="border-gray"></div>
                    </div>
                  </Col>
                  <Col sm={3}>

                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Data operação <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="date"
                        max={todayDate}
                        onChange={(event) => {
                          setDT_OPERACAO(event.target.value);
                        }}
                        defaultValue={""}
                        className="form-control"
                        placeholder="Data..."
                        required
                      />
                    </div>

                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Montante <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="number"
                        step='0.01'
                        onChange={(event) => {
                          setVALOR(event.target.value);
                        }}
                        className="form-control"
                        placeholder="Valor..."
                        required
                      />
                    </div>
                  </Col>
                  <Col sm={5}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">Divisa <span style={{ color: "red" }} >*</span></label>

                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={event => setDIVISA_ID(event)}
                        name="divisa"
                        options={divisaslist}
                        value={DIVISA_ID}
                        required
                        menuPlacement="auto"
                        menuPosition="fixed"
                        placeholder="Divisa..."

                      />
                      {/* </span> */}

                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">Meio Pagamento <span style={{ color: "red" }} >*</span></label>

                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={event => setMEIOPAGAMENTO_ID(event)}
                        name="meiopagamento"
                        options={meiopagamentolist}
                        value={MEIOPAGAMENTO_ID}
                        required
                        menuPlacement="auto"
                        menuPosition="fixed"
                        placeholder="Meio Pagamento..."

                      />
                      {/* </span> */}

                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">Modalidade Pagamento <span style={{ color: "red" }} >*</span></label>

                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={event => setMODALIDADE_ID(event)}
                        name="meiopagamento"
                        options={modalidadepagamentolist}
                        value={MODALIDADE_ID}
                        required
                        menuPlacement="auto"
                        menuPosition="fixed"
                        placeholder="Modalidade Pagamento..."

                      />
                      {/* </span> */}

                    </div>
                  </Col>

                  <div className="col-sm-12">
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Address">
                        Tipo Bem
                      </label>
                      <textarea
                        className="form-control"
                        maxLength="64000"
                        onChange={(event) => {
                          setTIPO_BEM(event.target.value);
                        }}
                        defaultValue={""}
                        rows="3"
                        placeholder="Descrição pormenorizada do bem que é objeto do negócio..."
                      />
                    </div>
                  </div>

                  <div className="col-sm-12">
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Address">
                        Motivo da suspeita
                      </label>
                      <textarea
                        className="form-control"
                        maxLength="64000"
                        onChange={(event) => {
                          setMOTIVO(event.target.value);
                        }}
                        defaultValue={""}
                        rows="3"
                        placeholder="Indicação da razão que levou á comunicação, nomeadamente tendo em atençao os regulamentos das entidades de fiscalização e os procedimentos internos."
                      />
                    </div>
                  </div>

                  <div className="col-sm-12">
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Address">
                        Observação
                      </label>
                      <textarea
                        className="form-control"
                        maxLength="64000"
                        onChange={(event) => {
                          setOBS(event.target.value);
                        }}
                        defaultValue={""}
                        rows="3"
                        placeholder="Indicar toda a informação que se entenda ser relevante para a melhor compreensão da operação, incluindo eventuais elementos adicionais que não ficaram expressos nos campos anteriores."
                      />
                    </div>
                  </div>
                </Row>

              </form>
            </Modal.Body>
            <Modal.Body
              style={activeProfileTab === "interveniente" ? {} : { display: "none" }}
            >
              <form id="criarItem" onSubmit={criarItemGO}>
                <Row>
                  <Col sm={12}>
                    <div className="d-flex flex-column " >
                      <span className="gray-bold-title">Intervenientes singulares</span>
                      <div className="border-gray"></div>
                    </div>
                  </Col>
                  <Col sm={12}>
                    <label className="floating-label" htmlFor="text">
                      Pessoa <span style={{ color: "red" }}>*</span>
                    </label>
                    <div style={{ display: "flex" }}>
                      <div
                        className="form-group fill"
                        style={{ width: "100%" }}
                      >
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          onChange={(event) => onChangePessoaSingular('PESSOA_ID', event.value)}
                          name="pessoa"
                          options={pessoalist}
                          defaultValue={singulares.PESSOA_ID}
                          required
                          menuPlacement="auto"
                          menuPosition="fixed"
                          placeholder="Pessoa..."
                        />
                      </div>

                      <Button
                        onClick={() => openpessoafunction()}
                        style={{ marginLeft: "8px", height: "38px" }}
                        variant="primary"
                      >
                        <i className="feather icon-plus" />
                      </Button>
                    </div>
                  </Col>

                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Data Nascimento<span style={{ color: "red" }}>*</span>
                      </label>
                      <input readOnly="readOnly"
                        type="date"
                        max={todayDate}
                        value={pessoaSelected.DATA_NASCIMENTO}
                        className="form-control"
                        placeholder="Data Nascimento..."
                      />
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Doc Indentificação <span style={{ color: "red" }}>*</span>
                      </label>
                      <input readOnly="readOnly"
                        type="text"
                        value={""}
                        className="form-control"
                        placeholder="Doc Indentificação..."
                      />
                    </div>
                  </Col>


                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Número <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        readOnly="readOnly"
                        value={""}
                        className="form-control"
                        placeholder="Número..."
                      />
                    </div>
                  </Col>

                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Contato <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        readOnly="readOnly"
                        value={pessoaSelected.TELEFONE}
                        className="form-control"
                        placeholder="Contato..."
                      />
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Nacionalidade <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        readOnly="readOnly"
                        value={pessoaSelected.NACIONALIDADE}
                        className="form-control"
                        placeholder="Nacionalidade..."
                      />
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        NIF <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="number"
                        readOnly="readOnly"
                        value={pessoaSelected.NIF}
                        className="form-control"
                        placeholder="NIF..."
                      />
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Morada <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        readOnly="readOnly"
                        value={pessoaSelected.MORADA}
                        className="form-control"
                        placeholder="Morada..."
                      />
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">Profissão <span style={{ color: "red" }} >*</span></label>
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={event => updateSingularObj('PROFISSAO_ID', event.value)}
                        name="profissao"
                        options={profissaolist}
                        value={singulares.PROFISSAO_ID}
                        required
                        menuPlacement="auto"
                        menuPosition="fixed"
                        placeholder="Profissão..."

                      />
                      {/* </span> */}

                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Local de Trabalho <span style={{ color: "red" }}>*</span>
                      </label>
                      <input

                        type="text" onChange={event => updateSingularObj('LOCAL_TRABALHO', event.target.value)}

                        defaultValue={""}
                        className="form-control"
                        placeholder="Local de Trabalho"
                      />
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Entidade Patronal <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text" onChange={event => updateSingularObj('ENTIDADE_PATRONAL', event.target.value)}
                        defaultValue={""}
                        className="form-control"
                        placeholder="Local de Trabalho"
                      />
                    </div>
                  </Col>

                </Row>



                <Row>
                  <Col sm={12}>
                    <div className="d-flex flex-column " >
                      <span className="gray-bold-title">Intervenientes colectivo</span>
                      <div className="border-gray"></div>
                    </div>
                  </Col>


                  <Col sm={12}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Nome<span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        onChange={event => updateColetivoObj('NOME', event.target.value)}
                        type="text"
                        defaultValue={""}
                        className="form-control"
                        placeholder="Nome..."
                      />
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        NIF <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        onChange={event => updateColetivoObj('NIF', event.target.value)}
                        type="number"
                        className="form-control"
                        placeholder="NIF..."
                      />
                    </div>
                  </Col>

                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Atividade <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        onChange={event => updateColetivoObj('ATIVIDADE', event.target.value)}
                        defaultValue={""}
                        className="form-control"
                        placeholder="Atividade..."
                      />
                    </div>
                  </Col>

                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Telefone <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        onChange={event => updateColetivoObj('TELEFONE', event.target.value)}
                        defaultValue={""}
                        className="form-control"
                        placeholder="Telefone..."
                      />
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Morada <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        onChange={event => updateColetivoObj('MORADA', event.target.value)}
                        defaultValue={""}
                        className="form-control"
                        placeholder="Morada..."
                      />
                    </div>
                  </Col>


                  <Col sm={12}>
                    <label className="floating-label" htmlFor="text">
                      Representante <span style={{ color: "red" }}>*</span>
                    </label>
                    <div style={{ display: "flex" }}>
                      <div
                        className="form-group fill"
                        style={{ width: "100%" }}
                      >
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          onChange={(event) => updateColetivoObj('PESSOA_ID', event.value)}
                          name="pessoa"
                          options={pessoalist}
                          defaultValue={coletivo.PESSOA_ID}
                          required
                          menuPlacement="auto"
                          menuPosition="fixed"
                          placeholder="Representante..."
                        />
                      </div>

                      <Button
                        onClick={() => openpessoafunction()}
                        style={{ marginLeft: "8px", height: "38px" }}
                        variant="primary"
                      >
                        <i className="feather icon-plus" />
                      </Button>
                    </div>
                  </Col>



                </Row>
              </form>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="danger" onClick={() => setIsOpen(false)}>
                Fechar
              </Button>

              {!isLoading ? <Button type="submit" form="criarItem" variant="primary">Guardar</Button> : <Button variant="primary">Guardando</Button>}


            </Modal.Footer>
          </Modal>

          {/* --------------------Editar Item------------------- */}

          <Modal
            size="lg"
            show={isEditarOpen}
            onHide={() => setIsEditarOpen(false)}
          >
            <Modal.Header style={{ border: "0" }} closeButton>
              <Modal.Title as="h5">Editar</Modal.Title>
            </Modal.Header>

            <ul
              className="nav nav-tabs profile-tabs nav-fill"
              id="myTab"
              role="tablist"
            >
              <li className="nav-item">
                <Link
                  to="#"
                  className={
                    activeProfileTab === "dados"
                      ? profileTabActiveClass
                      : profileTabClass
                  }
                  onClick={() => {
                    setActiveProfileTab("dados");
                  }}
                  id="profile-tab"
                >
                  <i className="feather icon-server mr-2" />
                  Comunicado
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="#"
                  className={
                    activeProfileTab === "interveniente"
                      ? profileTabActiveClass
                      : profileTabClass
                  }
                  onClick={() => {
                    setActiveProfileTab("interveniente");
                  }}
                  id="interveniente-tab"
                >
                  <i className="feather icon-file-text mr-2" />
                  Interveniente
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="#"
                  className={
                    activeProfileTab === "documentos"
                      ? profileTabActiveClass
                      : profileTabClass
                  }
                  onClick={() => {
                    setActiveProfileTab("documentos");
                  }}
                  id="contact-tab"
                >
                  <i className="feather icon-file-text mr-2" />
                  Documentos
                </Link>
              </li>
            </ul>

            <Modal.Body
              style={
                activeProfileTab === "documentos" ? {} : { display: "none" }
              }
            >
              <Documentos
                documentolist={documentolist}
                list={documentosgeral_lista}
                save={documentosgeral_lista_save}
                item={{ ID: itemSelected.ID, ENTIDADE: "PROCESSO_CASOSUSPEITO_ID" }}
                onSendData={handleDocumentData}

              />
            </Modal.Body>

            <Modal.Body
              style={activeProfileTab === "dados" ? {} : { display: "none" }}
            >
              <form id="editarItem" onSubmit={editarItemGO}>
                <Row>
                  <Col sm={2}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Código <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        disabled
                        type="text"
                        className="form-control"
                        id="Name"
                        value="*"
                        required
                      />
                    </div>
                  </Col>

                  <Col sm={5}>

                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Data <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="date"
                        max={todayDate}
                        onChange={(event) => {
                          setDT(event.target.value);
                        }}
                        defaultValue={itemSelected.DT}
                        className="form-control"
                        placeholder="Data..."
                        required
                      />
                    </div>

                  </Col>

                  <Col sm={5}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Referência <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        onChange={(event) => {
                          setREFERENCIA(event.target.value);
                        }}
                        defaultValue={itemSelected.REFERENCIA}
                        className="form-control"
                        placeholder="Referência..."
                        required
                      />
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="d-flex flex-column " >
                      <span className="gray-bold-title">Descrição da operação</span>
                      <div className="border-gray"></div>
                    </div>
                  </Col>
                  <Col sm={3}>

                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Data operação <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="date"
                        max={todayDate}
                        onChange={(event) => {
                          setDT_OPERACAO(event.target.value);
                        }}
                        defaultValue={itemSelected.DT_OPERACAO}
                        className="form-control"
                        placeholder="Data..."
                        required
                      />
                    </div>

                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Montante <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="number"
                        step='0.01'
                        onChange={(event) => {
                          setVALOR(event.target.value);
                        }}
                        defaultValue={itemSelected.VALOR}
                        className="form-control"
                        placeholder="Valor..."
                        required
                      />
                    </div>
                  </Col>
                  <Col sm={5}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">Divisa <span style={{ color: "red" }} >*</span></label>
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={event => setDIVISA_ID(event)}
                        name="divisa"
                        options={divisaslist}
                        defaultValue={divisaslist.map((p) =>
                          p.value == DIVISA_ID ? p : null
                        )}
                        required
                        menuPlacement="auto"
                        menuPosition="fixed"
                        placeholder="Divisa..."

                      />
                      {/* </span> */}

                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">Meio Pagamento <span style={{ color: "red" }} >*</span></label>

                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={event => setMEIOPAGAMENTO_ID(event)}
                        name="meiopagamento"
                        options={meiopagamentolist}
                        defaultValue={meiopagamentolist.map((p) =>
                          p.value == MEIOPAGAMENTO_ID ? p : null
                        )}
                        required
                        menuPlacement="auto"
                        menuPosition="fixed"
                        placeholder="Meio Pagamento..."

                      />
                      {/* </span> */}

                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">Modalidade Pagamento <span style={{ color: "red" }} >*</span></label>
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={event => setMODALIDADE_ID(event)}
                        name="meiopagamento"
                        options={modalidadepagamentolist}
                        defaultValue={modalidadepagamentolist.map((p) =>
                          p.value == MODALIDADE_ID ? p : null
                        )}
                        required
                        menuPlacement="auto"
                        menuPosition="fixed"
                        placeholder="Modalidade Pagamento..."

                      />
                      {/* </span> */}

                    </div>
                  </Col>

                  <div className="col-sm-12">
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Address">
                        Tipo Bem
                      </label>
                      <textarea
                        className="form-control"
                        maxLength="64000"
                        onChange={(event) => {
                          setTIPO_BEM(event.target.value);
                        }}
                        defaultValue={itemSelected.TIPO_BEM}
                        rows="3"
                        placeholder="Descrição pormenorizada do bem que é objeto do negócio..."
                      />
                    </div>
                  </div>

                  <div className="col-sm-12">
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Address">
                        Motivo da suspeita
                      </label>
                      <textarea
                        className="form-control"
                        maxLength="64000"
                        onChange={(event) => {
                          setMOTIVO(event.target.value);
                        }}
                        defaultValue={itemSelected.MOTIVO}
                        rows="3"
                        placeholder="Indicação da razão que levou á comunicação, nomeadamente tendo em atençao os regulamentos das entidades de fiscalização e os procedimentos internos."
                      />
                    </div>
                  </div>

                  <div className="col-sm-12">
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Address">
                        Observação
                      </label>
                      <textarea
                        className="form-control"
                        maxLength="64000"
                        onChange={(event) => {
                          setOBS(event.target.value);
                        }}
                        defaultValue={itemSelected.OBS}
                        rows="3"
                        placeholder="Indicar toda a informação que se entenda ser relevante para a melhor compreensão da operação, incluindo eventuais elementos adicionais que não ficaram expressos nos campos anteriores."
                      />
                    </div>
                  </div>
                </Row>
              </form>
            </Modal.Body>



            <Modal.Body
              style={activeProfileTab === "interveniente" ? {} : { display: "none" }}
            >
              <form id="editarItem" onSubmit={editarItemGO}>
                <Row>
                  <Col sm={12}>
                    <div className="d-flex flex-column " >
                      <span className="gray-bold-title">Intervenientes singulares</span>
                      <div className="border-gray"></div>
                    </div>
                  </Col>
                  <Col sm={12}>
                    <label className="floating-label" htmlFor="text">
                      Pessoa <span style={{ color: "red" }}>*</span>
                    </label>
                    <div style={{ display: "flex" }}>
                      <div
                        className="form-group fill"
                        style={{ width: "100%" }}
                      >
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          onChange={(event) => updateSingularObj('PESSOA_ID', event.value)}
                          name="pessoa"
                          options={pessoalist}
                          defaultValue={pessoalist.map((p) =>
                            p.value == singulares.PESSOA_ID ? p : null
                          )}
                          required
                          menuPlacement="auto"
                          menuPosition="fixed"
                          placeholder="Pessoa..."
                        />
                      </div>

                      <Button
                        onClick={() => openpessoafunction()}
                        style={{ marginLeft: "8px", height: "38px" }}
                        variant="primary"
                      >
                        <i className="feather icon-plus" />
                      </Button>
                    </div>
                  </Col>

                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Data Nascimento<span style={{ color: "red" }}>*</span>
                      </label>
                      <input readOnly="readOnly"
                        type="date"
                        max={todayDate}
                        value={pessoaSelected.DATA_NASCIMENTO}
                        className="form-control"
                        placeholder="Data Nascimento..."
                      />
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Doc Indentificação <span style={{ color: "red" }}>*</span>
                      </label>
                      <input readOnly="readOnly"
                        type="text"
                        value={""}
                        className="form-control"
                        placeholder="Doc Indentificação..."
                      />
                    </div>
                  </Col>


                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Número <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        readOnly="readOnly"
                        value={""}
                        className="form-control"
                        placeholder="Número..."
                      />
                    </div>
                  </Col>

                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Contato <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        readOnly="readOnly"
                        value={pessoaSelected.TELEFONE}
                        className="form-control"
                        placeholder="Contato..."
                      />
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Nacionalidade <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        readOnly="readOnly"
                        value={pessoaSelected.NACIONALIDADE}
                        className="form-control"
                        placeholder="Nacionalidade..."
                      />
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        NIF <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="number"
                        value={pessoaSelected.NIF}
                        readOnly="readOnly"
                        className="form-control"
                        placeholder="NIF..."
                      />
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Morada <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        readOnly="readOnly"
                        value={pessoaSelected.MORADA}
                        className="form-control"
                        placeholder="Morada..."
                      />
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">Profissão <span style={{ color: "red" }} >*</span></label>
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={event => updateSingularObj('PROFISSAO_ID', event.value)}
                        name="profissao"
                        options={profissaolist}
                        defaultValue={profissaolist.map((p) =>
                          p.value == singulares.PROFISSAO_ID ? p : null
                        )}
                        required
                        menuPlacement="auto"
                        menuPosition="fixed"
                        placeholder="Profissão..."

                      />
                      {/* </span> */}

                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Local de Trabalho <span style={{ color: "red" }}>*</span>
                      </label>
                      <input

                        type="text" onChange={event => updateSingularObj('LOCAL_TRABALHO', event.target.value)}

                        defaultValue={singulares.LOCAL_TRABALHO}
                        className="form-control"
                        placeholder="Local de Trabalho"
                      />
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Entidade Patronal <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text" onChange={event => updateSingularObj('ENTIDADE_PATRONAL', event.target.value)}
                        defaultValue={singulares.ENTIDADE_PATRONAL}
                        className="form-control"
                        placeholder="Local de Trabalho"
                      />
                    </div>
                  </Col>

                </Row>



                <Row>
                  <Col sm={12}>
                    <div className="d-flex flex-column " >
                      <span className="gray-bold-title">Intervenientes colectivo</span>
                      <div className="border-gray"></div>
                    </div>
                  </Col>


                  <Col sm={12}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Nome<span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        onChange={event => updateColetivoObj('NOME', event.target.value)}
                        type="text"
                        defaultValue={coletivo.NOME}
                        className="form-control"
                        placeholder="Nome..."
                      />
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        NIF <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        onChange={event => updateColetivoObj('NIF', event.target.value)}
                        defaultValue={coletivo.NIF}
                        type="number"
                        className="form-control"
                        placeholder="NIF..."
                      />
                    </div>
                  </Col>

                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Atividade <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        onChange={event => updateColetivoObj('ATIVIDADE', event.target.value)}
                        defaultValue={coletivo.NIF}
                        className="form-control"
                        placeholder="Atividade..."
                      />
                    </div>
                  </Col>

                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Telefone <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        onChange={event => updateColetivoObj('TELEFONE', event.target.value)}
                        defaultValue={coletivo.TELEFONE}
                        className="form-control"
                        placeholder="Telefone..."
                      />
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Morada <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        onChange={event => updateColetivoObj('MORADA', event.target.value)}
                        defaultValue={coletivo.MORADA}
                        className="form-control"
                        placeholder="Morada..."
                      />
                    </div>
                  </Col>


                  <Col sm={12}>
                    <label className="floating-label" htmlFor="text">
                      Representante <span style={{ color: "red" }}>*</span>
                    </label>
                    <div style={{ display: "flex" }}>
                      <div
                        className="form-group fill"
                        style={{ width: "100%" }}
                      >
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          onChange={(event) => updateColetivoObj('PESSOA_ID', event.value)}
                          name="pessoa"
                          options={pessoalist}
                          defaultValue={pessoalist.map((p) =>
                            p.value == coletivo.PESSOA_ID ? p : null
                          )}
                          required
                          menuPlacement="auto"
                          menuPosition="fixed"
                          placeholder="Representante..."
                        />
                      </div>

                      <Button
                        onClick={() => openpessoafunction()}
                        style={{ marginLeft: "8px", height: "38px" }}
                        variant="primary"
                      >
                        <i className="feather icon-plus" />
                      </Button>
                    </div>
                  </Col>



                </Row>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={() => setIsEditarOpen(false)}>
                Fechar
              </Button>
              {!isLoading ? <Button type="submit" form="editarItem" variant="primary">Guardar</Button> : <Button variant="primary">Guardando</Button>}

            </Modal.Footer>
          </Modal>

          {/* --------------------Ver Item------------------- */}

          <Modal size="lg" show={isVerOpen} onHide={() => setVerOpen(false)}>
            <Modal.Header style={{ border: "0" }} closeButton>
              <Modal.Title as="h5">Caso Suspeito </Modal.Title>
            </Modal.Header>
            <ul
              className="nav nav-tabs profile-tabs nav-fill"
              id="myTab"
              role="tablist"
            >
              <li className="nav-item">
                <Link
                  to="#"
                  className={
                    activeProfileTab === "dados"
                      ? profileTabActiveClass
                      : profileTabClass
                  }
                  onClick={() => {
                    setActiveProfileTab("dados");
                  }}
                  id="profile-tab"
                >
                  <i className="feather icon-server mr-2" />
                  Comunicado
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="#"
                  className={
                    activeProfileTab === "interveniente"
                      ? profileTabActiveClass
                      : profileTabClass
                  }
                  onClick={() => {
                    setActiveProfileTab("interveniente");
                  }}
                  id="interveniente-tab"
                >
                  <i className="feather icon-file-text mr-2" />
                  Interveniente
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="#"
                  className={
                    activeProfileTab === "documentos"
                      ? profileTabActiveClass
                      : profileTabClass
                  }
                  onClick={() => {
                    setActiveProfileTab("documentos");
                  }}
                  id="contact-tab"
                >
                  <i className="feather icon-file-text mr-2" />
                  Documentos
                </Link>
              </li>
            </ul>


            <Modal.Body
              style={activeProfileTab === "dados" ? {} : { display: "none" }}
            >
              <form >
                <Row>
                  <Col sm={2}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Código <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        disabled
                        type="text"
                        className="form-control"
                        id="Name"
                        value="*"
                        required
                      />
                    </div>
                  </Col>

                  <Col sm={5}>

                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Data <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="date"
                        disabled

                        max={todayDate}
                        onChange={(event) => {
                          setDT(event.target.value);
                        }}
                        defaultValue={itemSelected.DT}
                        className="form-control"
                        placeholder="Data..."
                        required
                      />
                    </div>

                  </Col>

                  <Col sm={5}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Referência <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        disabled

                        onChange={(event) => {
                          setREFERENCIA(event.target.value);
                        }}
                        defaultValue={itemSelected.REFERENCIA}
                        className="form-control"
                        placeholder="Referência..."
                        required
                      />
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="d-flex flex-column " >
                      <span className="gray-bold-title">Descrição da operação</span>
                      <div className="border-gray"></div>
                    </div>
                  </Col>
                  <Col sm={3}>

                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Data operação <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        disabled

                        type="date"
                        max={todayDate}
                        onChange={(event) => {
                          setDT_OPERACAO(event.target.value);
                        }}
                        defaultValue={itemSelected.DT_OPERACAO}
                        className="form-control"
                        placeholder="Data..."
                        required
                      />
                    </div>

                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Montante <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        disabled
                        type="text"
                        onChange={(event) => {
                          setVALOR(event.target.value);
                        }}
                        defaultValue={itemSelected.VALOR}
                        className="form-control"
                        placeholder="Valor..."
                        required
                      />
                    </div>
                  </Col>
                  <Col sm={5}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">Divisa <span style={{ color: "red" }} >*</span></label>
                      <Select
                        isDisabled={true}
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={event => setDIVISA_ID(event)}
                        name="divisa"
                        options={divisaslist}
                        defaultValue={divisaslist.map((p) =>
                          p.value == DIVISA_ID ? p : null
                        )}
                        required
                        menuPlacement="auto"
                        menuPosition="fixed"
                        placeholder="Divisa..."

                      />
                      {/* </span> */}

                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">Meio Pagamento <span style={{ color: "red" }} >*</span></label>

                      <Select isDisabled={true}
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={event => setMEIOPAGAMENTO_ID(event)}
                        name="meiopagamento"
                        options={meiopagamentolist}
                        defaultValue={meiopagamentolist.map((p) =>
                          p.value == MEIOPAGAMENTO_ID ? p : null
                        )}
                        required
                        menuPlacement="auto"
                        menuPosition="fixed"
                        placeholder="Meio Pagamento..."

                      />
                      {/* </span> */}

                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">Modalidade Pagamento <span style={{ color: "red" }} >*</span></label>
                      <Select
                        isDisabled={true}
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={event => setMODALIDADE_ID(event)}
                        name="meiopagamento"
                        options={modalidadepagamentolist}
                        defaultValue={modalidadepagamentolist.map((p) =>
                          p.value == MODALIDADE_ID ? p : null
                        )}
                        required
                        menuPlacement="auto"
                        menuPosition="fixed"
                        placeholder="Modalidade Pagamento..."

                      />
                      {/* </span> */}

                    </div>
                  </Col>

                  <div className="col-sm-12">
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Address">
                        Tipo Bem
                      </label>
                      <textarea
                        disabled
                        className="form-control"
                        maxLength="64000"
                        onChange={(event) => {
                          setTIPO_BEM(event.target.value);
                        }}
                        defaultValue={itemSelected.TIPO_BEM}
                        rows="3"
                        placeholder="Descrição pormenorizada do bem que é objeto do negócio..."
                      />
                    </div>
                  </div>

                  <div className="col-sm-12">
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Address">
                        Motivo da suspeita
                      </label>
                      <textarea
                        disabled
                        className="form-control"
                        maxLength="64000"
                        onChange={(event) => {
                          setMOTIVO(event.target.value);
                        }}
                        defaultValue={itemSelected.MOTIVO}
                        rows="3"
                        placeholder="Indicação da razão que levou á comunicação, nomeadamente tendo em atençao os regulamentos das entidades de fiscalização e os procedimentos internos."
                      />
                    </div>
                  </div>

                  <div className="col-sm-12">
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Address">
                        Observação
                      </label>
                      <textarea
                        disabled
                        className="form-control"
                        maxLength="64000"
                        onChange={(event) => {
                          setOBS(event.target.value);
                        }}
                        defaultValue={itemSelected.OBS}
                        rows="3"
                        placeholder="Indicar toda a informação que se entenda ser relevante para a melhor compreensão da operação, incluindo eventuais elementos adicionais que não ficaram expressos nos campos anteriores."
                      />
                    </div>
                  </div>
                </Row>
              </form>
            </Modal.Body>



            <Modal.Body
              style={activeProfileTab === "interveniente" ? {} : { display: "none" }}
            >
              <form >
                <Row>
                  <Col sm={12}>
                    <div className="d-flex flex-column " >
                      <span className="gray-bold-title">Intervenientes singulares</span>
                      <div className="border-gray"></div>
                    </div>
                  </Col>
                  <Col sm={12}>
                    <label className="floating-label" htmlFor="text">
                      Pessoa <span style={{ color: "red" }}>*</span>
                    </label>
                    <div style={{ display: "flex" }}>
                      <div
                        className="form-group fill"
                        style={{ width: "100%" }}
                      >
                        <Select
                          isDisabled={true}
                          className="basic-single"
                          classNamePrefix="select"
                          onChange={(event) => updateSingularObj('PESSOA_ID', event.value)}
                          name="pessoa"
                          options={pessoalist}
                          defaultValue={pessoalist.map((p) =>
                            p.value == singulares.PESSOA_ID ? p : null
                          )}
                          required
                          menuPlacement="auto"
                          menuPosition="fixed"
                          placeholder="Pessoa..."
                        />
                      </div>


                    </div>
                  </Col>

                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Data Nascimento<span style={{ color: "red" }}>*</span>
                      </label>
                      <input readOnly="readOnly"
                        type="date"
                        max={todayDate}
                        value={pessoaSelected.DATA_NASCIMENTO}
                        className="form-control"
                        placeholder="Data Nascimento..."
                      />
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Doc Indentificação <span style={{ color: "red" }}>*</span>
                      </label>
                      <input readOnly="readOnly"
                        type="text"
                        value={""}
                        className="form-control"
                        placeholder="Doc Indentificação..."
                      />
                    </div>
                  </Col>


                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Número <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        readOnly="readOnly"
                        value={""}
                        className="form-control"
                        placeholder="Número..."
                      />
                    </div>
                  </Col>

                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Telefone <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        readOnly="readOnly"
                        value={pessoaSelected.TELEFONE}
                        className="form-control"
                        placeholder="Telefone..."
                      />
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Nacionalidade <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        readOnly="readOnly"
                        value={pessoaSelected.NACIONALIDADE}
                        className="form-control"
                        placeholder="Nacionalidade..."
                      />
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        NIF <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="number"
                        value={pessoaSelected.NIF}
                        readOnly="readOnly"
                        className="form-control"
                        placeholder="NIF..."
                      />
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Morada <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        readOnly="readOnly"
                        value={pessoaSelected.MORADA}
                        className="form-control"
                        placeholder="Morada..."
                      />
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">Profissão <span style={{ color: "red" }} >*</span></label>
                      <Select
                        className="basic-single" isDisabled={true}
                        classNamePrefix="select"
                        onChange={event => updateSingularObj('PROFISSAO_ID', event.value)}
                        name="profissao"
                        options={profissaolist}
                        defaultValue={profissaolist.map((p) =>
                          p.value == singulares.PROFISSAO_ID ? p : null
                        )}
                        required
                        menuPlacement="auto"
                        menuPosition="fixed"
                        placeholder="Profissão..."

                      />
                      {/* </span> */}

                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Local de Trabalho <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        disabled
                        type="text" onChange={event => updateSingularObj('LOCAL_TRABALHO', event.target.value)}
                        defaultValue={singulares.LOCAL_TRABALHO}
                        className="form-control"
                        placeholder="Local de Trabalho"
                      />
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Entidade Patronal <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        disabled
                        type="text" onChange={event => updateSingularObj('ENTIDADE_PATRONAL', event.target.value)}
                        defaultValue={singulares.ENTIDADE_PATRONAL}
                        className="form-control"
                        placeholder="Local de Trabalho"
                      />
                    </div>
                  </Col>

                </Row>



                <Row>
                  <Col sm={12}>
                    <div className="d-flex flex-column " >
                      <span className="gray-bold-title">Intervenientes colectivo</span>
                      <div className="border-gray"></div>
                    </div>
                  </Col>


                  <Col sm={12}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Nome<span style={{ color: "red" }}>*</span>
                      </label>
                      <input disabled
                        onChange={event => updateColetivoObj('NOME', event.target.value)}
                        type="text"
                        defaultValue={coletivo.NOME}
                        className="form-control"
                        placeholder="Nome..."
                      />
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        NIF <span style={{ color: "red" }}>*</span>
                      </label>
                      <input disabled
                        onChange={event => updateColetivoObj('NIF', event.target.value)}
                        defaultValue={coletivo.NIF}
                        type="number"
                        className="form-control"
                        placeholder="NIF..."
                      />
                    </div>
                  </Col>

                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Atividade <span style={{ color: "red" }}>*</span>
                      </label>
                      <input disabled
                        type="text"
                        onChange={event => updateColetivoObj('ATIVIDADE', event.target.value)}
                        defaultValue={coletivo.NIF}
                        className="form-control"
                        placeholder="Atividade..."
                      />
                    </div>
                  </Col>

                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Telefone <span style={{ color: "red" }}>*</span>
                      </label>
                      <input disabled
                        type="text"
                        onChange={event => updateColetivoObj('TELEFONE', event.target.value)}
                        defaultValue={coletivo.ATIVIDADE}
                        className="form-control"
                        placeholder="Telefone..."
                      />
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Morada <span style={{ color: "red" }}>*</span>
                      </label>
                      <input disabled
                        type="text"
                        onChange={event => updateColetivoObj('MORADA', event.target.value)}
                        defaultValue={coletivo.MORADA}
                        className="form-control"
                        placeholder="Morada..."
                      />
                    </div>
                  </Col>


                  <Col sm={12}>
                    <label className="floating-label" htmlFor="text">
                      Representante <span style={{ color: "red" }}>*</span>
                    </label>
                    <div style={{ display: "flex" }}>
                      <div
                        className="form-group fill"
                        style={{ width: "100%" }}
                      >
                        <Select isDisabled={true}
                          className="basic-single"
                          classNamePrefix="select"
                          onChange={(event) => updateColetivoObj('PESSOA_ID', event.value)}
                          name="pessoa"
                          options={pessoalist}
                          defaultValue={pessoalist.map((p) =>
                            p.value == coletivo.PESSOA_ID ? p : null
                          )}
                          required
                          menuPlacement="auto"
                          menuPosition="fixed"
                          placeholder="Representante..."
                        />
                      </div>


                    </div>
                  </Col>



                </Row>
              </form>
            </Modal.Body>

            <Modal.Body
              style={
                activeProfileTab === "documentos" ? {} : { display: "none" }
              }
            >
              <div
                style={{
                  flexWrap: "wrap",
                  width: "100%",
                  display: "flex",
                  marginBottom: "15px",
                  flexDirection: "row",
                  borderBottom: "1px solid #d2b32a",
                  borderTop: "1px solid #d2b32a",
                  paddingTop: "20px",
                  paddingBottom: "20px",
                  marginTop: "5px",
                  overflow: "auto",
                  height: "70px",
                }}
              >
                {typeof itemSelected.doclist != "undefined"
                  ? itemSelected.doclist.map((e) => (
                    <Link
                      onClick={() => selectedImg(e)}
                      key={e.id}
                      style={{ margin: "2px" }}
                      to="#"
                      className="mb-1 text-muted d-flex align-items-end text-h-primary"
                    >
                      {"::" + e.nome}
                    </Link>
                  ))
                  : null}
              </div>

              {
                itemSelected?.doclist?.length > 0 ?
                  <>

                    <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "10px" }}>

                      <span><i className="feather icon-eye m-r-5" />Pré-vizualização</span>
                      <span style={{ cursor: "pointer" }} className="text-danger" onClick={() => removeItemFile(previewSelected?.id)}
                      >
                        <i className="feather icon-trash ml-5 text-danger" />
                        Eliminar                </span>
                    </div>
                    {
                      imgprev?.substring(imgprev?.lastIndexOf('.') + 1) !== "PDF" && imgprev?.substring(imgprev?.lastIndexOf('.') + 1) !== "pdf" ? (
                        <a
                          href={imgprev + "?alt=media&token=0"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div
                            className={imgprev == "" ? "previewdoc" : "previewdoc-img"}
                            style={{
                              backgroundImage: 'url("' + imgprev + '?alt=media&token=0")',
                              height: "450px",
                            }}
                          ></div>
                        </a>
                      ) : (
                        <object data={`${imgprev + "?alt=media&token=0"}`} type="application/pdf" width="100%" height="450px">
                          <p>Alternative text - include a link <a href="myfile.pdf">to the PDF!</a></p>
                        </object>
                      )

                    }
                  </>


                  : <p className='text-center'>Sem Anexos</p>

              }

              <Col sm={12}>
                <div className="form-group fill">
                  {/* {itemSelected.pagamento[0].sgigjreldocumento.length > 0 ? (
                    <a href={`${itemSelected.pagamento[0].sgigjreldocumento[0].DOC_URL}?alt=media&token=0`} target="_blank">
                      <Button variant="primary">Abrir documento</Button>
                    </a>
                  ) : null
                  } */}
                </div>
              </Col>

            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
              <span>Registado por: {itemSelected?.criadoPor?.sgigjrelpessoaentidade?.sgigjpessoa?.NOME}</span>
              <Button variant="danger" onClick={() => setVerOpen(false)}>Fechar</Button>

            </Modal.Footer>
          </Modal>
          <CriarPessoa
            generolist={generolist}
            estadocivillist={estadocivillist}
            glbgeografialist={glbgeografialist}
            documentolist={documentolist}
            contactolist={contactolist}
            pessoaopenDO={pessoaopen}
            uploadpessoa={uploadpessoa}
          />


          <Modal
            size="lg"
            show={isNewentidade}
            onHide={() => setisNewentidade(false)}
          >
            <Modal.Footer>
              <Button variant="danger" onClick={() => setisNewentidade(false)}>
                Fechar
              </Button>
              <Button variant="primary">Guardar</Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </React.Fragment >
  );
};
export default CasoSuspeito;
