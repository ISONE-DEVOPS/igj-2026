import { DesicaoField, DocumentsField, InfracaoCoimaField, OBS, PessoaField } from "./pecasFields";


/**
 * 
 * @param {*} k 
 * @param {*} value 
 * @param {*} set 
 * @param {*} selected_relinstrucaopeca 
 * @param {*} pessoalist 
 * @param {*} documentolist 
 * @param {*} ID_C 
 * @param {*} obsRef 
 * @returns 
 */
export const Switch = (k,value,set,selected_relinstrucaopeca,pessoalist,documentolist,documentosgeral_lista_save,ID_C,obsRef,required)=> {
    switch (k) {
        case 'PESSOA': 
         return <PessoaField k={k} set={set} value={value} selected_relinstrucaopeca={selected_relinstrucaopeca} pessoalist={pessoalist} documentolist={documentolist} />
        case 'OBS':
            return <OBS k={k} set={set} value={value} obsRef={obsRef} />
            break;
        case 'ANEXO_DOC':
            return <DocumentsField k={k} set={set} value={value} selected_relinstrucaopeca={selected_relinstrucaopeca} pessoalist={pessoalist} documentolist={documentolist} documentosgeral_lista_save={documentosgeral_lista_save} ID_C={ID_C} required={required} />
            break;

        case 'DESTINATARIO':
            return <PessoaField k={k} set={set} value={value} selected_relinstrucaopeca={selected_relinstrucaopeca} pessoalist={pessoalist} documentolist={documentolist} />
            break;
        case 'INFRACAO_COIMA':
            return <InfracaoCoimaField k={k} set={set} value={value} />
            break;
        case 'DECISAO':
            return <DesicaoField k={k} set={set} value={value}/>
            break;
        case 'TEXTO':
            return <OBS k={k} set={set} value={value} obsRef={obsRef} />
            break;
        case 'PERIODO_EXCLUSAO':
            return <OBS k={k} set={set} value={value} obsRef={obsRef} />
            break;
        default:
            return undefined;
            break;
    }
} 