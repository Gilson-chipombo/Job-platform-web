import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AppliesService {
    constructor(private prisma: PrismaService){}
    
    getAllApplies(){ return this.prisma.apply.findMany(); }
    
    async create(data: any, cvPath: string | null)
    {         
        const alreadyApplied = await this.prisma.apply.findFirst({
            where: {
                idStudent: Number(data.idStudent),
                idVaga: Number(data.idVaga)
            }
        });

        if (alreadyApplied) {
            return { message: "Já fizeste uma candidatura nesta vaga." };
        }

        return await this.prisma.apply.create({
            data: {
                idStudent: Number(data.idStudent),
                idVaga: Number(data.idVaga),
                description: data.description,
                cvPath: cvPath
            }
        });
    }

    getApplyById(id: number){ return this.prisma.apply.findUnique({ where: { id } }); }

    //Candidaturas por empresa


    //Studantes que aplicaram para uma vaga
    async appliesByVaga(id: number){
        const applies = await this.prisma.apply.findMany({where: { idVaga: id },
            select: {
                idVaga: true,
                idStudent: true,
                status: true,
                cvPath: true,
                student: {
                    select:{
                        fullName: true,
                        email: true,
                        telphone: true,
                        school: true,
                        areaInterest: true,
                        skills: true,
                    }
                }
            }
        });

        return applies.map(apply => ({
        ...apply,
        cvUrl: apply.cvPath
            ? `http://127.0.0.1:3000/uploads/cv/${apply.cvPath}`
            : null
        }));
    }

}
