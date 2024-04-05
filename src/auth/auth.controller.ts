import { IncomingHttpHeaders } from 'http';

import { Controller, Post, Body, Get, UseGuards, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';

@ApiTags( "Auth" )
@Controller('auth')
export class AuthController {

	constructor( private readonly authService: AuthService ) { }

	@Get( "check-status" )
	@Auth()
	checkAuthStatus(
		@GetUser() user: User,
	){
		return this.authService.checkAuthStatus( user );
	}


	@Get( "private" )
	@UseGuards( AuthGuard() )
	testingPrivateRouth(
		@GetUser() user: User,
		@GetUser( "email" ) userEmail: string,

		@RawHeaders() rawHeaders: string[],
		@Headers() headers: IncomingHttpHeaders
	) {
		return { user, userEmail, rawHeaders, headers };
	}

	@Get( "anotherPrivate" )
	// @SetMetadata( "roles", [ "admin", "super-user" ] )
	@RoleProtected( ValidRoles.superUser, ValidRoles.admin )
	@UseGuards( AuthGuard(), UserRoleGuard )
	anotherPrivateRouth(
		@GetUser() user: User,
	){
		return user;
	}

	@Get( "anotherPrivateAgain" )
	@Auth( ValidRoles.admin )
	anotherPrivateRouthAgain(
		@GetUser() user: User,
	){
		return user;
	}

	@Post( "register" )
	createUser( @Body() createUserDto: CreateUserDto ) {
		return this.authService.create( createUserDto );
	}

	@Post( "login" )
	loginUser( @Body() loginUserDto: LoginUserDto ) {
		return this.authService.login( loginUserDto );
	}
}
