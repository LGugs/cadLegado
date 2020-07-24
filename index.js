const webServer = require('./services/webserver.js');
const database = require('./services/db.js');
const dbconfig = require('./config/db.js');

const defaultThreadPoolSize = 4;

// aumenta o pool de conexão de banco do valor máximo estipulado em config/db.js somado com a constante acima.
process.env.UV_THREADPOOL_SIZE = dbconfig.hrPool.poolMax + defaultThreadPoolSize;

async function start() {

    // iniciando o pool de conexão com o banco antes da aplicação subir!
    try{
        console.log('Inicializando módulo de banco de dados.');
        await database.initialize();
    }catch (err){
        console.error(err);
        process.exit(1);
    }

    console.log('Iniciando aplicação!');

    try{
        console.log('Inicializando serviços!')

        await webServer.initialize(); // inicializa o serviço
    }catch (err){
        console.error(err);
        process.exit(1);
    }
}

start();

// garantindo que quando fecharmos a aplicação ele execute estas tarefas
async function shutdown(e) {
    let err = e;
      
    console.log('Fechando Aplicação!');
   
    try {
      console.log('Fechando serviços!');
   
      await webServer.close();
    } catch (e) {
      console.log('Erro encontrado!', e);
   
      err = err || e;
    }

    try {
      console.log('Fechando Módulo de Banco de Dados e suas conexões!');
   
      await database.close(); 
    } catch (err) {
      console.log('Erro Econtrado!', e);
   
      err = err || e;
    }
   
    console.log('Fechando processo!');
   
    if (err) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
   
  process.on('SIGTERM', () => {
    console.log('Recebido SIGTERM');
   
    shutdown();
  });
   
  process.on('SIGINT', () => {
    console.log('Recebido SIGINT');
   
    shutdown();
  });
   
  process.on('uncaughtException', err => {
    console.log('Exceção não reconhecida');
    console.error(err);
   
    shutdown(err);
  });