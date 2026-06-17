import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt'; 

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService){}

    async findAll(){
        return this.prisma.student.findMany({ omit: {password: true }});
    }

    async create(data: any) {

        const email    = data.email;
        const telphone = data.telphone;
        const nif      = data.NIF;

        const findEmail = await this.prisma.student.findFirst({ where: { email } });

        if (findEmail) return {"message": "Este email já existe."};

        const findTelphone = await this.prisma.student.findFirst({ where: { telphone } });
        
        if (findTelphone) return {"message": "Este número já existe."};

        data.password = await bcrypt.hash(data.password, 10);

        //const findNIF = await this.prisma.student.findFirst({ where: { nif } });

        //if (findNIF) return {"message": "Este NIF já existe."};

        return this.prisma.student.create({ data });
    }

    async findOne(id: number){
        return this.prisma.student.findUnique({where: {id},
            select:{
                id: true,
                fullName: true,
                email: true,
                telphone: true,
                nif: true,
                school: true,
                year: true,
                turno: true,
                areaInterest: true,
                skills: true 
            }
        });
    }

    async update(id: number, data: any){
        return this.prisma.student.update({ where: {id}, data});
    }

    async remove(id: number){
        return this.prisma.student.delete({where: {id}})
    }

    async reject(id: number){
        return this.prisma.student.update({ 
            where: {id},
            data: {state: "rejeitado"}
        })
    }

    async approve(id: number){
        return this.prisma.student.update({
            where: {id},
            data: {state: "aprovado"}
        })
    }

    async findByEmail(email: string)
    {
        return this.prisma.student.findUnique({where: {email},
            select:{
                id: true,
                fullName: true,
                email: true,
                state: true,
                password: true,
            }
        });
    }
}
