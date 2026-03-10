import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('students')
export class UsersController {
    constructor(private userService: UsersService){}

    @Get()
    findAll(){
        return this.userService.findAll();
    }
    @Post('create')
    create(@Body() body){
        return this.userService.create(body);
    }
    
    @Get(':id')
    findOne(@Param('id') id: String){
        return this.userService.findOne(+id);
    }
    @Put(':id')
    update(@Param('id') id: String, @Body() body){
        return this.userService.update(+id, body);
    }
    
    @Put('reject/:id')
    reject(@Param('id') id: String){
        return this.userService.reject(+id);
    }

    @Put('approve/:id')
    approve(@Param('id') id: String){
        return this.userService.approve(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: String){
        return this.userService.remove(+id);
    }
}
