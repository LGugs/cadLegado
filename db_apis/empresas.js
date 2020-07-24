const database = require ('../services/db.js');

async function findEmp(emp) {
    let queryEmp = `select emp_cnpj "cnpj", emp_razao_social "razao_social"`;

    const juncao = {};

    // se especificar um CNPJ, retornará informações mais detalhadas
    if (emp.emp_cnpj){
        
        juncao.emp_cnpj = emp.emp_cnpj;

        queryEmp += `, emp_porte "porte", emp_opt_simples "opt_simples", emp_logradouro "logradouro", emp_bairro "bairro" from pss.csuf_empresa\nwhere emp_cnpj = :emp_cnpj`;

    }else{
        // senão, retornará uma lista de empresas
        const limit = (emp.limit > 0) ? emp.limit : 10; // limita 10 resultados por padrão - // limit não funciona no 11g só no 12c pra cima. Portanto é para usar ROWNUM

        juncao.row_limit = limit;

        queryEmp += `\nfrom pss.csuf_empresa where ROWNUM <= :row_limit`;

    }

    const resultado = await database.executar(queryEmp, juncao);

    return resultado.rows;
}

module.exports.findEmp = findEmp;