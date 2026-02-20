import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Row, Col, Card, Pagination, Button } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { useHistory } from 'react-router-dom';
import toast from 'react-hot-toast';

import { GlobalFilter } from './GlobalFilter';
import PecaModal from './PecaModal';
import api from '../../../services/api';
import useAuth from '../../../hooks/useAuth';
import { pageEnable, taskEnable, taskEnableIcon, taskEnableTitle } from '../../../functions';

import './pecasprocessuais.scss';

const pageAcess = "/configuracao/pecasprocessuais";

function stripHTML(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
}

// ─── Table Component ──────────────────────────────────
function Table({ columns, data, modalOpen, loading, permissoes }) {
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
        state: { pageIndex, pageSize }
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10 }
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    return (
        <>
            <div className="pecas-toolbar">
                <div className="toolbar-left">
                    Mostrar
                    <select
                        className="form-control w-auto mx-1"
                        value={pageSize}
                        onChange={e => setPageSize(Number(e.target.value))}
                    >
                        {[5, 10, 20, 30, 40, 50].map(size => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                    entradas
                </div>
                <div className="toolbar-right">
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                    {taskEnable(pageAcess, permissoes, "Criar") !== false && (
                        <button className="btn-add" onClick={modalOpen}>
                            <i className="feather icon-plus" /> Adicionar
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="pecas-skeleton">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="skeleton-row">
                            <div className="skeleton-cell w-60" />
                            <div className="skeleton-cell w-180" />
                            <div className="skeleton-cell w-250" />
                            <div className="skeleton-cell w-80" />
                        </div>
                    ))}
                </div>
            ) : data.length === 0 ? (
                <div className="pecas-empty-state">
                    <i className="feather icon-file-text" />
                    <p>Nenhuma peça processual configurada</p>
                    {taskEnable(pageAcess, permissoes, "Criar") !== false && (
                        <Button variant="primary" size="sm" onClick={modalOpen}>
                            <i className="feather icon-plus mr-1" /> Adicionar Peça
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    <BTable striped bordered hover responsive {...getTableProps()}>
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                            {column.render('Header')}
                                            <span>
                                                {column.isSorted
                                                    ? column.isSortedDesc
                                                        ? <span className="feather icon-arrow-down text-muted float-right" />
                                                        : <span className="feather icon-arrow-up text-muted float-right" />
                                                    : ''}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map((row) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()}
                                                className={cell.column.centered ? 'text-center' : ''}
                                            >
                                                {cell.render('Cell')}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </BTable>

                    <div className="pecas-pagination">
                        <div className="page-info">
                            Página <strong>{pageIndex + 1} de {pageOptions.length}</strong>
                            {' '}| Ir para:
                            <input
                                type="number"
                                defaultValue={pageIndex + 1}
                                onChange={e => {
                                    const p = e.target.value ? Number(e.target.value) - 1 : 0;
                                    gotoPage(p);
                                }}
                            />
                        </div>
                        <Pagination>
                            <Pagination.First onClick={() => gotoPage(0)} disabled={!canPreviousPage} />
                            <Pagination.Prev onClick={() => previousPage()} disabled={!canPreviousPage} />
                            <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage} />
                            <Pagination.Last onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} />
                        </Pagination>
                    </div>
                </>
            )}
        </>
    );
}

