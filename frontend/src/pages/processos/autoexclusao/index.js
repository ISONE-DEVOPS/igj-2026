import React, { useState, useEffect, useCallback, useRef } from "react";
import { Row, Col, Card, Pagination, Button, Modal } from "react-bootstrap";
import BTable from "react-bootstrap/Table";

import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import Form from 'react-bootstrap/Form';

import { GlobalFilter } from "./../../../components/Shared/GlobalFilter";
import ReactDOMServer from "react-dom/server";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";

import Select from "react-select";

import api from "../../../services/api";

import useAuth from "../../../hooks/useAuth";

import { useHistory } from "react-router-dom";

import {
  pageEnable,
  taskEnable,
  taskEnableIcon,
  taskEnableTitle,
  convertToPrice,
  convertDateToPT,
  setParams,
} from "../../../functions";
import moment from 'moment';

import CriarPessoa from "../../../components/Custom/CriarPessoa";

import JoditEditor from "jodit-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import { formValueSelector } from "redux-form";
require('dotenv').config()
const pageAcess = "/processos/autoexclusao";
var activeValue = "active"

function filterActiveAndAndInactive(value) {
  if (value === "active") {
    activeValue = "active"
  } else {
    activeValue = "inactive"

  }
}
const columns2 = [
  { header: 'Referência', key: 'REF' },
  { header: 'PESSOA', key: 'PESSOA2' },
  { header: 'ENTIDADE', key: "ENTIDADE" },
  { header: 'DATA PEDIDO', key: 'DATA' },
  { header: 'MOTIVO', key: 'MOTIVO' },
  { header: 'PERÍODO', key: 'PERIODO' },
  { header: 'N DIAS', key: 'NUM_DIAS' },
  { header: 'DATA ÍNICIO', key: 'DT_INICIO' },
  { header: 'DATA FIM', key: 'DT_FIM' }

];

