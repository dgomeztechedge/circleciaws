import { JwtService, JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../users/user.service';
import { jwtConstants } from '../auth/constants';

describe('LoginController', () => {
  let controller: LoginController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      controllers: [LoginController],
      providers: [AuthService, UserService],
    }).compile();

    controller = module.get<LoginController>(LoginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
