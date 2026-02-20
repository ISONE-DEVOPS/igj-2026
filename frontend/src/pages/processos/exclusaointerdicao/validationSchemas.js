import * as Yup from 'yup';

export var termoEncerramentoSchema = Yup.object({
  DATA: Yup.string().required('Data e obrigatoria'),
  DESPACHO: Yup.string().required('Despacho e obrigatorio'),
});

export var criarProcessoSchema = Yup.object({
  DATA: Yup.string().required('Data e obrigatoria'),
  tipo_pedido: Yup.string().required('Selecione o tipo de pedido'),
});

export var despachoInicialSchema = Yup.object({
  REFERENCIA: Yup.string().required('Referencia e obrigatoria'),
  DATA: Yup.string().required('Data e obrigatoria'),
  tipo_pedido: Yup.string().required('Selecione o tipo de despacho'),
});
