import React from 'react';
import BTable from 'react-bootstrap/Table';



import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";




const Table = ({ data }) => {



    const columns = React.useMemo(
        () => [
            {
                Header: 'Peças Processual',
                accessor: 'PECAS',
            },

            {
                Header: 'Data',
                accessor: 'DATA2',
            },  
            
            // {
            //     Header: 'Quem',
            //     accessor: 'QUEM',
            // },  

            {
                Header: 'Anexos',
                accessor: 'ANEXOS',
            },

           

            {
                Header: 'Ações',
                accessor: 'action',
            },
        ],
        []
    );




    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,

      

        page,

        setPageSize,
        state: { pageIndex, pageSize }
       
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: Number.MAX_VALUE }
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );





    return (
       
                               
                               

                                
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
                                                        return (
                                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                                        )
                                                    })}
                                                </tr>
                                            )}
                                    )}
                                    </tbody>
                                 </BTable>

                           
                   
            
       
    )
}




export default Table;