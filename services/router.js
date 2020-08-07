const router = require('express').Router();
const empresas = require('../db_apis/empresas.js');
const historico = require('../db_apis/historico.js');
const bloqueios = require('../db_apis/bloqueios.js');

// caso eu utilize o controller para realizar as operações desta rota
//router.route('/empresa/:id?').get(empresas.get);

// inserir o auth.required caso necessite de autenticação e fazer ele apontar pro serviço de autenticação
router.get('/empresas/:emp_cnpj?', async (req, res, next) => {
    try {

        if(req.params.emp_cnpj || req.query.emp_insc){
            const emp = {};

            //emp.emp_cnpj = parseInt(req.params.emp_cnpj, 10); // converte para numero decimal, mas emp_cnpj é uma string

            emp.emp_cnpj = req.params.emp_cnpj;
            emp.emp_insc = parseInt(req.query.emp_insc);

            //emp.skip = parseInt(req.query.skip, 10);
            emp.limit = parseInt(req.query.limit, 10);

            const rows = await empresas.findEmp(emp);

           if(rows.length > 0) {
                for (let x = 0; x < rows.length; x++) {
                    if(rows[x].sit === 2){
                        rows[x].sit = 'Ativa'
                    }else if(rows [x].sit === 1){
                        rows[x].sit = 'Bloqueada'
                    }else if(rows [x].sit === 3){
                        rows[x].sit = 'Cancelada'
                    }
                }
                res.status(200).json(rows);
            }else{
                res.status(404).end();
            }
        }else{
            res.status(406).send('CNPJ ou Inscrição não informados!');
        }
    } catch (err) {
        next(err);
    }
});

router.get('/historico/:emp_cnpj?', async (req, res, next) => {
    try {

        // url de exemplo: http://localhost:3000/api/historico/04686208000167/?emp_insc=200112929&limit=1

        // lembrando que params é o valor após a barra -> /historico/04686208000167
        // e query são os valores de filtro -> /historico?emp_insc=200112929&limit=1

        // garanto saber se existe um dos dois atributos de filtro, para evitar de chamar uma pesquisa desnecessária no banco.
        if(req.params.emp_cnpj || req.query.emp_insc) {

            const emp = {};

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

router.get('/bloqueios/:emp_cnpj?', async (req, res, next) => {
    try {

        if(req.params.emp_cnpj || req.query.emp_insc) {

            const emp = {};

            emp.emp_cnpj = req.params.emp_cnpj;
            emp.emp_insc = parseInt(req.query.emp_insc);

            emp.limit = parseInt(req.query.limit, 10);

            const rows = await bloqueios.findBloq(emp);
        
            if(rows.length > 0){
                res.status(200).json(rows);
            } else {
                res.status(404).end();
            }
        } else {
            res.status(406).send('CNPJ ou Inscrição não informados!');
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;