import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VagasService } from './vagas.service';

@Controller('vagas')
export class VagasController {
    constructor(private vagas: VagasService){}

    @Get()
    async getAll() { return await this.vagas.getAll(); }

    @Post('create')
    async create(@Body() body){ return await this.vagas.create(body); }

    @Get('/recentes')
    async vagasRecentes(){
        return await this.vagas.vagasRecentes();
    }

    @Get('/destaques')
    async vagasDestaques(){
        return await this.vagas.vagasDestaques();
    }

    @Get(':id')
    async findOne(@Param('id') id: string){ return await this.vagas.findOne(+id); }

    @Get('/company/:id')
    async vagasByCompany(@Param('id') id: string){
        return await this.vagas.vagasByCompany(+id);
    }

    @Get('/company/applies/:id')
    appliesByCompany(@Param('id') id: string){
        return this.vagas.appliesByCompany(+id);
    }
}
