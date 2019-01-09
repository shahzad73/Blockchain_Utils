var mysql = require('mysql');


module.exports = {

	createConnection: async function() {

		return new Promise(function(resolve, reject) 
		{	
            try
            {
                var con = mysql.createConnection({
                      supportBigNumbers: true,
                      bigNumberStrings: true,
                      host: process.env.DB_SERVER,
                      user: process.env.DB_USER,
                      password: process.env.DB_PASSWORD,
                      database: process.env.DB_Database
                });

                con.connect(function(err) {
                    if (err) 
                    {
                        console.log(err);
                        reject(err);
                    }

                    resolve(con);
                });			
            }
            catch(error) {
                console.log(err);
                reject(err);
			}            
		});
			
	},
    
	executeSQLStatement: async function(sql, data) {
		
		return new Promise(function(resolve, reject) 
		{		
				module.exports.createConnection()
                .then( function(conn) {
					conn.query(sql, data, (error, results, fields) => {
						  if (error) {
                              console.log(error);
							  reject(error);
                          }
						  else
							  resolve(results);
                          
                          conn.end();      
					})
				})
				.catch(function(error) {
                     console.log(error);
				     reject(error);
				});
		});		
	},
    
    getAppParameterRecords: async function(parameters) {
        return new Promise(function(resolve, reject) 
		{	
            let stmt = "select * from app_parameters where Param in (" + parameters + ")";
            module.exports.executeSQLStatement(stmt, [])
            .then(function(result) {
                resolve(result);
            })
            .catch(function(error) {
                 console.log(error);
                 reject(error);
            }); 
        });
    },    
    
}