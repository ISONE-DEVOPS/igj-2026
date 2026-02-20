import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination, Button, Modal, ListGroup } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import { useParams } from 'react-router-dom';

import { Link } from 'react-router-dom';

import { GlobalFilter } from './../GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";

import Select from 'react-select';

import { saveAs } from 'file-saver';

import api from '../../../../services/api';

import useAuth from '../../../../hooks/useAuth';

import toast from 'react-hot-toast';

import { useHistory } from 'react-router-dom';

import { pageEnable, setParams, moduleList } from '../../../../functions';


const pageAcess = "/entidade/auditoria"

function Table({ columns, data, modalOpen, listProjetos, uploadlist, years, tableState, totalItems, setTableState, pessoalist, moduleList }) {
    console.log(pessoalist)
    console.log(moduleList)

    const userList = pessoalist.map((item, index) => {
        return {
            label: pessoalist[index].sgigjrelpessoaentidade.sgigjpessoa.NOME,
            value: item.ID
        };
    });
    let defaultUser = { label: "Selecione todos", value: "default" };
    const modulelist = moduleList.map(item => {
        return {
            label: item.value,
            value: item.key
        };
    });
    modulelist.unshift(defaultUser)
    userList.unshift(defaultUser)



    const [user, setUser] = useState(undefined);
    const [module, setModule] = useState(undefined);
    const [values, setValues] = useState()
    const params = useParams();


    const { permissoes, popUp_simcancelar } = useAuth();
    // const totalBRUTO = parseCurrency(totalBruto)

    function handlePageNext(pageIndex, pageSize) {

        // Assuming uploadlist is a function that you want to call when the page changes
        // You can replace it with your actual logic
        let offset = pageIndex + 1
        // Update the pageIndex and pageSize in tableState
        setTableState(prevState => ({
            ...prevState,
            pageIndex: offset,
            pageSize: 16,
        }));
        uploadlist(offset, 16, user, module);

    }

    function handlePagePrev(pageIndex, pageSize) {
        // Assuming uploadlist is a function that you want to call when the page changes
        // You can replace it with your actual logic
        let offset = pageIndex - 1
        // Update the pageIndex and pageSize in tableState
        setTableState(prevState => ({
            ...prevState,
            pageIndex: offset,
            pageSize: 16,
        }));
        uploadlist(offset, 16, user, module);

    }
    function gotoFirstPage(pageIndex, pageSize) {
        // Assuming uploadlist is a function that you want to call when the page changes
        // You can replace it with your actual logic
        // Update the pageIndex and pageSize in tableState
        setTableState(prevState => ({
            ...prevState,
            pageIndex: pageIndex,
            pageSize: 16,
        }));
        uploadlist(pageIndex);

    }
    function gotoLastPage(pageIndex, pageSize) {
        // Assuming uploadlist is a function that you want to call when the page changes
        // You can replace it with your actual logic
        // Update the pageIndex and pageSize in tableState
        setTableState(prevState => ({
            ...prevState,
            pageIndex: pageIndex,
            pageSize: 16,
        }));
        uploadlist(pageIndex);

    }
    function handleUser(e) {
        setUser(e === "default" ? undefined : e);
        uploadlist(0, 16, e === "default" ? undefined : e, module);
    }

    function handleModule(e) {
        setModule(e === "default" ? undefined : e);
        uploadlist(0, 16, user, e === "default" ? undefined : e);
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
        state: { pageIndex, pageSize }
    } = useTable(
        {
            columns,
            data: data,
            initialState: tableState,
            manualPagination: true,
            pageCount: Math.ceil(totalItems / tableState.pageSize),
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    return (
        <>
            <Row className='mb-3'>
                <Col md={3} className="d-flex align-items-center">
                    Mostrar
                    <select
                        className="form-control w-auto mx-2"
                        value={pageSize}
                        // onChange={(e) => {
                        //     setPageSize(Number(e.target.value));
                        //     uploadlist(Number(e.target.value), pageIndex * Number(e.target.value));
                        // }}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            uploadlist(pageIndex, Number(e.target.value));
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
                <Col md={4} >

                    <Select
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={event => { handleUser(event.value) }} name="user"
                        options={userList}
                        menuPlacement="auto"
                        menuPosition="fixed"
                        placeholder="Utilizador..."
                    />

                </Col>
                <Col md={4} >

                    <Select
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={event => { handleModule(event.value) }} name="module"
                        options={modulelist}
                        menuPlacement="auto"
                        menuPosition="fixed"
                        placeholder="Modulo..."
                    />

                </Col>
                {/* <Col md={3} className="d-flex justify-content-end">
                    <div className="d-flex align-items-center mr-2">
                    </div>
                </Col> */}
            </Row >
            <BTable striped bordered hover responsive {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    {/* Add a sort direction indicator */}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? <span className='feather icon-arrow-down text-muted float-right' />
                                                : <span className='feather icon-arrow-up text-muted float-right' />
                                            : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(
                        (row, i) => {
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
                            )
                        }
                    )}

                    {/* <div style={{ width: '100px', height: '100px', backgroundColor: "red" }}
                        className=''>

                    </div> */}
                </tbody>
            </BTable>
            <Row className='justify-content-between'>
                <Col>
                    <span className="d-flex align-items-center">
                        Página{' '} <strong> {pageIndex + 1} de {pageOptions.length} </strong>{' '}
                        | Ir para a página:{' '}
                        <input
                            type="number"
                            className='form-control ml-2'
                            defaultValue={pageIndex + 1}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                gotoPage(page)
                            }}
                            style={{ width: '100px' }}
                        />
                    </span>
                </Col>
                <Col>
                    <Pagination className="justify-content-end">
                        {/* ... existing code ... */}
                        <Pagination.First onClick={() => gotoFirstPage(0)} disabled={!canPreviousPage} />
                        <Pagination.Prev onClick={() => handlePagePrev(pageIndex, pageCount)} disabled={!canPreviousPage} />
                        <Pagination.Next onClick={() => handlePageNext(pageIndex, pageCount)} disabled={!canNextPage} />
                        <Pagination.Last onClick={() => gotoLastPage(totalItems - 1)} disabled={!canNextPage} />
                    </Pagination>
                </Col>
            </Row>
        </>
    )
}


