import { OnGatewayConnection, OnGatewayDisconnect, 
	SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
	import { JwtService } from '@nestjs/jwt';
	import { Server, Socket } from 'socket.io';

import { MessagesWsService } from './messages-ws.service';
import { newMessageDto } from './dto/new-message.dto';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() wss: Server;

	constructor(
		private readonly messagesWsService: MessagesWsService,
		private readonly jwtService: JwtService
	) { }

	async handleConnection( client: Socket ) {
		// console.log('Cliente Conectado:', client.id );
		const token = client.handshake.headers.authentication as string;
		let payload: JwtPayload;

		try { 
			payload = this.jwtService.verify( token );
			await this.messagesWsService.registerClient( client, payload.id );

		} catch ( error ) { client.disconnect(); return; }

		// console.log( payload );

		this.wss.emit( "clients-updated", this.messagesWsService.getConnectedClients() );
	}
	
	handleDisconnect( client: Socket ) {
		// console.log('Cliente Desconectado:', client.id );
		this.messagesWsService.removeClient( client.id );
		this.wss.emit( "clients-updated", this.messagesWsService.getConnectedClients() );
	}
	
	@SubscribeMessage( "message-from-client" )
	onMessageFromClient( client: Socket, payload: newMessageDto ) {
		
		// Emitir unicamente al cliente que envio el mensaje
		// client.emit( "message-from-server", {
		// 	fullName: "Soy yo",
		// 	messagge: payload.message || "no message"
		// });
			
		// Emitir a todos en el Socket, menos al cliente que lo mando
		// client.broadcast.emit( "message-from-server", {
		// 	fullName: "Soy yo",
		// 	messagge: payload.message || "no message"
		// });
			
		// Emitir a todos
		this.wss.emit( "message-from-server", {
			fullName: this.messagesWsService.getUserFullNameBySocketId( client.id ),
			message: payload.message || "no message"
		});
	}
}
