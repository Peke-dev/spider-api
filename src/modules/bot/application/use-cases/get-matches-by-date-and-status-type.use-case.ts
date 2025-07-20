import { Injectable } from '@nestjs/common';
import {
  DateStringEnum,
  FindAllMatchesUseCase,
  MatchTypeEnum,
} from '@modules/matches';

@Injectable()
export class GetMatchesByDateAndStatusTypeUseCase {
  constructor(private readonly findAllMatchesUseCase: FindAllMatchesUseCase) {}

  async execute(
    dateString: DateStringEnum = DateStringEnum.TODAY,
    statusType: MatchTypeEnum[] = [],
  ) {
    return await this.findAllMatchesUseCase.execute(
      {
        dateString: dateString,
        statusType: statusType,
      },
      {
        orderBy: 'timestamp',
        order: 'asc',
      },
    );
  }
}
