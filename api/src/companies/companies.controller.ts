import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
    constructor(private comapanies: CompaniesService){}

    @Get()
    getAll(){
        return this.comapanies.findAll();
    }

    @Post('create')
    create(@Body() body){
        return this.comapanies.create(body);
    }

    @Get('/amount/vagas/:id')
    getAmountVagas(@Param('id') id: String){
        return this.comapanies.getAmountVagas(+id);
    }

     @Put('reject/:id')
    reject(@Param('id') id: String){
        return this.comapanies.reject(+id);
    }

    @Put('approve/:id')
    approve(@Param('id') id: String){
        return this.comapanies.approve(+id);
    }
}
