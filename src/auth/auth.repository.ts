import { InjectModel } from '@nestjs/mongoose';
import { User, UserWithId } from '../users/user.schema';
import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../users/user.repository';

export class AuthRepository {
  constructor(private userRepository: UserRepository) {}
  async test() {
    return await 'TESTING';
  }

  async updatePassword({
    id,
    password
  }: {
    id: string;
    password: string;
  }): Promise<User> {
    const newPassword = { password: password };
    return await this.userRepository.updateById(id, newPassword);
  }

  async updateRecoveryTokenByEmail({
    id,
    token,
    timestamp
  }: {
    id: string;
    token: string;
    timestamp: string;
  }): Promise<User> {
    const updatedToken = {
      forgotPasswordToken: token,
      forgotPasswordTimestamp: timestamp
    };
    console.log('ID: ', id);
    return await this.userRepository.updateById(id, updatedToken);
  }

  async createUser(user: User): Promise<UserWithId> {
    console.log('DODJES LI OVDJE?');
    return await this.userRepository.createUser(user);
  }
}
