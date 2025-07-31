import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import Auth, { IAuth } from '../models/auth.model';
import mongoose from 'mongoose';
import { hashPassword } from '../utils/bcrypt.util';
import { AuthService } from '../services/implementations/auth.service';
import { AuthRepository } from '../repositories/implementations/auth.repository';
import { env } from '../configs/env.config';
import fs from "fs";

const PROTO_PATH = path.join(__dirname, "../../proto/auth.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const authProto = grpc.loadPackageDefinition(packageDefinition) as any;
const server = new grpc.Server();
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

const key = fs.readFileSync(path.join(__dirname, '../../certs', 'key.pem'));
const cert = fs.readFileSync(path.join(__dirname, '../../certs', 'cert.pem'));


server.addService(authProto.auth.AuthService.service, {
    RegisterUser: async (call: any, callback: any) => {
        try {
            const { _id, email, password, role } = call.request;

            const hashedPassword = await hashPassword(password);

            const authData: Partial<IAuth> = {
                _id: new mongoose.Types.ObjectId(_id),
                email,
                password: hashedPassword,
                role
            }

            await authService.createUserByGrpc(authData as IAuth);

            callback(null, { success: true, message: "User registered successfully" });
        } catch (error) {
            callback({
                code: grpc.status.INTERNAL,
                message: "Internal server error",
            });
        }
    }
});

const creds = grpc.ServerCredentials.createSsl(null, [{
    private_key: key,
    cert_chain: cert,
}], true);

const startGRPCServer = () => {
    server.bindAsync(`0.0.0.0:50051`, creds, () => {
        console.log("Auth gRPC Server running on port 50051");
    })
}

export default startGRPCServer;