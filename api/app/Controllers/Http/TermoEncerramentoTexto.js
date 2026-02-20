'use strict'

class TermoEncerramentoTexto {

  async index({ request, response }) {
    return {
      OBS: `<p style="text-align: center;"><strong>TERMO DE ENCERRAMENTO</strong></p>
<p></p>
<p>Proc. n.º _____/____-____</p>
<p></p>
<p></p>
<p>Aos ________ dias do mês de ___________ do ano de dois mil e ______________ procede-se ao encerramento do volume do processo, de fls. _______ a _______ e segue volume que se inicia a fls. ______ .</p>
<p></p>
<p>O/A Instrutor/a: ______________________________________________________________________________________</p>
<p></p>`
    }
  }

}

module.exports = TermoEncerramentoTexto