// ─── Main Component ───────────────────────────────────
const PecasProcessuais = () => {
    const { permissoes, popUp_removerItem, popUp_alertaOK } = useAuth();
    const history = useHistory();

    const [list, setList] = useState([]);
    const [listFields, setListFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = useState([]);

    // Modal state: { show, mode, item }
    const [modal, setModal] = useState({ show: false, mode: null, item: null });

    // ─── Data Fetching ────────────────────────────────
    const fetchList = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/sgigjprpecasprocessual');
            if (response.status === 200) {
                setList(response.data);
            }
        } catch (err) {
            // silent
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchFields = useCallback(async () => {
        try {
            const response = await api.get('/sigjprcampo');
            if (response.status === 200) {
                setListFields(response.data);
            }
        } catch (err) {
            // silent
        }
    }, []);

    useEffect(() => {
        if (pageEnable(pageAcess, permissoes) === false) {
            history.push('/');
        } else {
            fetchList();
            fetchFields();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ─── Build table data with action buttons ─────────
    useEffect(() => {
        const rows = list.map(item => ({
            ...item,
            OBS_DISPLAY: stripHTML(item.OBS || '').slice(0, 80),
            action: (
                <React.Fragment>
                    {taskEnable(pageAcess, permissoes, "Ler") !== false && (
                        <button
                            className="action-btn action-view"
                            title={taskEnableTitle(pageAcess, permissoes, "Ler")}
                            onClick={() => openModal('ver', item)}
                        >
                            <i className={taskEnableIcon(pageAcess, permissoes, "Ler")} />
                        </button>
                    )}
                    {taskEnable(pageAcess, permissoes, "Editar") !== false && (
                        <button
                            className="action-btn action-edit"
                            title={taskEnableTitle(pageAcess, permissoes, "Editar")}
                            onClick={() => openModal('editar', item)}
                        >
                            <i className={taskEnableIcon(pageAcess, permissoes, "Editar")} />
                        </button>
                    )}
                    {taskEnable(pageAcess, permissoes, "Remover") !== false && (
                        <button
                            className="action-btn action-delete"
                            title={taskEnableTitle(pageAcess, permissoes, "Remover")}
                            onClick={() => handleDelete(item.ID)}
                        >
                            <i className={taskEnableIcon(pageAcess, permissoes, "Remover")} />
                        </button>
                    )}
                </React.Fragment>
            )
        }));
        setTableData(rows);
    }, [list, permissoes]); // eslint-disable-line react-hooks/exhaustive-deps

    // ─── Columns ──────────────────────────────────────
    const columns = useMemo(() => [
        {
            Header: 'Código',
            accessor: 'CODIGO',
            Cell: ({ value }) => <span className="codigo-badge">{value}</span>
        },
        {
            Header: 'Designação',
            accessor: 'DESIG',
            Cell: ({ value }) => <span className="desig-text">{value}</span>
        },
        {
            Header: 'Descrição',
            accessor: 'OBS_DISPLAY',
            Cell: ({ value }) => (
                <span className="desc-truncated" title={value}>
                    {value || '-'}
                </span>
            )
        },
        {
            Header: 'Ações',
            accessor: 'action',
            centered: true,
            disableSortBy: true
        }
    ], []);

    // ─── Modal Handlers ───────────────────────────────
    const openModal = (mode, item = null) => {
        setModal({ show: true, mode, item });
    };

    const closeModal = () => {
        setModal({ show: false, mode: null, item: null });
    };

    const handleSave = async (data) => {
        try {
            if (modal.mode === 'criar') {
                const response = await api.post('/sgigjprpecasprocessual', data);
                if (response.status === 200) {
                    toast.success('Peça criada com sucesso');
                    fetchList();
                    closeModal();
                }
            } else if (modal.mode === 'editar') {
                const response = await api.put('/sgigjprpecasprocessual/' + modal.item.ID, data);
                if (response.status === 200 || response.status === 204) {
                    toast.success('Peça atualizada com sucesso');
                    fetchList();
                    closeModal();
                }
            }
        } catch (err) {
            if (err.response && err.response.status === 400) {
                toast.error(err.response.data.message, { duration: 4000 });
            } else {
                toast.error('Erro ao guardar. Tente mais tarde.', { duration: 4000 });
            }
        }
    };

    // ─── Delete Handler ───────────────────────────────
    const removeItemFunction = async (idx) => {
        try {
            await api.delete('/sgigjprpecasprocessual/' + idx);
            toast.success('Peça removida com sucesso');
            fetchList();
            return true;
        } catch (err) {
            popUp_alertaOK("Falha. Tente mais tarde");
            return false;
        }
    };

    const handleDelete = (idx) => {
        popUp_removerItem({
            delete: removeItemFunction,
            id: idx
        });
    };

    // ─── Render ───────────────────────────────────────
    return (
        <div className="pecas-wrapper">
            <Row>
                <Col sm={12}>
                    <Card>
                        <Card.Body>
                            <Table
                                columns={columns}
                                data={tableData}
                                modalOpen={() => openModal('criar')}
                                loading={loading}
                                permissoes={permissoes}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <PecaModal
                show={modal.show}
                mode={modal.mode}
                item={modal.item}
                fields={listFields}
                onHide={closeModal}
                onSave={handleSave}
            />
        </div>
    );
};

export default PecasProcessuais;
