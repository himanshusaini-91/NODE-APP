import express from "express";
import catchError from "../error/catch-error";
import IController from "../common/controller-interface";
import IAuthenticatedRequest from "../guards/authenticated.request";
import authenticationGuard from "../guards/authentication.guard";
import HandledApplicationError from '../error/handled-application-error';
const fs = require('fs');
const path = require('path');
const fileName = path.join(__dirname, '..', 'common', 'json', 'stock.json')

export class VendorController implements IController {
    public path = "/vendors";
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.put(`${this.path}/stock/update`, authenticationGuard, this.updateStock);
        this.router.get(`${this.path}/stock/available`, authenticationGuard, this.getAvailableStock);
    }
    // Update Stock Method: 
    // * It can update single appreal codes or multiple appreal codes along with respective sizes into the local JSON File
    private readonly updateStock = async (req: IAuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
        
        try {

            //Example Payload
            // {
            //     "stock": [
            //         {
            //              "apprelCodes": "MF2988", 
            //              "size": [
            //                  {
            //                      "category": "XXL",
            //                      "price": "899",
            //                      "isFullFilled": false
            //                  },
            //                  {
            //                      "category": "XXXL",
            //                      "price": "1899",
            //                      "isFullFilled": false
            //                  }
            //              ]
            //          }
            //      ]
            //  }
            const payload = req.body.stock ? req.body.stock : [];
            if(!payload.length) {
                throw new HandledApplicationError(500, 'Nothing to update');   
            }
            else {
                // Use fs.readFile() method to read the file
                fs.readFile(fileName, 'utf8', (err: any, data: any) => {
                    if(err) {
                        throw new HandledApplicationError(500, 'File is not exist');  
                    } else {
                        data = JSON.parse(data);
                        payload.map((item: any) => {
                            // add new apprelCodes
                            if(!data[item.apprelCodes]) {
                                data[item.apprelCodes] = {
                                    size: {}
                                }
                                item.size.map((y: any) => {
                                    data[item.apprelCodes].size[y.category] = {
                                        price: y.price,
                                        isFullFilled: false
                                    }
                                })
                            } else {
                                // update  apprelCodes of respective sizes
                                item.size.map((y: any) => {
                                    if(!data[item.apprelCodes].size[y.category]) {
                                        data[item.apprelCodes].size[y.category] = {
                                            price: y.price,
                                            isFullFilled: false
                                        }
                                    } else {
                                        data[item.apprelCodes].size[y.category].price = y.price
                                    }
                                    
                                })
                            }
                        })
                        this.saveDataToJSON(data, res);
                    }
                })
            }
        } catch(err){
            catchError(err, next);
        }
    }

    // Available Stock Method: 
    // This methods is used to check available appreal code of their respective sizes.
    private readonly getAvailableStock = async (req: IAuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
        try {

            //Example Payload
            // {
            //     "stock": [
            //         {
            //              "apprelCodes": "MF2988", 
            //              "size": ["xs", "L"]
            //          },
            //          {
            //              "apprelCodes": "GL1900", 
            //              "size": ["L", "XXL"]
            //          }
            //      ]
            //  }
            const payload = req.body.stock ? req.body.stock : [];
            if(!payload.length) {
                throw new HandledApplicationError(500, 'Nothing to update');   
            }
            else {
                // Use fs.readFile() method to read the file
                fs.readFile(fileName, 'utf8', (err: any, data: any) => {
                    if(err) {
                        throw new HandledApplicationError(500, 'File is not exist');  
                    } else {
                        data = JSON.parse(data);
                        let response: any = [];
                        payload.map((item: any) => {
                            if(data[item.apprelCodes]) {
                                let  sizeData: any = []
                                // update  apprelCodes of respective sizes
                                item.size.map((y: any) => {
                                    const obj: any ={}
                                    if(data[item.apprelCodes].size[y.toUpperCase()].isFullFilled) {
                                        obj.category = y;
                                        obj.status = "booked";
                                    }
                                    else {
                                        obj.category = y;
                                        obj.status = "available";
                                    }
                                    sizeData.push(obj)
                                })
                                response.push({apprelCodes: item.apprelCodes, sizeData: sizeData})
                            }
                        })
                        res.json(response);
                    }
                })
            }
        } catch(err){
            catchError(err, next);
        }
    }

    // saveDataToJSON  Method: 
    // * This methods is used to write the data into local JSON File
    private saveDataToJSON(data: any, res: any){
        fs.writeFile(fileName, JSON.stringify(data), (err: any, data: any) => {
            if(err) {
                console.log('data write sucess Fully', err);
            }
            else {
                res.send('data updated sucessfully');
            }
        });
    }
}
