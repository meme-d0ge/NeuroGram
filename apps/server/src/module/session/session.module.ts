import { Module } from "@nestjs/common";
import { GeoIpModule } from "../geo-ip/geo-ip.module.js";
import { AuthGuards } from "./auth.guards.js";
import { SessionController } from "./session.controller.js";
import { SessionService } from "./session.service.js";

@Module({
	controllers: [SessionController],
	imports: [GeoIpModule],
	providers: [SessionService, AuthGuards],
	exports: [SessionService],
})
export class SessionModule {}
