import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { JwtModule } from '@nestjs/jwt'
import { UsersService } from 'src/users/users.service';
import { CompaniesService } from 'src/companies/companies.service';
import { AdminModule } from 'src/admin/admin.module';
import { AdminService } from 'src/admin/admin.service';


@Module({
  imports: [
    JwtModule.register({
      secret: 'supersecret',
      signOptions: { expiresIn: '1d' },
    }),
    AuthModule,
    UsersModule,
    CompaniesModule,
    AdminModule
  ],
  providers: [
    AuthService, 
    UsersService,
    CompaniesService,
    AdminService
  ],
  controllers: [AuthController]
})
export class AuthModule {}
