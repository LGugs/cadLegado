const oracledb = require('oracledb');
const dbconfig = require('../config/db.js');

async function initialize() {
    const pool = await oracledb.createPool(dbconfig.hrPool); // carrega o tamanho de pool de conexões definida nas configurações    
}

module.exports.initialize = initialize;

async function close() {
    await oracledb.getPool().close();
}

module.exports.close = close;


function executar(statement, binds = [], opts = []) {
    return new Promise(async (resolve, reject) => {
        let conn;

        opts.outFormat = oracledb.OBJECT;
        //opts.autoCommit = true; não habilitado visto que esta aplicação só irá realizar buscas

        try {
            conn = await oracledb.getConnection();

            const result = await conn.execute(statement, binds, opts);

            resolve(result);
        } catch (err){
            reject(err);
        } finally {
            if (conn) { // fecha a conexão
                try {
                    await conn.close();
                } catch (err) {
                    console.log(err);
                }
            }
        }
    });
}

module.exports.executar = executar;