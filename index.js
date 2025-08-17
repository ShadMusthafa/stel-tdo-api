'use strict';
const express = require('express');
const cors = require('cors');
var Readable = require('stream').Readable;
const bodyParser = require('body-parser');
//const dotenv = require('dotenv');
//const jwt = require('jsonwebtoken');
const app = express();
app.use(bodyParser.json());
var hana = require('@sap/hana-client');
const { access } = require('fs');
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log('App now running on port', port);
});
// const corsOptions = {
//     origin: '*', // Allow all origins (or specify allowed domains)
//     methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'],
//     allowedHeaders: ['Origin', 'x-csrf-token', 'X-Requested-With', 'x-dme-plant', 'x-dme-industry-type', 'x-features', 'X-Sap-Cid', 'contentType', 'Content-Type', 'Accept', 'Authorization']
// };

// app.use(cors(corsOptions));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,x-csrf-token, X-Requested-With,x-dme-plant,x-dme-industry-type,x-features,X-Sap-Cid, contentType,Content-Type, Accept, Authorization'
  );
  next();
});

module.exports = app;
var dapConnOptions = {
  serverNode: '46cd6eb5-61ba-4428-812b-3965b4aee68a.hna0.prod-eu20.hanacloud.ondemand.com:443', // your hana instance sql end point
  encrypt: 'true',
  sslValidateCertificate: 'false',
  uid: 'NPRDHDBADMIN', // your hana instance administrator name
  pwd: 'Nprdhdb@123', //Administrator password
};

app.post('/api/insert/empDetails', async function (req, res) {
  console.log('Inside /api/insert/empDetails POST method');
  if (req.body != undefined) {
    var dbConnection = hana.createConnection();
    console.log('DB Connection Object : ' + dbConnection);
    dbConnection.connect(dapConnOptions, function (err) {
      if (err) throw err;
      var eid = req.body.EMP_ID;
      var esal = req.body.EMP_SALARY;
      var edesignation = req.body.EMP_DESIGNATION;
      var ename = req.body.EMP_NAME;
      var queryString = "select * from Z_EMPLOYEE where EMP_ID='" + eid + "' and EMP_NAME='" + ename + "'";
      console.log('/api/insert/empDetails SQL :' + queryString);
      dbConnection.exec(queryString, function (err, result) {
        if (err) throw err;
        console.log(result);
        if (result.length == 0) {
          var queryString =
            "insert into Z_EMPLOYEE (EMP_ID,EMP_NAME,EMP_DESIGNATION,EMP_SALARY) values('" +
            eid +
            "','" +
            ename +
            "','" +
            edesignation +
            "','" +
            esal +
            "')";
          console.log('/api/insert/empDetails SQL :' + queryString);
          dbConnection.exec(queryString, function (err, result) {
            if (err) throw err;
            console.log(ename + '- Emp Details Data inserted successfully');
            res.send(ename + '- Emp Details Data inserted successfully');
            dbConnection.disconnect();
          });
        } else {
          console.log(ename + '- Emp Details already found');
          res.send(ename + '- Emp is is already found');
          dbConnection.disconnect();
        }
      });
    });
  } else res.send("Request Body can't be empty");
});

app.post('/api/insert/operatorDetails', async function (req, res) {
  console.log('Inside /api/insert/operatorDetails POST method');
  if (req.body != undefined) {
    var dbConnection = hana.createConnection();
    console.log('DB Connection Object : ' + dbConnection);
    dbConnection.connect(dapConnOptions, function (err) {
      if (err) throw err;
      var workcenter = req.body.WORK_CENTER;
      var operator = req.body.OPERATOR;
      var component = req.body.COMPONENT;
      var minTol = req.body.MIN_TOL;
      var maxTol = req.body.MAX_TOL;
      var target = req.body.TARGET;
      var mg = req.body.MEAN_GAURD;
      var tdoset = req.body.TDO_SET;
      console.log('type=' + typeof mg);
      var queryString =
        "select * from Z_OPERATOR where OPERATOR='" + operator + "' and WORK_CENTER='" + workcenter + "' and COMPONENT='" + component + "'";
      console.log('/api/insert/operatorDetails SQL :' + queryString);
      dbConnection.exec(queryString, function (err, result) {
        if (err) throw err;
        console.log(result);
        if (result.length == 0) {
          var queryString =
            "insert into Z_OPERATOR (OPERATOR,WORK_CENTER,COMPONENT,MIN_TOLELANCE,MAX_TOLERANCE,TARGET_VALUE,MEAN_GAURD,TDO_SET) values('" +
            operator +
            "','" +
            workcenter +
            "','" +
            component +
            "','" +
            minTol +
            "','" +
            maxTol +
            "','" +
            target +
            "','" +
            mg +
            "','" +
            tdoset +
            "')";
          console.log('/api/insert/operatorDetails SQL :' + queryString);
          dbConnection.exec(queryString, function (err, result) {
            if (err) throw err;
            console.log(' Operator Details Data inserted successfully');
            res.send(' Operator Details Data inserted successfully');
            dbConnection.disconnect();
          });
        } else {
          var queryString =
            "update  Z_OPERATOR SET MIN_TOLELANCE='" +
            minTol +
            "',MAX_TOLERANCE='" +
            maxTol +
            "' ,TARGET_VALUE='" +
            target +
            "',MEAN_GAURD='" +
            mg +
            "',TDO_SET='" +
            tdoset +
            "' WHERE OPERATOR='" +
            operator +
            "' and WORK_CENTER='" +
            workcenter +
            "' and COMPONENT='" +
            component +
            "'";
          console.log('/api/insert/operatorDetails SQL :' + queryString);
          dbConnection.exec(queryString, function (err, result) {
            if (err) throw err;
            console.log(' Operator Details Data Updated successfully');
            res.send(' Operator Details Data Updated successfully');
            dbConnection.disconnect();
          });
        }
      });
    });
  } else res.send("Request Body can't be empty");
});

app.post('/api/get/operatorDetails', async function (req, res) {
  console.log('Inside /api/insert/operatorDetails POST method');
  if (req.body != undefined) {
    var dbConnection = hana.createConnection();
    console.log('DB Connection Object : ' + dbConnection);
    dbConnection.connect(dapConnOptions, function (err) {
      if (err) throw err;
      var workcenter = req.body.WORK_CENTER;
      var operator = req.body.OPERATOR;
      var component = req.body.COMPONENT;
      var queryString =
        "select * from Z_OPERATOR where OPERATOR='" + operator + "' and WORK_CENTER='" + workcenter + "' and COMPONENT='" + component + "'";
      console.log('/api/insert/operatorDetails SQL :' + queryString);
      dbConnection.exec(queryString, function (err, result) {
        if (err) throw err;
        console.log(result);
        var response = {
          workCenter: result[0].WORK_CENTER,
          operator: result[0].OPERATOR,
          component: result[0].COMPONENT,
          minimumTolerance: result[0].MIN_TOLELANCE,
          maximumTolerance: result[0].MAX_TOLERANCE,
          target: result[0].TARGET_VALUE,
          meanGaurd: result[0].MEAN_GAURD,
          tdoSet: result[0].TDO_SET,
        };
        console.log('Operator Details Fetched successfully');
        res.send(response);
        dbConnection.disconnect();
      });
    });
  } else res.send("Request Body can't be empty");
});

/* app.post('/api/insert/bomData', async function (req, res) {
    console.log("Inside /api/insert/bomData POST method");
    if (req.body != undefined) {
        var dbConnection = hana.createConnection();
        console.log("DB Connection Object : " + dbConnection);
        console.log("DB Connection Object : " + req.body);
        console.log("DB Connection Object : " + req.body);
        dbConnection.connect(dapConnOptions, function (err) {
            if (err) throw err;
            for(var i=0;i<req.body.length;i++){
            var plant = req.body[i].plant;
            var erpSequence = req.body[i].erpSequence;
            var bom = req.body[i].bom;
            var bomVersion = req.body[i].bomVersion;
            var component = req.body[i].component;
            var componentVersion = req.body[i].componentVersion;
            var componentType = req.body[i].componentType;
            var uom=req.body[i].unitOfMeasurement;
            var target = req.body[i].target;
            var minTolerance = req.body[i].minTolerance;
            var maxTolerance = req.body[i].maxTolerance;
            var scaleFactor = req.body[i].scaleFactor;
            var meanGaurdUpper = req.body[i].meanGaurdPlus;
            var meanGaurdLower= req.body[i].meanGaurdMinus;
            var cycleCount=req.body[i].cycleCount;
            //var queryString="select * from Z_EMPLOYEE where EMP_ID='" + eid + "' and EMP_NAME='"+ename+"'";
            //console.log("/api/insert/empDetails SQL :" + queryString);
            var queryString = "insert into Z_BOM_TOLERANCES (PLANT,ERP_SEQUENCE,BOM,BOM_VERSION,COMPONENT,COMPONENT_VERSION,COMPONENT_TYPE,UOM,TARGET,LOWER_TOLERANCE,UPPER_TOLERANCE,SCALE_FACTOR,MEAN_GAURD_PLUS,MEAN_GAURD_MINUS,CYCLE_COUNT_FOR_TDO) values('" + plant + "','" + erpSequence + "','" + bom + "','" +bomVersion + "','"+component+"','"+componentVersion+"','"+componentType+"','"+uom+"','"+target+"','"+minTolerance+"','"+maxTolerance+"','"+scaleFactor+"','"+meanGaurdUpper+"','"+meanGaurdLower+"','"+cycleCount+"')";
            console.log("/api/insert/bomData SQL :" + queryString);
            dbConnection.exec(queryString, function (err, result) {
            if (err) throw err;
            console.log(bom + "- BOM  Data inserted successfully");
          });
        }
        
        res.send("BOM  Data inserted successfully");
        dbConnection.disconnect();
        });
    } else
        res.send("Request Body can't be empty");
}); */

/* app.post('/api/insert/bomData', async function (req, res) {
    console.log("Inside /api/insert/bomData POST method");

    if (!req.body || req.body.length === 0) {
        return res.status(400).send("Request body can't be empty");
    }
    console.log(req.body);
    const dbConnection = hana.createConnection();
    console.log("DB Connection Object:", dbConnection);

    try {
        // Connect to the database
        await new Promise((resolve, reject) => {
            dbConnection.connect(dapConnOptions, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        console.log("Database connected successfully.");

        // Prepare and execute insert queries
        const queries = req.body.map((item) => {
            var material=item.component;
            console.log(18-material.length);
            var difference=18-material.length;
            var zerosString="";
            var component;
            if(difference!=0){
            for(var i=0;i<difference;i++)
            {
                zerosString=zerosString+"0";
                
            }
            component=zerosString+material;
            }
            else{
                
                component=material;
            }
            const queryString = `
                INSERT INTO Z_BOM_TOLERANCES (
                    PLANT, ERP_SEQUENCE, BOM, BOM_VERSION, COMPONENT, COMPONENT_VERSION,
                    COMPONENT_TYPE, UOM, TARGET, LOWER_TOLERANCE, UPPER_TOLERANCE,
                    SCALE_FACTOR, MEAN_GAURD_PLUS, MEAN_GAURD_MINUS, CYCLE_COUNT_FOR_TDO
                ) VALUES (
                    '${item.plant}', '${item.erpSequence}', '${item.bom}', '${item.bomVersion}',
                    '${component}', '${item.componentVersion}', '${item.componentType}',
                    '${item.unitOfMeasure}', '${item.target}', '${item.minTolerance}',
                    '${item.maxTolerance}', '${item.scaleFactor}', '${item.meanGaurdPlus}',
                    '${item.meanGaurdMinus}', '${item.tdoAdjustCycle}'
                )`;
            console.log("QueryString="+queryString);
            return new Promise((resolve, reject) => {
                dbConnection.exec(queryString, (err, result) => {
                    if (err) return reject(err);
                    console.log(`${item.bom} - BOM Data inserted successfully`);
                    resolve();
                });
            });
        });
        console.log(queries);
        // Wait for all queries to complete
        await Promise.all(queries);

        res.send("All BOM Data inserted successfully");
    } catch (err) {
        console.error("Error inserting BOM data:", err);
        res.status(500).send("Error inserting BOM data");
    } finally {
        // Ensure the connection is closed
        dbConnection.disconnect();
        console.log("Database connection closed.");
    }
}); */

