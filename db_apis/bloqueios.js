const database = require ('../services/db.js');

async function findBloq(emp) {
    let queryHist = `select * from pss.csuf_old_situacao_bloqueio`;
    let status = 0;
    const juncao = {};

    if (emp.emp_cnpj){
        status = 1;
        juncao.emp_cnpj = emp.emp_cnpj;

        queryHist += `\nwhere emp_cnpj = :emp_cnpj`;

    }

    if (emp.emp_insc){
        juncao.emp_insc = emp.emp_insc;

        if(status === 0){
            queryHist += `\nwhere inscsuf = :emp_insc`;
        } else {
            queryHist += `\nand inscsuf = :emp_insc`;
        }

    }
    
    // 10 registros de historico por padrão
    const limit = (emp.limit > 0) ? emp.limit : 10;

    juncao.row_limit = limit;

    queryHist += `\nand ROWNUM <= :row_limit order by databloqueio`;    

    const resultado = await database.executar(queryHist, juncao);

    return resultado.rows;
}

module.exports.findBloq = findBloq;