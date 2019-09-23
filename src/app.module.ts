import { AuthModule } from './auth/auth.module';
import { LoginController } from './hades-admin/login/login.controller';
import { ConfigModule } from './config/config.module';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { Author } from './author/entities/author.entity';
import { AuthorController } from './author/controllers/author.controller';
import { AuthorService } from './author/services/author.service';
import { Book } from './book/entities/book.entity';
import { BookController } from './book/controllers/book.controller';
import { BookService } from './book/services/book.service';
import { ReaderController } from './reader/controllers/reader.controller';
import { ReaderService } from './reader/services/reader.service';
import { Reader } from './reader/entities/reader.entity';
import { AuthorResolver } from './author/graphql/author.resolver';
import { BookResolver } from './book/graphql/book.resolver';
import { ConfigService } from './config/config.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AdminModule } from './hades-admin/admin.module';
import { AuthService } from './hades-admin/auth/auth.service';

// graphql

// middleware

@Module({
  imports: [
    ConfigModule,
    GraphQLModule.forRoot({
      debug: true,
      playground: true,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        name: 'default',
        type: 'mysql' as 'mysql',
        port: 3306,
        host: config.get('DATABASE_HOST'),
        username: config.get('DATABASE_USER'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_SCHEMA'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Author, Book, Reader]),
    AdminModule,
    AuthModule,
    LoginModule,
  ],
  controllers: [AuthorController, BookController, ReaderController, LoginController],
  providers: [
    ConfigModule,
    AuthorService,
    BookService,
    ReaderService,
    AuthService,
    // resolvers
    AuthorResolver,
    BookResolver,
  ],
})
export class AppModule implements NestModule {
  // set middleware configuration
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('book');
  }
}
