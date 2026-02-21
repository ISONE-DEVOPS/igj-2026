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

import api from "../../../services/api";

import useAuth from "../../../hooks/useAuth";

import Select from "react-select";

import { useHistory, useParams } from "react-router-dom";

import {
  pageEnable,
  taskEnable,
  taskEnableIcon,
  taskEnableTitle,
  convertToPrice,
  makedate,
  formatCurrency, setParams, parseCurrency, sumValues
} from "../../../functions";

import CriarPessoa from "../../../components/Custom/CriarPessoa";
import Documentos from "../../../components/Custom/Documentoshorizontal";

const pageAcess = "/processos/handpay";

const columns2 = [
  { header: 'REFERÊNCIA', key: 'REF' },
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
  const params = useParams();
  const [ANO, setANO] = useState("")
  const [newFilter, setNewFilter] = useState("");

  var total
  if (data.length > 0) {
    const listValor = data.map(res => parseCurrency(res.VALOR2))
    total = sumValues(listValor)
  }

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
      exportPDFHandpay(globalFilter);
      resetForm()
    } else if (value === "2") {
      saveExcel();
      resetForm()
    }
  }
  function handleChangeAno(ano) {
    setANO(ano)
    uploadList(ano)
  }

  const handleGlobalFilterChange = (value) => {
    setNewFilter(value); // Update globalFilter state with the new value
  };
  async function exportPDFHandpay() {
    const ano = ANO === "" ? undefined : ANO
    const search = newFilter === "" ? undefined : newFilter

    try {

      const response = await api.get(`/sgigjhandpay/exportPdf?ENTIDADE_ID=${params.id}` + setParams([['ANO', ano], ["NOME", search]]), { responseType: "blob" })
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
        <Col md={3} className="d-flex align-items-center">
          <select
            onChange={event => { handleChangeAno(event.target.value) }}
            className="form-control"
            style={{ minWidth: '150px' }}
          >
            <option value="">Todos os anos</option>
            {Array.from({ length: new Date().getFullYear() - 2022 + 1 }, (_, i) => 2022 + i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </Col>
        <Col className='d-flex justify-content-end'>
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
                <th className={column.id === 'VALOR2'
                  ? 'text-right' : ''} {...column.getHeaderProps(column.getSortByToggleProps())}>
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
          <tr>
            <td className="merged-cell font-weight-bold" colspan="2">Total</td>
            <td className='font-weight-bold text-right'></td>
            <td className='font-weight-bold text-right'></td>
            {/* <td className='font-weight-bold'>{formatCurrency(totalArt48)}</td> */}
            <td className='font-weight-bold text-right'>{formatCurrency(total)}</td>
            {/* <td className='font-weight-bold'>{formatCurrency(totalArt49)}</td> */}
            <td className='font-weight-bold text-right'></td>
            <td></td>

          </tr>
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

const Handpay = () => {
  const params = useParams();

  const workbook = new Excel.Workbook();
  const { permissoes } = useAuth();
  const history = useHistory();

  const { popUp_removerItem, popUp_alertaOK } = useAuth();

  const columns = React.useMemo(
    () => [
      {
        Header: "Referência",
        accessor: "REF",
        centered: false
      },
      {
        Header: "Pessoa",
        accessor: "PESSOA2",
        centered: true
      },
      {
        Header: "Entidade",
        accessor: "sgigjentidade.DESIG",
        centered: true
      },
      {
        Header: "Nacionalidade",
        accessor: "nacionalidade",
        centered: true
      },
      {
        Header: "Valor",
        accessor: "VALOR2",
        centered: false
      },

      {
        Header: "Data",
        accessor: "DATA2",
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

  const [documentosgeral_item, setdocumentosgeral_item] = useState({
    ID: "",
    ENTIDADE: "HANDPAY_ID",
  });

  var exportEx = []
  newdata?.forEach((dat, i) => {
    exportEx.push({
      "REF": dat.REF,
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
    const headers = [["REFERÊNCIA", "PESSOA", "ENTIDADE", "VALOR", "DATA"]];

    const data = exportEx?.map(c => [c.REF, c.PESSOA2, c.ENTIDADE, c.VALOR2, c.DATA2]);

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

  //-------------------------- UPLOAD -----------------


  async function uploadlist(ano) {
    ano = ano === "" ? undefined : ano

    console.log(params)
    let response
    try {



      response = await api.get('/sgigjhandpay?ENTIDADE_ID=' + params.id + setParams([["ANO", ano]]));



      if (response.status == "200") {
        for (var i = 0; i < response.data.length; i++) {
          const idx = response.data[i].ID;

          response.data[i].id = response.data[i].ID;

          response.data[i].PESSOA2 = response.data[i].sgigjpessoa.NOME;
          response.data[i].nacionalidade = response.data[i].sgigjpessoa.nacionalidade.NACIONALIDADE;

          response.data[i].DATA2 = makedate(response.data[i].DATA);
          response.data[i].VALOR2 = formatCurrency(response.data[i].VALOR);

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

  async function uploadpessoa() {
    try {
      const response = await api.get("/sgigjpessoa");

      if (response.status == "200") {
        for (var i = 0; i < response.data.length; i++) {
          response.data[i].value = response.data[i].ID;
          response.data[i].label = response.data[i].NOME;
        }

        setpessoalist(response.data);
      }
    } catch (err) {
      console.error(err.response);
    }
  }
  // async function uploadEntidadeCasino() {
  //   try {
  //     const response = await api.get("/sgigjentidadecasino");

  //     if (response.status == "200") {
  //       var filtered = response.data.filter(function (el) {
  //         return el.sgigjprentidadetp.DESIG === "Casino";
  //       });

  //       for (var i = 0; i < filtered.length; i++) {
  //         filtered[i].value = response.data[i].ID;
  //         filtered[i].label = response.data[i].DESIG;
  //       }

  //       setentidadelist(filtered);
  //     }
  //   } catch (err) {
  //     console.error(err.response);
  //   }
  // }

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
    let newitemler = idx;

    setimgprev("");
    setActiveProfileTab("dados");

    try {
      const response = await api.get("/sgigjhandpay/" + idx.id);

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
    setitemSelected(idx);

    setPESSOA_ID(idx.PESSOA_ID);
    setENTIDADE_ID(idx.ENTIDADE_ID)
    setVALOR(idx.VALOR);
    setDATA(createDate2(idx.DATA));
    setDESCR(idx.DESCR);
    setOBS_INTERNA(idx.OBS_INTERNA);
    //setESTADO_C(idx.ID)

    try {
      const response3 = await api.get(
        "/sgigjreldocumento?HANDPAY_ID=" + idx.ID
      );

      if (response3.status == "200") {
        setdocumentosgeral_lista(response3.data);
      }
    } catch (err) {
      console.error(err.response3);
    }
  };

  async function editarItemGO(event) {
    event.preventDefault();

    if (PESSOA_ID == null || PESSOA_ID == "")
      popUp_alertaOK("Escolha uma Pessoa");

    else {
      setIsLoading(true)
      var anexofile = "";
      const img = thumnail ? await onFormSubmitImage(thumnail) : null;
      anexofile = img?.file?.data;
      const upload = {
        VALOR,
        DATA,
        DESCR,
        OBS_INTERNA,
        PESSOA_ID,

        FOTO: anexofile ? anexofile : itemSelected.FOTO,
        ENTIDADE_ID: params.id
      };
      try {
        const response = await api.put(
          "/sgigjhandpay/" + itemSelected.ID,
          upload
        );

        if (response.status == "200") {
          setdocumentosgeral_lista_save(!documentosgeral_lista_save);

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

    if (PESSOA_ID == null || PESSOA_ID == "")
      popUp_alertaOK("Escolha uma Pessoa");

    if (thumnail == null) {
      return popUp_alertaOK("Escolha uma imagem");
    }
    else {
      setIsLoading(true)
      var anexofile = "";
      const img = await onFormSubmitImage(thumnail);
      anexofile = img.file.data;
      console.log(params)
      const upload = {
        VALOR,
        DATA,
        DESCR,
        OBS_INTERNA,
        PESSOA_ID,

        FOTO: anexofile,
        ENTIDADE_ID: params.id
      };
      console.log(upload)

      try {
        const response = await api.post("/sgigjhandpay", upload);
        if (response.status == "200") {
          uploadlist()
          //console.log("response", response)
          setID_C(response.data.ID);
          setdocumentosgeral_lista_save(!documentosgeral_lista_save);
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
      const response = await api.delete("/sgigjhandpay/" + idx);
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

  useEffect(() => {
    if (typeof itemSelected.doclist != "undefined") {
      setimgprev(itemSelected?.doclist[0]?.url)
      selectedImg(itemSelected?.doclist[0])
    }    // if (pageEnable(pageAcess, permissoes) == false) history.push("/");
    // else {
    uploadlist();
    uploadpessoa();
    // uploadEntidadeCasino()

    uploadgenerolist();
    uploadestadocivil();
    uploadglbgeografia();
    uploadcontactolist();
    uploaddocumentolist();
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
                  Frequentador
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
              />
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
                        required
                        accept="image/x-png,image/jpeg"
                        onChange={(event) => setThumnail(event.target.files[0])}
                        style={thumnail ? { width: "100%", backgroundImage: 'url(' + preview + ')', backgroundSize: "cover", backgroundPosition: "center" } : { width: "100%", }}
                        // style={{ width: "100%" } }
                        type="file"
                        id="input-file-now"
                        className="file-upload perfil_img_lingua-nonehandpay"
                      />
                    </div>
                  </Col>
                  <Col sm={9}>
                    <Row>
                      <Col sm={4}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Name">
                            Referência <span style={{ color: "red" }}>*</span>
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

                      <Col sm={8}>
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
                              onChange={(event) => setPESSOA_ID(event.value)}
                              name="pessoa"
                              options={pessoalist}
                              defaultValue={pessoalist.map((p) =>
                                p.ID == PESSOA_ID ? p : null
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

                      <Col sm={6}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Name">
                            Valor <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            type="number"
                            min="1000"
                            step='0.01'
                            onChange={(event) => {
                              setVALOR(event.target.value);
                            }}
                            defaultValue={""}
                            className="form-control"
                            placeholder="Valor..."
                            required
                          />
                        </div>
                      </Col>

                      <Col sm={6}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Name">
                            Data <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            type="date"
                            max={todayDate}
                            onChange={(event) => {
                              setDATA(event.target.value);
                            }}
                            defaultValue={""}
                            className="form-control"
                            placeholder="Data..."
                            required
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  {/* 
                  <Col sm={12}>
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
                          name="pessoa"
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
                    </div>
                  </Col> */}
                  <div className="col-sm-12">
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
                        defaultValue={""}
                        rows="3"
                        placeholder="Descrição..."
                        required
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
                          setOBS_INTERNA(event.target.value);
                        }}
                        defaultValue={""}
                        rows="3"
                        placeholder="Observação..."
                      />
                    </div>
                  </div>
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
                  Frequentador
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
                item={{ ID: itemSelected.ID, ENTIDADE: "HANDPAY_ID" }}
              />
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
                        required
                        accept="image/x-png,image/jpeg"
                        onChange={(event) => setThumnail(event.target.files[0])}
                        style={thumnail ?
                          { width: "100%", backgroundImage: 'url(' + preview + ')', backgroundSize: "cover", backgroundPosition: "center" }
                          :
                          { width: "100%", backgroundImage: 'url(' + itemSelected.FOTO + "?alt=media&token=0" + ')', backgroundSize: "cover", backgroundPosition: "center" }}
                        // style={{ width: "100%" } }
                        type="file"
                        id="input-file-now"
                        className="file-upload perfil_img_lingua-nonehandpay"
                      />
                    </div>
                  </Col>
                  <Col sm={9}>
                    <Row>

                      <Col sm={4}>
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

                      <Col sm={8}>
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
                              onChange={(event) => setPESSOA_ID(event.value)}
                              name="pessoa"
                              options={pessoalist}
                              defaultValue={pessoalist.map((p) =>
                                p.ID == PESSOA_ID ? p : null
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

                      <Col sm={6}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Name">
                            Valor <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            type="number"
                            min="1000"
                            step='0.01'
                            max="999999999"
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

                      <Col sm={6}>
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Name">
                            Data <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            type="date"
                            max={todayDate}
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
                    </Row>
                  </Col>
                  {/* <div className="col-md-12">
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
                          defaultValue={entidadelist.map((p) =>
                            p.ID == ENTIDADE_ID ? p : null
                          )}
                          required
                          menuPlacement="auto"
                          menuPosition="fixed"
                          placeholder="Entidade..."
                        />
                      </div>
                    </div>
                  </div> */}
                  <div className="col-sm-12">
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
                        defaultValue={itemSelected.DESCR}
                        rows="3"
                        placeholder="Descrição..."
                        required
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
                          setOBS_INTERNA(event.target.value);
                        }}
                        defaultValue={itemSelected.OBS_INTERNA}
                        rows="3"
                        placeholder="Observação..."
                      />
                    </div>
                  </div>
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
              <Modal.Title as="h5">Hand Pay</Modal.Title>
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
                  Frequentador
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
              <Row style={{ width: "100%", overflow: "auto" }}>

                <Col sm={3}>
                  <div className="form-group fill">
                    <img
                      src={`${itemSelected.FOTO + "?alt=media&token=0"}`}
                      style={{ width: "100%", backgroundImage: 'url(' + itemSelected.FOTO + "?alt=media&token=0" + ')', backgroundSize: "cover", backgroundPosition: "center" }}
                      className="file-upload perfil_img_lingua-nonehandpay"
                    />

                  </div>
                </Col>
                <Col sm={9}>
                  <Row>
                    <Col sm={4}>
                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="Name"> Referência </label>
                        <span
                          style={{
                            overflow: "auto",
                            height: "auto",
                            minHeight: "33px",
                          }}
                          className="form-control"
                        >
                          {itemSelected.REF}
                        </span>
                      </div>
                    </Col>

                    <Col sm={8}>
                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="Name">
                          Pessoa
                        </label>
                        <span
                          style={{
                            overflow: "auto",
                            height: "auto",
                            minHeight: "33px",
                          }}
                          className="form-control"
                        >
                          {pessoalist.map((e) =>
                            e.ID == itemSelected.PESSOA_ID ? e.NOME : null
                          )}
                        </span>
                      </div>
                    </Col>

                    <Col sm={4}>
                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="Name">
                          Valor
                        </label>
                        <span
                          style={{
                            overflow: "auto",
                            height: "auto",
                            minHeight: "33px",
                          }}
                          className="form-control"
                        >
                          {convertToPrice(itemSelected.VALOR)}
                        </span>
                      </div>
                    </Col>

                    <Col sm={8}>
                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="Name">
                          Data
                        </label>
                        <span
                          style={{
                            overflow: "auto",
                            height: "auto",
                            minHeight: "33px",
                          }}
                          className="form-control"
                        >
                          {itemSelected.DATA2}
                        </span>
                      </div>
                    </Col>
                  </Row>
                </Col>
                {/* <div className="col-md-12">
                  <div className="form-group fill">
                    <label className="floating-label" htmlFor="Name">
                      Entidade
                    </label>
                    <span
                      style={{
                        overflow: "auto",
                        height: "auto",
                        minHeight: "33px",
                      }}
                      className="form-control"
                    >
                      {entidadelist.map((e) =>
                        e.ID == itemSelected.ENTIDADE_ID ? e.DESIG : null
                      )}
                    </span>
                  </div>
                </div> */}
                <div className="col-sm-12">
                  <div className="form-group fill">
                    <label className="floating-label" htmlFor="Address">
                      Descrição
                    </label>
                    <label
                      style={{
                        overflow: "auto",
                        height: "auto",
                        minHeight: "33px",
                      }}
                      className="form-control"
                    >
                      {itemSelected.DESCR}
                    </label>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="form-group fill">
                    <label className="floating-label" htmlFor="Address">
                      Observação
                    </label>
                    <label
                      style={{
                        overflow: "auto",
                        height: "auto",
                        minHeight: "33px",
                      }}
                      className="form-control"
                    >
                      {itemSelected.OBS_INTERNA}
                    </label>
                  </div>
                </div>
              </Row>

              <div style={{ display: "flex", gap: 10, justifyContent: "end", marginRight: "26px" }}>
                <div>
                  {itemSelected.URL_DOC !== null ? (
                    <a href={`${itemSelected.URL_DOC}?alt=media&token=0'`} target="_blank">
                      <Button variant="primary">Abrir documento</Button>
                    </a>
                  ) : (
                    <>
                      {loadGenerte ? (
                        <Button style={{ cursor: "not-allowed" }} type="submit" form="criarItem" variant="primary">
                          Aguarde ...
                        </Button>
                      ) : (
                        <Button onClick={() => gerarHandpay()} form="criarItem" variant="primary">
                          Imprimir
                        </Button>
                      )}
                    </>
                  )}
                </div>
                <div>
                  <Button variant="danger" onClick={() => setVerOpen(false)}>
                    Fechar
                  </Button>
                </div>
              </div>
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


            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-start">
              <span>Registado por: {itemSelected?.criadoPor?.sgigjrelpessoaentidade?.sgigjpessoa?.NOME}</span>

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
    </React.Fragment>
  );
};
export default Handpay;
