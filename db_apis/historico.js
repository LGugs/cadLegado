const database = require ('../services/db.js');

async function findHist(emp) {
    let queryHist = `select * from pss.csuf_old_ce_situacao`;
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
    const limit = (emp.limit > 0) ? emp.limit : 10; // limita 10 resultados por padrão - // limit não funciona no 11g só no 12c pra cima. Portanto é para usar ROWNUM

    juncao.row_limit = limit;

    queryHist += `\nand ROWNUM <= :row_limit order by dt_inicial`;
    //queryHist += `\norder by dt_inicial`;
    

    const resultado = await database.executar(queryHist, juncao);

    return resultado.rows;
}

module.exports.findHist = findHist;