const mysql = require("mysql2/promise");

async function main() {
  try {
    pool = await mysql.createPool({
      connectionLimit: 80,
      //acquireTimeout: 120000,
      //conneectionTimeout: 120000,
      host: process.env.PLANETSCALE_DB_HOST, //baseconfig.mysql_host, //'172.17.0.1',
      // port: 3306,
      user: process.env.PLANETSCALE_DB_USERNAME,
      password: process.env.PLANETSCALE_DB_PASSWORD,
      database: process.env.PLANETSCALE_DB,
      ssl: {
        ca: process.env.PLANETSCALE_SSL_CERT_PATH
        // DO NOT DO THIS
        // set up your ca correctly to trust the connection
        // rejectUnauthorized: false,
      },
    });
    console.log("[MYSQL] create pool -> success");
    return pool;
  } catch (error) {
    console.log("[MYSQL] create pool -> failed");
    console.error(error);
    return undefined;
  }
}

var pool = main();

var getConnection = async () => {
  //wait for pool to be created
  while (pool == undefined) { 
    console.log("[MYSQL] pool is undefined");
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  let connection = await pool.getConnection();
  return connection;
  // return new Promise(resolve => {
  // });
};

module.exports = getConnection;

//async anonymous function
(async () => {
  pool.then(async(pool) => {
    console.log("[MYSQL] pool " + pool );
    const connection = await getConnection();
    const [rows] = await connection.query("SELECT * FROM dq_data");
    console.log(rows);
    connection.release();
  });
 
})();

// var getConnection = function(callback) {
//     pool.getConnection(function(err, connection) {
//         console.log("[MYSQL] pool.connect -> getConnnection")
//         callback(err, connection);
//         // connection.query("SELECT * FROM food_sites", function(err, rows, fields) {
//         //     // Connection is automatically released when query resolves
//         //     callback(err, rows);
//         //  })
//     });
// };
