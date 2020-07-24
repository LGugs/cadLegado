const router = require('express').Router();
const empresas = require('../db_apis/empresas.js');

// caso eu utilize o controller para realizar as operações desta rota
//router.route('/empresa/:id?').get(empresas.get);

// inserir o auth.required caso necessite de autenticação e fazer ele apontar pro serviço de autenticação
router.get('/empresas/:emp_cnpj?', async (req, res, next) => {
    try {
        const emp = {};

        //emp.emp_cnpj = parseInt(req.params.emp_cnpj, 10); // converte para numero decimal, mas emp_cnpj é uma string

        emp.emp_cnpj = req.params.emp_cnpj;

        emp.skip = parseInt(req.query.skip, 10);
        emp.limit = parseInt(req.query.limit, 10);

        const rows = await empresas.find(emp);

        if(req.params.emp_cnpj) {
            if(rows.length === 1){
                res.status(200).json(rows[0]);
            } else {
                res.status(404).end();
            }
        }else{
            res.status(200).json(rows);
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;