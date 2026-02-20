import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import Documentos from "../../../components/Custom/Documentoshorizontal";

import Select from "react-select";

import { Link } from "react-router-dom";

import api from "../../../services/api";

import useAuth from "../../../hooks/useAuth";

import { GlobalFilter } from "./GlobalFilter";
import JoditEditor from "jodit-react";

import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import { Pagination } from "react-bootstrap";

import BTable from "react-bootstrap/Table";

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

import Listfiles from "../../../components/Custom/Listfiles";

const pageAcess = "/processos/exclusaointerdicao";

function Table({ uploadList, columns,  listAno, data, modalOpen }) {
  const [DATA_DE, setDATA_DE] = useState("");
  const [DATA_PARA, setDATA_PARA] = useState("");
  const tableRef = useRef(null);
  const { permissoes } = useAuth();
  console.log(permissoes);
  const [values, setValues] = useState();
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
    setValues("");
  };
  function filterDataInicio(e) {
    setDATA_DE(e);
    console.log(e);
    uploadList(e, DATA_PARA);
  }

  function handleChangeAno(e) {
      // setDATA_PARA(e)
      uploadList(e)
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
          entradas
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
              <select onChange={event => { handleChangeAno(event.target.value) }} className="form-control" id="perfil" required aria-required="true">
                  <option value=""> Selecione um Ano </option>
                  {listAno.map(e => (
                      // console.log("casas",e)
                      <option key={e} value={e}>{e}</option>
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

          {/* {taskEnable(pageAcess, permissoes, "Criar") == false ? null : (
                        <Button
                            variant="primary"
                            className="btn-sm btn-round has-ripple ml-2"
                            onClick={modalOpen}
                        >
                            <i className="feather icon-plus" /> Adicionar
                        </Button>
                    )} */}
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

const ProcessoArquivados = () => {
  const { permissoes, user, popUp_simcancelar } = useAuth();

  const history = useHistory();
  const params = useParams();

  const [instrucaoitem, setinstrucaoitem] = useState(null);

  const { popUp_removerItem, popUp_alertaOK } = useAuth();

  let parecerEdit = "";

  const editorREF = useRef(null);

  const columns = React.useMemo(
    () => [
      {
        Header: "EST",
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

  const [PESSOA_ID, setPESSOA_ID] = useState([]);
  const [DESCR, setDESCR] = useState("");
  const [DATA, setDATA] = useState("");
  const [OBS, setOBS] = useState("");
  const [listAno, setListAno] = useState([]);

  //     nOTIFICATION

  const [activeProfileTab, setActiveProfileTab] = useState("dados");
  const [thumnail, setThumnail] = useState(null);
  const [tutelaDoc, setTutelaDoc] = useState(null);

  const profileTabClass = "nav-link text-reset";
  const profileTabActiveClass = "nav-link text-reset active";

  const [documentosgeral_lista, setdocumentosgeral_lista] = useState([]);
  const [documentosgeral_lista_save, setdocumentosgeral_lista_save] =
    useState(false);

  const [itemSelected, setitemSelected] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  var todayDate = new Date().toJSON().slice(0, 10);
  const [pessoalist, setpessoalist] = useState([]);

  //-------------------- c n---------------------------
  //---

  async function criarNotification(event) {
    event.preventDefault();

    if (PESSOA_ID == null || PESSOA_ID.length == 0)
      popUp_alertaOK("Escolha uma Pessoa");
    else {
      setIsLoading(true);
      var docs = [];
      if (thumnail) {
        for (let index = 0; index < thumnail.length; index++) {
          const doc = thumnail[index];
          const img = await onFormSubmitImage(doc.anexo.file);
          docs.push({
            PR_DOCUMENTO_TP_ID: doc.tipodocumento,
            NUMERO: doc.numero,
            DOC_URL: img?.file?.data,
            DT_EMISSAO: doc.dataemissao,
            DT_VALIDADE: doc.datavalidade,
            MAIN: "0",
          });
        }
      }

      //   anexofile = img.file.data;
      console.log(params);
      const upload = {
        PROCESSO_EXCLUSAO_ID: itemSelected.ID, // "b64e2ca3592304d4b172d822c5ca70f124b7",
        CORPO: DESCR,

        documentos:
          docs ||
          [
            // {
            // }
          ],
        visados: PESSOA_ID,

        DATA,

        // FOTO: anexofile,
        // ENTIDADE_ID: params.id
      };
      console.log(upload);

      try {
        const response = await api.post("/notificacao-processos", upload);
        if (response.status == "200") {
          uploadlist();
          //console.log("response", response)
          //   setID_C(response.data.ID);
          setdocumentosgeral_lista_save(!documentosgeral_lista_save);
          toast.success("Todos os dados foram gravados com sucesso!", {
            duration: 4000,
          });
          // addToast("Todos os dados foram gravados com sucesso!", {
          //   appearance: "success",
          // });
          setIsLoading(false);
          setIsNotificationOpen(false);
        }
      } catch (err) {
        setIsLoading(false);

        console.error(err.response);
      }
    }
  }

  async function criarTutela(event) {
    event.preventDefault();

    setIsLoading(true);
    var docs = [];
    for (let index = 0; index < tutelaDoc.length; index++) {
      const doc = tutelaDoc[index];
      const img = await onFormSubmitImage(doc.anexo.file);
      docs.push({
        PR_DOCUMENTO_TP_ID: doc.tipodocumento,
        NUMERO: doc.numero,
        DOC_URL: img?.file?.data,
        DT_EMISSAO: doc.dataemissao,
        DT_VALIDADE: doc.datavalidade,
        MAIN: "0",
      });
    }

    //   anexofile = img.file.data;
    console.log(params);
    const upload = {
      PROCESSO_EXCLUSAO_ID: itemSelected.ID, //"b64e2ca3592304d4b172d822c5ca70f124b7",
      CORPO: DESCR,

      documentos:
        docs ||
        [
          // {
          // }
        ],
    };
    console.log(upload);

    try {
      const response = await api.post(
        DESISAO == "T"
          ? "/decisao-tutelar-processos"
          : "/decisao-tribunal-processos",
        upload
      );
      if (response.status == "200") {
        uploadlist();
        //console.log("response", response)
        //   setID_C(response.data.ID);
        setdocumentosgeral_lista_save(!documentosgeral_lista_save);
        toast.success("Todos os dados foram gravados com sucesso!", {
          duration: 4000,
        });
        // addToast("Todos os dados foram gravados com sucesso!", {
        //   appearance: "success",
        // });
        setIsLoading(false);
        setIsTutelaOpen(false);
      }
    } catch (err) {
      setIsLoading(false);

      console.error(err.response);
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

  //-------------- EDITAR -------------------------

  const openNotificationHandler = (idx) => {
    setIsNotificationOpen(true);
    setitemSelected(idx);
  };

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isTutelaOpen, setIsTutelaOpen] = useState(false);
  const [DESISAO, setDesisao] = useState(null);

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

  //-------------------------- UPLOAD -----------------

  const [newdata, setnewdata] = useState([]);

  async function uploadlist(ano) {
    let response;
    let anos = []
    try {
      if (ano) {
        response = await api.get(`/sgigjprocessoexclusao?ENTIDADE_ID=${params.id}&ano=${ano}`);
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

          if (
            response.data[i]?.sgigjdespachofinal &&
            response.data[i]?.sgigjdespachofinal.length > 0
          ) {
            if (response.data[i]?.sgigjdespachofinal[0]?.URL_DOC_GERADO != null)
              colorx = "blue";

            TIPO_DESPACHO = "Despacho Decisão";
          }

          else if (response.data[i]?.sgigjprocessodespacho.length > 0) {
            if (
              response.data[i]?.sgigjprocessodespacho[0]
                ?.TIPO_PROCESSO_EXCLUSAO == "I"
            )
              TIPO_DESPACHO = "Inquérito";
            if (
              response.data[i]?.sgigjprocessodespacho[0]
                ?.TIPO_PROCESSO_EXCLUSAO == "C"
            )
              TIPO_DESPACHO = "Contraordenação";
            if (
              response.data[i]?.sgigjprocessodespacho[0]
                ?.TIPO_PROCESSO_EXCLUSAO == "A"
            )
              TIPO_DESPACHO = "Averiguação Sumária";

            if (
              response.data[i]?.sgigjprocessodespacho[0]?.URL_DOC_GERADO != null
            )
              colorx = "green";

            if (
              response.data[i]?.sgigjprocessodespacho[0]
                ?.sgigjrelprocessoinstrutor.length > 0
            ) {
              if (
                response.data[i]?.sgigjprocessodespacho[0]
                  ?.sgigjrelprocessoinstrutor[0]?.sgigjrelprocessoinstrucao
                  .length > 0
              ) {
                if (
                  response.data[i]?.sgigjprocessodespacho[0]
                    ?.sgigjrelprocessoinstrutor[0]?.sgigjrelprocessoinstrucao[0]
                    ?.RELATORIO_FINAL != null
                )
                  colorx = "orange";

                if (
                  response.data[i]?.sgigjprocessodespacho[0]
                    ?.sgigjrelprocessoinstrutor[0]?.sgigjrelprocessoinstrucao[0]
                    ?.sgigjdespachointerrompido.length > 0
                ) {
                  if (
                    response.data[i]?.sgigjprocessodespacho[0]
                      ?.sgigjrelprocessoinstrutor[0]
                      ?.sgigjrelprocessoinstrucao[0]
                      ?.sgigjdespachointerrompido[0].TIPO == "A"
                  )
                    colorx = "blue";
                }
              }
            }
          }

          response.data[i].TIPO_DESPACHO = TIPO_DESPACHO;

          response.data[i].action = (
            <React.Fragment>
              {/* {alert(JSON.stringify(permissoes))} */}
              {/* {alert(JSON.stringify(permissoes))} */}
              {taskEnable(pageAcess, permissoes, "Editar") == false ? null : (
                <Link
                  to="#"
                  title={"Decisão Tribunal"}
                  onClick={() => {
                    setIsTutelaOpen(true);
                    setitemSelected(itemx);
                  }}
                  className="text-primary mx-1"
                >
                  <i className={"text-primary  feather icon-file"} />
                </Link>
              )}
              {/* {alert(JSON.stringify(permissoes))} */}
              {taskEnable(pageAcess, permissoes, "Editar") == false ? null : (
                <Link
                  to="#"
                  title={"Notificação"}
                  onClick={() => openNotificationHandler(itemx)}
                  className="text-primary mx-1"
                >
                  <i className={"text-primary  feather icon-mail"} />
                </Link>
              )}
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
              {taskEnable(pageAcess, permissoes, "Editar") == false &&
              response.data[i]?.sgigjprocessodespacho[0]
                ?.sgigjrelprocessoinstrutor[0]?.sgigjrelprocessoinstrucao[0]
                ?.RELATORIO_FINAL == null ? null : (
                <Link
                  to="#"
                  title={"Instrução Despacho"}
                  onClick={() =>
                    popUp_simcancelar("Deseja resgatar o processo?", {
                      doit: resgatar,
                      id: itemx.id,
                    })
                  }
                  className="text-primary mx-1"
                >
                  <i className={"text-primary feather icon-power"} />
                </Link>
              )}
            </React.Fragment>
          );

          response.data[i].colorx = colorx;

          response.data[i].COLOR_STATUS = (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  backgroundColor: "red",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                }}
              />
              <div
                style={{
                  backgroundColor: "orange",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                }}
              />
              {/* <div style={{ backgroundColor: "yellow", width: "20px", height: "20px", borderRadius: "50%", }} /> */}
              <div
                style={{
                  backgroundColor: "green",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                }}
              />
              <div
                style={{
                  backgroundColor: "#fff",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  border: "2px solid blue",
                }}
              />
              {/* <div style={{ backgroundColor: "#fff", width: "20px", height: "20px", borderRadius: "50%", border: "2px solid brown" }} /> */}
              {/* <div style={{ backgroundColor: "#fff", width: "20px", height: "20px", borderRadius: "50%", border: "2px solid purple" }} /> */}
            </div>
          );
        }

        var filtered = response.data.filter((el) => el.colorx == "blue");

        setnewdata(filtered);
      }

      if( listAno.length == 0)
          setListAno(anos)
    } catch (err) {
      console.error(err.response);
    }
  }

  async function resgatar(INSTRUCAO_ID) {
    let resx = false
    try {
        const response = await api.get(
            `/sgigjprocessoexclusao/${INSTRUCAO_ID}/resgatar`
        );

        if (response.status === 200) {
            uploadlist()
            toast.success("Processo Resgatado!", { duration: 4000 });
            resx = true
        }
        } catch (err) {
        console.error(err.response);
        }

        return resx
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

          response.data[0].id = response.data[0].ID;

          response.data[0].DATA2 = createDateToUser(response.data[0].DATA);
          response.data[0].PESSOA = response.data[0].sgigjpessoa?.NOME;
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

          if (
            response.data[0]?.sgigjdespachofinal &&
            response.data[0].sgigjdespachofinal.length > 0
          ) {
            if (response.data[0].sgigjdespachofinal[0].URL_DOC_GERADO != null)
              despachofinal = {
                DOC: response.data[0].sgigjdespachofinal[0].URL_DOC_GERADO,
                DATA: createDateToUser(
                  response.data[0].sgigjdespachofinal[0].DATA
                ),
                DESICAO:
                  response.data[0].sgigjdespachofinal[0].sgigjprdecisaotp.TIPO,
              };
          }

          console.log(despachofinal);

          response.data[0].despacho = despacho;
          response.data[0].instrucao = instrucao;
          response.data[0].despachofinal = despachofinal;

          console.log(instrucao);

          setitemSelectedver(response.data[0]);

          setVerOpen(true);

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
    setDESCR(idx.DESCR);
    setDATA(createDateToInput(idx.DATA));
    setOBS(idx.OBS);
  };

  async function editarItemGO(event) {
    event.preventDefault();

    const upload = {
      PESSOA_ID,
      DESCR,
      DATA,
      OBS,
    };

    console.log(upload);

    try {
      const response = await api.put(
        "/sgigjprocessoexclusao/" + itemSelected.ID,
        upload
      );

      if (response.status == "200") {
        uploadlist();
        setIsEditarOpen(false);
      }
    } catch (err) {
      console.error(err.response);
    }
  }

  //----------------------------------------------

  //-------------- CRIAR -------------------------

  const openHandler = () => {
    setIsOpen(true);
    setIsEditarOpen(false);
    setVerOpen(false);

    setPESSOA_ID([]);
    setDESCR("");
    setDATA("");
    setOBS("");
  };

  async function criarItemGO(event) {
    event.preventDefault();

    const upload = {
      PESSOA_ID,
      DESCR,
      DATA,
      OBS,
    };

    console.log(upload);

    try {
      const response = await api.post("/sgigjprocessoexclusao", upload);

      if (response.status == "200") {
        uploadlist();
        setIsOpen(false);
      }
    } catch (err) {
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
    // if (pageEnable(pageAcess, permissoes) == false) history.push('/')

    // else {

    uploadlist();
    uploadpessoa();
    uploaddocumentolist();

    // }
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [isEditarOpen, setIsEditarOpen] = useState(false);
  const [isNewentidade, setisNewentidade] = useState(false);

  function doNada() {}

  //---------------- cria pessoa ------------

  const [pessoaopen, setpessoaopen] = useState({ code: 0, value: false });
  const openpessoafunction = () => {
    setpessoaopen({ code: pessoaopen.code + 1, value: true });
  };

  //-------------- Despacho -------------------------

  const [isDepachoopen, setisDepachoopen] = useState(false);

  const [editorcontent, seteditorcontent] = useState("");

  const [PR_DECISAO_TP_ID_D, setPR_DECISAO_TP_ID_D] = useState("");
  const [REFERENCIA_D, setREFERENCIA_D] = useState("");
  const [DATA_D, setDATA_D] = useState("");
  const [PRAZO_D, setPRAZO_D] = useState("");
  const [OBS_D, setOBS_D] = useState("");
  const [INSTRUTOR, setINSTRUTOR] = useState("");

  const [CODIGO_D, setCODIGO_D] = useState("");
  const [itemSelectedEdit, setitemSelectedEdit] = useState("");
  const [despachotipo, setdespachotipo] = useState("");

  let dataagora = new Date().toISOString().substring(0, 10);

  //-------------- Despacho Final -------------------------

  const [isdepachofinal, setisdepachofinal] = useState(false);

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

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Body>
              <Table
                listAno={listAno}
                uploadList={uploadlist}
                columns={columns}
                data={newdata}
                modalOpen={openHandler}
                pageAcess={pageAcess}
                permissoes={permissoes}
              />
            </Card.Body>
          </Card>

          <Modal size="lg" show={isVerOpen} onHide={() => setVerOpen(false)}>
            <Modal.Header style={{ border: "0" }} closeButton>
              <Modal.Title as="h5"></Modal.Title>
              <Modal.Title as="h5">Processo</Modal.Title>
            </Modal.Header>

            {itemSelectedver != null && (
              <Modal.Body>
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
                          Pedido Pedido
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
                          Arquivado
                        </span>
                        <span style={{ color: "#6c757d" }}>
                          {
                            itemSelectedver.sgigjprocessodespacho[0]
                              ?.sgigjrelprocessoinstrutor[0]
                              ?.sgigjrelprocessoinstrucao[0]
                              ?.sgigjdespachointerrompido[0]?.OBS
                          }
                        </span>
                      </div>
                      {/* 
                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-phone m-r-5" />Observação</span>
                                                <span style={{ color: "#6c757d" }} dangerouslySetInnerHTML={{ __html: itemSelectedver.OBS }} ></span>
                                            </div> */}

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
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "spaceAround",
                      }}
                    >
                      <span
                        onClick={() => setverlistgp("Despacho")}
                        style={
                          verlistgp == "Despacho"
                            ? {
                                paddingBottom: "4px",
                                cursor: "pointer",
                                borderBottom: "2px solid #d2b32a",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }
                            : {
                                paddingBottom: "4px",
                                cursor: "pointer",
                                borderBottom: "1px solid #E5E5E5",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }
                        }
                      >
                        <i className="feather icon-film m-r-5" />
                        Despacho
                      </span>

                      <span
                        onClick={() => setverlistgp("Instrucao")}
                        style={
                          verlistgp == "Instrucao"
                            ? {
                                paddingBottom: "4px",
                                cursor: "pointer",
                                borderBottom: "2px solid #d2b32a",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }
                            : {
                                paddingBottom: "4px",
                                cursor: "pointer",
                                borderBottom: "1px solid #E5E5E5",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }
                        }
                      >
                        <i className="feather icon-voicemail m-r-5" />
                        Instrução
                      </span>

                      <span
                        onClick={() => setverlistgp("Despachofinal")}
                        style={
                          verlistgp == "Despachofinal"
                            ? {
                                paddingBottom: "4px",
                                cursor: "pointer",
                                borderBottom: "2px solid #d2b32a",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }
                            : {
                                paddingBottom: "4px",
                                cursor: "pointer",
                                borderBottom: "1px solid #E5E5E5",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }
                        }
                      >
                        <i className="feather icon-file-text m-r-5" />
                        Despacho Decisão
                      </span>
                    </div>

                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "spaceAround",
                        marginTop: "20px",
                      }}
                    >
                      <span
                        onClick={() => setverlistgp("Notificacao")}
                        style={
                          verlistgp == "Notificacao"
                            ? {
                                paddingBottom: "4px",
                                cursor: "pointer",
                                borderBottom: "2px solid #d2b32a",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }
                            : {
                                paddingBottom: "4px",
                                cursor: "pointer",
                                borderBottom: "1px solid #E5E5E5",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }
                        }
                      >
                        <i className="feather icon-file-text m-r-5" />
                        Notificação
                      </span>

                      <span
                        onClick={() => setverlistgp("DesicaoTutela")}
                        style={
                          verlistgp == "DesicaoTutela"
                            ? {
                                paddingBottom: "4px",
                                cursor: "pointer",
                                borderBottom: "2px solid #d2b32a",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }
                            : {
                                paddingBottom: "4px",
                                cursor: "pointer",
                                borderBottom: "1px solid #E5E5E5",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }
                        }
                      >
                        <i className="feather icon-file-text m-r-5" />
                        Decisão Tutela
                      </span>

                      <span
                        onClick={() => setverlistgp("DesicaoTribunal")}
                        style={
                          verlistgp == "DesicaoTribunal"
                            ? {
                                paddingBottom: "4px",
                                cursor: "pointer",
                                borderBottom: "2px solid #d2b32a",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }
                            : {
                                paddingBottom: "4px",
                                cursor: "pointer",
                                borderBottom: "1px solid #E5E5E5",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }
                        }
                      >
                        <i className="feather icon-file-text m-r-5" />
                        Decisão Tribunal
                      </span>
                    </div>

                    <div
                      style={
                        verlistgp == "Despacho"
                          ? {
                              width: "100%",
                              height: "450px",
                              overflow: "auto",
                            }
                          : { display: "none" }
                      }
                    >
                      {itemSelectedver?.despacho != null && (
                        <div
                          style={{
                            width: "100%",

                            paddingTop: "20px",
                            marginTop: "20px",
                          }}
                        >
                          <div
                            style={{
                              padding: "5px",
                              borderBottom: "1px solid #d2b32a",
                              width: "100%",
                              display: "flex",
                              marginBottom: "10px",
                            }}
                          >
                            <span style={{ color: "#6c757d", width: "37%" }}>
                              Referência
                            </span>
                            <span style={{ color: "#6c757d", width: "37%" }}>
                              {itemSelectedver?.despacho?.REFERENCIA}
                            </span>
                          </div>

                          <div
                            style={{
                              padding: "5px",
                              borderBottom: "1px solid #d2b32a",
                              width: "100%",
                              display: "flex",
                              marginBottom: "10px",
                            }}
                          >
                            <span style={{ color: "#6c757d", width: "37%" }}>
                              Data
                            </span>
                            <span style={{ color: "#6c757d", width: "37%" }}>
                              {itemSelectedver?.despacho?.DATA}
                            </span>
                          </div>

                          <div
                            style={{
                              padding: "5px",
                              borderBottom: "1px solid #d2b32a",
                              width: "100%",
                              display: "flex",
                              marginBottom: "10px",
                            }}
                          >
                            <span style={{ color: "#6c757d", width: "37%" }}>
                              Prazo
                            </span>
                            <span style={{ color: "#6c757d", width: "37%" }}>
                              {itemSelectedver?.despacho?.PRAZO}
                            </span>
                          </div>

                          <div
                            style={{
                              padding: "5px",
                              borderBottom: "1px solid #d2b32a",
                              width: "100%",
                              display: "flex",
                              marginBottom: "10px",
                            }}
                          >
                            <span style={{ color: "#6c757d", width: "37%" }}>
                              Instrutor
                            </span>
                            <span style={{ color: "#6c757d", width: "37%" }}>
                              {itemSelectedver?.despacho?.INSTRUTOR}
                            </span>
                          </div>

                          <div
                            style={{
                              padding: "5px",
                              borderBottom: "1px solid #d2b32a",
                              width: "100%",
                              display: "flex",
                              marginBottom: "10px",
                            }}
                          >
                            <span style={{ color: "#6c757d", width: "37%" }}>
                              Observação
                            </span>
                            <span style={{ color: "#6c757d", width: "37%" }}>
                              {itemSelectedver?.despacho?.OBS}
                            </span>
                          </div>

                          {itemSelectedver?.despacho?.DOC != null && (
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                marginBottom: "15px",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <a
                                target="_blank"
                                href={
                                  itemSelectedver?.despacho?.DOC +
                                  "?alt=media&token=0"
                                }
                              >
                                <span
                                  style={{
                                    display: "flex",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Abrir Documento
                                </span>
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div
                      style={
                        verlistgp == "Instrucao"
                          ? {
                              width: "100%",
                              height: "450px",
                              overflow: "auto",
                            }
                          : { display: "none" }
                      }
                    >
                      {itemSelectedver?.sgigjprocessodespacho[0]?.sgigjrelprocessoinstrutor[0]?.sgigjrelprocessoinstrucao[0]?.sgigjrelinstrutorpeca != null && (
                        <div
                          style={{
                            width: "100%",

                            paddingTop: "20px",
                            marginTop: "20px",
                          }}
                        >
                          {itemSelectedver?.sgigjprocessodespacho[0]?.sgigjrelprocessoinstrutor[0]?.sgigjrelprocessoinstrucao[0]?.sgigjrelinstrutorpeca?.map((e) => (
                            <div
                              style={{
                                padding: "5px",
                                borderBottom: "1px solid #d2b32a",
                                width: "100%",
                                display: "flex",
                                marginBottom: "10px",
                              }}
                            >
                              <span style={{ color: "#6c757d" }}>
                                {e?.sgigjprpecasprocessual.DESIG}
                              </span>

                              <span style={{ color: "#6c757d" }}>
                                <Link
                                  to="#"
                                  onClick={() => opendetalhesdocumentos(e)}
                                >
                                  <i className={"feather icon-file"} />
                                </Link>
                              </span>
                            </div>
                          ))}

                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              marginBottom: "15px",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <a href={"#"}>
                              <span
                                onClick={() => juntada(itemSelectedver.ID)}
                                style={{ display: "flex", fontWeight: "bold" }}
                              >
                                Juntada
                              </span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      style={
                        verlistgp == "Despachofinal"
                          ? {
                              width: "100%",
                              height: "450px",
                              overflow: "auto",
                            }
                          : { display: "none" }
                      }
                    >
                      {itemSelectedver?.despachofinal != null && (
                        <div
                          style={{
                            width: "100%",

                            paddingTop: "20px",
                            marginTop: "20px",
                          }}
                        >
                          <div
                            style={{
                              padding: "5px",
                              borderBottom: "1px solid #d2b32a",
                              width: "100%",
                              display: "flex",
                              marginBottom: "10px",
                            }}
                          >
                            <span style={{ color: "#6c757d", width: "37%" }}>
                              Decisão
                            </span>
                            <span style={{ color: "#6c757d", width: "37%" }}>
                              {itemSelectedver?.despachofinal?.DESICAO}
                            </span>
                          </div>

                          <div
                            style={{
                              padding: "5px",
                              borderBottom: "1px solid #d2b32a",
                              width: "100%",
                              display: "flex",
                              marginBottom: "10px",
                            }}
                          >
                            <span style={{ color: "#6c757d", width: "37%" }}>
                              Data
                            </span>
                            <span style={{ color: "#6c757d", width: "37%" }}>
                              {itemSelectedver?.despachofinal?.DATA}
                            </span>
                          </div>

                          {itemSelectedver?.despachofinal?.DOC != null && (
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                marginBottom: "15px",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <a
                                target="_blank"
                                href={
                                  itemSelectedver?.despachofinal?.DOC +
                                  "?alt=media&token=0"
                                }
                              >
                                <span
                                  style={{
                                    display: "flex",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Abrir Documento
                                </span>
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div
                      style={
                        verlistgp == "Notificacao"
                          ? {
                              width: "100%",
                              height: "450px",
                              overflow: "auto",
                            }
                          : { display: "none" }
                      }
                    >
                      {itemSelectedver?.notificacao != null && (
                        <div
                          style={{
                            width: "100%",

                            paddingTop: "20px",
                            marginTop: "20px",
                          }}
                        >
                          {itemSelectedver?.notificacao?.map((e) => (
                            <div
                              style={{
                                padding: "5px",
                                borderBottom: "1px solid #d2b32a",
                                width: "100%",
                                display: "flex",
                                marginBottom: "10px",
                              }}
                            >
                              {e.visados?.map((v, i) => (
                                <span style={{ color: "#6c757d" }}>
                                  {/* {e.ID}
                                                                {JSON?.stringify(pessoalist.map(p=>({v:p.value})))} */}
                                  :: Notif.{" "}
                                  {
                                    pessoalist?.find(
                                      (p) => p.value == v.VISADO_ID
                                    )?.label
                                  }
                                  {e.URL_DOC_GERADO != null ||
                                  e.sgigjreldocumento.length > 0 ? (
                                    <Link
                                      to="#"
                                      onClick={() => opendetalhesdocumentos(e)}
                                      key={i}
                                    >
                                      <i className={"feather icon-file"} />
                                    </Link>
                                  ) : (
                                    ""
                                  )}
                                </span>
                              ))}
                            </div>
                          ))}

                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              marginBottom: "15px",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <a href={"#"}>
                              <span
                                onClick={() => juntada(itemSelectedver.ID)}
                                style={{ display: "flex", fontWeight: "bold" }}
                              >
                                Juntada
                              </span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      style={
                        verlistgp == "DesicaoTutela" ||
                        verlistgp == "DesicaoTribunal"
                          ? {
                              width: "100%",
                              height: "450px",
                              overflow: "auto",
                            }
                          : { display: "none" }
                      }
                    >
                      {(verlistgp == "DesicaoTutela"
                        ? itemSelectedver?.decisaoTutelar
                        : verlistgp == "DesicaoTribunal"
                        ? itemSelectedver?.decisaoTribunal
                        : null) != null && (
                        <div
                          style={{
                            width: "100%",

                            paddingTop: "20px",
                            marginTop: "20px",
                          }}
                        >
                          {(verlistgp == "DesicaoTutela"
                            ? itemSelectedver?.decisaoTutelar
                            : itemSelectedver?.decisaoTribunal
                          )?.map((e, i) => (
                            <div
                              style={{
                                padding: "5px",
                                borderBottom: "1px solid #d2b32a",
                                width: "100%",
                                display: "flex",
                                marginBottom: "10px",
                              }}
                            >
                              {e?.sgigjreldocumento?.map((v, j) => (
                                <span style={{ color: "#6c757d" }}>
                                  :: Anexo{" "}
                                  {(verlistgp == "DesicaoTutela"
                                    ? itemSelectedver?.decisaoTutelar
                                    : itemSelectedver?.decisaoTribunal
                                  )
                                    ?.slice(0, i)
                                    .reduce((acc, item, i) => {
                                      // Example condition: check if `documento[i-1]?.length` exists
                                      return item.sgigjreldocumento?.length
                                        ? acc + 1
                                        : acc;
                                    }, 0) +
                                    (j + 1) +
                                    " "}
                                  <Link
                                    to="#"
                                    onClick={() =>
                                      opendetalhesdocumentos(v.DOC_URL)
                                    }
                                  >
                                    <i className={"feather icon-file"} />
                                  </Link>
                                </span>
                              ))}
                            </div>
                          ))}

                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              marginBottom: "15px",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <a href={"#"}>
                              <span
                                onClick={() => juntada(itemSelectedver.ID)}
                                style={{ display: "flex", fontWeight: "bold" }}
                              >
                                Juntada
                              </span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
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

          <Modal
            size="lg"
            show={isNotificationOpen}
            onHide={() => setIsNotificationOpen(false)}
          >
            <Modal.Header style={{ border: "0" }} closeButton>
              <Modal.Title as="h5">Notificação</Modal.Title>
            </Modal.Header>

            {/* <ul
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
                  Notificação
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
            </ul> */}

            {/* <Modal.Body
              style={
                activeProfileTab === "documentos" ? {} : { display: "none" }
              }
            >
              <Documentos
              onSendData={setThumnail}
                documentolist={documentolist}
                list={documentosgeral_lista}
                save={documentosgeral_lista_save}
                item={{ ID: itemSelected.ID, ENTIDADE: "HANDPAY_ID" }}
              />
            </Modal.Body> */}

            <Modal.Body
              style={activeProfileTab === "dados" ? {} : { display: "none" }}
            >
              <form id="notificate" onSubmit={criarNotification}>
                <Row>
                  <Col sm={12}>
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

                      <Col sm={3}>
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

                      <Col sm={6}>
                        <label className="floating-label" htmlFor="text">
                          Visado(s) <span style={{ color: "red" }}>*</span>
                        </label>
                        <div style={{ display: "flex" }}>
                          <div
                            className="form-group fill"
                            style={{ width: "100%" }}
                          >
                            <Select
                              className="basic-single"
                              classNamePrefix="select"
                              onChange={(event) =>
                                setPESSOA_ID((ps) => {
                                  let iof = PESSOA_ID.indexOf(event.value);
                                  if (iof != -1) ps.splice(iof, 1);
                                  else ps.push(event.value);
                                  return ps;
                                })
                              }
                              name="pessoa"
                              options={pessoalist}
                              defaultValue={pessoalist.map((p) =>
                                PESSOA_ID.includes(p.ID) ? p : null
                              )}
                              required
                              menuPlacement="auto"
                              menuPosition="fixed"
                              placeholder="Pessoa..."
                            />
                          </div>
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
                        Notificação <span style={{ color: "red" }}>*</span>
                      </label>
                      <JoditEditor onChange={(event) => setDESCR(event)} />
                      {/* <textarea
                        className="form-control"
                        maxLength="64000"
                        onChange={(event) => {
                          setDESCR(event.target.value);
                        }}
                        defaultValue={itemSelected.DESCR}
                        rows="3"
                        placeholder="Descrição..."
                        required
                      /> */}
                    </div>
                  </div>

                  <div>
                    {itemSelected?.sgigjdespachofinal &&
                    itemSelected?.sgigjdespachofinal[0]?.URL_DOC_GERADO ? (
                      <a
                        target="_blank"
                        href={
                          itemSelected?.sgigjdespachofinal[0]?.URL_DOC_GERADO +
                          "?alt=media&token=0"
                        }
                      >
                        <span style={{ display: "flex", fontWeight: "bold" }}>
                          <i
                            className={"feather icon-file"}
                            style={{ alignContent: "center" }}
                          />
                          Documentos de Decisão
                        </span>
                      </a>
                    ) : null}
                  </div>
                </Row>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="danger"
                onClick={() => setIsNotificationOpen(false)}
              >
                Fechar
              </Button>
              {!isLoading ? (
                <Button type="submit" form="notificate" variant="primary">
                  Guardar
                </Button>
              ) : (
                <Button variant="primary">Guardando</Button>
              )}
            </Modal.Footer>
          </Modal>

          <Modal
            size="lg"
            show={isTutelaOpen == true}
            onHide={() => setIsTutelaOpen(false)}
          >
            <Modal.Header style={{ border: "0" }} closeButton>
              <Modal.Title as="h5">
                {DESISAO == "T" ? "Decicao Tulela" : "Desicao Tribunal"}
              </Modal.Title>
            </Modal.Header>

            <ul
              className="nav nav-tabs profile-tabs nav-fill"
              id="myTab"
              role="tablist"
            >
              {/* <li className="nav-item">
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
                  Notificação
                </Link>
              </li> */}

              {/* <li className="nav-item">
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
              </li> */}
            </ul>

            <Modal.Body>
              <form id="tutelaform" onSubmit={criarTutela}>
                <Col sm={12}>
                  <Form.Group
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Form.Check
                      inline
                      custom
                      required
                      type="radio"
                      label="Desicao Tutela"
                      name="supportedRadio"
                      id="averiguacao"
                      checked={DESISAO == "T" ? true : false}
                      onChange={() => setDesisao("T")}
                    />

                    <Form.Check
                      inline
                      custom
                      required
                      type="radio"
                      label="Desicao Tribunal"
                      name="supportedRadio"
                      id="contraordenacao"
                      checked={DESISAO == "TR" ? true : false}
                      onChange={() => setDesisao("TR")}
                    />
                  </Form.Group>
                </Col>
                <Documentos
                  onSendData={setTutelaDoc}
                  documentolist={documentolist}
                  list={documentosgeral_lista}
                  save={documentosgeral_lista_save}
                  item={{ ID: itemSelected.ID, ENTIDADE: "TUTELA_ID" }}
                />
              </form>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="danger" onClick={() => setIsTutelaOpen(false)}>
                Fechar
              </Button>
              {!isLoading ? (
                <Button type="submit" form="tutelaform" variant="primary">
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
              width="100%s"
            ></iframe>
          </Modal>

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
export default ProcessoArquivados;
