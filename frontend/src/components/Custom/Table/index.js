import React from 'react';
import { Row, Col, Pagination, Button } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';


import { GlobalFilter } from './GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";

import { taskEnable } from '../../../functions';




const Table = ({ columns, data, entity, modalOpen, permissoes, pageAcess }) => {

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
            <Row className='mb-3'>
                <Col className="d-flex align-items-center">
                    Mostrar
                    <select
                        className='form-control w-auto mx-2'
                        value={pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value))
                        }}
                    >
                        {[5, 10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                    entradas
                </Col>
                <Col className='d-flex justify-content-end'>
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />

                    {
                        entity === "campos" ?

                            taskEnable(pageAcess, permissoes, "Criar") == false || data.length >= 8 ? null :
                                <Button variant="primary" className="btn-sm btn-round has-ripple ml-2" onClick={modalOpen} ><i className="feather icon-plus" /> Adicionar</Button>
                            : taskEnable(pageAcess, permissoes, "Criar") == false ? null :
                                <Button variant="primary" className="btn-sm btn-round has-ripple ml-2" onClick={modalOpen} ><i className="feather icon-plus" /> Adicionar</Button>
                    }

                </Col>
            </Row>
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
                            console.log(entity)

                            return (

                                <tr {...row.getRowProps()}>

                                    {row.cells.map(cell => {
                                        console.log(cell)
                                        const isCentered = cell.column.centered;

                                        return (
                                            <>
                                                {entity === undefined && (

                                                    <td className={isCentered ? 'text-center' : 'text-right'} {...cell.getCellProps()}>{cell.render('Cell')}
                                                    </td>
                                                )}
                                                {entity === "campos" && (

                                                    <td className={isCentered ? 'text-center' : 'text-right'} {...cell.getCellProps()}>{

                                                        cell.value === "1" ?
                                                            <div className='text-center'><svg width="25" height="25" viewBox="0 0 42 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M15.5586 18.3327L20.7447 23.3327L38.0319 6.66602" stroke="#167538" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                                <path d="M36.3043 20V31.6667C36.3043 32.5507 35.9401 33.3986 35.2917 34.0237C34.6433 34.6488 33.7639 35 32.8469 35H8.64493C7.72796 35 6.84855 34.6488 6.20016 34.0237C5.55176 33.3986 5.1875 32.5507 5.1875 31.6667V8.33333C5.1875 7.44928 5.55176 6.60143 6.20016 5.97631C6.84855 5.35119 7.72796 5 8.64493 5H27.6608" stroke="#167538" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                            </svg></div>
                                                            : cell.value === "0" ? <div className='text-center'><svg width="25" height="25" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M22.5 41.25C32.8553 41.25 41.25 32.8553 41.25 22.5C41.25 12.1447 32.8553 3.75 22.5 3.75C12.1447 3.75 3.75 12.1447 3.75 22.5C3.75 32.8553 12.1447 41.25 22.5 41.25Z" stroke="#EC1C24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                                <path d="M28.125 16.875L16.875 28.125" stroke="#EC1C24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                                <path d="M16.875 16.875L28.125 28.125" stroke="#EC1C24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                            </svg></div>
                                                                : cell.value

                                                    }</td>
                                                )
                                                }

                                            </>

                                        )
                                    })}
                                </tr>
                            )
                        }
                    )}
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
                    <Pagination className='justify-content-end'>
                        <Pagination.First onClick={() => gotoPage(0)} disabled={!canPreviousPage} />
                        <Pagination.Prev onClick={() => previousPage()} disabled={!canPreviousPage} />
                        <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage} />
                        <Pagination.Last onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} />
                    </Pagination>
                </Col>
            </Row>
        </>
    )
}




export default Table;