const Auditoria = () => {

    const { id } = useParams();

    const [id_params, setid_params] = useState("0");

    const { popUp_removerItem, popUp_alertaOK, popUp_simcancelar } = useAuth();


    const { permissoes } = useAuth();

    const history = useHistory();

    var todayDate = new Date().toJSON().slice(0, 10);

    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'ID',
                centered: true
            },
            {
                Header: 'Data e Hora',
                accessor: 'Created_At',
                centered: false
            },
            {
                Header: 'Utilizador',
                accessor: 'user.USERNAME',
                centered: false
            },
            {
                Header: 'Ação Realizada',
                accessor: 'Accao',
                centered: false
            },
            {
                Header: 'Modulo',
                accessor: 'Text_Modulo',
                centered: false
            },

            {
                Header: 'Detalhes de Ação',
                accessor: 'Text_Detalhe',
                centered: false
            },
        ],
        []
    );


    const [startYear] = useState(2000);
    const [endYear] = useState(2023);

    const years = [];
    for (let year = startYear; year <= endYear; year++) {
        years.push(year);
    }

    //-------------------------- UPLOAD -----------------

    const [newdata, setnewdata] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [totalItems, setTotalItems] = useState(0);
    const [pessoalist, setpessoalist] = useState([]);
    const [modulelist, setmodulelist] = useState([]);

    async function uploadlist(offset, limit, user, model) {
        user = user === "" ? undefined : user
        model = model === "" ? undefined : model
        try {
            const response = await api.get('/auditoria?' + setParams([['User_ID', user], ["Model", model], ['limit', limit], ['offset', offset]]));
            if (response.status === 200) {
                let data = response.data.data;
                setTotalItems(response.data.totalItems);
                setnewdata(data);
                setTableState((state) => ({
                    ...state,
                    totalItems,
                    pageCount: Math.ceil(totalItems / state.pageSize),
                }));
            }
        } catch (err) {
            console.error(err.response);
        }
    }
    async function uploadUserList() {

        try {

            const response = await api.get('/glbuser');
            if (response.status == "200") {
                for (var i = 0; i < response.data.length; i++) {
                    response.data[i].value = response.data[i].ID;
                    response.data[i].label = response.data[i].sgigjrelpessoaentidade.sgigjpessoa.NOME;
                }
                setpessoalist(response.data);

            }
            for (let index = 0; index < moduleList.length; index++) {
                moduleList[i].value = moduleList[i].key;
                moduleList[i].label = moduleList[i].value
            }

            setmodulelist(moduleList)


        } catch (err) {

            console.error(err.response)


        }

    }
    const [tableState, setTableState] = useState({
        pageIndex: 0,
        pageSize: 16,
        totalItems: 0,
    });

    useEffect(() => {
        if (pageEnable(pageAcess, permissoes) === false) {
            history.push('/');
        } else {

            uploadlist();
            uploadUserList();


        }
    }, [permissoes]);


    console.log(tableState);

    const [isOpen, setIsOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);
    const [isVerOpen, setVerOpen] = useState(false);
    const [isCabimentoOpen, setIsCabimentoOpen] = useState(false);
    const [isEditarRecebimentoOpen, setIsEditarRecebimentoOpen] = useState(false);







    return (<>


        <React.Fragment>
            <Row>
                <Col sm={12}>
                    <Card>
                        <Card.Body>
                            <Table columns={columns} data={newdata} uploadlist={uploadlist} years={years} tableState={tableState} totalItems={totalItems} setTableState={setTableState} moduleList={moduleList} pessoalist={pessoalist} />
                        </Card.Body>
                    </Card>




                </Col>
            </Row >
        </React.Fragment >
    </>
    );












};
export default Auditoria;