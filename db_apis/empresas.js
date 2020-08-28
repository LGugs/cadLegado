const database = require ('../services/db.js');

async function findEmp(emp) {
    let queryEmp = `select a.emp_cnpj "cnpj", a.emp_razao_social "razao_social", b.inscsuf "insc", c.set_descricao "tipo", b.sit "sit", e.sset_descricao "subsetor" from pss.csuf_empresa a 
    join pss.csuf_old_inscsuf b on a.emp_cnpj = b.emp_cnpj
    join pss.csuf_setor c on c.set_cd = b.set_cd
    join pss.csuf_subsetor_emp d on b.inscsuf = d.inscsuf
    join pss.csuf_subsetor e on e.set_cd = d.set_cd`;
    var status = 0;
    const juncao = {};

    if (emp.emp_cnpj){
        status = 1;
        juncao.emp_cnpj = emp.emp_cnpj;
        queryEmp += `\nwhere a.emp_cnpj = :emp_cnpj`;

    }

    if (emp.emp_insc){
        juncao.emp_insc = emp.emp_insc;
        if(status === 0){
            queryEmp += `\nwhere inscsuf = :emp_insc`;
        } else {
            queryEmp += `\nand inscsuf = :emp_insc`;
        }

    }
    
    /*else{
        // senão, retornará uma lista de empresas
        const limit = (emp.limit > 0) ? emp.limit : 10; // limita 10 resultados por padrão - // limit não funciona no 11g só no 12c pra cima. Portanto é para usar ROWNUM

        juncao.row_limit = limit;

        queryEmp += `\nwhere ROWNUM <= :row_limit`;

    }*/

    const resultado = await database.executar(queryEmp, juncao);

    return resultado.rows;
}

module.exports.findEmp = findEmp;