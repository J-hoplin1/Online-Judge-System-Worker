import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'app/prisma/prisma.service';
import { Request } from 'express';

/**
 * Problem Id Checker
 * Only use for problem id required routers
 *
 * Return 400 BadRequest Error if problem does not exist
 */

@Injectable()
export class ProblemGuard implements CanActivate {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const problemId = request.params['pid'];

    // Check if problem in DB
    try {
      await this.prisma.problem.findUniqueOrThrow({
        where: {
          id: parseInt(problemId),
        },
      });
      return true;
    } catch (err) {
      throw new BadRequestException('PROBLEM_NOT_FOUND');
    }
  }
}