function Table({ uploadList, columns, data, modalOpen, exportPDF, saveExcel, toSave, uploadpessoa }) {
  const { permissoes } = useAuth();
  const [filterValues, setfilterValues] = useState()
  const [values, setValues] = useState()
  const [active, setActive] = useState('active')
  const [dispatch, setDispatch] = useState(undefined)
  const [DATA_DE, setDATA_DE] = useState("");
  const [DATA_PARA, setDATA_PARA] = useState("");
  const [idAutoexclusao, setIdAutoexclusao] = useState(localStorage.getItem('EXTRA'))
  const [ANO, setANO] = useState("")
  const [newFilter, setNewFilter] = useState("");

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
  if (toSave === true) filterActiveAndAndInactive("active")
  function filterActiveAndAndInactive(value) {
    if (value === "active") {
      localStorage.setItem("showAlert", false)
      setActive('active')
      uploadList("active", dispatch, ANO)
      uploadpessoa()
    } else {
      localStorage.setItem("showAlert", false)
      setActive('inactive')
      uploadList("inactive", dispatch, ANO)
      uploadpessoa()

    }
  }
  function updateList() {
    setIdAutoexclusao(null)
    uploadList("active", dispatch, ANO)
  }
  function filterDipatach(value) {
    if (value === "true") {
      setDispatch(true)
      localStorage.setItem("showAlert", false)
      uploadList(active, true, ANO)
      uploadpessoa()

    } else if (value === "false") {
      setDispatch("false")
      localStorage.setItem("showAlert", false)
      uploadList(active, "false", ANO)
      uploadpessoa()

    } else {
      localStorage.setItem("showAlert", false)
      uploadList(active, "", ANO)
      uploadpessoa()

    }

  }
  const handleGlobalFilterChange = (value) => {
    setNewFilter(value); // Update globalFilter state with the new value
  };
  function filterDataInicio(e) {
    setDATA_DE(e)
    console.log(e)
    uploadList(active, dispatch, e, DATA_PARA)
    uploadpessoa()

  }
  function filterDataFim(e) {
    setDATA_PARA(e)
    uploadList(active, dispatch, DATA_DE, e)
    uploadpessoa()

  }
  function optionDownload(value) {
    if (value === "1") {
      exportPDF();
      resetForm()
    } else if (value === "2") {
      saveExcel();
      resetForm()
    }
  } const resetForm = () => {
    setValues("")
  }
  const [timeoutId, setTimeoutId] = useState(null);

  function handleChangeAno(ano) {
    setANO(ano)

    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    // Set a new timeout
    const newTimeoutId = setTimeout(() => {
      uploadList(active, dispatch, ano)
    }, 1500);

    // Save the new timeout ID
    setTimeoutId(newTimeoutId);

  }
  function reloadList() {
    setDATA_DE("")
    setDATA_PARA("")
    uploadList(active, dispatch)

  }
  async function exportPDF() {
    const dispatchs = dispatch == "" ? undefined : dispatch
    const dataInicio = DATA_DE === "" ? undefined : DATA_DE
    const dataFim = DATA_PARA === "" ? undefined : DATA_PARA
    const ano = ANO === "" ? undefined : ANO

    const search = newFilter === "" ? undefined : newFilter

    try {
      // ?states=' + activeOrInactive + setParams([["dispatch", dispatch], ['DATA_INICIO', dataInicio], ["DATA_FIM", dataFim]]))
      const response = await api.get(`/sgigjprocessoautoexclusao/exportPdf?state=${active}` + setParams([["dispatch", dispatchs], ['DATA_INICIO', dataInicio], ["DATA_FIM", dataFim], ["ANO", ano], ["name", search]]), { responseType: "blob" });

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
    // const unit = "pt";
    // const size = "A4"; // Use A1, A2, A3 or A4
    // const orientation = "landscape"; // portrait or landscape

    // const marginLeft = 40;
    // const marginTop = 170;
    // const options = {
    //   align: 'center'
    // }
    // const doc = new jsPDF(orientation, unit, size);

    // doc.setFontSize(15);

    // const title = "Lista de Autoexclusão";
    // const headers = [["CODIGO", "PESSOA", "ENTIDADE", "DATA PEDIDO", "MOTIVO", "PERÍODO", "N DIAS", "DATA ÍNICIO", "DATA FIM"]];

    // const data = exportEx?.map(c => [c.CODIGO, c.PESSOA2, c.ENTIDADE, c.DATA, c.MOTIVO, c.PERIODO, c.NUM_DIAS, c.DT_INICIO, c.DT_FIM]);

    // let content = {
    //   startY: 200,
    //   head: headers,
    //   body: data
    // };

    // doc.text(title, marginLeft, marginTop);
    // doc.autoTable(content);
    // let element = (
    //   <div style={{ display: "flex", width: "70%" }}>
    //     <img style={{ width: "100%" }} src={img} />

    //   </div>
    // );
    // doc.html(ReactDOMServer.renderToString(element), {
    //   callback: function (doc) {
    //     doc.save("lista_autoexclusao.pdf")
    //   }
    // });
    // var width = doc.internal.pageSize.getWidth();
    // doc.addImage(img, 'PNG', 15, 40, width, 85);
    // doc.autoTable(content);
    // doc.save("lista_autoexclusao.pdf")

  }

  return (
    <>
      <Row className="mb-3">
        <Col md={4} className="d-flex align-items-center">


          <input
            type="number"
            className='form-control '
            placeholder='Pesquise por ano'
            onChange={event => { handleChangeAno(event.target.value) }} />

        </Col>
        {/* xcxss */}
        <Col md={8} className="d-flex align-items-center justify-content-end">

          {idAutoexclusao === undefined || idAutoexclusao === null ?
            <>
              <select className="form-control"

                style={{ marginRight: "10px" }}
                value={filterValues}
                onChange={(e) => { filterDipatach(e.target.value) }}
              >  <option selected value="todos"> Selecione  </option>
                <option value="true"> Despachado </option>
                <option value="false"> Por Despachar </option>
              </select>

              <select className="form-control"

                style={{ marginRight: "40px" }}
                value={filterValues}
                onChange={(e) => { filterActiveAndAndInactive(e.target.value) }}
              >
                <option selected value="active"> Ativo </option>
                <option value="inactive"> Inativo </option>
              </select>
            </>
            : <div className="text-center d-flex align-items-center "> <a style={{ textDecoration: 'underline', marginRight: '20px' }} href="#" onClick={() => { updateList() }}> Limpar Filtro</a></div>
          }
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} setNewFilter={handleGlobalFilterChange} />

          {taskEnable(pageAcess, permissoes, "Criar") == false ? null : (
            <Button
              variant="primary"
              className="btn-sm btn-round has-ripple ml-2"
              onClick={modalOpen}
            >
              <i className="feather icon-plus" /> Adicionar
            </Button>

          )}
          <select className="form-control"
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
      <BTable striped bordered hover responsive {...getTableProps()}>
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

const Autoexclusao = ({ activeValue }) => {

  const workbook = new Excel.Workbook();
  const editorREF = useRef(null);

  const { permissoes, user, uploadlistnotificacao } = useAuth();

  const history = useHistory();

  let parecerEdit = "";

  const { popUp_removerItem, popUp_alertaOK } = useAuth();

  const columns = React.useMemo(
    () => [
      {
        Header: "Referência",
        accessor: "REF",
        centered: false
      },

      {
        Header: "Frequentador",
        accessor: "PESSOA2",
        centered: true
      },
      {
        Header: "Entidade",
        accessor: "ENTIDADE",
        centered: true
      },
      {
        Header: "Data Pedido",
        accessor: "DATA3",
        centered: true
      },

      {
        Header: "Motivo",
        accessor: "MOTIVO",
        centered: true
      },

      {
        Header: "Período",
        accessor: "PERIODO",
        centered: true
      },
      {
        Header: "Nº Dias",
        accessor: "NUM_DIAS",
        centered: false
      },
      {
        Header: "Data Início",
        accessor: "DATAINICIO2",
        centered: true
      },

      {
        Header: "Data Fim",
        accessor: "DATAFIM2",
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

  const [dais_exclusao, setdais_exclusao] = useState(0);
  const [periodoDesignacao, setPeriodoDesignacao] = useState("");
  function dais_exclusaoMaker(e) {
    let newfilter = e.split(";:;");

    setdais_exclusao(parseInt(newfilter[1]));
    setPR_EXCLUSAO_PERIODO_ID(newfilter[0]);
    console.log(dais_exclusao)
    console.log(periodolist)

    console.log(PR_EXCLUSAO_PERIODO_ID)
    let periodo = periodolist
      .find((e) => e.ID === newfilter[0]).DESIG
    setPeriodoDesignacao(periodo)
    if (DT_INICIO) {
      let newdatefim = new Date(DT_INICIO)
      newdatefim.setDate(newdatefim.getUTCDate() + parseInt(newfilter[1]))
      console.log(newdatefim)
      if (newdatefim != "Invalid Date") {
        setDT_FIM(createDate2(newdatefim))
      }
    }

  }
  const [active, setActive] = useState("active")

  const [PESSOA_ID, setPESSOA_ID] = useState("");
  const [ENTIDADE_ID, setENTIDADE_ID] = useState("");
  const [PR_MOTIVO_ESCLUSAO_TP_ID, setPR_MOTIVO_ESCLUSAO_TP_ID] = useState("");
  const [PR_PROFISSAO_ID, setPR_PROFISSAO_ID] = useState("");
  const [PR_EXCLUSAO_PERIODO_ID, setPR_EXCLUSAO_PERIODO_ID] = useState("");
  const [DESCR, setDESCR] = useState("");
  const [DATA, setDATA] = useState("");
  const [CONCELHO, setCONCELHO] = useState("");
  const [FREGUESIA, setFREGUESIA] = useState("");

  const [OBS, setOBS] = useState("");
  const [DT_INICIO, setDT_INICIO] = useState("");
  const [DT_FIM, setDT_FIM] = useState("");
  const [newdata, setnewdata] = useState([]);
  const [alertList, setAlertList] = useState([]);

  const [showAlert, setShowAlert] = useState(true);
  const [isLoading, setIsLoading] = useState(false)
  const [USE_THIS_DOC, setUSE_THIS_DOC_] = useState(-1);


  const [itemSelected, setitemSelected] = useState({});
  const [previewSelected, setPreviewSelected] = useState(null);

  var exportEx = []
  newdata?.forEach((dat, i) => {
    exportEx.push({
      "CODIGO": dat.CODIGO,
      "PESSOA2": dat.PESSOA2,
      "DATA": dat.DATA3,
      "MOTIVO": dat.MOTIVO,
      "PERIODO": dat.PERIODO,
      "ENTIDADE": dat.ENTIDADE,
      "NUM_DIAS": dat.NUM_DIAS,
      "DT_INICIO": createDate1(dat.DT_INICIO),
      "DT_FIM": createDate1(dat.DT_FIM),

    })
  })
  const data = exportEx


  const handleSetDocument = (event, index) => {
    setUSE_THIS_DOC_(index)
  }



  const workSheetName = 'Worksheet-1';
  const saveExcel = async () => {
    try {

      const fileName = "lista_autoexclusao";

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
  function formatDate(date) {
    if (date == null) return
    var d = new Date(date),
      month = '' + (d.getUTCMonth() + 1),
      day = '' + d.getUTCDate(),
      year = d.getUTCFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
  }
  function createDate1(data) {
    if (data == null) return;

    let res = new Date(data)
      .toLocaleDateString("pt-PT", {
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

  //-------------------------- UPLOAD -----------------
  async function uploadlist(active, dispatch, ano) {

    let activeOrInactive = active === undefined ? active = "active" : active
    dispatch = dispatch == "" ? undefined : dispatch
    ano = ano === "" ? undefined : ano
    try {
      let response;
      if (localStorage.getItem("EXTRA")) {
        let request = await api.get("/sgigjprocessoautoexclusao/" + localStorage.getItem("EXTRA"));
        if (request.status == 200) {
          response = {
            data: {
              data: request['data']
            },
            status: 200
          }
        }

        localStorage.removeItem("EXTRA")
      } else {
        // setActive(activeValue)
        response = await api.get('/sgigjprocessoautoexclusao?states=' + activeOrInactive + setParams([["dispatch", dispatch], ["ANO", ano]]))
        // : await api.get(`/sgigjprocessoautoexclusao?states=${activeOrInactive}&dispatch=${dispatch}`);
      }


      if (response.status === 200) {
        for (var i = 0; i < response.data['data'].length; i++) {
          const idx = response.data['data'][i].ID;


          response.data['data'][i].id = response.data['data'][i].ID;

          response.data['data'][i].PESSOA2 = response.data['data'][i].sgigjpessoa.NOME;
          response.data['data'][i].ENTIDADE = response.data['data'][i].sgigjentidade ? response.data['data'][i].sgigjentidade.DESIG : "";
          response.data['data'][i].PROFISSAO = response.data['data'][i].sgigjprprofissao.DESIG;
          response.data['data'][i].MOTIVO =
            response.data['data'][i].sgigjprmotivoesclusaotp.DESIG;
          response.data['data'][i].PERIODO =
            response.data['data'][i].sgigjprexclusaoperiodo.DESIG;

          response.data['data'][i].DATA3 = formatDate(response.data['data'][i].DATA)
          response.data['data'][i].DATAINICIO2 = formatDate(
            response.data['data'][i].DT_INICIO
          );
          response.data['data'][i].DATAFIM2 = formatDate(response.data['data'][i].DT_FIM);
          response.data['data'][i].NUM_DIAS = response.data['data'][i].NUM_DIAS;

          const itemx = response.data['data'][i];
          //console.log({data: response.data[i]})
          response.data['data'][i].action = (
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

              {response.data['data'][i].sgigjprocessodespacho.length !== 0 && response.data['data'][i].sgigjprocessodespacho[0].TIPO === "CONCLUIR" ? null : taskEnable(pageAcess, permissoes, "Editar") == false ? null : (
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

              {response.data['data'][i].sgigjprocessodespacho.length !== 0 && response.data['data'][i].sgigjprocessodespacho[0].TIPO === "CONCLUIR" ? null : taskEnable(pageAcess, permissoes, "Despacho") == false ? null : (
                <Link
                  to="#"
                  title={taskEnableTitle(pageAcess, permissoes, "Despacho")}
                  onClick={() => openDespacho(itemx)}
                  className="text-primary mx-1"
                >
                  <i
                    className={
                      "" + taskEnableIcon(pageAcess, permissoes, "Despacho")
                    }
                  />
                </Link>
              )}

              {response.data['data'][i].sgigjprocessodespacho.length !== 0 && response.data['data'][i].sgigjprocessodespacho[0].TIPO === "CONCLUIR" ? null : taskEnable(pageAcess, permissoes, "Eliminar") == false ? null : (
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
        console.log({ data: response.data['data'] })
        setnewdata(response.data['data'])
        let isShowAlertFromLocalStorage = localStorage.getItem("showAlert")
        if (isShowAlertFromLocalStorage == "false") {
          localStorage.removeItem("showAlert")
          return
        } else {

          displayAlertMessageForExpireDate(response.data['alert'])
          localStorage.removeItem("showAlert")

        }
      }
    }
    catch (err) {

      console.error(err.response);
    }

  }
  function displayAlertMessageForExpireDate(alertList) {
    if (alertList && alertList.length > 0) {
      alertList.forEach(element => {
        toast.error(`A autoexclusão com a  Referência ${element.REF} expira em ${element.NUM_DIAS} dias `, { duration: 4000 })
      });
    }
    // }
  }
  // const [, updateState] = useState();
  // const forceUpdate = useCallback(() => {

  //   uploadlist()
  // }, [uploadlist]);
  //-------------------------------------------

  const [activeProfileTab, setActiveProfileTab] = useState("dados");

  const profileTabClass = "nav-link text-reset";
  const profileTabActiveClass = "nav-link text-reset active";

  const [pessoalist, setpessoalist] = useState([]);
  const [entidadelist, setentidadelist] = useState([]);
  var listOfPerson
  async function uploadpessoa() {
    try {
      const response = await api.get("/sgigjpessoa");

      if (response.status == "200") {
        for (var i = 0; i < response.data.length; i++) {
          response.data[i].value = response.data[i].ID;
          response.data[i].label = response.data[i].NOME;
        }
        console.log({ uploadpessoa: response.data })
        listOfPerson = response.data
        setpessoalist(response.data);
      }
    } catch (err) {
      console.error(err.response);
    }
  }

  async function getentidade() {
    try {
      const response = await api.get("/sgigjentidade");

      if (response.status == "200") {

        let entidades = response.data;

        entidades = entidades.filter((entidade, index) => entidade.sgigjprentidadetp.DESIG === "Casino")

        for (var i = 0; i < entidades.length; i++) {
          entidades[i].value = entidades[i].ID;
          entidades[i].label = entidades[i].DESIG;
        }
        console.log({ getENtidade: entidades })
        setentidadelist(entidades);
      }
    } catch (err) {
      console.error(err.response);
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

  const [profissaolist, setprofissaolist] = useState([]);

  async function uploadprofissaolist() {
    try {
      const response = await api.get("/sgigjprprofissao");

      if (response.status == "200") {
        setprofissaolist(response.data);
      }
    } catch (err) {
      console.error(err.response);
    }
  }

  const [motivoesclusaolist, setmotivoesclusaolist] = useState([]);

  async function uploadmotivoesclusaolist() {
    try {
      const response = await api.get("/sgigjprmotivoesclusaotp");

      if (response.status == "200") {
        setmotivoesclusaolist(response.data);
      }
    } catch (err) {
      console.error(err.response);
    }
  }

  const [periodolist, setperiodolist] = useState([]);

  async function uploadperiodolist() {
    try {
      const response = await api.get("/sgigjprexclusaoperiodo");

      if (response.status == "200") {
        setperiodolist(response.data);
      }
    } catch (err) {
      console.error(err.response);
    }
  }

  const [desicaolist, setdesicaolist] = useState([]);

  async function uploaddesicaolist() {
    try {
      const response = await api.get("/sgigjprdecisaotp");

      if (response.status == "200") {
        setdesicaolist(response.data);
      }
    } catch (err) {
      console.error(err.response);
    }
  }

  //-------------- Ver -------------------------

  const [imgprev, setimgprev] = useState("");
  const [createBy, setCreateBy] = useState("");

  console.log(pessoalist)
  const openVerHandler = async (idx) => {

    setPESSOA_ID(idx.PESSOA_ID);
    setPR_MOTIVO_ESCLUSAO_TP_ID(idx.PR_MOTIVO_ESCLUSAO_TP_ID);
    setPR_PROFISSAO_ID(idx.PR_PROFISSAO_ID);
    setPR_EXCLUSAO_PERIODO_ID(idx.PR_EXCLUSAO_PERIODO_ID);

    setDESCR(idx.DESCR);
    setOBS(idx.OBS);
    setFREGUESIA(idx.FREGUESIA)
    setCONCELHO(idx.CONCELHO)
    seturlDOC(idx.URL_DOC_GERADO)
    setDT_INICIO(createDate2(idx.DT_INICIO));
    setDT_FIM(createDate2(idx.DT_FIM));
    setDATA(createDate2(idx.DATA));
    let newitemler = idx;

    newitemler.processodespacho = null;
    console.log(imgprev)

    setimgprev("");
    setActiveProfileTab("dados");

    try {

      const response = await api.get("/sgigjprocessoautoexclusao/" + idx.id);
      if (response.status == "200") {
        if (response.data.length > 0) {
          if (response.data[0].sgigjprocessodespacho.length > 0) {
            newitemler.processodespacho =
              response.data[0].sgigjprocessodespacho[0].URL_DOC_GERADO;
          }

          let doclist = [];
          if (response.data[0].sgigjreldocumento.length > 0) {
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
          }

          let personThatCreateTheAutoexclusion = listOfPerson.find(person => person.ID === response.data[0].criado_por.sgigjrelpessoaentidade.PESSOA_ID)
          setCreateBy(personThatCreateTheAutoexclusion.NOME)
          setVerOpen(true);
          // setIsEditarOpen(false);
          // setisDepachoopen(false);
          // setIsOpen(false);
          console.log(imgprev)

          newitemler.doclist = doclist;

          console.log(newitemler);
          setitemSelected(newitemler);
        }
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
    console.log(idx)
    setIsEditarOpen(true);
    // setisDepachoopen(false);
    // setIsOpen(false);
    // setVerOpen(false);
    setitemSelected(idx);

    setPESSOA_ID(idx.PESSOA_ID);
    setPR_MOTIVO_ESCLUSAO_TP_ID(idx.PR_MOTIVO_ESCLUSAO_TP_ID);
    setPR_PROFISSAO_ID(idx.PR_PROFISSAO_ID);
    setPR_EXCLUSAO_PERIODO_ID(idx.PR_EXCLUSAO_PERIODO_ID);
    setFREGUESIA(idx.FREGUESIA)
    setCONCELHO(idx.CONCELHO)

    setDESCR(idx.DESCR);
    setOBS(idx.OBS);
    setENTIDADE_ID(idx.sgigjentidade.ID)
    setDT_INICIO(createDate2(idx.DT_INICIO));
    setDT_FIM(createDate2(idx.DT_FIM));
    setDATA(createDate2(idx.DATA));

    seturlDOC(idx.URL_DOC_GERADO)
    novosdocumentos = [];

    try {
      const response3 = await api.get(
        "/sgigjreldocumento?PROCESSO_AUTOEXCLUSAO_ID=" + idx.ID
      );

      if (response3.status == "200") {
        for (let ix = 0; ix < response3.data.length; ix++) {
          const DT_E =
            response3.data[ix].DT_EMISSAO != null
              ? response3.data[ix].DT_EMISSAO.substring(0, 10)
              : "";
          const DT_V =
            response3.data[ix].DT_VALIDADE != null
              ? response3.data[ix].DT_VALIDADE.substring(0, 10)
              : "";

          novosdocumentos.push({
            id: "" + response3.data[ix].ID,
            tipodocumento: response3.data[ix].PR_DOCUMENTO_TP_ID,
            numero: response3.data[ix].NUMERO,
            dataemissao: DT_E,
            datavalidade: DT_V,
            anexo: { type: 1, file: response3.data[ix].DOC_URL },
            main: response3.data[ix].MAIN

          });

        }
        let docActivated = novosdocumentos.indexOf(res => res.main === 1)
        setUSE_THIS_DOC_(docActivated)
      }
    } catch (err) {
      console.error(err.response3);
    }

    setnovosdocumentos(novosdocumentos.concat([]));
  };

  async function editarItemGO(event) {
    // setShowAlert(false)
    event.preventDefault();

    if (PESSOA_ID == null || PESSOA_ID == "")
      popUp_alertaOK("Escolha um Frequentador");
    else {
      setIsLoading(true)
      var anexofile = "";
      var isDocIdentification = false

      if (thumnail2 == null) {
        anexofile = itemSelected.URL_FOTO;
      } else {
        const img = await onFormSubmitImage(thumnail2);
        anexofile = img.file.data;
      }
      const upload = {
        PESSOA_ID,
        PR_MOTIVO_ESCLUSAO_TP_ID,
        PR_PROFISSAO_ID,
        PR_EXCLUSAO_PERIODO_ID,
        ENTIDADE_ID,
        DESCR,
        DATA,
        OBS,
        CONCELHO, FREGUESIA,
        DT_INICIO,
        DT_FIM,

        ESTADO: "1",
        URL_FOTO: anexofile,
      };

      console.log(upload);

      try {
        const response = await api.put(
          "/sgigjprocessoautoexclusao/" + itemSelected.ID,
          upload
        );

        if (response.status == "200") {
          toast.success('Documento Guardado!', { duration: 4000 })
          if (docedit == true) {
            const response2x = await api.delete(
              "/sgigjreldocumento/0?PROCESSO_AUTOEXCLUSAO_ID=" + itemSelected.ID
            );

            if (response2x.status == "200" || response2x.status == "204") {
              for (let i = 0; i < novosdocumentos.length; i++) {
                let tipodocumento = documentolist.find(res => res.ID === novosdocumentos[i].tipodocumento)
                if (tipodocumento.IDENTIFICACAO === 1) {
                  if (
                    novosdocumentos[i].datavalidade == "" ||
                    novosdocumentos[i].numero == "" || novosdocumentos[i].dataemissao == ""
                  ) {
                    isDocIdentification = true

                    continue
                  }
                }
                if (
                  novosdocumentos[i].tipodocumento != "" &&
                  novosdocumentos[i].numero != ""
                ) {
                  var anexofile = "";

                  if (novosdocumentos[i].anexo.type == "1") {
                    anexofile = novosdocumentos[i].anexo.file;
                  }

                  if (novosdocumentos[i].anexo.type == "2") {
                    const img = await onFormSubmitImage(
                      novosdocumentos[i].anexo.file
                    );

                    anexofile = img.file.data;
                  }


                  const upload2 = {
                    PROCESSO_AUTOEXCLUSAO_ID: itemSelected.ID,
                    PR_DOCUMENTO_TP_ID: novosdocumentos[i].tipodocumento,
                    NUMERO: novosdocumentos[i].numero,
                    DOC_URL: anexofile,
                    DT_EMISSAO: novosdocumentos[i].dataemissao,
                    DT_VALIDADE: novosdocumentos[i].datavalidade,
                    ESTADO: "1",
                    MAIN: novosdocumentos[i].main

                  };
                  if (isDocIdentification) {
                    setIsLoading(false)
                    popUp_alertaOK("Preenche os campos que representam um documento de identificação");
                    break
                  }
                  try {

                    const response2 = await api.post(
                      "/sgigjreldocumento",
                      upload2
                    );
                  } catch (err) {
                    console.error(err.response);
                  }
                }
              }
            }
          }
          localStorage.setItem("showAlert", false)
          uploadlist();
          setIsLoading(false)
          setIsEditarOpen(false);
        }
      } catch (err) {
        setIsLoading(false)
        console.error(err.response);
      }
    }
  }

  //----------------------------------------------

  //-------------- CRIAR -------------------------

  const openHandler = () => {
    setActiveProfileTab("dados");
    setPESSOA_ID("");
    setPR_MOTIVO_ESCLUSAO_TP_ID("");
    setPR_PROFISSAO_ID("");
    setPR_EXCLUSAO_PERIODO_ID("");

    setDESCR("");
    setOBS("");
    setCONCELHO("");
    setFREGUESIA("");
    setDT_INICIO("");
    setDT_FIM("")
    setDATA("");

    setnovosdocumentos([
      {
        id: "" + Math.random(),
        tipodocumento: "",
        numero: "",
        dataemissao: "",
        datavalidade: "",
        anexo: { type: 0, file: null },
      },
    ]);

    seturlDOC(null);
    sethasDOC(false);

    setIsOpen(true);
    setIsEditarOpen(false);
    setVerOpen(false);
    setisDepachoopen(false);
    setThumnail(null);

  };

  const [hasDOC, sethasDOC] = useState(false);
  const [urlDOC, seturlDOC] = useState(null);
  var todayDate = new Date().toJSON().slice(0, 10);

  async function criarItemGO(event) {
    var isRequired = false

    event.preventDefault();
    if (hasDOC) {

      if (PESSOA_ID == null || PESSOA_ID == "")
        return popUp_alertaOK("Escolha uma Pessoa");
      if (DT_INICIO < DATA)
        return popUp_alertaOK("Data de inicio de exclusão não pode ser inferior a data do pedido");
      if (ENTIDADE_ID == null || ENTIDADE_ID == "")
        return popUp_alertaOK("Escolha uma Entidade");
      else {
        if (thumnail == null) {
          return popUp_alertaOK("Escolha uma imagem");
        } else {
          setIsLoading(true)
          var anexofile = "";
          const img = await onFormSubmitImage(thumnail);
          anexofile = img.file.data;
          const upload = {
            PESSOA_ID,
            ENTIDADE_ID,
            PR_MOTIVO_ESCLUSAO_TP_ID,
            PR_PROFISSAO_ID,
            PR_EXCLUSAO_PERIODO_ID,
            URL_DOC_GERADO: urlDOC,
            DESCR,
            DATA,
            OBS,
            CONCELHO,
            FREGUESIA,
            DT_INICIO,
            DT_FIM,
            ESTADO: "1",
            URL_FOTO: anexofile,
          };
          console.log({ upload })
          for (let i = 0; i < novosdocumentos.length; i++) {
            if (USE_THIS_DOC === i) {
              if (novosdocumentos[i].anexo.file == null || novosdocumentos[i].anexo.file == "") {
                isRequired = true
              }
            }
          }
          if (isRequired) {
            return popUp_alertaOK("Escolha um anexo para o documento padrão");
          }
          try {
            const response = await api.post(
              "/sgigjprocessoautoexclusao",
              upload
            );

            if (response.status == "200") {
            toast.success('Documento Guardado!', { duration: 4000 })

              for (let i = 0; i < novosdocumentos.length; i++) {

                if (
                  novosdocumentos[i].tipodocumento != "" &&
                  novosdocumentos[i].numero != ""
                ) {
                  var anexofile = "";

                  if (novosdocumentos[i].anexo.type == "1") {
                    anexofile = novosdocumentos[i].anexo.file;
                  }

                  if (novosdocumentos[i].anexo.type == "2") {
                    const img = await onFormSubmitImage(
                      novosdocumentos[i].anexo.file
                    );

                    anexofile = img.file.data;
                  }



                  const upload2 = {
                    PROCESSO_AUTOEXCLUSAO_ID: response.data.ID,
                    PR_DOCUMENTO_TP_ID: novosdocumentos[i].tipodocumento,
                    NUMERO: novosdocumentos[i].numero,
                    DOC_URL: anexofile,
                    DT_EMISSAO: novosdocumentos[i].dataemissao,
                    DT_VALIDADE: novosdocumentos[i].datavalidade,
                    ESTADO: "1",
                    MAIN: USE_THIS_DOC === i ? 1 : 0
                  };

                  try {
                    const response2 = await api.post(
                      "/sgigjreldocumento",
                      upload2
                    );
                  } catch (err) {
                    console.error(err.response);

                  }
                }
              }
              localStorage.setItem("showAlert", false)
              setShowAlert(false)
              setIsLoading(false)

              // uploadlist("active")
              history.push('/')
              history.replace('/processos/autoexclusao');
              setShowAlert(false)
              uploadlistnotificacao()
              setIsLoading(false)
              setIsOpen(false);
            }
          } catch (err) {
            setIsLoading(false)
            console.error(err.response);
          }
        }
      }
    } else {

      if (PESSOA_ID == null || PESSOA_ID == "") {
        setisGeneratingPdf(false);
        return popUp_alertaOK("Escolha uma Pessoa");
      }
      if (DT_INICIO < DATA) {
        return popUp_alertaOK("Data de inicio de exclusão não pode ser inferior a data do pedido");
      }
      if (USE_THIS_DOC === -1) {
        return popUp_alertaOK("Selecione um documento padrão");

      }
      else {

        if (thumnail == null) {
          setisGeneratingPdf(false);
          return popUp_alertaOK("Escolha uma imagem");

        } else {

          var anexofile = "";
          var isDocIdentification = false
          const img = await onFormSubmitImage(thumnail);
          anexofile = img.file.data;
          let doc = novosdocumentos.find((res, index) => index === USE_THIS_DOC)
          if (doc) {
            if (doc.dataemissao === "" || doc.datavalidade === "" || doc.numero === "" || doc.tipodocumento === "") {
              setisGeneratingPdf(false)
              return popUp_alertaOK("Todos os campos do documento padrão são obrigatórios");
            }
          }
          for (let i = 0; i < novosdocumentos.length; i++) {

            let tipodocumento = documentolist.find(res => res.ID === novosdocumentos[i].tipodocumento)
            if (tipodocumento.IDENTIFICACAO === 1) {
              if (
                novosdocumentos[i].datavalidade == "" ||
                novosdocumentos[i].numero == "" || novosdocumentos[i].dataemissao == ""
              ) {
                isDocIdentification = true
              }
            }
            if (USE_THIS_DOC === i) {
              if (novosdocumentos[i].anexo.file == null || novosdocumentos[i].anexo.file == "") {
                isRequired = true
              }
            }
          }
          if (isDocIdentification) {
            return popUp_alertaOK("Preenche os campos que representam um documento de identificação");

          }
          if (isRequired) {
            return popUp_alertaOK("Escolha um anexo para o documento padrão");
          }
          let tipodocumento = documentolist.find(res => res.ID === doc.tipodocumento)
          setisGeneratingPdf(true);
          const upload = {
            PESSOA_ID,
            ENTIDADE_ID,
            PR_PROFISSAO_ID,
            PR_EXCLUSAO_PERIODO_ID,
            DATA,
            IMG: anexofile + "?alt=media&token=0",
            FREGUESIA,
            CONCELHO,
            PR_DOCUMENTO_TP_ID: tipodocumento.DESIG,
            NUMERO: doc.numero,
            DOC_URL: anexofile,
            DT_EMISSAO: doc.dataemissao,
            DT_VALIDADE: doc.datavalidade,
            ESTADO: "1",
            MAIN: 1
          };
          console.log(upload);
          try {
            const response = await api.post("/gerarpedidoaotoexclusao", upload);

            if (response.status == "200") {
              seturlDOC(response.data);
              sethasDOC(true);
              setisGeneratingPdf(false)
              console.log(response.data);
            }
          } catch (err) {
            console.error(err.response);
            setisGeneratingPdf(false)
          }
        }
      }
    }
  }

  //----------------------------------------------

  //-------------- Remover -------------------------

  const removeItemFunction = async (idx) => {

    let res = true;

    try {
      const response = await api.delete("/sgigjprocessoautoexclusao/" + idx);
    } catch (err) {
      res = false;
      console.error(err.response);
      popUp_alertaOK("Falha. Tente mais tarde");
    }
    localStorage.setItem("showAlert", false)

    uploadlist();

    return res;
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

  const removeItem = async (idx) => {
    popUp_removerItem({
      delete: removeItemFunction,
      id: idx,
    });
  };
  const removeItemFile = async (idx) => {
    popUp_removerItem({
      delete: removeItemFileFunction,
      id: idx,
    });
  };
  //-----------------------------------------------
  function setEndDate(e) {
    setDT_INICIO(e)
    let newdatefim = new Date(e)
    newdatefim.setDate(newdatefim.getUTCDate() + dais_exclusao)
    console.log(newdatefim)
    if (newdatefim != "Invalid Date") {
      setDT_FIM(createDate2(newdatefim))
    }
  }  //Update the stat of isSave whenever the method criarItem is called


  useEffect(() => {
    uploadlist();
  }, []);



  useEffect(() => {
    if (typeof itemSelected.doclist != "undefined") {
      setimgprev(itemSelected?.doclist[0]?.url)
      selectedImg(itemSelected?.doclist[0])
    }
    if (pageEnable(pageAcess, permissoes) == false) history.push("/");
    else {
      uploadpessoa();
      getentidade();
      uploadperiodolist();
      uploadprofissaolist();

      uploadmotivoesclusaolist();
      uploadgenerolist();
      uploadestadocivil();
      uploadglbgeografia();
      uploadcontactolist();
      uploaddocumentolist();
      uploaddesicaolist();
    }
  }, [itemSelected]);

  // useEffect(() => {
  //   let newdatefim = new Date(DT_INICIO);
  //   newdatefim.setDate(newdatefim.getDate() + dais_exclusao);

  //   if (newdatefim != "Invalid Date") {
  //     setDT_FIM(createDate2(newdatefim));
  //   }
  // }, [DT_INICIO, dais_exclusao, active]);

  const [isOpen, setIsOpen] = useState(false);
  const [isEditarOpen, setIsEditarOpen] = useState(false);
  const [isVerOpen, setVerOpen] = useState(false);
  const [isNewentidade, setisNewentidade] = useState(false);

  //-------------------- documento

  var [novosdocumentos, setnovosdocumentos] = useState([
    {
      id: "" + Math.random(),
      tipodocumento: "",
      numero: "",
      dataemissao: "",
      datavalidade: "",
      anexo: { type: 0, file: null },
      main: ''
    },
  ]);

  function addnovosdocumentos() {
    setnovosdocumentos(
      novosdocumentos.concat([
        {
          id: "" + Math.random(),
          tipodocumento: "",
          numero: "",
          dataemissao: "",
          datavalidade: "",
          main: '',
          anexo: { type: 0, file: null },
        },
      ])
    );
  }

  function removenovosdocumentos(id) {
    if (novosdocumentos.length > 1) {
      const indexx = novosdocumentos.findIndex((x) => x.id === id);

      if (indexx > -1) {
        var newArr = novosdocumentos;
        newArr.splice(indexx, 1);
        setnovosdocumentos(newArr.concat([]));

        setdocedit(true);
      }
    }
  }

  const [docedit, setdocedit] = useState(false);

  function criartipodoc(tipodoc, id) {
    const indexx = novosdocumentos.findIndex((x) => x.id === id);

    novosdocumentos[indexx] = {
      id: id,

      tipodocumento: tipodoc,

      numero: novosdocumentos[indexx].numero,
      dataemissao: novosdocumentos[indexx].dataemissao,
      datavalidade: novosdocumentos[indexx].datavalidade,
      anexo: novosdocumentos[indexx].anexo,
      main: novosdocumentos[indexx].main,

    };

    setdocedit(true);

    setnovosdocumentos(novosdocumentos.concat([]));
  }

  function criardocnum(docnum, id) {
    const indexx = novosdocumentos.findIndex((x) => x.id === id);

    novosdocumentos[indexx] = {
      id: id,

      numero: docnum,

      tipodocumento: novosdocumentos[indexx].tipodocumento,
      dataemissao: novosdocumentos[indexx].dataemissao,
      datavalidade: novosdocumentos[indexx].datavalidade,
      anexo: novosdocumentos[indexx].anexo,
      main: novosdocumentos[indexx].main,

    };

    setdocedit(true);

    setnovosdocumentos(novosdocumentos.concat([]));
  }

  function criardocdataE(docdataE, id) {
    const indexx = novosdocumentos.findIndex((x) => x.id === id);

    novosdocumentos[indexx] = {
      id: id,

      dataemissao: docdataE,

      numero: novosdocumentos[indexx].numero,
      tipodocumento: novosdocumentos[indexx].tipodocumento,
      datavalidade: novosdocumentos[indexx].datavalidade,
      anexo: novosdocumentos[indexx].anexo,
      main: novosdocumentos[indexx].main,

    };

    setdocedit(true);

    setnovosdocumentos(novosdocumentos.concat([]));
  }

  function criardocdataV(docdataV, id) {
    const indexx = novosdocumentos.findIndex((x) => x.id === id);

    novosdocumentos[indexx] = {
      id: id,

      datavalidade: docdataV,

      numero: novosdocumentos[indexx].numero,
      tipodocumento: novosdocumentos[indexx].tipodocumento,
      dataemissao: novosdocumentos[indexx].dataemissao,
      anexo: novosdocumentos[indexx].anexo,
      main: novosdocumentos[indexx].main,

    };

    setdocedit(true);

    setnovosdocumentos(novosdocumentos.concat([]));
  }

  function criaranexo(anexo, id) {
    const indexx = novosdocumentos.findIndex((x) => x.id === id);

    if (
      novosdocumentos[indexx].tipodocumento == "" ||
      novosdocumentos[indexx].numero == ""
    ) {
      popUp_alertaOK("Preencha o campos obrigatórios");
    }

    novosdocumentos[indexx] = {
      id: id,

      tipodocumento: novosdocumentos[indexx].tipodocumento,
      dataemissao: novosdocumentos[indexx].dataemissao,
      datavalidade: novosdocumentos[indexx].datavalidade,
      numero: novosdocumentos[indexx].numero,
      main: novosdocumentos[indexx].main,

      anexo: { type: 2, file: anexo },
    };

    setdocedit(true);

    setnovosdocumentos(novosdocumentos.concat([]));
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

  //---------------- cria pessoa ------------

  const [pessoaopen, setpessoaopen] = useState({ code: 0, value: false });
  const openpessoafunction = () => {
    setpessoaopen({ code: pessoaopen.code + 1, value: true });
  };

  //----------------------uploadimg

  const [thumnail, setThumnail] = useState(null);

  const preview = React.useMemo(() => {
    //return thumnail ? onFormSubmit() : null;
    return thumnail ? URL.createObjectURL(thumnail) : null;
  }, [thumnail]);

  const [thumnail2, setThumnail2] = useState(null);

  const preview2 = React.useMemo(() => {
    //return thumnail ? onFormSubmit() : null;
    return thumnail2
      ? URL.createObjectURL(thumnail2)
      : "/static/media/l6.e0eceb02.jpg";
  }, [thumnail2]);

  //-------------- Despacho -------------------------

  const [isDepachoopen, setisDepachoopen] = useState(false);

  const [editorcontent, seteditorcontent] = useState("");

  const updateContent = (value) => {
    //seteditorcontent(value);
    parecerEdit = value;

    console.log(parecerEdit);
  };

  const setRef = (jodit) => {
    // control
  };

  function gerartextodespacho() {

    let periodo = periodolist
      .find((e) => e.ID === PR_EXCLUSAO_PERIODO_ID_D).DESIG
    setPeriodoDesignacao(periodo)
    console.log(periodo)
    console.log(periodoDesignacao)

    if (
      PR_DECISAO_TP_ID_D == "" ||
      PR_EXCLUSAO_PERIODO_ID_D == "" ||
      REFERENCIA_D == "" ||
      DATA_D == ""
    ) {
      popUp_alertaOK("Preencha todos os campos obrigatórios");
    } else {
      parecerEdit = `
                
                    <p class="MsoNormal" align="center" style="margin: 0in 0px 0in 0in; font-size: 13px; font-family: Calibri, sans-serif; text-align: center;"><b style="mso-bidi-font-weight:normal"><span style="font-size: 32px; font-family: &quot;Times New Roman&quot;, serif;">AUTO-EXCLUSÃO  N.º ${REFERENCIA_D}/${convertDateToPT(dataagora)?.ano
        }</span></b></p>
                    <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 13px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
                    
                    <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 13px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
                    
                    <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 13px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
                    
                    <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 14px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
                    
                    <p class="MsoNormal" style="margin: 0in 17px 0in 0in; font-size: 13px; font-family: Calibri, sans-serif; text-align: justify; line-height: 107%;"><span style="font-size: 21px; line-height: 107%; font-family: &quot;Times New Roman&quot;, serif;">Ao abrigo da faculdade conferida pelo n.º 5 do artigo 65º da Lei 62/VII/2010 de 31 de maio, que altera a Lei n.º 77/VII/2005 de 16 de agosto, que estabelece o Regime Jurídico da Exploração de Jogos de Fortuna ou Azar, suportada pelo pedido, por escrito, datado de ${convertDateToPT(DATA_PEDIDO)?.dia
        } de ${convertDateToPT(DATA_PEDIDO)?.mes} de ${convertDateToPT(DATA_PEDIDO)?.ano}, de auto proibição, apresentado pelo Sr. ${itemSelectedEdit?.PESSOA2
        } alegando motivos de perda no casino, determino:</span></p>
                    
                    <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 13px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
                    
                    <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 13px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
                    
                    <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 16px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
                    
                    <p class="MsoNormal" style="margin: 0in 0in 0in 65px; font-size: 13px; font-family: Calibri, sans-serif; text-indent: -24px;"><b style="mso-bidi-font-weight:normal"><span style="font-size: 21px; line-height: 105%; font-family: &quot;Times New Roman&quot;, serif;"><span style="mso-list:Ignore">1.<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;
                    </span></span></span></b>
                    <span 
                    style="font-weight:600; font-size: 21px; line-height: 105%; font-family: &quot;Times New Roman&quot;, serif;">
                    Fica o Sr. ${itemSelectedEdit?.PESSOA2}, proibido do acesso à sala de jogos de fortuna ou azar no país, pelo período de ${periodoDesignacao}, a
                    partir da data da comunicação de auto proibição, ou seja, ${convertDateToPT(DT_INICIO_D)?.dia} de ${convertDateToPT(DT_INICIO_D)?.mes} de ${convertDateToPT(DT_INICIO_D)?.ano};
                    </span>
                    </p>
                    
                    <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 20px;"><b style="mso-bidi-font-weight:normal"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></b></p>

                    <p class="MsoNormal" style="margin: 0in 0in 0in 65px; font-size: 13px; font-family: Calibri, sans-serif; text-indent: -24px;"><b style="mso-bidi-font-weight:normal"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;"><span style="mso-list:Ignore">2.<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp; </span></span></span></b><b style="mso-bidi-font-weight:normal"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">Notifique-se
                                a Direção do(a) ${entidade} ;</span></b></p>
                    
                    <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 13px;"><b style="mso-bidi-font-weight:normal"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></b></p>
                    
                    
                    
                    <p class="MsoNormal" style="margin: 0in 0in 0in 65px; font-size: 13px; font-family: Calibri, sans-serif; text-indent: -24px;"><b style="mso-bidi-font-weight:normal"><span style="font-size: 21px; line-height: 106%; font-family: &quot;Times New Roman&quot;, serif;"><span style="mso-list:Ignore">3.<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;
                                    </span></span></span></b><b style="mso-bidi-font-weight:normal"><span style="font-size: 21px; line-height: 106%; font-family: &quot;Times New Roman&quot;, serif;">Deve a Direção do Casino dar
                                de imediato conhecimento à receção do mesmo, devendo esta, bem como o Diretor
                                Geral do casino estarem cientes das suas responsabilidades se permitirem o
                                acesso do referido frequentador ao espaço confinado ao jogo.</span></b></p>
                    
                            
                    <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 20px;"><b style="mso-bidi-font-weight:normal"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></b></p>
                    <p class="MsoNormal" style="margin: 0in 0in 0in 65px; font-size: 13px; font-family: Calibri, sans-serif; text-indent: -24px;"><b style="mso-bidi-font-weight:normal"><span style="font-size: 21px; line-height: 106%; font-family: &quot;Times New Roman&quot;, serif;"><span style="mso-list:Ignore">4.<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;
                    </span></span></span></b><b style="mso-bidi-font-weight:normal"><span style="font-size: 21px; line-height: 106%; font-family: &quot;Times New Roman&quot;, serif;">Dar conhecimento ao visado.</span></b></p>
    
                    <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 13px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
                    <p class="MsoNormal" style="margin: 0in 0in 0in 65px; font-size: 13px; font-family: Calibri, sans-serif; text-indent: -24px;"><b style="mso-bidi-font-weight:normal"><span style="font-size: 21px; line-height: 106%; font-family: &quot;Times New Roman&quot;, serif;"><span style="mso-list:Ignore">5.<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;
                    </span></span></span></b><b style="mso-bidi-font-weight:normal"><span style="font-size: 21px; line-height: 106%; font-family: &quot;Times New Roman&quot;, serif;">CUMPRA-SE.</span></b></p>
    
                    <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 13px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
        
                    <p class="MsoNormal" style="margin: 0in 0in 0in 17px; font-size: 13px; font-family: Calibri, sans-serif;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">Praia, ${convertDateToPT(dataagora)?.dia
        } de ${convertDateToPT(dataagora)?.mes} de ${convertDateToPT(dataagora)?.ano
        }</span></p>
                                
                            
                `;
      seteditorcontent(parecerEdit);
    }
  }

  const [PR_DECISAO_TP_ID_D, setPR_DECISAO_TP_ID_D] = useState("");
  const [PR_EXCLUSAO_PERIODO_ID_D, setPR_EXCLUSAO_PERIODO_ID_D] = useState("");
  const [REFERENCIA_D, setREFERENCIA_D] = useState("");
  const [DATA_D, setDATA_D] = useState("");
  const [DT_INICIO_D, setDT_INICIO_D] = useState("");
  const [DT_FIM_D, setDT_FIM_d] = useState("");
  const [PROCESSO_AUTOEXCLUSAO_ID_D, setPROCESSO_AUTOEXCLUSAO_ID_D] =
    useState("");
  const [CODIGO_D, setCODIGO_D] = useState("");
  const [itemSelectedEdit, setitemSelectedEdit] = useState("");
  const [despachotipo, setdespachotipo] = useState("");
  const [DATA_REGISTO, setDATA_REGISTO] = useState("");
  const [DATA_PEDIDO, setDATA_PEDIDO] = useState("");

  const [entidade, setEntidade] = useState("");
  const [isGeneratingPdf, setisGeneratingPdf] = useState(false);

  let dataagora = new Date().toISOString().substring(0, 10);

  const openDespacho = async (idx) => {
    setPROCESSO_AUTOEXCLUSAO_ID_D(idx.id);


    setPR_DECISAO_TP_ID_D("");
    setCODIGO_D("*");
    setPR_EXCLUSAO_PERIODO_ID(idx.PR_EXCLUSAO_PERIODO_ID);
    setPR_EXCLUSAO_PERIODO_ID_D(idx.PR_EXCLUSAO_PERIODO_ID);
    setREFERENCIA_D("");
    // setDATA_D(
    //   createDate2(idx.sgigjprocessodespacho[0].DATA)
    // );
    setDATA_D(createDate2(idx.DT_REGISTO));
    setDATA_REGISTO(createDate2(idx.DT_REGISTO))
    setDT_INICIO(createDate2(idx.DT_INICIO));
    setDT_FIM(createDate2(idx.DT_FIM));
    setEntidade(idx.sgigjentidade.DESIG)
    setitemSelectedEdit(idx);
    // let periodo = periodolist
    //   .find((e) => e.ID === idx.PR_EXCLUSAO_PERIODO_ID).DESIG
    // console.log(periodo)
    setDATA_PEDIDO(idx.DATA)
    setPeriodoDesignacao(idx.sgigjprexclusaoperiodo.DESIG)
    dataagora = new Date("2021-01-01");

    console.log(idx);

    parecerEdit = ``;
    try {
      const response = await api.get("/sgigjprocessoautoexclusao/" + idx.id);

      if (response.status == "200") {
        if (response.data.length > 0) {
          if (response.data[0].sgigjprocessodespacho.length > 0) {
            setPR_DECISAO_TP_ID_D(
              response.data[0].sgigjprocessodespacho[0].PR_DECISAO_TP_ID
            );
            setPR_EXCLUSAO_PERIODO_ID_D(
              response.data[0].sgigjprocessodespacho[0].PR_EXCLUSAO_PERIODO_ID
            );
            setREFERENCIA_D(
              response.data[0].sgigjprocessodespacho[0].REFERENCIA
            );
            setCODIGO_D(response.data[0].REF);
            setDATA_D(
              createDate2(response.data[0].sgigjprocessodespacho[0].DATA)
            );
            setDT_INICIO_D(
              createDate2(response.data[0].sgigjprocessodespacho[0].DATA_INICIO)
            );
            setDT_FIM_d(
              createDate2(response.data[0].sgigjprocessodespacho[0].DATA_FIM)
            );

            parecerEdit = response.data[0].sgigjprocessodespacho[0].DESPACHO;
          }
        }

      }

      seteditorcontent(parecerEdit);
      console.log(parecerEdit);

    } catch (err) {
      console.error(err.response);
    }

    setisDepachoopen(true);
    // setIsEditarOpen(false);
    // setVerOpen(false);
    // setIsOpen(false);


  };

  async function criarDespacho(event) {

    event.preventDefault();
    setIsLoading(true)
    const upload = {
      PR_DECISAO_TP_ID: PR_DECISAO_TP_ID_D,
      PR_EXCLUSAO_PERIODO_ID: PR_EXCLUSAO_PERIODO_ID,
      REFERENCIA: REFERENCIA_D,
      DATA: DATA_D,
      DATA_INICIO: DT_INICIO,
      DATA_FIM: DT_FIM,
      DESPACHO: editorREF?.current?.value,
      ESTADO: "1",
      TIPO: despachotipo,
    };

    console.log(parecerEdit);

    console.log(upload);

    console.log(editorREF?.current);
    console.log(editorREF?.current?.value);

    try {
      const response = await api.put(
        `/sgigjprocessoautoexclusao/${PROCESSO_AUTOEXCLUSAO_ID_D}/despacho`,
        upload
      );

      if (response.status == "200") {
        toast.success('Despasho Guardado!', { duration: 4000 })

        localStorage.setItem("showAlert", false)

        uploadlist();
      }
      if (despachotipo === "CONCLUIR") {
        setIsLoading(false)
        setisDepachoopen(false);
      } else {
        toast.success('Todos os dados foram atualizadas com sucesso!', { duration: 4000 })
        setIsLoading(false)

      }

    } catch (err) {
      setIsLoading(false)
      console.error(err.response);
    }
  }

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Body>
              <Table uploadList={uploadlist} saveExcel={saveExcel} columns={columns} data={newdata} modalOpen={openHandler} uploadpessoa={uploadpessoa} />
            </Card.Body>
          </Card>

          {/* --------------------Criar Item------------------- */}

          <Modal backdrop="static" size="xl" show={isOpen} onHide={() => setIsOpen(false)}>
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
                  Autoexclusão
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
              <Col
                style={{ display: "flex", justifyContent: "flex-end" }}
                sm={12}
              >
                <Button onClick={() => addnovosdocumentos()} variant="primary">
                  +
                </Button>
              </Col>

              {novosdocumentos.map((eq, index) => (
                <Row style={{ marginBottom: "12px" }} key={eq.id}>
                  <Col sm={10}>
                    <Row>
                      <Col sm={6}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Phone">
                            Tipo de Documentos{" "}
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <select
                            onChange={(event) => {
                              criartipodoc(event.target.value, eq.id);
                            }}
                            className="form-control"
                            id="perfil"
                            required
                            aria-required="true"
                          >
                            <option hidden value="">
                              --- Selecione ---
                            </option>

                            {documentolist.map((e) => (
                              <option key={e.ID} value={e.ID}>
                                {e.DESIG}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="text">
                            Número <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            required
                            onChange={(event) => {
                              criardocnum(event.target.value, eq.id);
                            }}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </Col>

                      <div className="col-sm-3  paddinhtop28OnlyPC">
                        <label
                          htmlFor={"anexarcriar" + eq.id}
                          className="btn"
                          style={{ backgroundColor: "#d2b32a", color: "#fff" }}
                        >
                          {eq?.anexo?.file == null ? (
                            <>
                              <i className="feather icon-download" />
                              <>{" Anexar"}</>
                            </>
                          ) : (
                            "Anexado"
                          )}{" "}
                        </label>
                        <input
                          id={"anexarcriar" + eq.id}
                          onChange={(event) =>
                            criaranexo(event.target.files[0], eq.id)
                          }
                          accept="image/x-png,image/jpeg"
                          style={{ display: "none" }}
                          type="file"
                        />
                        <Form.Check style={{ marginLeft: "27px", display: "inline-block" }} type="radio" onChange={(event) =>
                          handleSetDocument(event.target.value, index)
                        } name={`radio`} aria-label="radio 1" label="Usar este" />
                      </div>
                      {/* <div className="col-sm-1 d-flex  justify-content-center">
                      
                      </div> */}
                      <Col sm={6}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="date">
                            Data de Emissão                             <span style={{ color: "red" }}>*</span>

                          </label>
                          <input

                            onChange={(event) => {
                              criardocdataE(event.target.value, eq.id);
                            }}
                            type="date"
                            className="form-control"
                          />
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="text">
                            Data de Validade                             <span style={{ color: "red" }}>*</span>

                          </label>
                          <input

                            onChange={(event) => {
                              criardocdataV(event.target.value, eq.id);
                            }}
                            type="date"
                            className="form-control"
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>

                  {novosdocumentos.length > 1 ? (
                    <div className="paddinhtop66OnlyPC sm-2">
                      <Button
                        onClick={() => removenovosdocumentos(eq.id)}
                        variant="danger"
                      >
                        <i className="feather icon-trash-2" />
                      </Button>
                    </div>
                  ) : null}
                </Row>
              ))}
            </Modal.Body>

            <Modal.Body
              style={activeProfileTab === "dados" ? {} : { display: "none" }}
            >
              <form id="criarItem" onSubmit={criarItemGO}>
                <Row>
                  <Col sm={3}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name"></label>
                      <input
                        accept="image/x-png,image/jpeg"
                        onChange={(event) => setThumnail(event.target.files[0])}
                        style={
                          thumnail
                            ? {
                              width: "100%",
                              backgroundImage: "url(" + preview + ")",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }
                            : { width: "100%" }
                        }
                        type="file"
                        id="input-file-now"
                        className="file-upload perfil_img_lingua-none"
                      />
                    </div>
                  </Col>

                  <Col sm={9}>
                    <Row>
                      <Col sm={3}>
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

                      <Col sm={9}>
                        <label className="floating-label" htmlFor="text">
                          Frequentador <span style={{ color: "red" }}>*</span>
                        </label>
                        <div style={{ display: "flex" }}>
                          <div
                            className="form-group fill"
                            style={{ width: "100%" }}
                          >
                            <Select
                              className="basic-single"
                              classNamePrefix="select"
                              onChange={(event) => setPESSOA_ID(event.value)}
                              name="pessoa"
                              options={pessoalist}
                              defaultValue={PESSOA_ID}
                              required
                              menuPlacement="auto"
                              menuPosition="fixed"
                              placeholder="Frequentador..."
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
                      <Col sm={3}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Name">
                            Data Pedido <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            type="date"
                            onChange={(event) => {
                              setDATA(event.target.value);
                            }}
                            defaultValue={DATA}
                            max={todayDate}
                            className="form-control"
                            placeholder="Data..."
                            required
                          />
                        </div>
                      </Col>
                      <Col sm={9}>
                        <label className="floating-label" htmlFor="text">
                          Entidade <span style={{ color: "red" }}>*</span>
                        </label>
                        <div style={{ display: "flex" }}>
                          <div
                            className="form-group fill"
                            style={{ width: "100%" }}
                          >
                            <Select
                              className="basic-single"
                              classNamePrefix="select"
                              onChange={(event) => setENTIDADE_ID(event.value)}
                              name="entidade"
                              options={entidadelist}
                              defaultValue={ENTIDADE_ID}
                              required
                              menuPlacement="auto"
                              menuPosition="fixed"
                              placeholder="Entidade..."
                            />
                          </div>

                          {/*<Button
                            onClick={() => openentidadefunction()}
                            style={{ marginLeft: "8px", height: "38px" }}
                            variant="primary"
                          >
                            <i className="feather icon-plus" />
                          </Button>*/}
                        </div>
                      </Col>

                      <Col sm={6}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Name">
                            Profissão <span style={{ color: "red" }}>*</span>
                          </label>

                          <select
                            onChange={(event) => {
                              setPR_PROFISSAO_ID(event.target.value);
                            }}
                            defaultValue={PR_PROFISSAO_ID}
                            className="form-control"
                            id="pessoa"
                            required
                            aria-required="true"
                          >
                            <option hidden value="">
                              --- Selecione ---
                            </option>

                            {profissaolist.map((e) => (
                              <option key={e.ID} title={e.CODIGO} value={e.ID}>
                                {e.DESIG}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>


                      <Col sm={6}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Name">
                            Motivo Exclusão{" "}
                            <span style={{ color: "red" }}>*</span>
                          </label>

                          <select
                            onChange={(event) => {
                              setPR_MOTIVO_ESCLUSAO_TP_ID(event.target.value);
                            }}
                            defaultValue={PR_MOTIVO_ESCLUSAO_TP_ID}
                            className="form-control"
                            id="pessoa"
                            required
                            aria-required="true"
                          >
                            <option hidden value="">
                              --- Selecione ---
                            </option>

                            {motivoesclusaolist.map((e) => (
                              <option key={e.ID} title={e.CODIGO} value={e.ID}>
                                {e.DESIG}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Address">
                            Concelho de nascimento do frequentador <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            className="form-control"
                            onChange={(event) => {
                              setCONCELHO(event.target.value);
                            }}
                            defaultValue={CONCELHO}
                            placeholder="Concelho..."
                            required
                          />
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Address">
                            Freguesia de nascimento do frequentador <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            className="form-control"
                            onChange={(event) => {
                              setFREGUESIA(event.target.value);
                            }}
                            defaultValue={FREGUESIA}
                            placeholder="Freguesia..."
                            required
                          />
                        </div>
                      </Col>


                      <Col sm={4}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Name">
                            Período Exclusão{" "}
                            <span style={{ color: "red" }}>*</span>
                          </label>

                          <select
                            onChange={(event) => {
                              dais_exclusaoMaker(event.target.value);
                            }}
                            defaultValue={PR_EXCLUSAO_PERIODO_ID}
                            className="form-control"
                            id="pessoa"
                            required
                            aria-required="true"
                          >
                            <option hidden value="">
                              --- Selecione ---
                            </option>

                            {periodolist.map((e) => (
                              <option
                                key={e.ID}
                                title={e.CODIGO}
                                value={e.ID + ";:;" + e.NUM_DIAS}
                              >
                                {e.DESIG}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>

                      <Col sm={4}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Name">
                            Data Início <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            type="date"
                            onChange={(event) => {
                              setEndDate(event.target.value)
                            }}
                            defaultValue={DT_INICIO}
                            className="form-control"
                            placeholder="Data..."
                            max="2050-12-31"
                            required
                          />
                        </div>
                      </Col>

                      <Col sm={4}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Name">
                            Data Fim{" "}
                          </label>
                          <input
                            type="date"
                            value={DT_FIM}
                            className="form-control"
                            placeholder="Data..."

                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>

                  <div className="col-sm-6">
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Address">
                        Descrição <span style={{ color: "red" }}>*</span>
                      </label>
                      <textarea
                        className="form-control"
                        maxLength="64000"
                        onChange={(event) => {
                          setDESCR(event.target.value);
                        }}
                        defaultValue={DESCR}
                        rows="3"
                        placeholder="Descrição..."
                        required
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
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
                        defaultValue={OBS}
                        rows="3"
                        placeholder="Observação..."
                      />
                    </div>
                  </div>
                </Row>
              </form>
            </Modal.Body>

            <Modal.Footer>
              {/* <Button variant="danger" onClick={() => setIsOpen(false)}>
                Fechar
              </Button> */}
              {urlDOC != null ? (
                <a href={urlDOC + "?alt=media&token=0"} target="_blank">
                  {" "}
                  <Button variant="primary">Abrir documento</Button>
                </a>
              ) : null}
              {hasDOC &&
                <>
                  {!isLoading ? <Button type="submit" form="criarItem" variant="primary">Guardar</Button> : <Button variant="primary">Guardando</Button>}

                </>
              }
              {!hasDOC && !isGeneratingPdf ? (
                <Button type="submit" form="criarItem" variant="primary">
                  Gerar DOC
                </Button>
              ) : ""
              }

              {isGeneratingPdf &&
                <Button variant="primary">
                  Gerando PDF
                </Button>
              }
            </Modal.Footer>
          </Modal>

          {/* --------------------Editar Item------------------- */}

          <Modal
            size="xl"
            show={isEditarOpen}
            backdrop="static"
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
                  Autoexclusão
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
              <Col
                style={{ display: "flex", justifyContent: "flex-end" }}
                sm={12}
              >
                <Button onClick={() => addnovosdocumentos()} variant="primary">
                  +
                </Button>
              </Col>

              {novosdocumentos.map((eq, index) => (
                <Row style={{ marginBottom: "12px" }} key={eq.id}>
                  <Col sm={10}>
                    <Row>
                      <Col sm={6}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Phone">
                            Tipo de Documentos{" "}
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <select
                            defaultValue={eq.tipodocumento}
                            onChange={(event) => {
                              criartipodoc(event.target.value, eq.id);
                            }}
                            className="form-control"
                            id="perfil"
                            required
                            aria-required="true"
                          >
                            <option hidden value="">
                              --- Selecione ---
                            </option>

                            {documentolist.map((e) => (
                              <option key={e.ID} value={e.ID}>
                                {e.DESIG}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="text">
                            Número <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            required
                            defaultValue={eq.numero}
                            onChange={(event) => {
                              criardocnum(event.target.value, eq.id);
                            }}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </Col>

                      <div className="col-sm-3 d-flex paddinhtop28OnlyPC">
                        <label
                          htmlFor={"anexareditar" + eq.id}
                          className="btn"
                          style={{ backgroundColor: "#d2b32a", color: "#fff" }}
                        >
                          {eq?.anexo?.file == null ? (
                            <>
                              <i className="feather icon-download" />
                              <>{" Anexar"}</>
                            </>
                          ) : (
                            "Anexado"
                          )}{" "}
                        </label>
                        <input
                          id={"anexareditar" + eq.id}
                          style={{ display: "none" }}
                          onChange={(event) =>
                            criaranexo(event.target.files[0], eq.id)
                          }
                          accept="image/x-png,image/jpeg"
                          type="file"
                        />
                        <Form.Check disabled defaultChecked={eq.main === 1} style={{ marginLeft: "27px", display: "inline-block" }} type="radio" onChange={(event) =>
                          handleSetDocument(event.target.value, index)
                        } name={`radio`} aria-label="radio 1" label="Usar este" />
                      </div>

                      <Col sm={6}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="date">
                            Data de Emissão                            <span style={{ color: "red" }}>*</span>

                          </label>
                          <input

                            defaultValue={eq.dataemissao}
                            onChange={(event) => {
                              criardocdataE(event.target.value, eq.id);
                            }}
                            type="date"
                            className="form-control"
                          />
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="text">
                            Data de Validade                             <span style={{ color: "red" }}>*</span>

                          </label>
                          <input

                            defaultValue={eq.datavalidade}
                            onChange={(event) => {
                              criardocdataV(event.target.value, eq.id);
                            }}
                            type="date"
                            className="form-control"
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>

                  {novosdocumentos.length > 1 ? (
                    <div className="paddinhtop66OnlyPC sm-2">
                      <Button
                        onClick={() => removenovosdocumentos(eq.id)}
                        variant="danger"
                      >
                        <i className="feather icon-trash-2" />
                      </Button>
                    </div>
                  ) : null}
                </Row>
              ))}
            </Modal.Body>

            <Modal.Body
              style={activeProfileTab === "dados" ? {} : { display: "none" }}
            >
              <form id="editarItem" onSubmit={editarItemGO}>
                <Row>
                  <Col sm={3}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name"></label>
                      <input
                        accept="image/x-png,image/jpeg"
                        onChange={(event) =>
                          setThumnail2(event.target.files[0])
                        }
                        style={
                          thumnail2
                            ? {
                              width: "100%",
                              backgroundImage: "url(" + preview2 + ")",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }
                            : {
                              width: "100%",
                              backgroundImage:
                                "url(" +
                                itemSelected.URL_FOTO +
                                "?alt=media&token=0)",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }
                        }
                        type="file"
                        id="input-file-now"
                        className="file-upload perfil_img_lingua-none"
                      />
                    </div>
                  </Col>

                  <Col sm={9}>
                    <Row>
                      <Col sm={3}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Name">
                          Referência <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            disabled
                            type="text"
                            className="form-control"
                            id="Name"
                            value={itemSelected.REF}
                            required
                          />
                        </div>
                      </Col>

                      <Col sm={9}>
                        <label className="floating-label" htmlFor="text">
                          Frequentador <span style={{ color: "red" }}>*</span>
                        </label>
                        <div style={{ display: "flex" }}>
                          <div
                            className="form-group fill"
                            style={{ width: "100%" }}
                          >
                            <Select
                              className="basic-single"
                              classNamePrefix="select"
                              onChange={(event) => setPESSOA_ID(event.value)}
                              name="pessoa"
                              options={pessoalist}
                              defaultValue={pessoalist.map((p) =>
                                p.ID == PESSOA_ID ? p : null
                              )}
                              required
                              menuPlacement="auto"
                              menuPosition="fixed"
                              placeholder="Frequentador..."
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
                      <Col sm={3}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Name">
                            Data Pedido <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            type="date"
                            onChange={(event) => {
                              setDATA(event.target.value);
                            }}
                            defaultValue={DATA}
                            className="form-control"
                            placeholder="Data..."
                            required
                          />
                        </div>
                      </Col>
                      <Col sm={9}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Name">
                            Entidade<span style={{ color: "red" }}>*</span>
                          </label>
                          <Select
                            className="basic-single"
                            classNamePrefix="select"
                            onChange={(event) => setENTIDADE_ID(event.value)}
                            name="entidade"
                            options={entidadelist}
                            defaultValue={entidadelist.map((p) =>
                              p.ID == ENTIDADE_ID ? p : null
                            )}
                            required
                            menuPlacement="auto"
                            menuPosition="fixed"
                            placeholder="Entidade..."
                          />
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Name">
                            Profissão <span style={{ color: "red" }}>*</span>
                          </label>

                          <select
                            onChange={(event) => {
                              setPR_PROFISSAO_ID(event.target.value);
                            }}
                            defaultValue={PR_PROFISSAO_ID}
                            className="form-control"
                            id="pessoa"
                            required
                            aria-required="true"
                          >
                            <option hidden value="">
                              --- Selecione ---
                            </option>

                            {profissaolist.map((e) => (
                              <option key={e.ID} title={e.CODIGO} value={e.ID}>
                                {e.DESIG}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>



                      <Col sm={6}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Name">
                            Motivo Exclusão{" "}
                            <span style={{ color: "red" }}>*</span>
                          </label>

                          <select
                            onChange={(event) => {
                              setPR_MOTIVO_ESCLUSAO_TP_ID(event.target.value);
                            }}
                            defaultValue={PR_MOTIVO_ESCLUSAO_TP_ID}
                            className="form-control"
                            id="pessoa"
                            required
                            aria-required="true"
                          >
                            <option hidden value="">
                              --- Selecione ---
                            </option>

                            {motivoesclusaolist.map((e) => (
                              <option key={e.ID} title={e.CODIGO} value={e.ID}>
                                {e.DESIG}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Address">
                            Concelho de nascimento do frequentador <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            className="form-control"
                            onChange={(event) => {
                              setCONCELHO(event.target.value);
                            }}
                            defaultValue={CONCELHO}
                            placeholder="Concelho..."
                            required
                          />
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Address">
                            Freguesia de nascimento do frequentador <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            className="form-control"
                            onChange={(event) => {
                              setFREGUESIA(event.target.value);
                            }}
                            defaultValue={FREGUESIA}
                            placeholder="Freguesia..."
                            required
                          />
                        </div>
                      </Col>
                      <Col sm={4}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Name">
                            Período Exclusão{" "}
                            <span style={{ color: "red" }}>*</span>
                          </label>

                          <select
                            onChange={(event) => {
                              dais_exclusaoMaker(event.target.value);
                            }}
                            defaultValue={
                              PR_EXCLUSAO_PERIODO_ID +
                              ";:;" +
                              itemSelected?.sgigjprexclusaoperiodo?.NUM_DIAS
                            }
                            className="form-control"
                            id="pessoa"
                            required
                            aria-required="true"
                          >
                            <option hidden value="">
                              --- Selecione ---
                            </option>

                            {periodolist.map((e) => (
                              <option
                                key={e?.ID}
                                title={e?.CODIGO}
                                value={e?.ID + ";:;" + e.NUM_DIAS}
                              >
                                {e?.DESIG}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>

                      <Col sm={4}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Name">
                            Data Início <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            type="date"
                            onChange={(event) => {
                              setDT_INICIO(event.target.value);
                            }}
                            defaultValue={DT_INICIO}
                            max="2050-12-31"
                            className="form-control"
                            placeholder="Data..."
                            required
                          />
                        </div>
                      </Col>

                      <Col sm={4}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Name">
                            Data Fim{" "}
                          </label>
                          <input
                            type="date"
                            value={DT_FIM}
                            className="form-control"
                            placeholder="Data..."
                            required
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>

                  <div className="col-sm-6">
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Address">
                        Descrição <span style={{ color: "red" }}>*</span>
                      </label>
                      <textarea
                        className="form-control"
                        maxLength="64000"
                        onChange={(event) => {
                          setDESCR(event.target.value);
                        }}
                        defaultValue={DESCR}
                        rows="3"
                        placeholder="Descrição..."
                        required
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
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
                        defaultValue={OBS}
                        rows="3"
                        placeholder="Observação..."
                      />
                    </div>
                  </div>
                </Row>
              </form>
            </Modal.Body>
            <Modal.Footer>
              {!isLoading ? <Button type="submit" form="editarItem" variant="primary">Guardar</Button> : <Button variant="primary">Guardando</Button>}

              {/* <a href={urlDOC + "?alt=media&token=0"} target="_blank">
                {" "}
                <Button variant="primary">Abrir documento</Button>
              </a> */}
            </Modal.Footer>
          </Modal>

          {/* --------------------Ver Item------------------- */}

          <Modal size="xl" show={isVerOpen} onHide={() => setVerOpen(false)}>
            <Modal.Header style={{ border: "0" }} closeButton>
              <Modal.Title as="h5">Autoexclusão</Modal.Title>
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
                  Dados
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

              {itemSelected?.processodespacho != null ? (
                <li className="nav-item">
                  <Link
                    to="#"
                    className={
                      activeProfileTab === "despacho"
                        ? profileTabActiveClass
                        : profileTabClass
                    }
                    onClick={() => {
                      setActiveProfileTab("despacho");
                    }}
                    id="contact-tab"
                  >
                    <i className="feather icon-file-text mr-2" />
                    Despacho
                  </Link>
                </li>
              ) : null}
            </ul>

            <Modal.Body
              style={activeProfileTab === "despacho" ? {} : { display: "none" }}
            >
              <a
                href={itemSelected?.processodespacho + "?alt=media&token=0"}
                target="_blank"
                rel="noopener noreferrer"
              >

                <object data={`${itemSelected?.processodespacho + "?alt=media&token=0"}`} type="application/pdf" width="100%" height="450px">
                  <p>Alternative text - include a link <a href="myfile.pdf">to the PDF!</a></p>
                </object>

              </a>
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

                {/*
                                                    
                                                            <Link style={{margin:"2px"}} to='#' className="mb-1 text-muted d-flex align-items-end text-h-primary">::contrato_de_trabalho</Link>
                                                            <Link style={{margin:"2px"}} to='#' className="mb-1 text-muted d-flex align-items-end text-h-primary">::contrato</Link>
                                                            <Link style={{margin:"2px"}} to='#' className="mb-1 text-muted d-flex align-items-end text-h-primary">::contrato_de_trabalho</Link>
                                                            <Link style={{margin:"2px"}} to='#' className="mb-1 text-muted d-flex align-items-end text-h-primary">::contrato_de_trabalho</Link>
                                                    
                                                    */}
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


            </Modal.Body>

            <Modal.Body
              style={activeProfileTab === "dados" ? {} : { display: "none" }}
            >
              <Row>
                <Col sm={3}>
                  <div className="form-group fill">
                    <label className="floating-label" htmlFor="Name"></label>
                    <label
                      style={{
                        backgroundImage:
                          "url(" +
                          itemSelected.URL_FOTO +
                          "?alt=media&token=0)",
                        width: "100%",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      type="file"
                      id="input-file-now"
                      className="file-upload perfil_img_lingua-ver"
                      htmlFor="Name"
                    ></label>
                  </div>
                </Col>

                <Col sm={9}>
                  <Row>
                    <Col sm={3}>
                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="Name">
                        Referência
                        </label>
                        <input
                          readonly="readonly"
                          style={{ backgroundColor: "rgba(0,0,0,0.0)" }}
                          type="text"
                          className="form-control"
                          id="Name"
                          defaultValue={itemSelected.REF}
                          required
                        />
                      </div>
                    </Col>

                    <Col sm={9}>
                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="Name">
                          Frequentador
                        </label>

                        <input
                          readonly="readonly"
                          style={{ backgroundColor: "rgba(0,0,0,0.0)" }}
                          defaultValue={itemSelected.PESSOA2}
                          className="form-control"
                          placeholder="Data..."
                          required
                        />
                      </div>
                    </Col>
                    <Col sm={3}>
                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="Name">
                          Data Pedido
                        </label>
                        <input
                          type="date"
                          readonly="readonly"
                          style={{ backgroundColor: "rgba(0,0,0,0.0)" }}
                          defaultValue={DATA}
                          max={todayDate}
                          className="form-control"
                          placeholder="Data..."
                          required
                        />
                      </div>
                    </Col>
                    <Col sm={9}>
                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="Name">
                          Entidade
                        </label>
                        <input
                          readonly="readonly"
                          style={{ backgroundColor: "rgba(0,0,0,0.0)" }}
                          defaultValue={itemSelected.ENTIDADE}
                          className="form-control"
                          placeholder="Data..."
                          required
                        />
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="Name">
                          Profissão
                        </label>

                        <input
                          readonly="readonly"
                          style={{ backgroundColor: "rgba(0,0,0,0.0)" }}
                          type="text"
                          defaultValue={itemSelected.PROFISSAO}
                          className="form-control"
                          placeholder="Data..."
                          required
                        />
                      </div>
                    </Col>


                    <Col sm={6}>
                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="Name">
                          Motivo Exclusão
                        </label>

                        <input
                          readonly="readonly"
                          style={{ backgroundColor: "rgba(0,0,0,0.0)" }}
                          type="text"
                          defaultValue={itemSelected.MOTIVO}
                          className="form-control"
                          placeholder="Data..."
                          required
                        />
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="Address">
                          Concelho de nascimento do frequentador <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          style={{ backgroundColor: "rgba(0,0,0,0.0)" }}

                          readonly="readonly"
                          className="form-control"
                          onChange={(event) => {
                            setCONCELHO(event.target.value);
                          }}
                          defaultValue={CONCELHO}
                          placeholder="Concelho..."
                          required
                        />
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="Address">
                          Freguesia de nascimento do frequentador <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          style={{ backgroundColor: "rgba(0,0,0,0.0)" }}
                          readonly="readonly"
                          className="form-control"
                          onChange={(event) => {
                            setFREGUESIA(event.target.value);
                          }}
                          defaultValue={FREGUESIA}
                          placeholder="Freguesia..."
                          required
                        />
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="Name">
                          Período Exclusão
                        </label>

                        <input
                          readonly="readonly"
                          style={{ backgroundColor: "rgba(0,0,0,0.0)" }}
                          type="text"
                          defaultValue={itemSelected.PERIODO}
                          className="form-control"
                          placeholder="Data..."
                          required
                        />
                      </div>
                    </Col>

                    <Col sm={4}>
                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="Name">
                          Data Início
                        </label>
                        <input
                          readonly="readonly"
                          style={{ backgroundColor: "rgba(0,0,0,0.0)" }}
                          type="date"
                          defaultValue={DT_INICIO}
                          max="2050-12-31"
                          className="form-control"
                          placeholder="Data..."
                          required
                        />
                      </div>
                    </Col>

                    <Col sm={4}>
                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="Name">
                          Data Fim{" "}
                        </label>
                        <input
                          readonly="readonly"
                          style={{ backgroundColor: "rgba(0,0,0,0.0)" }}
                          type="date"
                          defaultValue={DT_FIM}
                          className="form-control"
                          placeholder="Data..."
                          required
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>

                <div className="col-sm-6">
                  <div className="form-group fill">
                    <label className="floating-label" htmlFor="Address">
                      Descrição
                    </label>
                    <textarea
                      readonly="readonly"
                      style={{ backgroundColor: "rgba(0,0,0,0.0)" }}
                      className="form-control"
                      maxLength="64000"
                      defaultValue={DESCR}
                      rows="3"
                      placeholder="Descrição..."
                      required
                    />
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form-group fill">
                    <label className="floating-label" htmlFor="Address">
                      Observação
                    </label>
                    <textarea
                      readonly="readonly"
                      style={{ backgroundColor: "rgba(0,0,0,0.0)" }}
                      className="form-control"
                      maxLength="64000"
                      defaultValue={OBS}
                      rows="3"
                      placeholder="Observação..."
                    />
                  </div>
                </div>
              </Row>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
              <span>Registado por: {createBy}</span>
              <a href={urlDOC + "?alt=media&token=0"} target="_blank">
                {" "}
                <Button variant="primary">Abrir documento</Button>
              </a>
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

          {/* --------------------Despacho------------------- */}

          <Modal
            size="xl"
            show={isDepachoopen}
            backdrop="static"
            onHide={() => setisDepachoopen(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title as="h5">Despacho</Modal.Title>
            </Modal.Header>
            <Modal.Body className="newuserbox">
              <form id="criarDespacho" onSubmit={criarDespacho}>
                <Row>
                  <Col sm={2}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                      Referência <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        disabled
                        type="text"
                        className="form-control"
                        id="Name"
                        value={CODIGO_D}
                        required
                      />
                    </div>
                  </Col>

                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Decisão <span style={{ color: "red" }}>*</span>
                      </label>
                      <select
                        onChange={(event) => {
                          setPR_DECISAO_TP_ID_D(event.target.value);
                        }}
                        defaultValue={PR_DECISAO_TP_ID_D}
                        className="form-control"
                        id="pessoa"
                        required
                        aria-required="true"
                      >
                        <option hidden value="">
                          --- Selecione ---
                        </option>

                        {desicaolist.map((e) => (
                          <option key={e.ID} title={e.CODIGO} value={e.ID}>
                            {e.DESIG}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Col>

                  <Col sm={3}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Referência <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="number"
                        onChange={(event) => {
                          setREFERENCIA_D(event.target.value);
                        }}
                        defaultValue={REFERENCIA_D}
                        className="form-control"
                        placeholder="Referência..."
                        required
                      />
                    </div>
                  </Col>

                  <Col sm={3}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Data <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="date"
                        onChange={(event) => {
                          setDATA_D(event.target.value);
                        }}
                        defaultValue={DATA_D}
                        className="form-control"
                        placeholder="Data..."
                        required
                      />
                    </div>
                  </Col>

                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Período Exclusão <span style={{ color: "red" }}>*</span>
                      </label>

                      <select
                        onChange={(event) => {
                          dais_exclusaoMaker(event.target.value);
                        }}
                        defaultValue={
                          PR_EXCLUSAO_PERIODO_ID +
                          ";:;" +
                          periodolist
                            .filter((e) => e.ID == PR_EXCLUSAO_PERIODO_ID)
                            .map((e) => e.NUM_DIAS)
                        }
                        className="form-control"
                        id="pessoa"
                        required
                        aria-required="true"
                      >
                        <option hidden value="">
                          --- Selecione ---
                        </option>

                        {periodolist.map((e) => (
                          <option
                            key={e.ID}
                            title={e.CODIGO}
                            value={e.ID + ";:;" + e.NUM_DIAS}
                          >
                            {e.DESIG}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Col>

                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Data Início<span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="date"
                        onChange={(event) => {
                          setDT_INICIO(event.target.value);
                        }}
                        defaultValue={DT_INICIO}
                        max="2050-12-31"
                        className="form-control"
                        placeholder="Data..."
                        required
                      />
                    </div>
                  </Col>

                  <Col sm={4}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Data Fim<span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="date"
                        value={DT_FIM}
                        className="form-control"
                        placeholder="Data..."
                        required
                      />
                    </div>
                  </Col>

                  <Col sm={12}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Despacho
                      </label>

                      <JoditEditor
                        editorRef={setRef}
                        value={editorcontent}
                        config={{
                          readonly: false,
                        }}
                        ref={editorREF}
                        onChange={(event) => updateContent(event)}
                      />
                    </div>
                  </Col>
                </Row>
              </form>
            </Modal.Body>

            <Modal.Footer>

              <Button onClick={() => gerartextodespacho()} variant="primary">
                Gerar texto
              </Button>


              {!isLoading ? <Button
                onClick={() => setdespachotipo("SALVAR")}
                type="submit"
                form="criarDespacho"
                variant="primary"
              >
                Guardar
              </Button> : <Button variant="primary">Guardando</Button>}

              {!isLoading ? <Button
                onClick={() => setdespachotipo("CONCLUIR")}
                type="submit"
                form="criarDespacho"
                variant="primary"
              >
                Concluir
              </Button> : <Button variant="primary">Concluindo</Button>}
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Autoexclusao;