//To insert BOM tolerances to HANA DB from S/4
app.post('/api/insert/bomData', async function (req, res) {
  console.log('Inside /api/insert/bomData POST method');

  if (!req.body || req.body.length === 0) {
    return res.status(400).send("Request body can't be empty");
  }
  console.log(req.body);
  const dbConnection = hana.createConnection();
  console.log('DB Connection Object:', dbConnection);

  try {
    // Connect to the database
    await new Promise((resolve, reject) => {
      dbConnection.connect(dapConnOptions, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    console.log('Database connected successfully.');

    // Prepare and execute queries
    const queries = req.body.map(async (item) => {
      var material = item.component;
      var component = material; //newly addedd
      // var difference = 18 - material.length;
      // var zerosString = "";
      //var component;

      // if (difference > 0) {
      //     for (var i = 0; i < difference; i++) {
      //         zerosString += "0";
      //     }
      //     component = zerosString + material;
      // } else {
      //     component = material;
      // }

      // Check if the row exists
      const checkQuery = `
                SELECT 1 
                FROM Z_BOM_TOLERANCES
                WHERE PLANT='${item.plant}' AND COMPONENT = '${component}' AND BOM = '${item.bom}' AND ERP_SEQUENCE = '${item.erpSequence}'
            `;
      console.log('CheckQuery: ' + checkQuery);

      const rows = await new Promise((resolve, reject) => {
        dbConnection.exec(checkQuery, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });

      console.log(`Rows found: ${JSON.stringify(rows)}`);

      // If rows exist, delete them
      if (rows.length > 0) {
        const deleteQuery = `
                    DELETE FROM Z_BOM_TOLERANCES
                    WHERE PLANT='${item.plant}' AND COMPONENT = '${component}' AND BOM = '${item.bom}' AND ERP_SEQUENCE = '${item.erpSequence}'
                `;
        console.log('DeleteQuery: ' + deleteQuery);

        await new Promise((resolve, reject) => {
          dbConnection.exec(deleteQuery, (err, result) => {
            if (err) return reject(err);
            console.log(`${item.bom} - Existing rows deleted successfully`);
            resolve(result);
          });
        });
      }

      // Insert new row
      const insertQuery = `
                INSERT INTO Z_BOM_TOLERANCES (
                    PLANT, ERP_SEQUENCE, BOM, BOM_VERSION, COMPONENT, COMPONENT_VERSION,
                    COMPONENT_TYPE, UOM, TARGET, LOWER_TOLERANCE, UPPER_TOLERANCE,
                    SCALE_FACTOR, MEAN_GAURD_PLUS, MEAN_GAURD_MINUS, CYCLE_COUNT_FOR_TDO
                ) VALUES (
                    '${item.plant}', '${item.erpSequence}', '${item.bom}', '${item.bomVersion}',
                    '${component}', '${item.componentVersion}', '${item.componentType}',
                    '${item.unitOfMeasure}', '${item.target}', '${item.minTolerance}',
                    '${item.maxTolerance}', '${item.scaleFactor}', '${item.meanGaurdPlus}',
                    '${item.meanGaurdMinus}', '${item.tdoAdjustCycle}'
                )
            `;
      console.log('InsertQuery: ' + insertQuery);

      await new Promise((resolve, reject) => {
        dbConnection.exec(insertQuery, (err, result) => {
          if (err) return reject(err);
          console.log(`${item.bom} - BOM Data inserted successfully`);
          resolve(result);
        });
      });
    });

    // Wait for all queries to complete
    await Promise.all(queries);

    res.send('All BOM Data inserted successfully');
  } catch (err) {
    console.error('Error inserting BOM data:', err);
    res.status(500).send('Error inserting BOM data');
  } finally {
    // Ensure the connection is closed
    dbConnection.disconnect();
    console.log('Database connection closed.');
  }
});

//To delete BOM data from HANA DB from S/4
app.post('/api/delete/bomData', async function (req, res) {
  console.log('Inside /api/delete/bomData POST method');

  if (!req.body || req.body.length === 0) {
    return res.status(400).send("Request body can't be empty");
  }
  console.log(req.body);
  const dbConnection = hana.createConnection();
  console.log('DB Connection Object:', dbConnection);

  try {
    // Connect to the database
    await new Promise((resolve, reject) => {
      dbConnection.connect(dapConnOptions, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    console.log('Database connected successfully.');

    // Prepare and execute queries
    const queries = req.body.map(async (item) => {
      // var material = item.component;
      // var component=material; //newly addedd
      // var difference = 18 - material.length;
      // var zerosString = "";
      //var component;

      // if (difference > 0) {
      //     for (var i = 0; i < difference; i++) {
      //         zerosString += "0";
      //     }
      //     component = zerosString + material;
      // } else {
      //     component = material;
      // }

      // Check if the row exists
      const checkQuery = `
                SELECT 1 
                FROM Z_BOM_TOLERANCES
                WHERE PLANT='${item.plant}' AND COMPONENT = '${item.component}' AND BOM = '${item.bom}' AND ERP_SEQUENCE = '${item.erpSequence}'
            `;
      console.log('CheckQuery: ' + checkQuery);

      const rows = await new Promise((resolve, reject) => {
        dbConnection.exec(checkQuery, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });

      console.log(`Rows found: ${JSON.stringify(rows)}`);

      // If rows exist, delete them
      if (rows.length > 0) {
        const deleteQuery = `
                    DELETE FROM Z_BOM_TOLERANCES
                    WHERE PLANT='${item.plant}' AND COMPONENT = '${item.component}' AND BOM = '${item.bom}' AND ERP_SEQUENCE = '${item.erpSequence}'
                `;
        console.log('DeleteQuery: ' + deleteQuery);

        await new Promise((resolve, reject) => {
          dbConnection.exec(deleteQuery, (err, result) => {
            if (err) return reject(err);
            console.log(`${item.bom} - Existing rows deleted successfully`);
            resolve(result);
          });
        });
      }
    });

    // Wait for all queries to complete
    await Promise.all(queries);

    res.send('All BOM Data Deleted successfully');
  } catch (err) {
    console.error('Error Deleting BOM data:', err);
    res.status(500).send('Error Deleting BOM data');
  } finally {
    // Ensure the connection is closed
    dbConnection.disconnect();
    console.log('Database connection closed.');
  }
});

app.post('/api/insert/personalizedTolerances', async function (req, res) {
  console.log('Inside /api/insert/personalizedTolerances POST method');
  if (req.body != undefined) {
    var dbConnection = hana.createConnection();
    console.log('DB Connection Object : ' + dbConnection);
    dbConnection.connect(dapConnOptions, function (err) {
      if (err) throw err;
      var workcenter = req.body.WORK_CENTER;
      var operator = req.body.OPERATOR;
      var component = req.body.COMPONENT;
      var minTol = req.body.MIN_TOL;
      var maxTol = req.body.MAX_TOL;
      var target = req.body.TARGET;
      var mg = req.body.MEAN_GAURD;
      var tdoset = req.body.TDO_SET;
      console.log('type=' + typeof mg);
      var queryString =
        "select * from Z_OPERATOR where OPERATOR='" + operator + "' and WORK_CENTER='" + workcenter + "' and COMPONENT='" + component + "'";
      console.log('/api/insert/operatorDetails SQL :' + queryString);
      dbConnection.exec(queryString, function (err, result) {
        if (err) throw err;
        console.log(result);
        if (result.length == 0) {
          var queryString =
            "insert into Z_OPERATOR (OPERATOR,WORK_CENTER,COMPONENT,MIN_TOLELANCE,MAX_TOLERANCE,TARGET_VALUE,MEAN_GAURD,TDO_SET) values('" +
            operator +
            "','" +
            workcenter +
            "','" +
            component +
            "','" +
            minTol +
            "','" +
            maxTol +
            "','" +
            target +
            "','" +
            mg +
            "','" +
            tdoset +
            "')";
          console.log('/api/insert/personalizedTolerances SQL :' + queryString);
          dbConnection.exec(queryString, function (err, result) {
            if (err) throw err;
            console.log(' Personalized Tolerances Data inserted successfully');
            res.send(' Personalized Tolerances Data inserted successfully');
            dbConnection.disconnect();
          });
        } else {
          var queryString =
            "update  Z_OPERATOR SET MIN_TOLELANCE='" +
            minTol +
            "',MAX_TOLERANCE='" +
            maxTol +
            "' ,TARGET_VALUE='" +
            target +
            "',MEAN_GAURD='" +
            mg +
            "',TDO_SET='" +
            tdoset +
            "' WHERE OPERATOR='" +
            operator +
            "' and WORK_CENTER='" +
            workcenter +
            "' and COMPONENT='" +
            component +
            "'";
          console.log('/api/insert/operatorDetails SQL :' + queryString);
          dbConnection.exec(queryString, function (err, result) {
            if (err) throw err;
            console.log(' Personalized Tolerances Data Updated successfully');
            res.send(' Personalized Tolerances Data Updated successfully');
            dbConnection.disconnect();
          });
        }
      });
    });
  } else res.send("Request Body can't be empty");
});

app.post('/api/get/bomTolerances', async function (req, res) {
  console.log('Inside /api/get/bomTolerances POST method');
  if (req.body != undefined) {
    var dbConnection = hana.createConnection();
    console.log('DB Connection Object : ' + dbConnection);
    console.log(req.body);
    dbConnection.connect(dapConnOptions, function (err) {
      if (err) throw err;
      console.log('Connected');
      var bom = req.body.BOM;
      var erpBom = req.body.ERP_BOM;
      var erpSequence = req.body.ERP_SEQUENCE;
      var bomVersion = req.body.BOM_VERSION;
      var component = req.body.COMPONENT;
      var componentVersion = req.body.COMPONENT_VERSION;
      var order = req.body.ORDER;
      var operator = req.body.OPERATOR;
      var workcenter = req.body.WORKCENTER;
      var plant = req.body.PLANT;
      var portioning = req.body.PORTIONING;
      var active = 1;
      console.log('portioning=' + portioning);
      if (portioning == 'true') {
        var queryString =
          "select * from Z_PERSONALIZED_TOLERANCES where PLANT='" +
          plant +
          "' and ERP_BOM='" +
          erpBom +
          "' and OPERATOR='" +
          operator +
          "' and WORKCENTER='" +
          workcenter +
          "' and COMPONENT='" +
          component +
          "'and COMPONENT_VERSION='" +
          componentVersion +
          "'and BOM='" +
          bom +
          "'and BOM_VERSION='" +
          bomVersion +
          '\'and "ORDER"=\'' +
          order +
          "'and ACTIVE='" +
          active +
          "'";
        console.log('/api/get/bomTolerances from personalized table SQL :' + queryString);
        dbConnection.exec(queryString, function (err, result) {
          if (err) throw err;
          console.log(result);
          if (result.length != 0) {
            console.log(' Operator Personalized tolerancen Details fetched successfully');
            res.send(result);
            dbConnection.disconnect();
          } else {
            console.log('No data found');
            res.send('No data found');
          }
        });
      } else {
        var queryString =
          "select * from Z_BOM_TOLERANCES where PLANT='" + plant + "' and BOM='" + erpBom + "' and COMPONENT='" + component + "'"; //and COMPONENT_VERSION='" + componentVersion + "'";
        console.log('/api/get/bomTolerances from BOM table SQL :' + queryString);
        dbConnection.exec(queryString, function (err, result) {
          if (err) throw err;
          console.log(result);
          // var response={
          //     "workCenter": result[0].WORK_CENTER,
          //     "operator": result[0].OPERATOR,
          //     "component": result[0].COMPONENT,
          //     "minimumTolerance": result[0].MIN_TOLELANCE,
          //     "maximumTolerance":result[0].MAX_TOLERANCE,
          //     "target":result[0].TARGET_VALUE,
          //     "meanGaurd":result[0].MEAN_GAURD,
          //     "tdoSet":result[0].TDO_SET
          //   }
          console.log('bomTolerances Details Fetched successfully');
          res.send(result);
          dbConnection.disconnect();
        });
      }
    });
  } else res.send("Request Body can't be empty");
});

app.post('/api/get/consumptionData', async function (req, res) {
  console.log('Inside /api/get/consumptionData POST method');
  if (req.body != undefined) {
    var dbConnection = hana.createConnection();
    console.log('DB Connection Object : ' + dbConnection);
    console.log(req.body);
    dbConnection.connect(dapConnOptions, function (err) {
      if (err) throw err;
      console.log('Connected');
      var plant = req.body.plant;
      var queryString =
        "select TO_DECIMAL(UPPER_TOLERANCE/1000,10,4) AS UPPER_TOL_IN_KG,TO_DECIMAL(LOWER_TOLERANCE/1000,10,4) AS LOWER_TOL_IN_KG,TO_DECIMAL(QUANTITY/1000,10,4) AS QTY_IN_KG ,TO_DECIMAL(TARGET/1000,10,4) AS TARGET_IN_KG ,* from Z_CONSUMPTION where PLANT='" +
        plant +
        "' ORDER BY CONSUMPTION_DATE DESC";
      console.log('/api/get/consumptionData SQL :' + queryString);
      dbConnection.exec(queryString, function (err, result) {
        if (err) throw err;
        console.log(result);
        console.log('Consumption Details Fetched successfully');
        res.send(result);
        dbConnection.disconnect();
      });
    });
  } else res.send("Request Body can't be empty");
});

app.post('/api/userCal/claculateTolerance', async function (req, res) {
  console.log('Inside /apiuserCal/claculateTolerance POST method');
  if (req.body != undefined) {
    var dbConnection = hana.createConnection();
    console.log('DB Connection Object : ' + dbConnection);
    console.log(req.body);
    dbConnection.connect(dapConnOptions, function (err) {
      if (err) throw err;
      console.log('Connected');
      var plant = req.body.PLANT;
      var orderNo = req.body.ORDER_NO;
      var material = req.body.MATERIAL;
      var operator = req.body.OPERATOR;
      var bom = req.body.BOM;
      var erpBOM = req.body.ERP_BOM;
      var erpSequence = req.body.ERP_SEQUENCE;
      var bomVersion = req.body.BOM_VERSION;
      var component = req.body.COMPONENT;
      var componentVersion = req.body.COMPONENT_VERSION;
      var portioning = 1;
      var queryString =
        "CALL TARGET_DYNAMIC_OPTIMIZATION_PROC_V2('" +
        plant +
        "','" +
        orderNo +
        "','" +
        material +
        "','" +
        operator +
        "','" +
        bom +
        "','" +
        erpBOM +
        // "','" +
        // erpSequence +
        "','" +
        bomVersion +
        "','" +
        component +
        "','" +
        componentVersion +
        "','" +
        portioning +
        "',OUTPUT_TABLE => ?);";
      console.log('/api/userCal/claculateTolerance SQL :' + queryString);
      dbConnection.exec(queryString, function (err, result) {
        if (err) throw err;
        console.log(result);
        console.log('Execution Successful');
        res.send(result);
        dbConnection.disconnect();
      });
    });
  } else res.send("Request Body can't be empty");
});

app.post('/api/insert/consumptionData', async function (req, res) {
  console.log('Inside /api/insert/consumptionData POST method');
  if (req.body != undefined) {
    console.log('Consumption Request Body=' + JSON.stringify(req.body));
    var dbConnection = hana.createConnection();
    console.log('DB Connection Object : ' + dbConnection);
    dbConnection.connect(dapConnOptions, function (err) {
      if (err) throw err;
      var plant = req.body.plant;
      var order = req.body.order;
      var operator = req.body.operator;
      var bom = req.body.bom;
      var batch = req.body.batch;
      var operation = req.body.operation;
      var uom = req.body.uom;
      var erpBom = req.body.erpBom;
      var erpSequence = req.body.erpSequence;
      var localSequence = req.body.localSequence;
      var bomVersion = req.body.bomVersion;
      var component = req.body.component;
      var componentVersion = req.body.componentVersion;
      var workcenter = req.body.workcenter;
      var resource = req.body.resource;
      var target = req.body.target;
      var minTolerance = req.body.minTolerance;
      var maxTolerance = req.body.maxTolerance;
      var qty = req.body.quantity;
      var portioning = req.body.portioning;
      var workcenterDesc = req.body.workcenterDesc;
      var headerMaterial = req.body.headerMaterial;
      var headerMaterialDesc = req.body.headerMaterialDesc;
      var componentDescription = req.body.componentDescription;
      var orderStatus = req.body.orderStatus;
      var storageLocation = req.body.storageLocation;
      //erpSequence=Number(erpSequence);
      console.log('loacalSequence= ' + localSequence);
      localSequence = Number(localSequence);
      console.log('loacalSequenceNumber= ' + localSequence);
      //var queryString="select * from Z_EMPLOYEE where EMP_ID='" + eid + "' and EMP_NAME='"+ename+"'";
      //console.log("/api/insert/empDetails SQL :" + queryString);

      /* ++BOC Shad Musthafa - Tare weight calculation */
      var currentGrossWeight = parseFloat(req.body.currentGrossWeight),
        tareActualWeight = 0;
      // if (currentGrossWeight && parseFloat(currentGrossWeight) >= 0) {
      if (parseFloat(currentGrossWeight) >= 0) {
        //Query to get the last consumption record
        // lag(CURRENT_GROSS_WEIGHT) over (partition by PLANT, OPERATOR, BATCH_NUMBER, BOM, BOM_VERSION, WORKCENTER, COMPONENT, COMPONENT_VERSION, RESOURCE  order by CONSUMPTION_DATE) as PREV_GROSS_WEIGHT
        var queryString = `select PLANT, OPERATOR, WORKCENTER, COMPONENT, RESOURCE, CONSUMPTION_DATE, QUANTITY,
                        CURRENT_GROSS_WEIGHT as PREV_GROSS_WEIGHT
                    from Z_CONSUMPTION
                    where PLANT = '${plant}' 
                        and OPERATOR = '${operator}'
                        and WORKCENTER = '${workcenter}'
                        and COMPONENT = '${component}'
                        and RESOURCE = '${resource}'
                    order by CONSUMPTION_DATE DESC
                    limit 1`;
        dbConnection.exec(queryString, function (err, result) {
          if (err) throw err;
          console.log('Previous consumption check ->', JSON.stringify(result));

          /*  Calculate the tare weight
              - If no previous consumption for the component with resource and operator mapping then current consumption is tare
              - If previous consumption available and
                - current gross weight less than previous       -> Not tare relevant
                - current gross weight greater than previous    -> Tare calculated
          */
          if (result && result.length > 0) {
            var fPreviousGrossWeight = parseFloat(result[0].PREV_GROSS_WEIGHT);
            // console.log('SMDEV Tare check ->', currentGrossWeight, fPreviousGrossWeight);
            console.log(`SMDEV Tare check -> Current: ${currentGrossWeight}, Previous: ${fPreviousGrossWeight}`);
            if (parseFloat(fPreviousGrossWeight) >= 0 && currentGrossWeight > fPreviousGrossWeight) {
              tareActualWeight = currentGrossWeight + parseFloat(qty);
            }
          } else {
            tareActualWeight = currentGrossWeight + parseFloat(qty);
            console.log('SMDEV Calc default ->', tareActualWeight);
          }

          console.log('SMDEV Tare WT ->', tareActualWeight);

          var queryString =
            "insert into Z_CONSUMPTION (PLANT,ORDER_NO,OPERATOR,BOM,BOM_VERSION,COMPONENT,COMPONENT_VERSION,RESOURCE,WORKCENTER,TARGET,LOWER_TOLERANCE,UPPER_TOLERANCE,QUANTITY,PORTIONING,ERP_BOM,WORKCENTER_DESCRIPTION,HEADER_MATERIAL,HEADER_MATERIAL_DESCRIPTION,COMPONENT_DESCRIPTION,ORDER_STATUS,UNIT_OF_MEASURE,BATCH_NUMBER,OPERATION,LOCAL_SEQUENCE,STORAGE_LOCATION,CURRENT_GROSS_WEIGHT,TARE_ACTUAL_WEIGHT) values('" +
            plant +
            "','" +
            order +
            "','" +
            operator +
            "','" +
            bom +
            "','" +
            bomVersion +
            "','" +
            component +
            "','" +
            componentVersion +
            "','" +
            resource +
            "','" +
            workcenter +
            "','" +
            target +
            "','" +
            minTolerance +
            "','" +
            maxTolerance +
            "','" +
            qty +
            "','" +
            portioning +
            "','" +
            erpBom +
            "','" +
            workcenterDesc +
            "','" +
            headerMaterial +
            "','" +
            headerMaterialDesc +
            "','" +
            componentDescription +
            "','" +
            orderStatus +
            "','" +
            uom +
            "','" +
            batch +
            "','" +
            operation +
            "','" +
            localSequence +
            "','" +
            storageLocation +
            "','" +
            currentGrossWeight +
            "','" +
            tareActualWeight +
            "')";

          console.log('/api/insert/consumptionData SQL :' + queryString);
          dbConnection.exec(queryString, function (err, result) {
            if (err) throw err;
            console.log(bom + '- consumption  Data inserted successfully');
            res.send(bom + '- consumption  Data inserted successfully');
            dbConnection.disconnect();
          });
        });
      }
      // var queryString = "insert into Z_CONSUMPTION (PLANT,ORDER_NO,OPERATOR,BOM,BOM_VERSION,COMPONENT,COMPONENT_VERSION,RESOURCE,WORKCENTER,TARGET,LOWER_TOLERANCE,UPPER_TOLERANCE,QUANTITY,PORTIONING,ERP_BOM,WORKCENTER_DESCRIPTION,HEADER_MATERIAL,HEADER_MATERIAL_DESCRIPTION,COMPONENT_DESCRIPTION,ORDER_STATUS,UNIT_OF_MEASURE,BATCH_NUMBER,OPERATION,LOCAL_SEQUENCE,STORAGE_LOCATION) values('" + plant + "','" + order + "','" + operator + "','" + bom + "','" +bomVersion + "','"+component+"','"+componentVersion+"','"+resource+"','"+workcenter+"','"+target+"','"+minTolerance+"','"+maxTolerance+"','"+qty+"','"+portioning+"','"+erpBom+"','"+workcenterDesc+"','"+headerMaterial+"','"+headerMaterialDesc+"','"+componentDescription+"','"+orderStatus+"','"+uom+"','"+batch+"','"+operation+"','"+localSequence+"','"+storageLocation+"')";
      // var queryString = "insert into Z_CONSUMPTION (PLANT,ORDER_NO,OPERATOR,BOM,BOM_VERSION,COMPONENT,COMPONENT_VERSION,RESOURCE,WORKCENTER,TARGET,LOWER_TOLERANCE,UPPER_TOLERANCE,QUANTITY,PORTIONING,ERP_BOM,WORKCENTER_DESCRIPTION,HEADER_MATERIAL,HEADER_MATERIAL_DESCRIPTION,COMPONENT_DESCRIPTION,ORDER_STATUS,UNIT_OF_MEASURE,BATCH_NUMBER,OPERATION,LOCAL_SEQUENCE,STORAGE_LOCATION,CURRENT_GROSS_WEIGHT,TARE_ACTUAL_WEIGHT) values('" + plant + "','" + order + "','" + operator + "','" + bom + "','" +bomVersion + "','"+component+"','"+componentVersion+"','"+resource+"','"+workcenter+"','"+target+"','"+minTolerance+"','"+maxTolerance+"','"+qty+"','"+portioning+"','"+erpBom+"','"+workcenterDesc+"','"+headerMaterial+"','"+headerMaterialDesc+"','"+componentDescription+"','"+orderStatus+"','"+uom+"','"+batch+"','"+operation+"','"+localSequence+"','"+storageLocation+"','" + currentGrossWeight + "','" + tareActualWeight + "')";

      // /* ++EOC Shad Musthafa - Tare Weight Calculation */

      // console.log("/api/insert/consumptionData SQL :" + queryString);
      // dbConnection.exec(queryString, function (err, result) {
      //     if (err) throw err;
      //     console.log(bom + "- consumption  Data inserted successfully");
      //     res.send(bom + "- consumption  Data inserted successfully");
      //     dbConnection.disconnect();
      // });
    });
  } else res.send("Request Body can't be empty");
});

app.post('/api/insert/initial/personalizedTolerances', async function (req, res) {
  console.log('Inside /api/insert/initial/personalizedTolerances POST method');
  if (req.body != undefined) {
    var dbConnection = hana.createConnection();
    console.log('DB Connection Object : ' + dbConnection);
    console.log('Request Body=' + req.body);
    dbConnection.connect(dapConnOptions, function (err) {
      if (err) throw err;
      var workcenter = req.body.workCenter;
      var operator = req.body.operator;
      var component = req.body.component;
      var componentVersion = req.body.componentVersion;
      var bom = req.body.bom;
      var bomVersion = req.body.bomVersion;
      var order = req.body.order;
      var material = req.body.material;
      var plant = req.body.plant;
      var resource = req.body.resource;
      var erpBOM = req.body.erpBOM;
      var erpSequence = req.body.erpSequence;
      var active = 1;
      console.log('type=' + typeof active);
      var queryString =
        "select * from Z_PERSONALIZED_TOLERANCES where PLANT='" +
        plant +
        "' and ERP_BOM='" +
        erpBOM +
        "'  and OPERATOR='" +
        operator +
        "' and WORKCENTER='" +
        workcenter +
        "' and COMPONENT='" +
        component +
        "'and COMPONENT_VERSION='" +
        componentVersion +
        "'and BOM='" +
        bom +
        "'and BOM_VERSION='" +
        bomVersion +
        '\'and "ORDER"=\'' +
        order +
        "'and ACTIVE='" +
        active +
        "'";
      console.log('/api/insert/initial/personalizedTolerances SQL :' + queryString);
      dbConnection.exec(queryString, function (err, result) {
        if (err) throw err;
        console.log(result);
        if (result.length == 0) {
          var queryString =
            "select * from Z_BOM_TOLERANCES where PLANT='" + plant + "'and COMPONENT='" + component + "'and BOM='" + erpBOM + "'";
          console.log('/api/insert/initial/personalizedTolerances SQL :' + queryString);
          dbConnection.exec(queryString, function (err, result) {
            if (err) throw err;
            console.log(result);
            if (result.length != 0) {
              var upperTolerance = result[0].UPPER_TOLERANCE;
              var lowerTolerance = result[0].LOWER_TOLERANCE;
              var target = result[0].TARGET;
              var scaleFactor = result[0].SCALE_FACTOR;
              var meanGaurdPlus = result[0].MEAN_GAURD_PLUS;
              var meanGaurdMinus = result[0].MEAN_GAURD_MINUS;
              var cycleCountForTDO = result[0].CYCLE_COUNT_FOR_TDO;
              var active = 1;

              var queryString =
                'insert into Z_PERSONALIZED_TOLERANCES (PLANT,"ORDER",MATERIAL,OPERATOR,WORKCENTER,ERP_BOM,BOM,BOM_VERSION,COMPONENT,COMPONENT_VERSION,TARGET,LOWER_TOLERANCE,UPPER_TOLERANCE,SCALE_FACTOR,MEAN_GAURD_PLUS,MEAN_GAURD_MINUS,ACTIVE,COUNT_FOR_TDO,RESOURCE) values(\'' +
                plant +
                "','" +
                order +
                "','" +
                material +
                "','" +
                operator +
                "','" +
                workcenter +
                "','" +
                erpBOM +
                "','" +
                bom +
                "','" +
                bomVersion +
                "','" +
                component +
                "','" +
                componentVersion +
                "','" +
                target +
                "','" +
                lowerTolerance +
                "','" +
                upperTolerance +
                "','" +
                scaleFactor +
                "','" +
                meanGaurdPlus +
                "','" +
                meanGaurdMinus +
                "','" +
                active +
                "','" +
                cycleCountForTDO +
                "','" +
                resource +
                "')";
              console.log('/api/insert/initial/personalizedTolerances SQL :' + queryString);
              dbConnection.exec(queryString, function (err, result) {
                if (err) throw err;
                console.log(' Operator Personalized tolerancen Details Data inserted successfully');
                res.send('Operator Personalized tolerancen Details Data inserted successfully');
                dbConnection.disconnect();
              });
            } else {
              console.log('The BOM Component data not found');
              res.send('The BOM Component data not found');
            }
          });
        } else {
          console.log('The required data already there');
          res.send('The required data already there');
        }
      });
    });
  } else res.send("Request Body can't be empty");
});

/* app.post('/api/get/personalizedTolerances', async function(req, res) {
    console.log("Inside /api/get/personalizedTolerances POST method");
    if (req.body != undefined) {
        var dbConnection = hana.createConnection();
        console.log("DB Connection Object : " + dbConnection);
        dbConnection.connect(dapConnOptions, function(err) {
            if (err) throw err;
            var workcenter = req.body.workCenter;
            var operator = req.body.operator;
            var component = req.body.component;
            var erpBom=req.body.erpBom;
            var erpSequence=req.body.erpSequence;
            var componentVersion = req.body.componentVersion;
            var bom = req.body.bom;
            var bomVersion = req.body.bomVersion;
            var order = req.body.order;
            var plant = req.body.plant;
            var active = 1;
            console.log("type=" + typeof(mg));
            var queryString = "select * from Z_PERSONALIZED_TOLERANCES where PLANT='" + plant + "' and ERP_BOM='" + erpBom + "' and ERP_SEQUENCE='" + erpSequence + "' and OPERATOR='" + operator + "' and WORKCENTER='" + workcenter + "' and COMPONENT='" + component + "'and COMPONENT_VERSION='" + componentVersion + "'and BOM='" + bom + "'and BOM_VERSION='" + bomVersion + "'and \"ORDER\"='" + order + "'and ACTIVE='" + active + "'";
            console.log("/api/get/personalizedTolerances SQL :" + queryString);
            dbConnection.exec(queryString, function(err, result) {
                if (err) throw err;
                console.log(result)
                if (result.length != 0) {
                    console.log(" Operator Personalized tolerancen Details fetched successfully");
                    res.send(result);
                    dbConnection.disconnect();
                } 
                else{
                    console.log("No data found");
                    res.send("No data found");
                }
            });

        });
    } else
        res.send("Request Body can't be empty");
}); */

app.post('/api/get/personalizedTolerances', async function (req, res) {
  console.log('Inside /api/get/personalizedTolerances POST method');
  if (req.body != undefined) {
    var dbConnection = hana.createConnection();
    console.log('DB Connection Object : ' + dbConnection);
    console.log(req.body);
    dbConnection.connect(dapConnOptions, function (err) {
      if (err) throw err;
      console.log('Connected');
      var plant = req.body.PLANT;
      var order = req.body.ORDER;
      var erpBOM = req.body.ERP_BOM;
      var erpSequence = req.body.ERP_SEQUENCE;
      var operator = req.body.OPERATOR;
      var bom = req.body.BOM;
      var bomVersion = req.body.BOM_VERSION;
      var component = req.body.COMPONENT;
      var componentVersion = req.body.COMPONENT_VERSION;
      var active = 1;
      // var queryString="select * from Z_PERSONALIZED_TOLERANCES where BOM='" + bom + "' and BOM_VERSION='"+bomVersion+"' and COMPONENT='"+component+"' and COMPONENT_VERSION='"+componentVersion+"'";
      var queryString =
        "select * from Z_PERSONALIZED_TOLERANCES where PLANT='" +
        plant +
        "' and ERP_BOM='" +
        erpBOM +
        "' and ERP_SEQUENCE='" +
        erpSequence +
        '\' and "ORDER"=\'' +
        order +
        "' and OPERATOR='" +
        operator +
        "' and BOM='" +
        bom +
        "' and BOM_VERSION='" +
        bomVersion +
        "' and COMPONENT='" +
        component +
        "' and COMPONENT_VERSION='" +
        componentVersion +
        "'and ACTIVE='" +
        active +
        "'";
      console.log('/api/get/personalizedTolerances SQL :' + queryString);
      dbConnection.exec(queryString, function (err, result) {
        if (err) throw err;
        console.log(result);
        console.log('Personalized Tolerances Details Fetched successfully');
        res.send(result);
        dbConnection.disconnect();
      });
    });
  } else res.send("Request Body can't be empty");
});

app.post('/api/get/realTimeConsumptionData', async function (req, res) {
  console.log('Inside /api/get/realTimeConsumptionData POST method');
  if (req.body != undefined) {
    var dbConnection = hana.createConnection();
    console.log('DB Connection Object : ' + dbConnection);
    console.log(req.body);
    dbConnection.connect(dapConnOptions, function (err) {
      if (err) throw err;
      console.log('Connected');
      var plant = req.body.plant;
      var resource = req.body.resource;
      var operator = req.body.operator;
      var order = req.body.order;
      var component = req.body.component;
      var fromDateandTime = req.body.fromDateAndTime;
      // var queryString =
      //   "select (select count(*) from Z_CONSUMPTION where TO_DATE( CONSUMPTION_DATE ) = CURRENT_DATE AND PLANT='" +
      //   plant +
      //   "' AND COMPONENT='" +
      //   component +
      //   "'  AND OPERATOR='" +
      //   operator +
      //   "' AND ORDER_NO='" +
      //   order +
      //   "') AS PORTION_COUNT,TO_DECIMAL(UPPER_TOLERANCE/1000,10,4) AS UPPER_TOL_IN_KG,TO_DECIMAL(LOWER_TOLERANCE/1000,10,4) AS LOWER_TOL_IN_KG,TO_DECIMAL(QUANTITY/1000,10,4) AS QTY_IN_KG,TO_DECIMAL(TARGET/1000,10,4) AS TARGET_IN_KG , * from Z_CONSUMPTION where PLANT='" +
      //   plant +
      //   "' AND RESOURCE='" +
      //   resource +
      //   "'  AND COMPONENT='" +
      //   component +
      //   "'  AND OPERATOR='" +
      //   operator +
      //   "' AND ORDER_NO='" +
      //   order +
      //   "' AND CONSUMPTION_DATE >= '" +
      //   fromDateandTime +
      //   "'";

      /* ++BOC Shad Musthafa - Query update
          - Use window function to capture portion_count
          - Join Z_BOM_TOLERANCES table to capture BOM tolerance data
      */

      var queryString = `
        SELECT
          count( quantity ) over (partition by cons.plant, cons.resource, cons.component, cons.operator, cons.order_no) as PORTION_COUNT,
          TO_DECIMAL(cons.UPPER_TOLERANCE / 1000, 10, 4) AS UPPER_TOL_IN_KG,
          TO_DECIMAL(cons.LOWER_TOLERANCE / 1000, 10, 4) AS LOWER_TOL_IN_KG,
          TO_DECIMAL(QUANTITY / 1000, 10, 4) AS QTY_IN_KG,
          TO_DECIMAL(cons.TARGET / 1000, 10, 4) AS TARGET_IN_KG,
          *,
          TO_DECIMAL(bom.upper_tolerance / 1000, 10, 4) AS BOM_UPPER_TOL,
          TO_DECIMAL(bom.lower_tolerance / 1000, 10, 4) AS BOM_LOWER_TOL
        FROM Z_CONSUMPTION as cons
        left join z_bom_tolerances as bom
          on bom.plant = cons.plant
          and bom.bom = cons.erp_bom
          and bom.component = cons.component
        WHERE
            cons.PLANT = '${plant}'
            AND cons.RESOURCE = '${resource}'
            AND cons.COMPONENT = '${component}'
            AND cons.OPERATOR = '${operator}'
            AND cons.ORDER_NO = '${order}'
            AND CONSUMPTION_DATE >= '${fromDateandTime}';`;
      // console.log('/api/get/realTimeConsumptionData SQL :' + queryString);
      console.log('DBAPI | Info | GET | realTimeConsumptionData | Realtime consumption query \n' + JSON.stringify(queryString));

      dbConnection.exec(queryString, function (err, result) {
        if (err) throw err;
        // console.log(result);
        // console.log('Consumption Details Fetched successfully');
        console.log('DBAPI | Info | GET | realTimeConsumptionData | Consumption Details Fetched successfully \n' + JSON.stringify(result));
        res.send(result);
        dbConnection.disconnect();
      });
    });
  } else res.send("Request Body can't be empty");
  /* ++EOC Shad Musthafa - Query update*/
});

app.get('/api/get/tareData', async function (req, res, next) {
  console.log('DBAPI | Info | GET | TARE_DATA | Get Tare Information Handler');

  //If the mandatory parameters are not available, thorw error
  if (!req.query.plant || !req.query.resource || !req.query.operator || !req.query.orderNo || !req.query.component) {
    var oError = new Error('Required query params missing');
    oError.status = 400;
    throw oError;
  }

  var sPlant = req.query.plant,
    sResource = req.query.resource,
    sOperator = req.query.operator,
    sOrderNo = req.query.orderNo,
    sComponent = req.query.component,
    sFromDateTime = req.query.fromTimestamp;

  var sQuery = `SELECT plant, resource, operator, order_no, component, consumption_date, 
                  TO_DECIMAL(tare_actual_weight / 1000, 10, 4) AS TARE_ACTUAL_WEIGHT          
                  FROM Z_CONSUMPTION
                  WHERE plant = '${sPlant}'
                    and resource = '${sResource}'
                    and operator = '${sOperator}'
                    and order_no = '${sOrderNo}'
                    and component = '${sComponent}'
                    ${sFromDateTime ? "and consumption_date > '" + sFromDateTime + "'" : ''}
                    and tare_actual_weight > 0 
                  ORDER BY consumption_date desc`;

  //Open connection to db
  var dbConnection = hana.createConnection();
  //Log query to console
  console.log('DBAPI | Info | GET | TARE_DATA | SQL Query| ' + JSON.stringify(sQuery));
  dbConnection.connect(dapConnOptions, function (err) {
    dbConnection.exec(sQuery, function (err, result) {
      if (err) throw err;
      console.log('DBAPI | Info | GET | TARE_DATA | Result | ' + JSON.stringify(result));
      console.log('DBAPI | Info | GET | TARE_DATA | Consumption Details Fetched successfully');
      res.send(result);
      dbConnection.disconnect();
    });
  });
});

/*
app.post('/api/get/realTimeConsumptionData', async function (req, res) {
    console.log("Inside /api/get/realTimeConsumptionData POST method");
    if (req.body != undefined) {
        var dbConnection = hana.createConnection();
        console.log("DB Connection Object : " + dbConnection);
        console.log(req.body)
        dbConnection.connect(dapConnOptions, function (err) {
            if (err) throw err;
            console.log("Connected");
            var plant=req.body.plant; 
            var resource=req.body.resource;
            var operator=req.body.operator;
            var order=req.body.order;
            var component=req.body.component;
            var fromDateandTime=req.body.fromDateAndTime;       
            var queryString="select (select count(*) from Z_CONSUMPTION where TO_DATE( CONSUMPTION_DATE ) = CURRENT_DATE AND PLANT='" + plant + "' AND COMPONENT='" + component + "'  AND OPERATOR='" + operator + "' AND ORDER_NO='" + order + "') AS PORTION_COUNT, * from Z_CONSUMPTION where PLANT='" + plant + "' AND RESOURCE='" + resource + "'  AND COMPONENT='" + component + "'  AND OPERATOR='" + operator + "' AND ORDER_NO='" + order + "' AND CONSUMPTION_DATE BETWEEN '" + fromDateandTime + "' AND CURRENT_TIMESTAMP";
            console.log("/api/get/realTimeConsumptionData SQL :" + queryString);
            dbConnection.exec(queryString, function (err, result) {
                if (err) throw err;
                console.log(result);
                console.log("Consumption Details Fetched successfully");
                res.send(result);
                dbConnection.disconnect();

            });
           
        });
    } 
    else
        res.send("Request Body can't be empty");
});*/

app.post('/api/insertAndUpdate/personalizedTolerances', async function (req, res) {
  console.log('Inside /api/insertAndUpdate/personalizedTolerances POST method');
  if (req.body != undefined) {
    var dbConnection = hana.createConnection();
    console.log('DB Connection Object : ' + dbConnection);
    console.log('Request Body=' + req.body);
    dbConnection.connect(dapConnOptions, function (err) {
      if (err) throw err;
      var workcenter = req.body.workCenter;
      var operator = req.body.operator;
      var component = req.body.component;
      var componentVersion = req.body.componentVersion;
      var bom = req.body.bom;
      var bomVersion = req.body.bomVersion;
      var order = req.body.order;
      var material = req.body.material;
      var plant = req.body.plant;
      var erpBOM = req.body.erpBOM;
      var erpSequence = req.body.erpSequence;
      var upperTolerance = req.body.upperTolerance;
      var lowerTolerance = req.body.lowerTolerance;
      var meanGaurdPlus = req.body.meanGaurdPlus;
      var meanGaurdMinus = req.body.meanGaurdMinus;
      var consecutiveThreshold = req.body.consecutiveThreshold;
      var cumulativeThreshold = req.body.cumulativeThreshold;
      var cumulativeCunsumption = req.body.cumulativeCunsumption;
      var tdoAdjustmentCycle = req.body.tdoAdjustmentCycle;

      var active = 1;
      console.log('type=' + typeof active);
      // var queryString = "select * from Z_PERSONALIZED_TOLERANCES where PLANT='" + plant + "' and MATERIAL='" + material + "' and ERP_BOM='" + erpBOM + "' and ERP_SEQUENCE='" + erpSequence + "' and OPERATOR='" + operator + "' and WORKCENTER='" + workcenter + "' and COMPONENT='" + component + "'and COMPONENT_VERSION='" + componentVersion + "'and BOM='" + bom + "'and BOM_VERSION='" + bomVersion + "'and \"ORDER\"='" + order + "'and ACTIVE='" + active + "'";
      var queryString =
        "select * from Z_PERSONALIZED_TOLERANCES where PLANT='" +
        plant +
        "' and MATERIAL='" +
        material +
        "' and ERP_BOM='" +
        erpBOM +
        "' and OPERATOR='" +
        operator +
        "' and WORKCENTER='" +
        workcenter +
        "' and COMPONENT='" +
        component +
        "'and COMPONENT_VERSION='" +
        componentVersion +
        "'and BOM='" +
        bom +
        "'and BOM_VERSION='" +
        bomVersion +
        '\'and "ORDER"=\'' +
        order +
        "'and ACTIVE='" +
        active +
        "'";
      console.log('/api/insertAndUpdate/personalizedTolerances SQL :' + queryString);
      dbConnection.exec(queryString, function (err, result) {
        if (err) throw err;
        console.log(result);
        if (result.length > 0) {
          var scaleFactor = result[0].SCALE_FACTOR;
          var target = result[0].TARGET;
          var resource = result[0].RESOURCE;
          var previoushandle = result[0].HANDLE;
          var cycleCountForTDO = result[0].COUNT_FOR_TDO;
          // var queryString =
          //   "UPDATE Z_PERSONALIZED_TOLERANCES SET ACTIVE=0 where PLANT='" +
          //   plant +
          //   "' and MATERIAL='" +
          //   material +
          //   "' and ERP_BOM='" +
          //   erpBOM +
          //   "' and ERP_SEQUENCE='" +
          //   erpSequence +
          //   "' and OPERATOR='" +
          //   operator +
          //   "' and WORKCENTER='" +
          //   workcenter +
          //   "' and COMPONENT='" +
          //   component +
          //   "'and COMPONENT_VERSION='" +
          //   componentVersion +
          //   "'and BOM='" +
          //   bom +
          //   "'and BOM_VERSION='" +
          //   bomVersion +
          //   '\'and "ORDER"=\'' +
          //   order +
          //   "'and ACTIVE='" +
          //   active +
          //   "'";
          var queryString =
            "UPDATE Z_PERSONALIZED_TOLERANCES SET ACTIVE=0 where PLANT='" +
            plant +
            "' and MATERIAL='" +
            material +
            "' and ERP_BOM='" +
            erpBOM +
            "' and OPERATOR='" +
            operator +
            "' and WORKCENTER='" +
            workcenter +
            "' and COMPONENT='" +
            component +
            "'and COMPONENT_VERSION='" +
            componentVersion +
            "'and BOM='" +
            bom +
            "'and BOM_VERSION='" +
            bomVersion +
            '\'and "ORDER"=\'' +
            order +
            "'and ACTIVE='" +
            active +
            "'";
          console.log('/api/insertAndUpdate/personalizedTolerances SQL :' + queryString);
          dbConnection.exec(queryString, function (err, result) {
            if (err) throw err;
            console.log(result);
            // var queryString =
            //   'insert into Z_PERSONALIZED_TOLERANCES (PLANT,"ORDER",MATERIAL,OPERATOR,WORKCENTER,ERP_BOM,ERP_SEQUENCE,BOM,BOM_VERSION,COMPONENT,COMPONENT_VERSION,TARGET,LOWER_TOLERANCE,UPPER_TOLERANCE,SCALE_FACTOR,MEAN_GAURD_PLUS,MEAN_GAURD_MINUS,ACTIVE,COUNT_FOR_TDO,RESOURCE,PREVIOUS_HANDLE,CONSECUTIVE_THRESHOLD_COUNT,CUMULATIVE_THRESHOLD_COUNT,CUMULATIVE_CONSUMPTION_LIMIT) values(\'' +
            //   plant +
            //   "','" +
            //   order +
            //   "','" +
            //   material +
            //   "','" +
            //   operator +
            //   "','" +
            //   workcenter +
            //   "','" +
            //   erpBOM +
            //   "','" +
            //   erpSequence +
            //   "','" +
            //   bom +
            //   "','" +
            //   bomVersion +
            //   "','" +
            //   component +
            //   "','" +
            //   componentVersion +
            //   "','" +
            //   target +
            //   "','" +
            //   lowerTolerance * 1000 +
            //   "','" +
            //   upperTolerance * 1000 +
            //   "','" +
            //   scaleFactor +
            //   "','" +
            //   meanGaurdPlus +
            //   "','" +
            //   meanGaurdMinus +
            //   "','" +
            //   active +
            //   "','" +
            //   tdoAdjustmentCycle +
            //   "','" +
            //   resource +
            //   "','" +
            //   previoushandle +
            //   "','" +
            //   consecutiveThreshold +
            //   "','" +
            //   cumulativeThreshold +
            //   "','" +
            //   cumulativeCunsumption +
            //   "')";
            var queryString =
              'insert into Z_PERSONALIZED_TOLERANCES (PLANT,"ORDER",MATERIAL,OPERATOR,WORKCENTER,ERP_BOM,BOM,BOM_VERSION,COMPONENT,COMPONENT_VERSION,TARGET,LOWER_TOLERANCE,UPPER_TOLERANCE,SCALE_FACTOR,MEAN_GAURD_PLUS,MEAN_GAURD_MINUS,ACTIVE,COUNT_FOR_TDO,RESOURCE,PREVIOUS_HANDLE,CONSECUTIVE_THRESHOLD_COUNT,CUMULATIVE_THRESHOLD_COUNT,CUMULATIVE_CONSUMPTION_LIMIT) values(\'' +
              plant +
              "','" +
              order +
              "','" +
              material +
              "','" +
              operator +
              "','" +
              workcenter +
              "','" +
              erpBOM +
              "','" +
              bom +
              "','" +
              bomVersion +
              "','" +
              component +
              "','" +
              componentVersion +
              "','" +
              target +
              "','" +
              lowerTolerance * 1000 +
              "','" +
              upperTolerance * 1000 +
              "','" +
              scaleFactor +
              "','" +
              meanGaurdPlus +
              "','" +
              meanGaurdMinus +
              "','" +
              active +
              "','" +
              tdoAdjustmentCycle +
              "','" +
              resource +
              "','" +
              previoushandle +
              "','" +
              consecutiveThreshold +
              "','" +
              cumulativeThreshold +
              "','" +
              cumulativeCunsumption +
              "')";
            console.log('Inserting PersonalizedTolerances SQL :' + queryString);
            dbConnection.exec(queryString, function (err, result) {
              if (err) throw err;
              console.log('Operator Personalized tolerances Data updated successfully');
              res.send('Operator Personalized tolerances Data updated successfully');
              dbConnection.disconnect();
            });
          });
        } else {
          console.log('Personalized data not found');
          res.send('Personalized data not found');
        }
      });
    });
  } else res.send("Request Body can't be empty");
});

app.post('/api/insertAndUpdate/operatorOccupancy', async function (req, res) {
  console.log('Inside /api/insertAndUpdate/operatorOccupancy POST method');
  if (req.body != undefined) {
    var dbConnection = hana.createConnection();
    console.log('DB Connection Object : ' + dbConnection);
    console.log('Request Body=' + req.body);
    dbConnection.connect(dapConnOptions, function (err) {
      if (err) throw err;

      var operator = req.body.operator;
      var resource = req.body.resource;
      var active = req.body.isAssigned;
      console.log('type=' + typeof active);
      var queryString = "select * from Z_OPERATOR_OCCUPANCY where OPERATOR='" + operator + "'";
      console.log('/api/insertAndUpdate/operatorOccupancy SQL :' + queryString);
      dbConnection.exec(queryString, function (err, result) {
        if (err) throw err;
        console.log(result);
        if (result.length == 0) {
          var queryString =
            "insert into Z_OPERATOR_OCCUPANCY (OPERATOR,RESOURCE,IS_ASSIGNED) values('" +
            operator +
            "','" +
            resource +
            "','" +
            active +
            "')";
          console.log('/api/insertAndUpdate/operatorOccupancy SQL :' + queryString);
          dbConnection.exec(queryString, function (err, result) {
            if (err) throw err;
            console.log(result);
            console.log('Operator Resource occupancy Data updated successfully');
            res.send('Operator Resource occupancy Data updated successfully');
            dbConnection.disconnect();
          });
        } else {
          var queryString =
            "UPDATE Z_OPERATOR_OCCUPANCY SET RESOURCE='" + resource + "',IS_ASSIGNED='" + active + "' where OPERATOR='" + operator + "'";
          console.log('/api/insertAndUpdate/operatorOccupancy SQL :' + queryString);
          dbConnection.exec(queryString, function (err, result) {
            if (err) throw err;
            console.log('Operator Resource occupancy Data updated successfully');
            res.send('Operator Resource occupancy Data updated successfully');
            dbConnection.disconnect();
          });
        }
      });
    });
  } else res.send("Request Body can't be empty");
});

app.post('/api/test/operatorOccupancy', async function (req, res) {
  console.log('Inside /api/test/operatorOccupancy POST method');
  if (req.body != undefined) {
    var dbConnection = hana.createConnection();
    console.log('DB Connection Object : ' + dbConnection);
    console.log('Request Body=' + req.body);
    dbConnection.connect(dapConnOptions, function (err) {
      if (err) throw err;

      var operator = req.body.operator;
      var resource = req.body.resource;
      console.log('type=' + typeof active);
      var queryString = "select * from Z_OPERATOR_OCCUPANCY where OPERATOR='" + operator + "' AND IS_ASSIGNED=1";
      console.log('/api/test/operatorOccupancy SQL :' + queryString);
      dbConnection.exec(queryString, function (err, result) {
        if (err) throw err;
        console.log(result);
        console.log('Operator Assignement is successfully fetched ');
        res.send(result);
        dbConnection.disconnect();
      });
    });
  } else res.send("Request Body can't be empty");
});

app.post('/api/clear/resourceOccupancy', async function (req, res) {
  console.log('Incoming Request Headers:', req.headers);
  console.log('Inside /api/clear/resourceOccupancy POST method');
  if (req.body != undefined) {
    var dbConnection = hana.createConnection();
    console.log('DB Connection Object : ' + dbConnection);
    console.log('Request Body=' + req.body);
    dbConnection.connect(dapConnOptions, function (err) {
      if (err) throw err;

      var operator = req.body.operator;
      var resource = req.body.resource;
      var active = req.body.isAssigned;
      console.log('type=' + typeof active);
      var queryString = "select * from Z_OPERATOR_OCCUPANCY where RESOURCE='" + resource + "'";
      console.log('/api/clear/resourceOccupancy SQL :' + queryString);
      dbConnection.exec(queryString, function (err, result) {
        if (err) throw err;
        console.log(result);
        if (result.length > 0) {
          var queryString = "UPDATE Z_OPERATOR_OCCUPANCY SET RESOURCE='' , IS_ASSIGNED=0 where RESOURCE='" + resource + "'";
          console.log('/api/clear/resourceOccupancy SQL :' + queryString);
          dbConnection.exec(queryString, function (err, result) {
            if (err) throw err;
            console.log('Operator Resource occupancy Data cleared successfully');
            res.send('Operator Resource occupancy Data cleared successfully');
            dbConnection.disconnect();
          });
        } else {
          res.send('Nothing needs to be cleared');
        }
      });
    });
  } else res.send("Request Body can't be empty");
});

app.post('/api/insertOrUpdate/assignenmentDetails', async function (req, res) {
  console.log('Inside /api/insertOrUpdate/assignenmentDetails POST method');
  if (req.body != undefined) {
    var dbConnection = hana.createConnection();
    console.log('DB Connection Object : ' + dbConnection);
    dbConnection.connect(dapConnOptions, function (err) {
      if (err) throw err;
      var workcenter = req.body.workcenter;
      var operator = req.body.operator;
      var component = req.body.component;
      var seatNumber = req.body.seatNumber;
      var componentSequence = req.body.componentSequence;
      var material = req.body.material;
      var plant = req.body.plant;
      var acceptanceDelay = req.body.acceptanceDelay;
      var correctionTime = req.body.correctionTime;
      var resource = req.body.resource;
      var active = req.body.active;

      var queryString =
        "select * from Z_ASSIGNMENT where SEAT_NUMBER='" +
        seatNumber +
        "' and COMPONENT_SEQUENCE='" +
        componentSequence +
        "' and WORK_CENTER='" +
        workcenter +
        "' and COMPONENT='" +
        component +
        "' and MATERIAL='" +
        material +
        "' and PLANT='" +
        plant +
        "'";
      console.log('/api/insertOrUpdate/assignenmentDetails SQL :' + queryString);
      dbConnection.exec(queryString, function (err, result) {
        if (err) throw err;
        console.log(result);
        if (result.length == 0) {
          var queryString =
            "insert into Z_ASSIGNMENT (PLANT,SEAT_NUMBER,COMPONENT_SEQUENCE,OPERATOR,WORK_CENTER,COMPONENT,MATERIAL,RESOURCE,ACCEPTANCE_DELAY,CORRECTION_TIME,ACTIVE,UPDATED_DATE_TIME) values('" +
            plant +
            "','" +
            seatNumber +
            "','" +
            componentSequence +
            "','" +
            operator +
            "','" +
            workcenter +
            "','" +
            component +
            "','" +
            material +
            "','" +
            resource +
            "','" +
            acceptanceDelay +
            "','" +
            correctionTime +
            "','" +
            active +
            "',ADD_SECONDS(CURRENT_UTCTIMESTAMP, 3 * 3600))";
          console.log('/api/insertOrUpdate/assignenmentDetails SQL :' + queryString);
          dbConnection.exec(queryString, function (err, result) {
            if (err) throw err;
            console.log(' Assignment Details  Updated successfully');
            res.send(' Assignment Details  Updated successfully');
            dbConnection.disconnect();
          });
        } else {
          var queryString =
            "update  Z_ASSIGNMENT SET OPERATOR='" +
            operator +
            "',RESOURCE='" +
            resource +
            "' ,ACCEPTANCE_DELAY='" +
            acceptanceDelay +
            "',CORRECTION_TIME='" +
            correctionTime +
            "',ACTIVE='" +
            active +
            "', UPDATED_DATE_TIME=ADD_SECONDS(CURRENT_UTCTIMESTAMP, 3 * 3600) WHERE SEAT_NUMBER='" +
            seatNumber +
            "' and COMPONENT_SEQUENCE='" +
            componentSequence +
            "' and WORK_CENTER='" +
            workcenter +
            "' and COMPONENT='" +
            component +
            "' and MATERIAL='" +
            material +
            "' and PLANT='" +
            plant +
            "'";
          console.log('/api/insertOrUpdate/assignenmentDetails SQL :' + queryString);
          dbConnection.exec(queryString, function (err, result) {
            if (err) throw err;
            console.log(' Assignment Details  Updated successfully');
            res.send(' Assignment Details  Updated successfully');
            dbConnection.disconnect();
          });
        }
      });
    });
  } else res.send("Request Body can't be empty");
});

app.post('/api/massUpdate/assignenmentDetails', async function (req, res) {
  console.log('Inside /api/massUpdate/assignenmentDetails POST method');

  if (!req.body || req.body.length === 0) {
    return res.status(400).send("Request body can't be empty");
  }
  console.log(req.body);
  const dbConnection = hana.createConnection();
  console.log('DB Connection Object:', dbConnection);

  try {
    // Connect to the database
    await new Promise((resolve, reject) => {
      dbConnection.connect(dapConnOptions, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    console.log('Database connected successfully.');

    // Prepare and execute queries
    const queries = req.body.map(async (item) => {
      // Check if the row exists
      const checkQuery =
        "select * from Z_ASSIGNMENT where SEAT_NUMBER='" +
        item.seatNumber +
        "' and COMPONENT_SEQUENCE='" +
        item.componentSequence +
        "' and WORK_CENTER='" +
        item.workcenter +
        "' and COMPONENT='" +
        item.component +
        "' and MATERIAL='" +
        item.material +
        "' and PLANT='" +
        item.plant +
        "'";
      console.log('CheckQuery: ' + checkQuery);

      const rows = await new Promise((resolve, reject) => {
        dbConnection.exec(checkQuery, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });

      console.log(`Rows found: ${JSON.stringify(rows)}`);

      // If rows exist, delete them
      if (rows.length > 0) {
        const updateQuery =
          "update  Z_ASSIGNMENT SET OPERATOR='" +
          item.operator +
          "',RESOURCE='" +
          item.resource +
          "' ,ACCEPTANCE_DELAY='" +
          item.acceptanceDelay +
          "',CORRECTION_TIME='" +
          item.correctionTime +
          "',ACTIVE='" +
          item.active +
          "', UPDATED_DATE_TIME=ADD_SECONDS(CURRENT_UTCTIMESTAMP, 3 * 3600) WHERE SEAT_NUMBER='" +
          item.seatNumber +
          "' and COMPONENT_SEQUENCE='" +
          item.componentSequence +
          "'and WORK_CENTER='" +
          item.workcenter +
          "' and COMPONENT='" +
          item.component +
          "' and MATERIAL='" +
          item.material +
          "' and PLANT='" +
          item.plant +
          "'";
        console.log('updateQuery: ' + updateQuery);

        await new Promise((resolve, reject) => {
          dbConnection.exec(updateQuery, (err, result) => {
            if (err) return reject(err);
            console.log(`Existing rows updated successfully`);
            resolve(result);
          });
        });
      } else {
        // Insert new row
        const insertQuery =
          "insert into Z_ASSIGNMENT (PLANT,SEAT_NUMBER,COMPONENT_SEQUENCE,OPERATOR,WORK_CENTER,COMPONENT,MATERIAL,RESOURCE,ACCEPTANCE_DELAY,CORRECTION_TIME,ACTIVE,UPDATED_DATE_TIME) values('" +
          item.plant +
          "','" +
          item.seatNumber +
          "','" +
          item.componentSequence +
          "','" +
          item.operator +
          "','" +
          item.workcenter +
          "','" +
          item.component +
          "','" +
          item.material +
          "','" +
          item.resource +
          "','" +
          item.acceptanceDelay +
          "','" +
          item.correctionTime +
          "','" +
          item.active +
          "',ADD_SECONDS(CURRENT_UTCTIMESTAMP, 3 * 3600))";
        console.log('InsertQuery: ' + insertQuery);

        await new Promise((resolve, reject) => {
          dbConnection.exec(insertQuery, (err, result) => {
            if (err) return reject(err);
            console.log(` BOM Data inserted successfully`);
            resolve(result);
          });
        });
      }
    });

    // Wait for all queries to complete
    await Promise.all(queries);

    res.send('All assignment Data inserted successfully');
  } catch (err) {
    console.error('Error inserting assignment data:', err);
    res.status(500).send('Error inserting assignment data');
  } finally {
    // Ensure the connection is closed
    dbConnection.disconnect();
    console.log('Database connection closed.');
  }
});

app.post('/api/get/assignmentDetails', async function (req, res) {
  console.log('Inside /api/get/assignmentDetails POST method');
  if (req.body != undefined) {
    var dbConnection = hana.createConnection();
    console.log('DB Connection Object : ' + dbConnection);
    console.log(req.body);
    dbConnection.connect(dapConnOptions, function (err) {
      if (err) throw err;
      console.log('Connected');
      var plant = req.body.plant;
      var material = req.body.material;
      var workcenter = req.body.workcenter;
      var queryString = "select * from Z_ASSIGNMENT where MATERIAL='" + material + "' and PLANT='" + plant + "'";
      console.log('/api/get/assignmentDetails SQL :' + queryString);
      dbConnection.exec(queryString, function (err, result) {
        if (err) throw err;
        console.log(result);
        console.log('Assignment Details Details Fetched successfully');
        res.send(result);
        dbConnection.disconnect();
      });
    });
  } else res.send("Request Body can't be empty");
});

app.post('/api/get/detailsForAdminScreen', async function (req, res) {
  console.log('Inside /api/get/detailsForAdminScreen POST method');
  if (req.body != undefined) {
    var dbConnection = hana.createConnection();
    console.log('DB Connection Object : ' + dbConnection);
    console.log(req.body);
    dbConnection.connect(dapConnOptions, function (err) {
      if (err) throw err;
      console.log('Connected');
      var plant = req.body.plant;
      var order = req.body.order;
      var material = req.body.material;
      var queryString =
        "select TO_DECIMAL(UPPER_TOLERANCE/1000,10,4) AS UPPER_TOL_IN_KG,TO_DECIMAL(LOWER_TOLERANCE/1000,10,4) AS LOWER_TOL_IN_KG,TO_DECIMAL(TARGET/1000,10,4) AS TARGET_IN_KG, * from Z_PERSONALIZED_TOLERANCES where PLANT='" +
        plant +
        "' and MATERIAL='" +
        material +
        '\' and "ORDER"=\'' +
        order +
        "'and ACTIVE=1";
      console.log('/api/get/detailsForAdminScreen SQL :' + queryString);
      dbConnection.exec(queryString, function (err, result) {
        if (err) throw err;
        console.log(result);
        console.log('Details for Admin screen Fetched successfully');
        res.send(result);
        dbConnection.disconnect();
      });
    });
  } else res.send("Request Body can't be empty");
});

app.post('/api/insert/AssetTagData', async function (req, res) {
  console.log('Inside /api/insert/AssetTagData POST method');
  if (req.body != undefined) {
    var dbConnection = hana.createConnection();
    console.log('DB Connection Object : ' + dbConnection);
    dbConnection.connect(dapConnOptions, function (err) {
      if (err) throw err;
      var Asset_Name = req.body.Asset_Name;
      var Batch_Information = req.body.Batch_Information;
      var AutoManualAccpectance = req.body.AutoManualAccpectance;
      console.log(typeof AutoManualAccpectance);
      //AutoManualAccpectance = JSON.parse(AutoManualAccpectance.toLowerCase());
      var AutoAcceptanceDelay = req.body.AutoAcceptanceDelay;
      var CorrectionTime = req.body.CorrectionTime;
      var Confirmed_Net_Weight = req.body.Confirmed_Net_Weight;
      var Confirmed_Gross_Weight = req.body.Confirmed_Gross_Weight;
      var Current_Gross_Weight = req.body.Current_Gross_Weight;
      var Current_Net_Weight = req.body.Current_Net_Weight;
      var Current_UOM = req.body.Current_UOM;
      var OperatorName = req.body.OperatorName;
      var Material_Number = req.body.Material_Number;
      var Material_Information = req.body.Material_Information;
      var Formulation_FalsePortioning_True = req.body.Formulation_FalsePortioning_True;
      //  Formulation_FalsePortioning_True=JSON.parse(Formulation_FalsePortioning_True.toLowerCase());
      var SFC = req.body.SFC;
      var Select_Scale_ID = req.body.Select_Scale_ID;
      var QuantityToConsume = req.body.QuantityToConsume;
      var Order = req.body.Order;
      var State_Signal = req.body.State_Signal;
      var Tare_Flag = req.body.Tare_Flag;
      // Tare_Flag=JSON.parse(Tare_Flag.toLowerCase());
      var Tare_Scale_PB = req.body.Tare_Scale_PB;
      // Tare_Scale_PB=JSON.parse(Tare_Scale_PB.toLowerCase());
      var TareWeight = req.body.TareWeight;
      //var queryString="select * from Z_EMPLOYEE where EMP_ID='" + eid + "' and EMP_NAME='"+ename+"'";
      //console.log("/api/insert/empDetails SQL :" + queryString);
      var queryString =
        'insert into Z_ASSET ("Asset_Name","Batch_Information","AutoManualAccpectance","AutoAcceptanceDelay","CorrectionTime","Confirmed_Net_Weight","Confirmed_Gross_Weight","Current_Net_Weight","Current_UOM","OperatorName","Material_Number","Material_Information","Formulation_FalsePortioning_True","SFC","Select_Scale_ID","QuantityToConsume","Order","State_Signal","Tare_Flag","Tare_Scale_PB","TareWeight") values(\'' +
        Asset_Name +
        "','" +
        Batch_Information +
        "','" +
        AutoManualAccpectance +
        "','" +
        AutoAcceptanceDelay +
        "','" +
        CorrectionTime +
        "','" +
        Confirmed_Net_Weight +
        "','" +
        Confirmed_Gross_Weight +
        "','" +
        Current_Net_Weight +
        "','" +
        Current_UOM +
        "','" +
        OperatorName +
        "','" +
        Material_Number +
        "','" +
        Material_Information +
        "','" +
        Formulation_FalsePortioning_True +
        "','" +
        SFC +
        "','" +
        Select_Scale_ID +
        "','" +
        QuantityToConsume +
        "','" +
        Order +
        "','" +
        State_Signal +
        "','" +
        Tare_Flag +
        "','" +
        Tare_Scale_PB +
        "','" +
        TareWeight +
        "')";
      var query = `INSERT INTO Z_ASSET 
("Asset_Name", "Batch_Information", "AutoManualAccpectance", "AutoAcceptanceDelay", 
"CorrectionTime", "Confirmed_Net_Weight", "Confirmed_Gross_Weight", "Current_Net_Weight", 
"Current_UOM", "OperatorName", "Material_Number", "Material_Information", 
"Formulation_FalsePortioning_True", "SFC", "Select_Scale_ID", "QuantityToConsume", "Order", 
"State_Signal", "Tare_Flag", "Tare_Scale_PB", "TareWeight") 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      var values = [
        Asset_Name,
        Batch_Information,
        AutoManualAccpectance,
        AutoAcceptanceDelay,
        CorrectionTime,
        Confirmed_Net_Weight,
        Confirmed_Gross_Weight,
        Current_Net_Weight,
        Current_UOM,
        OperatorName,
        Material_Number,
        Material_Information,
        Formulation_FalsePortioning_True,
        SFC,
        Select_Scale_ID,
        QuantityToConsume,
        Order,
        State_Signal,
        Tare_Flag,
        Tare_Scale_PB,
        TareWeight,
      ];
      console.log('/api/insert/AssetTagData SQL :' + query);
      console.log('/api/insert/AssetTagData SQL :' + values);
      dbConnection.exec(query, values, function (err, result) {
        if (err) throw err;
        console.log('AssetTagData  Data inserted successfully');
        res.send('AssetTagData  Data inserted successfully');
        dbConnection.disconnect();
      });
    });
  } else res.send("Request Body can't be empty");
});

app.get('/api/get/operatorOccupancy', async function (req, res) {
  console.log('Inside /api/test/operatorOccupancy POST method');

  var dbConnection = hana.createConnection();
  console.log('DB Connection Object : ' + dbConnection);
  console.log('Request Body=' + req.body);
  dbConnection.connect(dapConnOptions, function (err) {
    if (err) throw err;
    var queryString = 'select * from Z_OPERATOR_OCCUPANCY';
    console.log('/api/get/operatorOccupancy SQL');
    dbConnection.exec(queryString, function (err, result) {
      if (err) throw err;
      console.log(result);
      console.log('Operator Assignement is successfully fetched ');
      res.send(result);
      dbConnection.disconnect();
    });
  });
});

app.post('/api/insert/consumptionDataPCO', async function (req, res) {
  console.log('Inside /api/insert/consumptionDataPCO POST method');
  if (req.body != undefined) {
    var dbConnection = hana.createConnection();
    console.log('DB Connection Object : ' + dbConnection);
    dbConnection.connect(dapConnOptions, function (err) {
      if (err) throw err;
      var batch = req.body.Order.split(',');
      var materialRef = req.body.SFC.split(',');
      // $output.stOutPlant=batch[0];
      // $output.stOutOrder=batch[1];
      // $output.stOutSFC=batch[2];
      // $output.stOutOperationActivity=batch[3];
      // $output.stOutBOM=batch[4];
      // $output.stOutBOMVersion=batch[5];
      // $output.stOutWorkCenter=batch[6];
      // $output.outResource=batch[7];
      // $output.stOutErpBOM=batch[8];
      // $output.stOutWorkCenterDesc=batch[9];
      // $output.stOutHeaderMaterial=batch[10];
      // $output.stOutHeaderMaterialDesc=batch[11];
      // $output.stOutOrderStatus=batch[12];

      // $output.stOutMaterial=materialRef[0];
      // $output.stOutmaterialVersion=materialRef[1];
      // $output.stOutUOM=materialRef[2];
      // $output.stOutErpSequence=materialRef[3];
      // $output.stOutMaterialDescription=materialRef[4];
      // $output.stOutInventoryId=materialRef[5];
      var plant = batch[0];
      var order = batch[1];
      var operator = req.body.OperatorName;
      var bom = batch[4];
      var batch = req.body.Batch_Information;
      var operation = batch[3];
      var uom = materialRef[2];
      var erpBom = batch[8];
      var erpSequence = Number(materialRef[3]);
      var bomVersion = batch[5];
      var component = materialRef[0];
      var componentVersion = materialRef[1];
      var workcenter = batch[6];
      var resource = batch[7];
      var target = req.body.QuantityToConsume;
      var minTolerance = req.body.Tol_Minimum;
      var maxTolerance = req.body.Tol_Maximum;
      var qty = req.body.Confirmed_Net_Weight;
      var portioning = true;
      var workcenterDesc = batch[9];
      var headerMaterial = batch[10];
      var headerMaterialDesc = batch[11];
      var componentDescription = materialRef[4];
      var orderStatus = batch[12];
      //erpSequence=Number(erpSequence);
      //var queryString="select * from Z_EMPLOYEE where EMP_ID='" + eid + "' and EMP_NAME='"+ename+"'";
      //console.log("/api/insert/empDetails SQL :" + queryString);
      var queryString =
        "insert into Z_CONSUMPTION (PLANT,ORDER_NO,OPERATOR,BOM,BOM_VERSION,COMPONENT,COMPONENT_VERSION,RESOURCE,WORKCENTER,TARGET,LOWER_TOLERANCE,UPPER_TOLERANCE,QUANTITY,PORTIONING,ERP_BOM,ERP_SEQUENCE,WORKCENTER_DESCRIPTION,HEADER_MATERIAL,HEADER_MATERIAL_DESCRIPTION,COMPONENT_DESCRIPTION,ORDER_STATUS,UNIT_OF_MEASURE,BATCH_NUMBER,OPERATION) values('" +
        plant +
        "','" +
        order +
        "','" +
        operator +
        "','" +
        bom +
        "','" +
        bomVersion +
        "','" +
        component +
        "','" +
        componentVersion +
        "','" +
        resource +
        "','" +
        workcenter +
        "','" +
        target +
        "','" +
        minTolerance +
        "','" +
        maxTolerance +
        "','" +
        qty +
        "','" +
        portioning +
        "','" +
        erpBom +
        "','" +
        erpSequence +
        "','" +
        workcenterDesc +
        "','" +
        headerMaterial +
        "','" +
        headerMaterialDesc +
        "','" +
        componentDescription +
        "','" +
        orderStatus +
        "','" +
        uom +
        "','" +
        batch +
        "','" +
        operation +
        "')";
      console.log('/api/insert/consumptionDataPCO SQL :' + queryString);
      dbConnection.exec(queryString, function (err, result) {
        if (err) throw err;
        console.log(bom + '- consumption  Data inserted successfully');
        res.send(bom + '- consumption  Data inserted successfully');
        dbConnection.disconnect();
      });
    });
  } else res.send("Request Body can't be empty");
});

/* app.get('/api/get/consolidatedQuantity', async function (req, res) {
    console.log("Inside /api/get/consolidatedQuantity GET method");
    if (req.query != undefined) {
        var dbConnection = hana.createConnection();
        console.log("DB Connection Object : " + dbConnection);
        console.log(req.query)
        dbConnection.connect(dapConnOptions, function (err) {
            if (err) throw err;
            console.log("Connected");
            var plant=req.query.plant; 
            var order=req.query.order;
            var material=req.query.material; 
            var phase=req.query.phase; 
            var workcenter=req.query.workcenter;
            var component=req.query.component;  
            var erpSequence=req.query.erpSequence;
            erpSequence = parseInt(erpSequence, 10);
            var queryString = `SELECT 
                                SUM(QUANTITY)
                                FROM Z_CONSUMPTION 
                                WHERE PLANT = '${plant}' 
                                AND HEADER_MATERIAL = '${material}' 
                                AND "ORDER" = '${order}' 
                                AND "OPERATION" = '${phase}' 
                                AND "WORKCENTER" = '${workcenter}'
                                AND COMPONENT = '${component}'
                                AND ERP_SEQUENCE = '${erpSequence}' 
                                AND COUNTED_FOR_CONSOLIDATED_POSTING = 0;
                            `;
            console.log("/api/get/consolidatedQuantity SQL :" + queryString);
            dbConnection.exec(queryString, function (err, result) {
                if (err) throw err;
                console.log(result);
                console.log("Consolidated consumption quantity fetched successfully");
                res.send(result);
                dbConnection.disconnect();

            });
           
        });
    } 
    else
        res.send("Request query parameters can't be empty");
});

 app.get('/api/get/consolidatedQuantity', async function (req, res) {
    console.log("Inside /api/get/consolidatedQuantity GET method");

    if (Object.keys(req.query).length === 0) {
        return res.status(400).send("Request query parameters can't be empty");
    }

    var dbConnection = hana.createConnection();
    console.log("DB Connection Object:", dbConnection);

    dbConnection.connect(dapConnOptions, function (err) {
        if (err) {
            console.error("Database connection failed:", err);
            return res.status(500).send("Database connection error");
        }
        console.log("Connected");

        var { plant, order, material, phase, workcenter, component,erpSequence } = req.query;
        erpSequence = parseInt(erpSequence, 10);

        var queryString = `
            SELECT SUM(QUANTITY)/1000 AS TOTAL_QUANTITY
            FROM Z_CONSUMPTION 
            WHERE PLANT = ? 
            AND HEADER_MATERIAL = ? 
            AND "ORDER_NO" = ? 
            AND "OPERATION" = ? 
            AND "WORKCENTER" = ? 
            AND COMPONENT = ? 
            AND ERP_SEQUENCE = ?
            AND COUNTED_FOR_CONSOLIDATED_POSTING = 0;
        `;

        console.log("/api/get/consolidatedQuantity SQL:", queryString);

        dbConnection.exec(queryString, [plant, material, order, phase, workcenter, component, erpSequence], function (err, result) {
            if (err) {
                console.error("Query execution failed:", err);
                res.status(500).send("Error executing query");
            } else {
                console.log("Consolidated consumption quantity fetched successfully", result);
                res.json(result);
            }

            dbConnection.disconnect();
        });
    });
});*/

app.get('/api/get/consolidatedQuantity', async function (req, res) {
  console.log('Inside /api/get/consolidatedQuantity GET method');

  if (Object.keys(req.query).length === 0) {
    return res.status(400).send("Request query parameters can't be empty");
  }

  var dbConnection = hana.createConnection();
  console.log('DB Connection Object:', dbConnection);

  dbConnection.connect(dapConnOptions, function (err) {
    if (err) {
      console.error('Database connection failed:', err);
      return res.status(500).send('Database connection error');
    }
    console.log('Connected');

    var { plant, order, material, phase, workcenter, component, erpSequence, localSequence } = req.query;
    erpSequence = parseInt(erpSequence, 10);

    var queryString = `
            SELECT SUM(QUANTITY)/1000 AS TOTAL_QUANTITY
            FROM Z_CONSUMPTION 
            WHERE PLANT = '${plant}' 
                AND HEADER_MATERIAL = '${material}' 
                AND "ORDER_NO" = '${order}' 
                AND "OPERATION" = '${phase}' 
                AND "WORKCENTER" = '${workcenter}' 
                AND COMPONENT = '${component}' 
                AND LOCAL_SEQUENCE = '${localSequence}'
            AND COUNTED_FOR_CONSOLIDATED_POSTING = 0;
        `;

    console.log('/api/get/consolidatedQuantity SQL:', queryString);

    dbConnection.exec(queryString, function (err, result) {
      if (err) {
        console.error('Query execution failed:', err);
        res.status(500).send('Error executing query');
      } else {
        console.log('Consolidated consumption quantity fetched successfully', result);
        var totalQuantity = result.length > 0 && result[0].TOTAL_QUANTITY !== null ? result[0].TOTAL_QUANTITY : 0;
        totalQuantity = Number(totalQuantity);
        totalQuantity = totalQuantity.toFixed(3);
        totalQuantity = Number(totalQuantity);
        res.json({ value: totalQuantity });
        // res.send(result);
      }

      dbConnection.disconnect();
    });
  });
});

app.post('/api/update/ConsolidatedPostingData', async function (req, res) {
  console.log('Inside /api/update/ConsolidatedPostingData POST method');
  if (req.body != undefined) {
    var dbConnection = hana.createConnection();
    console.log('DB Connection Object : ' + dbConnection);
    console.log(req.body);
    dbConnection.connect(dapConnOptions, function (err) {
      if (err) throw err;
      console.log('Connected');
      var plant = req.body.plant;
      var order = req.body.order;
      var material = req.body.material;
      var phase = req.body.phase;
      var workcenter = req.body.workcenter;
      var component = req.body.component;
      var erpSequence = req.body.erpSequence;
      var localSequence = req.body.localSequence;
      var queryString = `
                UPDATE Z_CONSUMPTION 
                SET COUNTED_FOR_CONSOLIDATED_POSTING = 1 
                WHERE PLANT = '${plant}' 
                AND HEADER_MATERIAL = '${material}' 
                AND "ORDER_NO" = '${order}' 
                AND "OPERATION" = '${phase}' 
                AND "WORKCENTER" = '${workcenter}' 
                AND COMPONENT = '${component}' 
                AND LOCAL_SEQUENCE = '${localSequence}'
                AND COUNTED_FOR_CONSOLIDATED_POSTING = 0;
            `;

      console.log('/api/update/ConsolidatedPostingData SQL :' + queryString);
      dbConnection.exec(queryString, function (err, result) {
        if (err) throw err;
        console.log(result);
        console.log('Consolidated consumption quantity updated successfully');
        res.send('Success');
        dbConnection.disconnect();
      });
    });
  } else res.send("Request query body can't be empty");
});

/* app.post('/api/get/consolidatedQuantity', async function (req, res) {
    console.log("Inside /api/get/consolidatedQuantity POST method");

    if (Object.keys(req.body).length === 0) {
        return res.status(400).send("Request query parameters can't be empty");
    }

    var dbConnection = hana.createConnection();
    console.log("DB Connection Object:", dbConnection);

    dbConnection.connect(dapConnOptions, function (err) {
        if (err) {
            console.error("Database connection failed:", err);
            return res.status(500).send("Database connection error");
        }
        console.log("Connected");

        var { plant, order, material, phase, workcenter, component,erpSequence } = req.body;
        //erpSequence = parseInt(erpSequence, 10);

        var queryString = `
            SELECT SUM(QUANTITY)/1000 AS TOTAL_QUANTITY
            FROM Z_CONSUMPTION 
            WHERE PLANT = '${plant}' 
                AND HEADER_MATERIAL = '${material}' 
                AND "ORDER_NO" = '${order}' 
                AND "OPERATION" = '${phase}' 
                AND "WORKCENTER" = '${workcenter}' 
                AND COMPONENT = '${component}' 
                AND ERP_SEQUENCE = '${erpSequence}'
            AND COUNTED_FOR_CONSOLIDATED_POSTING = 0;
        `;

        console.log("/api/get/consolidatedQuantity SQL:", queryString);

        dbConnection.exec(queryString, function (err, result) {
            if (err) {
                console.error("Query execution failed:", err);
                res.status(500).send("Error executing query");
            } else {
                console.log("Consolidated consumption quantity fetched successfully", result);
                res.json(result);
            }

            dbConnection.disconnect();
        });
    });
});*/

app.get('/api/get/consolidatedInventory', async function (req, res) {
  console.log('Inside /api/get/consolidatedInventory GET method');

  if (Object.keys(req.query).length === 0) {
    return res.status(400).send("Request query parameters can't be empty");
  }

  var dbConnection = hana.createConnection();
  console.log('DB Connection Object:', dbConnection);

  dbConnection.connect(dapConnOptions, function (err) {
    if (err) {
      console.error('Database connection failed:', err);
      return res.status(500).send('Database connection error');
    }
    console.log('Connected');

    var { plant, component, storageLocation, batch } = req.query;
    //erpSequence = parseInt(erpSequence, 10);

    var queryString = `
            SELECT SUM(QUANTITY)/1000 AS TOTAL_QUANTITY
            FROM Z_CONSUMPTION 
            WHERE PLANT = '${plant}' 
                AND "STORAGE_LOCATION" = '${storageLocation}' 
                AND "BATCH_NUMBER" = '${batch}'  
                AND COMPONENT = '${component}' 
            AND COUNTED_FOR_CONSOLIDATED_POSTING = 0;
        `;

    console.log('/api/get/consolidatedQuantity SQL:', queryString);

    dbConnection.exec(queryString, function (err, result) {
      if (err) {
        console.error('Query execution failed:', err);
        res.status(500).send('Error executing query');
      } else {
        console.log('Consolidated consumption quantity fetched successfully', result);
        var totalQuantity = result.length > 0 && result[0].TOTAL_QUANTITY !== null ? result[0].TOTAL_QUANTITY : 0;
        totalQuantity = Number(totalQuantity);
        totalQuantity = totalQuantity.toFixed(3);
        totalQuantity = Number(totalQuantity);
        res.json({ quantity: totalQuantity });
        // res.send(result);
      }

      dbConnection.disconnect();
    });
  });
});

app.get('/api/get/consumptionAnalysis', async function (req, res) {
  console.log('DBAPI | Info | GET | CONS_ANL | Get Consumption Analysis Handler');

  //If the mandatory parameters are not available, thorw error
  if (!req.query.plant || !req.query.operator || !req.query.orderNo || !req.query.component) {
    var oError = new Error('Required query params missing');
    oError.status = 400;
    throw oError;
  }

  //Create db connection
  const dbConnection = hana.createConnection();

  dbConnection.connect(dapConnOptions, function (oError) {
    if (oError) {
      console.error('DB connection failed', JSON.stringify(oError));
      return res.status(500).send('Database connection error');
    }

    var sPlant = req.query.plant,
      // sResource = req.query.resource,
      sOperator = req.query.operator,
      sOrderNo = req.query.orderNo,
      sComponent = req.query.component,
      iConsecutiveThreshold = 1,
      iCumulativeThreshold = 1,
      iCumulativeCount = 1;

    //Query to fetch user personalized tolerances
    var sQuery = `
      SELECT *
      FROM z_personalized_tolerances
      WHERE plant = '${sPlant}'
        and "ORDER" = '${sOrderNo}'
        and component = '${sComponent}'
        and operator = '${sOperator}'
        and active = 1
      ORDER BY created_timestamp DESC
      LIMIT 1
    `;

    console.log('DBAPI | Info | GET | CONS_ANL | Retrieve personalized tolerance', JSON.stringify(sQuery));
    dbConnection.exec(sQuery, function (oError, aResult) {
      console.log('DBAPI | Info | GET | CONS_ANL | Results', JSON.stringify(aResult));
      if (oError) {
        console.log('DBAPI | Error | GET | CONS_ANL | Error retrieving personalized tolerance data', JSON.stringify(oError));
        res.status(500).send('Error executing query');
        return;
      }

      //Expecting one row from the table corresponding to the provided filters
      if (aResult && aResult.length !== 1) {
        console.log('DBAPI | Error | GET | CONS_ANL | No consumption found for given parameters', JSON.stringify(oError));
        res.status(404).send('No consumption found for given parameters');
        return;
      }

      iConsecutiveThreshold = aResult[0].CONSECUTIVE_THRESHOLD_COUNT;
      iCumulativeCount = aResult[0].CUMULATIVE_THRESHOLD_COUNT;
      iCumulativeThreshold = aResult[0].CUMULATIVE_CONSUMPTION_LIMIT;

      console.log(
        `DBAPI | Info | GET | CONS_ANL | ConsCount=${iConsecutiveThreshold}, CumulCount=${iCumulativeCount}, CumulThreshold=${iCumulativeThreshold}`
      );

      var sQuery = `
        SELECT *
        FROM ZTF_FAIL_ANALYSIS_COMBINED(
          ${iConsecutiveThreshold},
          ${iCumulativeThreshold},
          ${iCumulativeCount},
          '${sPlant}',
          '${sOperator}',
          '${sOrderNo}',
          '${sComponent}'
        )
      `;

      console.log('DBAPI | Info | GET | CONS_ANL | Run the table function to capture data', JSON.stringify(sQuery));
      dbConnection.exec(sQuery, function (oError, aResult) {
        if (oError || (aResult && aResult.length !== 1)) {
          console.log('DBAPI | Error | GET | CONS_ANL | Error occured running ZTF_FAIL_ANALYSIS_COMBINED', JSON.stringify(oError));
          res.status(500).send('Error executing query');
          return;
        }

        res.send(aResult);
      });
    });
  });
});
