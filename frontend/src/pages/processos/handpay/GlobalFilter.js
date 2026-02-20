import React, { useEffect, useState } from 'react'
import { useAsyncDebounce } from 'react-table'
export const GlobalFilter = ({ filter, setFilter, setNewFilter }) => {
  const [value, setValue] = useState(filter);

  const onChange = useAsyncDebounce(value => {
    setFilter(value || undefined); // Passing the updated value to setFilter

    setNewFilter(value || undefined); // Passing the updated value to setFilter
  }, 1000);

  useEffect(() => {
    setValue(filter); // Update local state when filter prop changes
  }, [filter]);

  return (
    <span className="d-flex align-items-center justify-content-end">
      Procurar:{' '}
      <input
        className='form-control ml-2 w-auto'
        placeholder="pesquisar por nome, entidades"
        value={value || ''}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
      />
    </span>
  );
};