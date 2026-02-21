import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import toast from "react-hot-toast";

import { Link } from "react-router-dom";

import api from "../../../services/api";

import useAuth from "../../../hooks/useAuth";

import { GlobalFilter } from "./GlobalFilter";

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
  createDateToUser,
  convertDateToPT,
} from "../../../functions";

const pageAcess = "/processos/reclamacao";

function Table({ columns, data, modalOpen, uploadList }) {
  const { permissoes } = useAuth();
  const tableRef = useRef(null);
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

const Reclamacoes = () => {
  const { permissoes, user, popUp_removerItem, popUp_alertaOK } = useAuth();

  const history = useHistory();

  const columns = React.useMemo(
    () => [
      {
        Header: "Código",
        accessor: "CODIGO",
        centered: false,
      },
      {
        Header: "Processo",
        accessor: "PROCESSO_REF",
        centered: true,
      },
      {
        Header: "Visado",
        accessor: "VISADO_NOME",
        centered: true,
      },
      {
        Header: "Entidade",
        accessor: "ENTIDADE_NOME",
        centered: true,
      },
      {
        Header: "Data",
        accessor: "DATA_FORMATADA",
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
  const [isLoading, setIsLoading] = useState(false);

  // Detail modal
  const [isVerOpen, setVerOpen] = useState(false);
  const [itemSelectedver, setitemSelectedver] = useState(null);

  async function uploadlist() {
    try {
      const response = await api.get("/sgigjexclusaoreclamacao");

      if (response.status == "200") {
        for (var i = 0; i < response.data.length; i++) {
          const e = response.data[i];
          const processo = e.sgigjprocessoexclusao || {};
          const entidade = processo.sgigjentidade || {};
          const intervenientes = processo.sgigjrelinterveniente || [];
          const visado = intervenientes.length > 0 ? (intervenientes[0].sgigjpessoa || {}) : {};
          const pessoaEntidade = e.sgigjrelpessoaentidade || {};
          const pessoa = pessoaEntidade.sgigjpessoa || {};

          response.data[i].PROCESSO_REF = processo.REF || "";
          response.data[i].VISADO_NOME = visado.NOME || "";
          response.data[i].ENTIDADE_NOME = entidade.DESIG || "";
          response.data[i].DATA_FORMATADA = createDateToUser(e.DATA);
          response.data[i].REGISTADO_POR = pessoa.NOME || "";

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
            </React.Fragment>
          );
        }

        setnewdata(response.data);
      }
    } catch (err) {
      console.error(err.response);
    }
  }

  const openVerHandler = async (idx) => {
    try {
      const response = await api.get("/sgigjexclusaoreclamacao/" + idx.ID);

      if (response.status == "200") {
        if (response.data.length > 0) {
          const e = response.data[0];
          const processo = e.sgigjprocessoexclusao || {};
          const entidade = processo.sgigjentidade || {};
          const intervenientes = processo.sgigjrelinterveniente || [];
          const visado = intervenientes.length > 0 ? (intervenientes[0].sgigjpessoa || {}) : {};
          const pessoaEntidade = e.sgigjrelpessoaentidade || {};
          const pessoa = pessoaEntidade.sgigjpessoa || {};

          e.PROCESSO_REF = processo.REF || "";
          e.VISADO_NOME = visado.NOME || "";
          e.ENTIDADE_NOME = entidade.DESIG || "";
          e.DATA_FORMATADA = createDateToUser(e.DATA);
          e.REGISTADO_POR = pessoa.NOME || "";

          // Peças processuais
          e.pecas = (e.sgigjrelreclamacaopeca || []).map(p => ({
            DESIG: p.sgigjprpecasprocessual?.DESIG || "",
            ...p
          }));

          setitemSelectedver(e);
          setVerOpen(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Export functions
  async function exportPdf() {
    try {
      setIsLoading(true);
      const response = await api.get("/export-pdf/sgigjexclusaoreclamacao");
      if (response.status == "200" && response.data.url) {
        window.open(response.data.url + "?alt=media&token=0", "_blank");
        toast.success("PDF exportado com sucesso!", { duration: 4000 });
      }
    } catch (err) {
      console.error(err.response);
      toast.error("Erro ao exportar PDF", { duration: 4000 });
    } finally {
      setIsLoading(false);
    }
  }

  async function exportCsv() {
    try {
      setIsLoading(true);
      const response = await api.get("/export-csv/sgigjexclusaoreclamacao", {
        responseType: "blob",
      });
      if (response.status == "200") {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "reclamacoes.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("CSV exportado com sucesso!", { duration: 4000 });
      }
    } catch (err) {
      console.error(err.response);
      toast.error("Erro ao exportar CSV", { duration: 4000 });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    uploadlist();
  }, []);

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Reclamações</Card.Title>
              <div className="d-flex justify-content-end">
                <Button
                  variant="outline-danger"
                  className="btn-sm mr-2"
                  onClick={exportPdf}
                  disabled={isLoading}
                >
                  <i className="feather icon-file-text mr-1" />
                  PDF
                </Button>
                <Button
                  variant="outline-success"
                  className="btn-sm"
                  onClick={exportCsv}
                  disabled={isLoading}
                >
                  <i className="feather icon-download mr-1" />
                  CSV
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Table
                columns={columns}
                data={newdata}
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
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalhes da Reclamação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {itemSelectedver && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Código:</strong> {itemSelectedver.CODIGO}
                </Col>
                <Col md={6}>
                  <strong>Data:</strong> {itemSelectedver.DATA_FORMATADA}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Processo:</strong> {itemSelectedver.PROCESSO_REF}
                </Col>
                <Col md={6}>
                  <strong>Entidade:</strong> {itemSelectedver.ENTIDADE_NOME}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Visado:</strong> {itemSelectedver.VISADO_NOME}
                </Col>
                <Col md={6}>
                  <strong>Registado por:</strong> {itemSelectedver.REGISTADO_POR}
                </Col>
              </Row>
              {itemSelectedver.OBS && (
                <Row className="mb-3">
                  <Col md={12}>
                    <strong>Observações:</strong>
                    <p>{itemSelectedver.OBS}</p>
                  </Col>
                </Row>
              )}

              {itemSelectedver.pecas && itemSelectedver.pecas.length > 0 && (
                <>
                  <hr />
                  <h6>Peças Processuais</h6>
                  <BTable striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Peça Processual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemSelectedver.pecas.map((peca, idx) => (
                        <tr key={idx}>
                          <td>{peca.DESIG}</td>
                        </tr>
                      ))}
                    </tbody>
                  </BTable>
                </>
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

export default Reclamacoes;
