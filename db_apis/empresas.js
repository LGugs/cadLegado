const database = require ('../services/db.js');

const baseQuery = `select emp_cnpj "cnpj", emp_razao_social "razao_social"`;

async function find(emp) {
    let query = baseQuery;

    const juncao = {};

    // se especificar um CNPJ, retornará informações mais detalhadas
    if (emp.emp_cnpj){
        
        juncao.emp_cnpj = emp.emp_cnpj;

        query += `, emp_porte "porte", emp_opt_simples "opt_simples", emp_logradouro "logradouro", emp_bairro "bairro" from pss.csuf_empresa\nwhere emp_cnpj = :emp_cnpj`;

    }else{
        // senão, retornará uma lista de empresas
        const limit = (emp.limit > 0) ? emp.limit : 30; // limita 30 resultados por padrão - // limit não funciona no 11g só no 12c pra cima. Portanto é para usar ROWNUM

        juncao.row_limit = limit;

        query += `\nwhere ROWNUM <= :row_limit`;

    }

    console.log(query);

    console.log(juncao);

    const resultado = await database.executar(query, juncao);

    return resultado.rows;
}

module.exports.find = find;

