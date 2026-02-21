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

import { useHistory } from "react-router-dom";
import {
  pageEnable,
  taskEnable,
  taskEnableIcon,
  taskEnableTitle,
  createDateToInput,
  createDateToUser,
  convertDateToPT,
} from "../../../functions";

import Listfiles from "../../../components/Custom/Listfiles";

const pageAcess = "/processos/contraordenacao";

function Table({ columns, listAno, data, uploadList }) {
  const [DATA_DE, setDATA_DE] = useState("");
  const [DATA_PARA, setDATA_PARA] = useState("");
  const tableRef = useRef(null);
  const { permissoes } = useAuth();
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

  function handleChangeAno(e) {
    uploadList(e);
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
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
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
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
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

const Contraordenacao = () => {
  const { permissoes, user, popUp_removerItem, popUp_alertaOK, popUp_simcancelar } = useAuth();

  const history = useHistory();

  const columns = React.useMemo(
    () => [
      {
        Header: "Estado",
        accessor: "COLOR_STATUS",
        centered: true,
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

  const [newdata, setnewdata] = useState([]);
  const [listAno, setListAno] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Detail modal
  const [isVerOpen, setVerOpen] = useState(false);
  const [itemSelectedver, setitemSelectedver] = useState(null);
  const [verlistgp, setverlistgp] = useState("Despacho");

  async function uploadlist(ano) {
    let response;
    let anos = [];
    try {
      if (ano) {
        response = await api.get(`/sgigjprocessoexclusao?ano=${ano}`);
      } else {
        response = await api.get(`/sgigjprocessoexclusao`);
      }
      if (response.status == "200") {
        for (var i = 0; i < response.data.length; i++) {
          response.data[i].id = response.data[i].ID;

          response.data[i].DATA2 = createDateToUser(response.data[i].DATA);

          let date = new Date(response.data[i].DATA);
          if (date && !anos.includes(date.getFullYear())) {
            anos.push(date.getFullYear());
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
          let isContraordenacao = false;

          if (response.data[i]?.sgigjdespachofinal && response.data[i]?.sgigjdespachofinal.length > 0) {
            if (response.data[i]?.sgigjdespachofinal[0]?.URL_DOC_GERADO != null)
              colorx = "blue";
            TIPO_DESPACHO = "Despacho Decisão";
          } else if (response.data[i]?.sgigjprocessodespacho.length > 0) {
            if (
              response.data[i]?.sgigjprocessodespacho[0]?.TIPO_PROCESSO_EXCLUSAO == "C"
            ) {
              TIPO_DESPACHO = "Contraordenação";
              isContraordenacao = true;
            }

            if (response.data[i]?.sgigjprocessodespacho[0]?.URL_DOC_GERADO != null)
              colorx = "green";

            if (
              response.data[i]?.sgigjprocessodespacho[0]?.sgigjrelprocessoinstrutor.length > 0
            ) {
              if (
                response.data[i]?.sgigjprocessodespacho[0]?.sgigjrelprocessoinstrutor[0]
                  ?.sgigjrelprocessoinstrucao.length > 0
              ) {
                if (
                  response.data[i]?.sgigjprocessodespacho[0]?.sgigjrelprocessoinstrutor[0]
                    ?.sgigjrelprocessoinstrucao[0]?.RELATORIO_FINAL != null
                )
                  colorx = "orange";
              }
            }
          }

          response.data[i].TIPO_DESPACHO = TIPO_DESPACHO;
          response.data[i].isContraordenacao = isContraordenacao;

          response.data[i].action = (
            <React.Fragment>
              {taskEnable(pageAcess, permissoes, "Ler") == false ? null : (
                <Link
                  to="#"
                  title="Ver detalhes"
                  onClick={() => openVerHandler(itemx)}
                  className="mx-1"
                >
                  <i className="feather icon-eye text-primary" />
                </Link>
              )}
              {taskEnable(pageAcess, permissoes, "Editar") == false ? null : (
                <Link
                  to={`/processos/exclusaointerdicao`}
                  title="Editar processo"
                  className="mx-1"
                >
                  <i className="feather icon-edit text-success" />
                </Link>
              )}
              {taskEnable(pageAcess, permissoes, "Eliminar") == false ? null : (
                <Link
                  to="#"
                  title="Eliminar"
                  onClick={() => {
                    popUp_removerItem && popUp_removerItem(itemx.id, "sgigjprocessoexclusao", () => uploadlist());
                  }}
                  className="mx-1"
                >
                  <i className="feather icon-trash-2 text-danger" />
                </Link>
              )}
            </React.Fragment>
          );

          let statusText = "Pendente";
          let statusBg = "#6c757d";
          if (colorx === "green") { statusText = "Despachado"; statusBg = "#28a745"; }
          else if (colorx === "blue") { statusText = "Decisão Final"; statusBg = "#007bff"; }
          else if (colorx === "orange") { statusText = "Relatório Final"; statusBg = "#fd7e14"; }
          else if (colorx === "grey") { statusText = "Pendente"; statusBg = "#6c757d"; }

          response.data[i].COLOR_STATUS = (
            <span
              style={{
                backgroundColor: statusBg,
                color: "#fff",
                padding: "4px 10px",
                borderRadius: "12px",
                fontSize: "11px",
                fontWeight: "600",
                whiteSpace: "nowrap",
              }}
            >
              {statusText}
            </span>
          );
        }

        // Filter only contraordenação processes
        var filtered = response.data.filter((el) => el.isContraordenacao);

        setnewdata(filtered);
      }
      if (listAno.length == 0) setListAno(anos);
    } catch (err) {
      console.error(err.response);
    }
  }

  const openVerHandler = async (idx) => {
    try {
      const response = await api.get("/sgigjprocessoexclusao/" + idx.id);

      if (response.status == "200") {
        if (response.data.length > 0) {
          response.data[0].id = response.data[0].ID;
          response.data[0].DATA2 = createDateToUser(response.data[0].DATA);
          response.data[0].PESSOA = response.data[0].sgigjrelinterveniente
            ?.map((e) => e.sgigjpessoa?.NOME)
            .join(", ");
          response.data[0].ORIGEM = response.data[0].sgigjprorigemtp?.DESIG;
          response.data[0].PESSOAREGISTO =
            response.data[0].sgigjrelpessoaentidade?.sgigjpessoa?.NOME;
          response.data[0].ENTIDADEREGISTO =
            response.data[0]?.sgigjentidade?.DESIG;

          let despacho = null;
          let instrucao = null;

          if (response.data[0].sgigjprocessodespacho.length > 0) {
            if (response.data[0].sgigjprocessodespacho[0].URL_DOC_GERADO != null)
              despacho = {
                DATA: createDateToUser(response.data[0].sgigjprocessodespacho[0].DATA),
                REFERENCIA: response.data[0].sgigjprocessodespacho[0].REFERENCIA,
                PRAZO: response.data[0].sgigjprocessodespacho[0].PRAZO,
                OBS: response.data[0].sgigjprocessodespacho[0].OBS,
                DOC: response.data[0].sgigjprocessodespacho[0].URL_DOC_GERADO,
                INSTRUTOR: "",
              };

            if (
              response.data[0].sgigjprocessodespacho[0].sgigjrelprocessoinstrutor.length > 0
            ) {
              despacho && (despacho.INSTRUTOR =
                response.data[0].sgigjprocessodespacho[0].sgigjrelprocessoinstrutor[0]
                  .sgigjrelpessoaentidade?.sgigjpessoa?.NOME);

              if (
                response.data[0].sgigjprocessodespacho[0].sgigjrelprocessoinstrutor[0]
                  .sgigjrelprocessoinstrucao.length > 0
              ) {
                instrucao = {
                  list: response.data[0].sgigjprocessodespacho[0]
                    .sgigjrelprocessoinstrutor[0].sgigjrelprocessoinstrucao[0]
                    .sgigjrelinstrutorpeca,
                };
              }
            }
          }

          response.data[0].despacho = despacho;
          response.data[0].instrucao = instrucao;

          setitemSelectedver(response.data[0]);
          setVerOpen(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    uploadlist();
  }, []);

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Processos de Contraordenação</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table
                columns={columns}
                data={newdata}
                listAno={listAno}
                uploadList={uploadlist}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de Detalhes */}
      <Modal
        show={isVerOpen}
        onHide={() => setVerOpen(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalhes do Processo de Contraordenação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {itemSelectedver && (
            <div>
              <ul className="nav nav-tabs mb-3" id="myTab" role="tablist">
                <li className="nav-item">
                  <a
                    className={verlistgp === "Despacho" ? "nav-link active" : "nav-link"}
                    onClick={() => setverlistgp("Despacho")}
                    style={{ cursor: "pointer" }}
                  >
                    Dados Gerais
                  </a>
                </li>
                {itemSelectedver.despacho && (
                  <li className="nav-item">
                    <a
                      className={verlistgp === "Instrucao" ? "nav-link active" : "nav-link"}
                      onClick={() => setverlistgp("Instrucao")}
                      style={{ cursor: "pointer" }}
                    >
                      Despacho
                    </a>
                  </li>
                )}
                {itemSelectedver.instrucao && (
                  <li className="nav-item">
                    <a
                      className={verlistgp === "Pecas" ? "nav-link active" : "nav-link"}
                      onClick={() => setverlistgp("Pecas")}
                      style={{ cursor: "pointer" }}
                    >
                      Instrução / Peças
                    </a>
                  </li>
                )}
              </ul>

              {verlistgp === "Despacho" && (
                <div>
                  <Row className="mb-3">
                    <Col md={6}>
                      <strong>Referência:</strong> {itemSelectedver.REF}
                    </Col>
                    <Col md={6}>
                      <strong>Data:</strong> {itemSelectedver.DATA2}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={6}>
                      <strong>Entidade:</strong> {itemSelectedver.ENTIDADEREGISTO}
                    </Col>
                    <Col md={6}>
                      <strong>Visado:</strong> {itemSelectedver.PESSOA}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={6}>
                      <strong>Origem:</strong> {itemSelectedver.ORIGEM}
                    </Col>
                    <Col md={6}>
                      <strong>Registado por:</strong> {itemSelectedver.PESSOAREGISTO}
                    </Col>
                  </Row>
                </div>
              )}

              {verlistgp === "Instrucao" && itemSelectedver.despacho && (
                <div>
                  <Row className="mb-3">
                    <Col md={6}>
                      <strong>Data do Despacho:</strong> {itemSelectedver.despacho.DATA}
                    </Col>
                    <Col md={6}>
                      <strong>Referência:</strong> {itemSelectedver.despacho.REFERENCIA}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={6}>
                      <strong>Prazo:</strong> {itemSelectedver.despacho.PRAZO} dias
                    </Col>
                    <Col md={6}>
                      <strong>Instrutor:</strong> {itemSelectedver.despacho.INSTRUTOR}
                    </Col>
                  </Row>
                  {itemSelectedver.despacho.OBS && (
                    <Row className="mb-3">
                      <Col md={12}>
                        <strong>Observações:</strong>
                        <p>{itemSelectedver.despacho.OBS}</p>
                      </Col>
                    </Row>
                  )}
                  {itemSelectedver.despacho.DOC && (
                    <Row className="mb-3">
                      <Col md={12}>
                        <a
                          href={itemSelectedver.despacho.DOC + "?alt=media&token=0"}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="feather icon-file mr-1" />
                          Ver Documento do Despacho
                        </a>
                      </Col>
                    </Row>
                  )}
                </div>
              )}

              {verlistgp === "Pecas" && itemSelectedver.instrucao && (
                <div>
                  <h6>Peças Processuais da Instrução</h6>
                  {itemSelectedver.instrucao.list && itemSelectedver.instrucao.list.length > 0 ? (
                    <BTable striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Peça Processual</th>
                          <th>Data</th>
                          <th>Documentos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemSelectedver.instrucao.list.map((peca, idx) => (
                          <tr key={idx}>
                            <td>{peca.sgigjprpecasprocessual?.DESIG || ""}</td>
                            <td>{createDateToUser(peca.DT_REGISTO)}</td>
                            <td>
                              {peca.sgigjreldocumento && peca.sgigjreldocumento.length > 0 ? (
                                peca.sgigjreldocumento.map((doc, dIdx) => (
                                  <a
                                    key={dIdx}
                                    href={doc.DOC_URL + "?alt=media&token=0"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-sm btn-outline-secondary mr-1 mb-1"
                                  >
                                    <i className="feather icon-file mr-1" />
                                    {doc.sgigjprdocumentotp?.DESIG || "Documento"}
                                  </a>
                                ))
                              ) : (
                                <span className="text-muted">Sem documentos</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </BTable>
                  ) : (
                    <p className="text-muted">Sem peças processuais registadas.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setVerOpen(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default Contraordenacao;
