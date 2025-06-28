import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenRepository } from '../../domain/repositories';
import { Token as TokenEntity } from '../../domain/entities';
import { TokenSchema, TokenDocument } from '../schemas';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenMongooseRepository implements TokenRepository {
  constructor(
    @InjectModel(TokenSchema.name)
    private readonly tokenModel: Model<TokenDocument>,
  ) {}

  async findById(id: string): Promise<TokenEntity | null> {
    const token = await this.tokenModel.findOne({ id }).exec();

    if (!token) {
      return null;
    }

    return new TokenEntity(
      token.id,
      token.accountName,
      token.isValid,
      token.scopes,
      token.createdAt,
    );
  }

  async create(tokenData: Omit<TokenEntity, 'id'>): Promise<TokenEntity> {
    const id = uuidv4();
    const isValid = tokenData.isValid ?? true;

    const token = new this.tokenModel({
      id,
      accountName: tokenData.accountName,
      isValid,
      scopes: tokenData.scopes,
      createdAt: tokenData.createdAt,
    });

    const savedToken = await token.save();

    return new TokenEntity(
      savedToken.id,
      savedToken.accountName,
      savedToken.isValid,
      savedToken.scopes,
      savedToken.createdAt,
    );
  }

  async findAll(): Promise<TokenEntity[]> {
    const tokens = await this.tokenModel.find().exec();

    return tokens.map(
      (token) =>
        new TokenEntity(
          token.id,
          token.accountName,
          token.isValid,
          token.scopes,
          token.createdAt,
        ),
    );
  }
}
