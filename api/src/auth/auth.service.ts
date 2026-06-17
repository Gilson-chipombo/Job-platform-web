import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { AdminService } from 'src/admin/admin.service';
import { CompaniesService } from 'src/companies/companies.service';
import { UsersService } from 'src/users/users.service';
import bcrypt from "bcrypt"
import { error } from 'console';

@Injectable()
export class AuthService {
    constructor( private usersService: UsersService, 
                 private companyService: CompaniesService,
                 private jwtService: JwtService,
                 private adminService: AdminService
    ){}

    async validateStudent(email: string, pass: string){
        const student = await this.usersService.findByEmail(email);

        if (!student) return null;

        const isMatch = await bcrypt.compare(pass, student.password);
        if (!isMatch) return null;
        if (student.state != "aprovado") return null;
        return student;
    }

    async validateCompany(email: string, pass: string){
        const company = await this.companyService.findByEmail(email);

        if (!company) return null;
        const isMatch = await bcrypt.compare(pass, company.password);
        if (!isMatch) return null;
        if (company.state != "aprovado") return null;
        return company;
    }

    async validateAdmin(email: string, pass: string){
        const admin = await this.adminService.findByEmail(email);

        if (!admin) return null;
        const isMatch = await bcrypt.compare(pass, admin.password);
        if (!isMatch) return null;
        return admin;
    }

    async login(user: any, userType: string) {
        const payload = {sub: user.id, email: user.email};
        const idUser = user.id;
        return {
            access_token: this.jwtService.sign(payload),
            idUser,
            userType
        };
    }
}
