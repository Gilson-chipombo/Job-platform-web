import { Module } from '@nestjs/common';
import { AppliesController } from './applies.controller';
import { AppliesService } from './applies.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AppliesController],
  providers: [AppliesService]
})
export class AppliesModule {}
