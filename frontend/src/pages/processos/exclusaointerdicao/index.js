import React, { useState, useEffect, useRef, useMemo } from "react";
import { Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { GlobalFilter } from "./GlobalFilter";

import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import { Pagination } from "react-bootstrap";

import BTable from "react-bootstrap/Table";

import Select from "react-select";

import api from "../../../services/api";

import useAuth from "../../../hooks/useAuth";

import { useHistory, useParams } from "react-router-dom";

import {
  pageEnable,
  taskEnable,
  taskEnableIcon,
  taskEnableTitle,
  createDateToInput,
  createDateToUser,
  convertDateToPT,
} from "../../../functions";

import CriarPessoa from "../../../components/Custom/CriarPessoa";

import Instrucao from "./Instrucao";
import DespachoInicial from "./DespachoInicial";

import DespachoFinal from "./DespachoFinal";
import Listfiles from "../../../components/Custom/Listfiles";

import JoditEditor from "jodit-react";

import Tempolimite from "./Tempolimite";
import TermoEncerramento from "./TermoEncerramento";

import StatusBadge from "../../../components/Custom/StatusBadge";
import ProcessoStepper from "../../../components/Custom/ProcessoStepper";
import ProcessoTimeline from "../../../components/Custom/ProcessoTimeline";
import AdvancedFilters from "./AdvancedFilters";
import '../processos.scss';

const pageAcess = "/processos/exclusaointerdicao";
function Table({ uploadList, columns, listAno,data, modalOpen }) {
  const [DATA_DE, setDATA_DE] = useState("");
  const [DATA_PARA, setDATA_PARA] = useState("");
  const tableRef = useRef(null);
  const { permissoes } = useAuth();
  const [values, setValues] = useState();

  // Advanced filters state
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeStatuses, setActiveStatuses] = useState([]);
  const [filterDateDe, setFilterDateDe] = useState("");
  const [filterDateAte, setFilterDateAte] = useState("");

  var filteredData = useMemo(function() {
    var result = data;
    if (activeStatuses.length > 0) {
      result = result.filter(function(row) {
        return activeStatuses.indexOf(row.colorx) !== -1;
      });
    }
    if (filterDateDe) {
      result = result.filter(function(row) {
        return row.DATA && row.DATA >= filterDateDe;
      });
    }
    if (filterDateAte) {
      result = result.filter(function(row) {
        return row.DATA && row.DATA <= filterDateAte;
      });
    }
    return result;
  }, [data, activeStatuses, filterDateDe, filterDateAte]);

  function handleStatusToggle(colorx) {
    setActiveStatuses(function(prev) {
      if (prev.indexOf(colorx) !== -1) {
        return prev.filter(function(s) { return s !== colorx; });
      }
      return prev.concat([colorx]);
    });
  }

  function handleClearFilters() {
    setActiveStatuses([]);
    setFilterDateDe("");
    setFilterDateAte("");
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
      data: filteredData,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const resetForm = () => {
    setValues("");
  };
  function filterDataInicio(e) {
    setDATA_DE(e);
    console.log(e);
    uploadList(e, DATA_PARA);
  }

  function handleChangeAno(e){
    uploadList(e);
  }

  function filterDataFim(e) {
    setDATA_PARA(e);
    uploadList(DATA_DE, e);
  }
  function reloadList() {
    setDATA_DE("");
    setDATA_PARA("");
    uploadList();
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
        </Col>
        <Col md={9} className="d-flex justify-content-end">
          {/* <div className="form-group fill">
              <label className="floating-label" htmlFor="Name">
                Data Início<span style={{ color: "red" }}>*</span>
              </label>
             
            </div> */}
          <div className="d-flex align-items-center mr-2">
            <div className="d-flex">
              <div className="d-flex align-items-center mr-1">
                <span className="floating-label" htmlFor="Name">
                  Ano:<span style={{ color: "red" }}>*</span>
                </span>
                <select
                  onChange={(event) => {
                    handleChangeAno(event.target.value);
                  }}
                  className="form-control"
                  id="perfil"
                  required
                  aria-required="true"
                >
                  <option value=""> Selecione um Ano </option>
                  {listAno.map((e) => (
                    // console.log("casas",e)
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>
              {/* <div className="d-flex align-items-center mr-1">
                <span className="floating-label" htmlFor="Name">
                  De:<span style={{ color: "red" }}>*</span>
                </span>
                <input
                  type="date"
                  onChange={(event) => {
                    filterDataInicio(event.target.value);
                  }}
                  value={DATA_DE}
                  max="2050-12-31"
                  className="form-control"
                  placeholder="Data Inicio"
                  required
                />
              </div> */}
              {/* <div className="d-flex align-items-center">
                <span className="floating-label" htmlFor="Name">
                  Para:<span style={{ color: "red" }}>*</span>
                </span>
                <input
                  onChange={(event) => {
                    filterDataFim(event.target.value);
                  }}
                  type="date"
                  value={DATA_PARA}
                  max="2050-12-31"
                  className="form-control"
                  placeholder="Data Fim"
                  required
                />
              </div> */}
            </div>
            {DATA_DE !== "" || DATA_PARA !== "" ? (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  reloadList();
                }}
                className="ml-2"
              >
                <i className="feather icon-x-circle" />
              </div>
            ) : (
              ""
            )}
          </div>
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />

          <div className="ml-2">
            <AdvancedFilters
              isOpen={isFiltersOpen}
              onToggle={function() { setIsFiltersOpen(!isFiltersOpen); }}
              activeStatuses={activeStatuses}
              onStatusToggle={handleStatusToggle}
              dataDe={filterDateDe}
              dataAte={filterDateAte}
              onDateDeChange={setFilterDateDe}
              onDateAteChange={setFilterDateAte}
              onClear={handleClearFilters}
            />
          </div>

          {taskEnable(pageAcess, permissoes, "Criar") == false ? null : (
            <Button
              variant="primary"
              className="btn-sm btn-round has-ripple ml-2"
              onClick={modalOpen}
            >
              <i className="feather icon-plus" /> Adicionar
            </Button>
          )}
        </Col>
      </Row>
      <BTable
        ref={tableRef}
        striped
        bordered
        hover
        responsive
        {...getTableProps()}
      >
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
                {row.cells.map((cell) => {
                  const isCentered = cell.column.centered;
                  return (
                    <td
                      {...cell.getCellProps()}
                      className={isCentered ? "text-center" : "text-right"}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
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

const ProcessoEmCurso = () => {
  const { permissoes, user, popUp_simnao } = useAuth();
  const params = useParams();

  const history = useHistory();

  const [instrucaoitem, setinstrucaoitem] = useState(null);

  const { popUp_removerItem, popUp_alertaOK } = useAuth();

  const [tipo_pedido, settipo_pedido] = useState("");
  var todayDate = new Date().toJSON().slice(0, 10);

  const [editorcontent, seteditorcontent] = useState("");
  const [isGuardandoClick, setGuardandoClick] = useState(false);
  const [isConcluindoClick, setConcluindoClick] = useState(false);

  let parecerEdit = "";

  const editorREF = useRef(null);
  const editorREFEdit = useRef(null);

  const setRef = (jodit) => {
    // control
  };

  const updateContent = (value) => {
    //seteditorcontent(value);
    parecerEdit = value;

    console.log(parecerEdit);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Estado",
        accessor: "COLOR_STATUS",
        centered: false,
      },

      {
        Header: "Referência",
        accessor: "REF",
        centered: false,
      },

      {
        Header: "Despacho",
        accessor: "TIPO_DESPACHO",
        centered: true,
      },

      {
        Header: "Entidade Decisora",
        accessor: "ENTIDADEREGISTO",
        centered: true,
      },

      {
        Header: "Pessoa",
        accessor: "PESSOAREGISTO",
        centered: true,
      },

      {
        Header: "Visado",
        accessor: "PESSOA",
        centered: true,
      },

      {
        Header: "Data",
        accessor: "DATA2",
        centered: true,
      },

      {
        Header: "Ações",
        accessor: "action",
        centered: true,
      },
    ],
    []
  );

  const [PESSOA_ID, setPESSOA_ID] = useState("");
  const [ENTIDADE_ID, setENTIDADE_ID] = useState("");
  const [DESCR, setDESCR] = useState("");
  const [OBS_IG, setOBS_IG] = useState("");
  const [listAno, setListAno] = useState([]);

  const [DATA, setDATA] = useState("");
  const [OBS, setOBS] = useState("");
  const [PESSOAS, setPESSOAS] = useState([]);

  const [itemSelected, setitemSelected] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [pessoalist, setpessoalist] = useState([]);

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

  const [decisaolist, setdecisaolist] = useState([]);

  async function uploaddecisaolist() {
    try {
      const response = await api.get("/sgigjprdecisaotp");

      if (response.status == "200") {
        setdecisaolist(response.data);
      }
    } catch (err) {
      console.error(err.response);
    }
  }

  const [entidadelist, setentidadelist] = useState([]);

  async function uploadentidadelist() {
    try {
      const response = await api.get("/sgigjentidade");

      if (response.status == "200") {
        setentidadelist(response.data);
      }
    } catch (err) {
      console.error(err.response);
    }
  }

  const [processoID_despachoInicial, setprocessoID_despachoInicial] =
    useState("");

  //-------------------------- UPLOAD -----------------

  const [newdata, setnewdata] = useState([]);

  async function uploadlist(ano) {
    let response;
    let anos = []
    try {
      if (ano) {
        response = await api.get(
          `/sgigjprocessoexclusao?ENTIDADE_ID=${params.id}&ano=${ano}`
        );
      } else {
        response = await api.get(
          `/sgigjprocessoexclusao?ENTIDADE_ID=${params.id}`
        );
      }
      if (response.status == "200") {
        console.log(response.data);
        for (var i = 0; i < response.data.length; i++) {
          const idx = response.data[i].ID;

          response.data[i].id = response.data[i].ID;

          response.data[i].DATA2 = createDateToUser(response.data[i].DATA);

          let date = new Date(response.data[i].DATA)
          if(date && !anos.includes(date.getFullYear())){
              anos.push(date.getFullYear())
          }

          response.data[i].PESSOA = response.data[i].sgigjrelinterveniente
            .map((e) => e.sgigjpessoa.NOME)
            .join(", ");

          response.data[i].ORIGEM = response.data[i].sgigjprorigemtp?.DESIG;

          response.data[i].PESSOAREGISTO =
            response.data[i].sgigjrelpessoaentidade?.sgigjpessoa?.NOME;
          response.data[i].ENTIDADEREGISTO =
            response.data[i]?.sgigjentidade?.DESIG;

          const itemx = response.data[i];

          let TIPO_DESPACHO = "";

          let colorx = "grey";
          let interrompido = false;

          try {
          const proc = response.data[i];
          const despacho = proc?.sgigjprocessodespacho?.[0];
          const instrutor = despacho?.sgigjrelprocessoinstrutor?.[0];
          const instrucao = instrutor?.sgigjrelprocessoinstrucao?.[0];
          const despFinal = proc?.sgigjdespachofinal?.[0];

          if (proc.ESTADO_ENCERRAMENTO == "ENCERRADO") {
            colorx = "black";

          } else if (proc?.sgigjprocessodespacho?.length > 0) {
            if (despacho?.TIPO_PROCESSO_EXCLUSAO == "I")
              TIPO_DESPACHO = "Inquérito";
            if (despacho?.TIPO_PROCESSO_EXCLUSAO == "C")
              TIPO_DESPACHO = "Contraordenação";
            if (despacho?.TIPO_PROCESSO_EXCLUSAO == "A")
              TIPO_DESPACHO = "Averiguação Sumária";

            if (despacho?.URL_DOC_GERADO != null)
              colorx = "green";

            if (instrutor?.sgigjrelprocessoinstrucao?.length > 0) {
              if (instrucao?.RELATORIO_FINAL != null) {
                colorx = "orange";
              }

              if (instrucao?.sgigjdespachointerrompido?.length > 0) {
                interrompido = true;
                const tipoInt = instrucao?.sgigjdespachointerrompido?.[0]?.TIPO;
                if (tipoInt == "A" || tipoInt == "P")
                  colorx = "blue";
              }
            }
          }

          // Despacho Decisão — aplica blue se concluído
          if (proc?.sgigjdespachofinal?.length > 0) {
            if (despFinal?.URL_DOC_GERADO != null && despFinal?.ESTADO != 0)
              colorx = "blue";
            TIPO_DESPACHO = "Despacho Decisão";
          }

          } catch (colorErr) {
            console.error("ERRO colorx processo:", response.data[i]?.ID, colorErr);
          }

          response.data[i].TIPO_DESPACHO = TIPO_DESPACHO;
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
                ( response.data[i].ESTADO_DEPACHO_INICIAL != "CONCLUIR" && <Link
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
                </Link>)
              )}
              {itemx.sgigjprocessodespacho[0]?.URL_DOC_GERADO != null &&
              itemx.sgigjprocessodespacho[0]?.URL_DOC_GERADO != "" &&
              taskEnable(pageAcess, permissoes, "DespachoFinal") == false
                ? null
                : colorx != "grey" && (
                    <Link
                      to="#"
                      title={taskEnableTitle(pageAcess, permissoes, "Despacho")}
                      onClick={() =>
                        window.open(
                          itemx.sgigjprocessodespacho[0]?.URL_DOC_GERADO +
                            "?alt=media&token=0"
                        )
                      }
                      className="text-primary mx-1"
                    >
                      <i className={"text-primary  feather icon-file-text"} />
                    </Link>
                  )}
              {taskEnable(pageAcess, permissoes, "DespachoFinal") == false
                ? null
                : colorx == "orange" && (
                    <Link
                      to="#"
                      // title={taskEnableTitle(
                      //   pageAcess,
                      //   permissoes,
                      //   "Despacho Decisao"
                      // )}
                      title="Despacho Decisao"
                      onClick={() => openDespachofinal(itemx)}
                      className="text-primary mx-1"
                    >
                      <i
                        style={{ cursor: "pointer" }}
                        className={
                          "text-primary " +
                          taskEnableIcon(pageAcess, permissoes, "DespachoFinal")
                        }
                      />
                    </Link>
                  )}

              {taskEnable(pageAcess, permissoes, "DespachoFinal") == false
                ? null
                : colorx == "orange" && (
                    <Link
                      to="#"
                      // title={taskEnableTitle(
                      //   pageAcess,
                      //   permissoes,
                      //   "Despacho Decisao"
                      // )}
                      title="Encerrar"


                      onClick={() => {
                        setprocesso_ID(itemx?.ID);
                        setinstrucao_ID(itemx?.sgigjprocessodespacho[0]?.sgigjrelprocessoinstrutor[0]?.sgigjrelprocessoinstrucao[0]?.ID)
                        setIsOpenEncerrar(true);
                      }}
                      className="text-primary mx-1"
                    >
                      <i
                        style={{ cursor: "pointer" }}
                        className={"text-primary feather icon-paperclip"}
                      />
                    </Link>
                  )}

              {taskEnable(pageAcess, permissoes, "DespachoInicial") == false
                ? null
                : colorx == "grey" &&  response.data[i].ESTADO_DEPACHO_INICIAL == "CONCLUIR" && (
                    <Link
                      to="#"
                      title={taskEnableTitle(
                        pageAcess,
                        permissoes,
                        "DespachoInicial"
                      )}
                      onClick={() => setprocessoID_despachoInicial(idx)}
                      className="text-primary mx-1"
                    >
                      <i
                        className={
                          "text-primary " +
                          taskEnableIcon(
                            pageAcess,
                            permissoes,
                            "DespachoInicial"
                          )
                        }
                      />
                    </Link>
                  )}

              {interrompido
                ? taskEnable(pageAcess, permissoes, "Interromper") == false
                  ? null
                  : (colorx == "green" || colorx == "orange") && (
                      <Link
                        to="#"
                        title={taskEnableTitle(
                          pageAcess,
                          permissoes,
                          "Interromper"
                        )}
                        onClick={() => openModalInterropidofinal(itemx)}
                        className="text-primary mx-1"
                      >
                        <i
                          className={
                            "text-primary " +
                            taskEnableIcon(pageAcess, permissoes, "Interromper")
                          }
                        />
                      </Link>
                    )
                : taskEnable(pageAcess, permissoes, "Instrucao") == false
                ? null
                : (colorx == "green" || colorx == "orange") && (
                    <Link
                      to="#"
                      title={taskEnableTitle(
                        pageAcess,
                        permissoes,
                        "Instrucao"
                      )}
                      onClick={() => openInstrucao(itemx)}
                      className="text-primary mx-1"
                    >
                      <i
                        className={
                          "text-primary " +
                          taskEnableIcon(pageAcess, permissoes, "Instrucao")
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

          {
            /*
                
                        grey -> red
                        green -> orange
                        orange -> yellow
                
                    */
          }

          response.data[i].colorx = colorx;

          response.data[i].COLOR_STATUS = <StatusBadge colorx={colorx} />;
        }

        var filtered = response.data.filter((el) => el.colorx != "blue" && el.colorx != "black");

        setnewdata(filtered);
      }

      if( listAno.length == 0)
          setListAno(anos)
    } catch (err) {
      console.error(err.response);
    }
  }

  //----------------------------------------

  //-------------- Ver -------------------------

  const [itemSelectedver, setitemSelectedver] = useState(null);

  const [itemlist, setitemlist] = useState({});

  const [verlistgp, setverlistgp] = useState("Despacho");

  const [itemVerID, setitemVerID] = useState("");

  const [isVerOpen, setVerOpen] = useState(false);

  const openVerHandler = async (idx) => {
    try {
      const response = await api.get("/sgigjprocessoexclusao/" + idx.id);

      if (response.status == "200") {
        if (response.data.length > 0) {
          response.data[0].id = response.data[0].ID;

          response.data[0].DATA2 = createDateToUser(response.data[0].DATA);

          response.data[0].PESSOA = response.data[0].sgigjrelinterveniente
            .map((e) => e.sgigjpessoa.NOME)
            .join(", ");

          response.data[0].ORIGEM = response.data[0].sgigjprorigemtp?.DESIG;

          response.data[0].PESSOAREGISTO =
            response.data[0].sgigjrelpessoaentidade?.sgigjpessoa?.NOME;
          response.data[0].ENTIDADEREGISTO =
            response.data[0]?.sgigjentidade?.DESIG;

          let despacho = null;
          let instrucao = null;
          let despachofinal = null;

          if (response.data[0].sgigjprocessodespacho.length > 0) {
            if (
              response.data[0].sgigjprocessodespacho[0].URL_DOC_GERADO != null
            )
              despacho = {
                DATA: createDateToUser(
                  response.data[0].sgigjprocessodespacho[0].DATA
                ),
                REFERENCIA:
                  response.data[0].sgigjprocessodespacho[0].REFERENCIA,
                PRAZO: response.data[0].sgigjprocessodespacho[0].PRAZO,
                OBS: response.data[0].sgigjprocessodespacho[0].OBS,
                DOC: response.data[0].sgigjprocessodespacho[0].URL_DOC_GERADO,
                INSTRUTOR: "",
              };

            if (
              response.data[0].sgigjprocessodespacho[0]
                .sgigjrelprocessoinstrutor.length > 0
            ) {
              despacho.INSTRUTOR =
                response.data[0].sgigjprocessodespacho[0].sgigjrelprocessoinstrutor[0].sgigjrelpessoaentidade?.sgigjpessoa?.NOME;

              if (
                response.data[0].sgigjprocessodespacho[0]
                  .sgigjrelprocessoinstrutor[0].sgigjrelprocessoinstrucao
                  .length > 0
              ) {
                instrucao = {
                  list: response.data[0].sgigjprocessodespacho[0]
                    .sgigjrelprocessoinstrutor[0].sgigjrelprocessoinstrucao[0]
                    .sgigjrelinstrutorpeca,
                };

                if (
                  response.data[0].sgigjprocessodespacho[0]
                    .sgigjrelprocessoinstrutor[0].sgigjrelprocessoinstrucao[0]
                    .sgigjprocessodespacho.length > 0
                ) {
                  if (
                    response.data[0].sgigjprocessodespacho[0]
                      .sgigjrelprocessoinstrutor[0].sgigjrelprocessoinstrucao[0]
                      .sgigjprocessodespacho[0].URL_DOC_GERADO != null
                  )
                    despachofinal = {
                      DOC: response.data[0].sgigjprocessodespacho[0]
                        .sgigjrelprocessoinstrutor[0]
                        .sgigjrelprocessoinstrucao[0].sgigjprocessodespacho[0]
                        .URL_DOC_GERADO,
                      DATA: createDateToUser(
                        response.data[0].sgigjprocessodespacho[0]
                          .sgigjrelprocessoinstrutor[0]
                          .sgigjrelprocessoinstrucao[0].sgigjprocessodespacho[0]
                          .DATA
                      ),
                      DESICAO:
                        response.data[0].sgigjprocessodespacho[0]
                          .sgigjrelprocessoinstrutor[0]
                          .sgigjrelprocessoinstrucao[0].sgigjprocessodespacho[0]
                          .sgigjprdecisaotp.TIPO,
                    };
                }
              }
            }
          }

          response.data[0].despacho = despacho;
          response.data[0].instrucao = instrucao;
          response.data[0].despachofinal = despachofinal;

          console.log(instrucao);

          response.data[0].colorx = idx.colorx;
          setitemSelectedver(response.data[0]);

          setVerOpen(true);

          console.log(response.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  //-----------------------------------------------'

  //-------------- EDITAR -------------------------

  const openEditHandler = (idx) => {
    setIsEditarOpen(true);
    setIsOpen(false);
    setVerOpen(false);
    setitemSelected(idx);

    setPESSOA_ID(idx.PESSOA_ID);
    setENTIDADE_ID(idx.ENTIDADE_ID);
    setDESCR(idx.DESCR);
    setDATA(createDateToInput(idx.DATA));
    seteditorcontent(idx.OBS);
    setOBS(idx.OBS);
  };

  async function editarItemGO(event,isConcluir=false) {
    event.preventDefault();
    setIsLoading(true);

    const upload = {
      PESSOAS: PESSOAS.map((e) => e.ID),
      DESCR,
      ENTIDADE_ID: params.id,
      DATA,
      OBS: editorREFEdit?.current?.value,
      ESTADO_DEPACHO_INICIAL: isConcluir ? "CONCLUIR" : "GUARDAR",
    };

    if (isConcluir) {
      setGuardandoClick(false);
      setConcluindoClick(true);
    } else {
      setGuardandoClick(true);
      setConcluindoClick(false);
    }

    console.log(upload);

    try {
      const response = await api.put(
        "/sgigjprocessoexclusao/" + itemSelected.ID,
        upload
      );

      if (response.status == "200") {
        toast.success("Documento Guardado!", { duration: 4000 });

        uploadlist();
        setIsLoading(false);
        setIsEditarOpen(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err.response);
    }
  }

  //----------------------------------------------

  //-------------- CRIAR -------------------------

  const openHandler = () => {
    setENTIDADE_ID("");

    if (
      user?.sgigjrelpessoaentidade?.sgigjentidade?.sgigjprentidadetp?.DESIG ==
      "Casino"
    ) {
      setENTIDADE_ID(user?.sgigjrelpessoaentidade?.sgigjentidade?.ID);
    }

    setIsOpen(true);
    setIsEditarOpen(false);
    setVerOpen(false);

    setPESSOA_ID("");
    setPESSOA_ID([]);
    setDESCR("");
    setDATA("");
    setOBS("");

    if (taskEnable(pageAcess, permissoes, "Criar_C") == false)
      settipo_pedido("N");
    else settipo_pedido("C");

    parecerEdit = `
        <p class="MsoNormal" align="center" style="margin: 0cm 0cm 8pt; line-height: 16.866667px; font-size: 11pt; font-family: Calibri, sans-serif; caret-color: rgb(0, 0, 0); color: rgb(0, 0, 0); font-style: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: auto; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration: none; text-align: center;"><strong><span lang="PT" style="font-size: 12pt; line-height: 18.4px; font-family: Cambria, serif;">${
          tipo_pedido == "C" ? "Comunicado" : "Auto de Noticia"
        }<o:p></o:p></span></strong></p>
        
        <p class="MsoNormal" style="margin: 0in; line-height: 107%; text-align: justify; font-size: 15px;"><span style="line-height: 107%; font-size: 24px;">Aos _______ dias do mês de ___ do ano de dois mil e _____ no _____ (identificação do serviço ou entidade), sito em ______ (localidade), no seguimento de _______ (diligência, circunstância ocasional ou denúncia), tomei conhecimento e por esta via dou notícia do seguinte:<br>
        __________________(descrição detalhada dos factos com menção dos fatores tempo, modo e lugar das ocorrências).<br>
        Com os ditos procedimentos os ___________ (autores) incorrem em infração por violação do ____________ (enquadramento legal).<br>
        É quanto me cumpre dar notícia e para os devidos e legais efeitos se lavrou o presente auto.<br>
        A Testemunha: (nome legível/n.° do documento de identificação) ______________________<br>
        A Testemunha: (nome legível/n.° do documento de identificação) ______________________<br>
        O (denunciante): ______________________</span></p>`;

    seteditorcontent(parecerEdit);
  };

  async function criarItemGO(event, isConcluir = true) {
    if (event) {
      event.preventDefault();
    }

    if (isConcluir) {
      setGuardandoClick(false);
      setConcluindoClick(true);
    } else {
      setGuardandoClick(true);
      setConcluindoClick(false);
    }

    setIsLoading(true);
    let OBC_C = "";

    // if (tipo_pedido == "C") OBC_C = editorREFEdit?.current?.value //OBS
    // if (tipo_pedido == "N") OBC_C = editorREF?.current?.value

    const upload = {
      PESSOAS: PESSOAS.map((e) => e.ID),
      DESCR,
      DATA,
      ENTIDADE_ID: params.id,
      OBS: editorREF?.current?.value,
      TIPO: tipo_pedido,
      ESTADO_DEPACHO_INICIAL: isConcluir ? "CONCLUIR" : "GUARDAR",
    };

    console.log(upload);

    try {
      const response = await api.post("/sgigjprocessoexclusao", upload);

      if (response.status == "200") {
        toast.success("Documento Guardado!", { duration: 4000 });

        uploadlist();
        setIsLoading(false);
        setIsOpen(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err.response);
    }
  }

  //----------------------------------------------

  //-------------- Remover -------------------------

  const removeItemFunction = async (idx) => {
    let res = true;

    try {
      const response = await api.delete("/sgigjprocessoexclusao/" + idx);
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

  //-----------------------------------------------

  //-------------- Instrucao -------------------------

  const openInstrucao = async (item) => {
    setinstrucaoitem(item);
  };

  useEffect(() => {
    parecerEdit = `
        <p class="MsoNormal" align="center" style="margin: 0cm 0cm 8pt; line-height: 16.866667px; font-size: 11pt; font-family: Calibri, sans-serif; caret-color: rgb(0, 0, 0); color: rgb(0, 0, 0); font-style: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: auto; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration: none; text-align: center;"><strong><span lang="PT" style="font-size: 20pt; line-height: 18.4px; font-family: Cambria, serif;">${
          tipo_pedido == "C" ? "Comunicado" : "Auto de Noticia"
        }<o:p></o:p></span></strong></p>
        
        <p class="MsoNormal" style="margin: 0in; line-height: 107%; text-align: justify; font-size: 15px;"><span style="line-height: 107%; font-size: 24px;">Aos _______ dias do mês de ___ do ano de dois mil e _____ no _____ (identificação do serviço ou entidade), sito em ______ (localidade), no seguimento de _______ (diligência, circunstância ocasional ou denúncia), tomei conhecimento e por esta via dou notícia do seguinte:<br>
        __________________(descrição detalhada dos factos com menção dos fatores tempo, modo e lugar das ocorrências).<br>
        Com os ditos procedimentos os ___________ (autores) incorrem em infração por violação do ____________ (enquadramento legal).<br>
        É quanto me cumpre dar notí cia e para os devidos e legais efeitos se lavrou o presente auto.<br>
        A Testemunha: (nome legível/n.° do documento de identificação) ______________________<br>
        A Testemunha: (nome legível/n.° do documento de identificação) ______________________<br>
        O (denunciante): ______________________</span></p>`;

    seteditorcontent(parecerEdit);
  }, [tipo_pedido]);

  useEffect(() => {
    // if (pageEnable(pageAcess, permissoes) == false) history.push('/')

    // else {

    uploadlist();
    uploadpessoa();
    uploadgenerolist();
    uploaddecisaolist();
    uploadestadocivil();
    uploadglbgeografia();
    uploaddocumentolist();
    uploadentidadelist();
    uploadcontactolist();

    // }
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenInterropido, setIsOpenInterropido] = useState(false);
  const [isOpenEncerrar, setIsOpenEncerrar] = useState("");
  const [ID, setID] = useState(null);

  const [isEditarOpen, setIsEditarOpen] = useState(false);
  const [isNewentidade, setisNewentidade] = useState(false);
  const [processo_ID, setprocesso_ID] = useState(null);
  const [instrucao_ID, setinstrucao_ID] = useState(null);

  //---------------- cria pessoa ------------

  const [pessoaopen, setpessoaopen] = useState({ code: 0, value: false });
  const openpessoafunction = () => {
    setpessoaopen({ code: pessoaopen.code + 1, value: true });
  };

  //-------------- Despacho Final -------------------------

  const [isdepachofinal, setisdepachofinal] = useState(false);

  function openDespachofinal(item) {
    setitemSelected(item);
    setisdepachofinal(true);
    console.log("SCV");
  }

  function openModalInterropidofinal(item) {
    setitemSelected(item);
    setIsOpenInterropido(true);
    console.log("SCV");
  }


  //-------------- Despacho Final -------------------------

  const [isdetalhesdocumentos, setisdetalhesdocumentos] = useState(false);
  const [lista_detalhesdocumentos, setlista_detalhesdocumentos] = useState([]);

  function opendetalhesdocumentos(e) {
    var list = [];
    list = e?.sgigjreldocumento;

    if (e.URL_DOC != null) {
      list.push({
        DOC_URL: e.URL_DOC,
        sgigjprdocumentotp: {
          DESIG: "Documento gerado",
        },
      });
    }

    setisdetalhesdocumentos(true);
    setlista_detalhesdocumentos(e?.sgigjreldocumento);
  }

  const [mergedPdfUrl, setMergedPdfUrl] = useState();
  const [isjuntadaopen, setisjuntadaopen] = useState(false);

  async function juntada(newid) {
    console.log("sdsdsds");
    let instrucao = [];

    try {
      const response = await api.get("/sgigjprocessoexclusao/" + newid);

      if (response.status == "200") {
        if (response.data.length > 0) {
          response.data[0].id = response.data[0].ID;

          if (response.data[0].sgigjprocessodespacho.length > 0) {
            if (
              response.data[0].sgigjprocessodespacho[0]
                .sgigjrelprocessoinstrutor.length > 0
            ) {
              if (
                response.data[0].sgigjprocessodespacho[0]
                  .sgigjrelprocessoinstrutor[0].sgigjrelprocessoinstrucao
                  .length > 0
              ) {
                instrucao =
                  response.data[0].sgigjprocessodespacho[0]
                    .sgigjrelprocessoinstrutor[0].sgigjrelprocessoinstrucao[0]
                    .sgigjrelinstrutorpeca;
              }
            }
          }
        }
      }

      var list = [];

      if (instrucao.length > 0) {
        for (let index3 = 0; index3 < instrucao.length; index3++) {
          const element = instrucao[index3];

          for (
            let index2 = 0;
            index2 < element.sgigjreldocumento.length;
            index2++
          ) {
            const element2 = element.sgigjreldocumento[index2];

            list.push(element2.DOC_URL);
          }

          if (element.URL_DOC != null) {
            list.push(element.URL_DOC);
          }
        }
      }

      console.log("GO_ER");

      const responsePDF = await api.get("/juntada/" + newid /*, { list }*/);
      if (responsePDF.status == "200") {
        const array = responsePDF.data.buffer.data;

        const arraybuffer = new Uint8Array(array).buffer;

        var blob = new Blob([arraybuffer], { type: "application/pdf" });

        const url = URL.createObjectURL(blob);

        console.log(blob);

        setMergedPdfUrl(url);

        setisjuntadaopen(true);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function isUserCasino() {
    let res = false;

    if (
      user?.sgigjrelpessoaentidade?.sgigjentidade?.sgigjprentidadetp?.DESIG ==
      "Casino"
    ) {
      res = true;
    }

    return res;
  }

  function openInterrompidoFinal(e) {
    e.preventDefault();

    async function interromper(APLICAR) {
      const INSTRUCAO_ID =
        itemSelected?.sgigjprocessodespacho[0].sgigjrelprocessoinstrutor[0]
          .sgigjrelprocessoinstrucao[0].ID;

      const upload = {
        OBS_IG: OBS_IG,
        APLICAR,
      };

      let res = false;

      try {
        const response = await api.put(
          `/sgigjrelprocessoinstrucao/${INSTRUCAO_ID}/interrompidofinal`,
          upload
        );

        if (response.status == "200") {
          toast.success("Documento Guardado!", { duration: 4000 });

          uploadlist();
          setIsOpenInterropido(false);
          res = true;
        }
      } catch (err) {
        console.error(err.response);
      }

      return res;
    }

    if (itemSelected?.sgigjprocessodespacho?.length > 0) {
      if (
        itemSelected?.sgigjprocessodespacho[0]?.sgigjrelprocessoinstrutor
          .length > 0
      ) {
        if (
          itemSelected?.sgigjprocessodespacho[0]?.sgigjrelprocessoinstrutor[0]
            ?.sgigjrelprocessoinstrucao.length > 0
        ) {
          if (
            itemSelected?.sgigjprocessodespacho[0]?.sgigjrelprocessoinstrutor[0]
              ?.sgigjrelprocessoinstrucao[0]?.sgigjdespachointerrompido.length >
            0
          ) {
            const interrompidoTipo =
              itemSelected.sgigjprocessodespacho[0].sgigjrelprocessoinstrutor[0]
                .sgigjrelprocessoinstrucao[0].sgigjdespachointerrompido[0].TIPO;

            console.log(interrompidoTipo);

            if (interrompidoTipo == "P0") {
              popUp_simnao("Deseja confirmar a prescrição?", {
                sim: () => interromper("S"),
                nao: () => interromper("N"),
                id: user?.ID,
              });
            }

            if (interrompidoTipo == "A0") {
              popUp_simnao("Deseja confirmar o arquivamento?", {
                sim: () => interromper("S"),
                nao: () => interromper("N"),
                id: user?.ID,
              });
            }
          }
        }
      }
    }
  }

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Body>
              {instrucaoitem == null ? (
                <Table
                  listAno={listAno}
                  uploadList={uploadlist}
                  columns={columns}
                  data={newdata}
                  modalOpen={openHandler}
                  pageAcess={pageAcess}
                  permissoes={permissoes}
                />
              ) : (
                <>
                  <Instrucao
                    decisaolist={decisaolist}
                    uploadlist={uploadlist}
                    setinstrucaoitem={setinstrucaoitem}
                    pageAcess={pageAcess}
                    permissoes={permissoes}
                    item={instrucaoitem}
                  />
                </>
              )}
            </Card.Body>
          </Card>

          {/* --------------------Criar Item------------------- */}

          <Modal size="lg" show={isOpen} onHide={() => setIsOpen(false)} scrollable centered>
            <Modal.Header closeButton>
              <Modal.Title as="h5">Criar</Modal.Title>
            </Modal.Header>
            <Modal.Body className="newuserbox">
              <form id="criarItem" onSubmit={criarItemGO}>
                <Row>
                  <Col sm={12}>
                    <Form.Group
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Form.Check
                        inline
                        custom
                        required
                        type="radio"
                        label="Comunicado"
                        name="supportedRadio"
                        id="group"
                        defaultChecked={tipo_pedido == "C" ? true : false}
                        disabled={!taskEnable(pageAcess, permissoes, "Criar_C")}
                        onChange={() => settipo_pedido("C")}
                      />
                      <Form.Check
                        inline
                        custom
                        required
                        disabled={!taskEnable(pageAcess, permissoes, "Criar_N")}
                        type="radio"
                        label="Auto de Notícia"
                        name="supportedRadio"
                        id="collapse"
                        defaultChecked={tipo_pedido == "N" ? true : false}
                        onChange={() => settipo_pedido("N")}
                      />
                    </Form.Group>
                  </Col>

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

                  {/* <Col sm={10}>
                    <label className="floating-label" htmlFor="text">Pessoa</label>
                    <div style={{ display: "flex" }}>
                      <div className="form-group fill" style={{ width: "100%" }}>
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          onChange={event => setPESSOAS(event)}
                          name="pessoa"
                          options={pessoalist}
                          defaultValue={pessoalist.map(p => (p.ID == PESSOA_ID ? p : null))}
                          menuPlacement="auto"
                          menuPosition="fixed"
                          placeholder="Pessoa..."
                          isMulti
                        />
                      </div>
                      <Button onClick={() => openpessoafunction()} style={{ marginLeft: "8px", height: "38px" }} variant="primary"><i className="feather icon-plus" /></Button>
                    </div>
                  </Col> */}

                  <Col sm={6}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Data <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        max={todayDate}
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

                  {/* <Col sm={9}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">Entidade</label>
                      <select className="form-control" disabled={isUserCasino()} onChange={event => { setENTIDADE_ID(event.target.value) }} value={ENTIDADE_ID} id="perfil">
                        <option hidden value="">--- Selecione ---</option>
                        {entidadelist.map(e => (
                          <option key={e.ID} value={e.ID}>{e.DESIG}</option>
                        ))}
                      </select>
                    </div>
                  </Col>

                  <div className="col-sm-12">
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Address">Descrição</label>
                      <textarea maxLength="64000" className="form-control" onChange={event => { setDESCR(event.target.value) }} defaultValue={DESCR} rows="3" placeholder='Descrição...' />
                    </div>
                  </div>

                  {tipo_pedido == "C" &&
                    <>
                      <div className="col-sm-12">
                        <div className="form-group fill">
                          <label className="floating-label" htmlFor="Address">Observação</label>
                          <textarea maxLength="64000" className="form-control" onChange={event => { setOBS(event.target.value) }} defaultValue={OBS} rows="3" placeholder='Observação...' />
                        </div>
                      </div>
                    </>
                  } */}

                  <div className="col-sm-12">
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
                </Row>
              </form>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="danger" onClick={() => setIsOpen(false)}>
                Fechar
              </Button>
              {tipo_pedido == "N" && (
                <Button variant="primary" onClick={() => {
                  const texto = `
                    <p class="MsoNormal" align="center" style="margin: 0cm 0cm 8pt; line-height: 16.866667px; font-size: 11pt; font-family: Calibri, sans-serif; text-align: center;"><strong><span lang="PT" style="font-size: 12pt; line-height: 18.4px; font-family: Cambria, serif;">Auto de Notícia</span></strong></p>
                    <p class="MsoNormal" style="margin: 0in; line-height: 107%; text-align: justify; font-size: 15px;"><span style="line-height: 107%; font-size: 24px;">Aos _______ dias do mês de ___ do ano de dois mil e _____ no _____ (identificação do serviço ou entidade), sito em ______ (localidade), no seguimento de _______ (diligência, circunstância ocasional ou denúncia), tomei conhecimento e por esta via dou notícia do seguinte:<br>
                    __________________(descrição detalhada dos factos com menção dos fatores tempo, modo e lugar das ocorrências).<br>
                    Com os ditos procedimentos os ___________ (autores) incorrem em infração por violação do ____________ (enquadramento legal).<br>
                    É quanto me cumpre dar notícia e para os devidos e legais efeitos se lavrou o presente auto.<br>
                    A Testemunha: (nome legível/n.° do documento de identificação) ______________________<br>
                    A Testemunha: (nome legível/n.° do documento de identificação) ______________________<br>
                    O (denunciante): ______________________</span></p>`;
                  seteditorcontent(texto);
                }}>
                  Gerar Texto
                </Button>
              )}
              {!isLoading ? (
                <Button
                  type="button"
                  form="criarItem"
                  variant="primary"
                  onClick={(e) => criarItemGO(e, false)}
                >
                  Guardar
                </Button>
              ) : (
                <Button variant="primary">
                  {isGuardandoClick ? "Guardando" : "Guardar"}
                </Button>
              )}
              {!isLoading ? (
                <Button type="submit" form="criarItem" variant="primary">
                  Concluir
                </Button>
              ) : (
                <Button variant="primary">
                  {isConcluindoClick ? "Concluindo" : "Concluir"}
                </Button>
              )}
            </Modal.Footer>
          </Modal>

          {/* --------------------Editar Item------------------- */}

          <Modal
            size="lg"
            show={isEditarOpen}
            onHide={() => setIsEditarOpen(false)}
            scrollable
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title as="h5">Editar</Modal.Title>
            </Modal.Header>
            <Modal.Body className="newuserbox">
              <form id="editarItem" onSubmit={editarItemGO}>
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
                  {/* <Col sm={10}>
                    <label className="floating-label" htmlFor="text">Pessoa</label>
                    <div style={{ display: "flex" }}>
                      <div className="form-group fill" style={{ width: "100%" }}>
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          onChange={event => setPESSOA_ID(event.value)}
                          name="pessoa"
                          options={pessoalist}
                          defaultValue={pessoalist.map(p => (p.ID == PESSOA_ID ? p : null))}
                          menuPlacement="auto"
                          menuPosition="fixed"
                          placeholder="Pessoa..."
                        />
                      </div>
                      <Button onClick={() => openpessoafunction()} style={{ marginLeft: "8px", height: "38px" }} variant="primary"><i className="feather icon-plus" /></Button>
                    </div>
                  </Col> */}

                  <Col sm={6}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">
                        Data <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        max={todayDate}
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

                  {/* <Col sm={9}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Name">Entidade</label>
                      <select className="form-control" disabled={isUserCasino()} onChange={event => { setENTIDADE_ID(event.target.value) }} value={ENTIDADE_ID} id="perfil">
                        <option hidden value="">--- Selecione ---</option>
                        {entidadelist.map(e => (
                          <option key={e.ID} value={e.ID}>{e.DESIG}</option>
                        ))}
                      </select>
                    </div>
                  </Col>

                  <div className="col-sm-12">
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Address">Descrição</label>
                      <textarea maxLength="64000" className="form-control" onChange={event => { setDESCR(event.target.value) }} defaultValue={DESCR} rows="3" placeholder='Descrição...' />
                    </div>
                  </div> */}

                  <div className="col-sm-12">
                    <div className="form-group fill">
                      <JoditEditor
                        editorRef={setRef}
                        value={editorcontent}
                        config={{
                          readonly: false,
                        }}
                        ref={editorREFEdit}
                        // onChange={event => setOBS(event)}
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

              {!isLoading ? (
                <Button form="editarItem" variant="primary" onClick={(e) => editarItemGO(e,true)}>
                  Concluir
                </Button>
              ) : (
                <Button variant="primary">
                  {isConcluindoClick ? "Concluindo" : "Concluir"}
                </Button>
              )}
              {!isLoading ? (
                <Button type="submit" form="editarItem" variant="primary">
                  Guardar
                </Button>
              ) : (
                <Button variant="primary">{isGuardandoClick ? "Guardando" : "Guardar"}</Button>
              )}
            </Modal.Footer>
          </Modal>

          <Modal size="lg" show={isVerOpen} onHide={() => setVerOpen(false)} scrollable centered>
            <Modal.Header className="modal-header--processo" closeButton>
              <Modal.Title as="h5">Processo</Modal.Title>
            </Modal.Header>

            {itemSelectedver != null && (
              <Modal.Body>
                <ProcessoStepper colorx={itemSelectedver.colorx} variant="detail" />
                <Row>
                  <Col xl={4} className="task-detail-right">
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <span>
                        <i className="feather icon-shield m-r-5" />
                        Pedido
                      </span>
                    </div>

                    <div
                      style={{
                        borderBottom: "1px solid #d2b32a",
                        borderTop: "1px solid #d2b32a",
                        marginBottom: "20px",
                        marginTop: "6px",
                        paddingTop: "20px",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          flexDirection: "column ",
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "15px",
                        }}
                      >
                        <span>
                          <i className="feather icon-map-pin m-r-5" />
                          Visado
                        </span>

                        <span style={{ color: "#6c757d" }}>
                          {itemSelectedver.PESSOA}
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        borderBottom: "1px solid #d2b32a",
                        marginBottom: "20px",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "15px",
                        }}
                      >
                        <span>
                          <i className="feather icon-map-pin m-r-5" />
                          Entidade Decisora
                        </span>
                        <span style={{ color: "#6c757d" }}>IGJ</span>
                      </div>

                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "15px",
                        }}
                      >
                        <span>
                          <i className="feather icon-map-pin m-r-5" />
                          Pedido por
                        </span>
                        <span style={{ color: "#6c757d" }}>
                          {itemSelectedver.PESSOAREGISTO}
                        </span>
                      </div>

                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "15px",
                        }}
                      >
                        <span>
                          <i className="feather icon-map-pin m-r-5" />
                          Data do Pedido
                        </span>
                        <span style={{ color: "#6c757d" }}>
                          {itemSelectedver.DATA2}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "15px",
                        }}
                      >
                        <span>
                          <i className="feather icon-phone m-r-5" />
                          Descrição
                        </span>
                        <span style={{ color: "#6c757d" }}>
                          {itemSelectedver.DESCR}
                        </span>
                      </div>

                      {/* {
                                                itemSelectedver.TIPO == "C" &&

                                                <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                    <span><i className="feather icon-phone m-r-5" />Observação</span>
                                                    <span style={{ color: "#6c757d" }}  dangerouslySetInnerHTML={{__html:itemSelectedver.OBS}}></span>
                                                </div>

                                            } */}

                      {itemSelectedver.URL_DOC_GERADO != null && (
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: "15px",
                          }}
                        >
                          <a
                            target="_blank"
                            href={
                              itemSelectedver?.URL_DOC_GERADO +
                              "?alt=media&token=0"
                            }
                          >
                            <span
                              style={{ display: "flex", fontWeight: "bold" }}
                            >
                              Abrir Pedido
                            </span>
                          </a>
                        </div>
                      )}
                    </div>
                  </Col>

                  <Col xl={8} className="task-detail-right">
                    <ProcessoTimeline processo={itemSelectedver} />
                  </Col>
                </Row>
              </Modal.Body>
            )}

            <Modal.Footer>
              <Button variant="danger" onClick={() => setVerOpen(false)}>
                Fechar
              </Button>
            </Modal.Footer>
          </Modal>

          {/* --------------------Interrompido Final------------------- */}

          <Modal
            size="lg"
            show={isOpenInterropido}
            onHide={() => setIsOpenInterropido(false)}
            scrollable
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title as="h5">Interrompido Final</Modal.Title>
            </Modal.Header>
            <Modal.Body className="newuserbox w-100">
              <form
                className="w-100"
                id="criarItem"
                onSubmit={openInterrompidoFinal}
              >
                <Row>
                  <div className="col-sm-12">
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Address">
                        Descrição <span style={{ color: "red" }}>*</span>
                      </label>
                      <textarea
                        maxLength="64000"
                        className="form-control"
                        onChange={(event) => {
                          setOBS_IG(event.target.value);
                        }}
                        defaultValue={OBS_IG}
                        rows="3"
                        placeholder="Descrição..."
                        required
                      />
                    </div>
                  </div>
                </Row>
              </form>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="danger"
                onClick={() => setIsOpenInterropido(false)}
              >
                Fechar
              </Button>

              {!isLoading ? (
                <Button type="submit" form="criarItem" variant="primary">
                  Guardar
                </Button>
              ) : (
                <Button variant="primary">Guardando</Button>
              )}
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

          <Listfiles
            Open={isdetalhesdocumentos}
            setOpen={setisdetalhesdocumentos}
            list={lista_detalhesdocumentos}
          />

          <Modal
            size="xl"
            show={isjuntadaopen}
            onHide={() => setisjuntadaopen(false)}
          >
            <iframe
              height={1000}
              src={`${mergedPdfUrl}`}
              title="pdf-viewer"
              width="100%"
            ></iframe>
          </Modal>

          <DespachoFinal
            uploadlist={uploadlist}
            decisaolist={decisaolist}
            isdepachofinal={isdepachofinal}
            setisdepachofinal={setisdepachofinal}
            processo={itemSelected}
          />

          <Tempolimite />

          <DespachoInicial
            decisaolist={decisaolist}
            pessoalist={pessoalist}
            uploadlist={uploadlist}
            processo_ID={processoID_despachoInicial}
            setprocesso_ID={setprocessoID_despachoInicial}
          />

          <TermoEncerramento
            decisaolist={decisaolist}
            pessoalist={pessoalist}
            uploadlist={uploadlist}
            processo_ID={processo_ID}
            isOpenEncerrar={isOpenEncerrar}
            setIsOpenEncerrar={setIsOpenEncerrar}
            instrucao_ID={instrucao_ID}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default ProcessoEmCurso;
