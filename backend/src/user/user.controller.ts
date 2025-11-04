import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/user.schema';
import { DeleteDto, PaginationDto } from 'lib/pagination.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.userSignup(createUserDto);
  }
  @Post('create-vendor')
  createVendor(@Body() createUserDto: CreateUserDto) {
    return this.userService.vendorSignup(createUserDto);
  }
  @Post('create-admin')
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.userService.adminCreateUser(createUserDto,"admin" as UserRole);
  }
  @Post('login-user')
  userLogin(@Body() login: LoginUserDto) {
    return this.userService.login(login);

  }

  @Get('find-one-user')
  findOneUSer(@Query() query:DeleteDto) {
    return this.userService.getSingleUser(query.id!);
  }
  @Get('find-all-users')
  findAll(@Query() query:PaginationDto) {
    return this.userService.findAll(query,"admin" as UserRole);
  }

 /*  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  } */

  @Patch('update-user')
  update( @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(updateUserDto.id, updateUserDto);
  }
  @Patch('update-user-admin')
  updateUserAdmin( @Body() updateUserDto: UpdateUserDto) {
    return this.userService.adminUpdateUser(updateUserDto.id, updateUserDto,"admin" as UserRole);
  }

  @Delete('delete-user')
  remove(@Query() qeury:DeleteDto) {
    return this.userService.remove(qeury.id!,"admin" as UserRole);
  }
}
