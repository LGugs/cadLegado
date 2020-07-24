const router = require('express').Router();
const empresas = require('../db_apis/empresas.js');
const historico = require('../db_apis/historico.js');

// caso eu utilize o controller para realizar as operações desta rota
//router.route('/empresa/:id?').get(empresas.get);

// inserir o auth.required caso necessite de autenticação e fazer ele apontar pro serviço de autenticação
router.get('/empresas/:emp_cnpj?', async (req, res, next) => {
    try {
        const emp = {};

        //emp.emp_cnpj = parseInt(req.params.emp_cnpj, 10); // converte para numero decimal, mas emp_cnpj é uma string

        emp.emp_cnpj = req.params.emp_cnpj;

        //emp.skip = parseInt(req.query.skip, 10);
        emp.limit = parseInt(req.query.limit, 10);

        const rows = await empresas.findEmp(emp);

        if(req.params.emp_cnpj) {
            if(rows.length === 1){
                res.status(200).json(rows[0]);
            } else {
                res.status(404).end(); // .end() finaliza a response sem atribuir o Content-Type e Etag no cabeçalho HTTP. Só utilizar quando não há mensagens a serem enviadas.
            }
        }else{
            res.status(200).json(rows);
        }
    } catch (err) {
        next(err);
    }
});

router.get('/historico/:emp_cnpj?', async (req, res, next) => {
    try {
        // garanto saber se existe um dos dois atributos de filtro, para evitar de chamar uma pesquisa desnecessária no banco.
        if(req.params.emp_cnpj || req.params.emp_insc) {

            const emp = {};

            //emp.emp_cnpj = parseInt(req.params.emp_cnpj, 10); // converte para numero decimal, mas emp_cnpj é uma string

            // serão utilizado os valores de cnpj e inscricao para filtragem de busca
            emp.emp_cnpj = req.params.emp_cnpj;
            emp.emp_insc = parseInt(req.query.emp_insc);

            emp.limit = parseInt(req.query.limit, 10);

            const rows = await historico.findHist(emp);
        
            if(rows.length > 0){
                res.status(200).json(rows);
            } else {
                res.status(404).end(); // caso não tenha registro de histórico
            }
        } else {
            res.status(406).send('CNPJ ou Inscrição não informados!');
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;