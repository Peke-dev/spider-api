import { Injectable } from '@nestjs/common';
import { DateStringEnum, FindAllMatchesUseCase } from '@modules/matches';

@Injectable()
export class GetMatchesByDateUseCase {
  constructor(private readonly findAllMatchesUseCase: FindAllMatchesUseCase) {}

  async execute(dateString: DateStringEnum = DateStringEnum.TODAY) {
    return await this.findAllMatchesUseCase.execute({
      dateString: dateString,
    });
  }
}
