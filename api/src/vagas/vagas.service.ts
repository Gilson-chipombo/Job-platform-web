import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class VagasService {
    constructor(private prisma: PrismaService){}

    async getAll(){
        return this.prisma.vaga.findMany({
            select: {
                id: true,
                title: true,
                type: true,
                location: true,
                minSalary: true,
                maxSalary: true,
                experience: true,
                description: true,
                responsability: true,
                requirements: true,
                skills: true,
                beneficios: true,
                idCompany: true,
                createdAt: true,
                company: {
                    select:{
                        name: true
                    }
                }
            }
        });
    }

    async create(data: any){
        return this.prisma.vaga.create({ data });
    }

    async findOne(id: number){
        return this.prisma.vaga.findUnique({where: { id: id },
            select: {
                id: true,
                title: true,
                type: true,
                location: true,
                minSalary: true,
                maxSalary: true,
                experience: true,
                description: true,
                responsability: true,
                requirements: true,
                skills: true,
                beneficios: true,
                idCompany: true,
                company: {
                    select:{
                        name: true,
                        website: true,
                        Province: true,
                        address: true,
                        segment: true,
                        description: true
                    }
                }
            }
        });
    }
    // retorna as vagas que a compania publicou e a qtdade de candidaturas
    async vagasByCompany(id: number){
        return this.prisma.vaga.findMany({
            where: {idCompany: id},
            include:{
                _count: {
                    select: {
                      applies: true
                    }
                }
            }
        })
    }
    // Retorna as vagas e os estudantes cadastrados
    async appliesByCompany(id: number){
        return this.prisma.vaga.findMany({ where: {},
            select:{
                applies: {
                    select:{
                        id: true,
                        idVaga: true,
                        idStudent: true,
                        status: true,
                        student: {
                            select:{
                                id: true,
                                fullName: true,
                                areaInterest: true
                            }
                        }
                    },
                },

            }
        });
    }

    async vagasDestaques(){
        return this.prisma.vaga.findMany({ 
            where: { type: "estagio" },
            take: 3,
        });
    }

    async vagasRecentes()
    {
        return this.prisma.vaga.findMany({
            take: 6,
            orderBy:{
                createdAt: 'desc'
            }
        });
    }
}
