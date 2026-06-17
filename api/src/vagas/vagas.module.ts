import { Module } from '@nestjs/common';
import { VagasController } from './vagas.controller';
import { VagasService } from './vagas.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VagasController],
  providers: [VagasService]
})
export class VagasModule {}
