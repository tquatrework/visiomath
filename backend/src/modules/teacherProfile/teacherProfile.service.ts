import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherProfile } from '../../shared/entities/teacherProfile.entity.js';
import { UserProfile } from '../../shared/entities/userprofile.entity.js';

@Injectable()
export class TeacherProfileService {
  constructor(
    @InjectRepository(TeacherProfile)
    private readonly teacherProfileRepository: Repository<TeacherProfile>,

    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {}

  /**
   * Retrieve all teacher profiles with optional filters.
   */
  async findAll(profileId?: number): Promise<TeacherProfile[]> {
    if (profileId) {
      const teacherProfile = await this.findByProfileId(profileId);
      return teacherProfile ? [teacherProfile] : [];
    }
    return this.teacherProfileRepository.find({
      relations: ['userProfile'],
    });
  }

  /**
   * Retrieve a specific teacher profile by ID.
   */
  async findOne(id: number): Promise<TeacherProfile> {
    const profile = await this.teacherProfileRepository.findOne({
      where: { id },
      relations: ['userProfile'],
    });
    if (!profile) {
      throw new NotFoundException(`TeacherProfile with ID ${id} not found`);
    }
    return profile;
  }

  /**
   * Retrieve a teacher profile by UserProfile ID, or create one if it does not exist.
   */
  async findByProfileId(profileId: number): Promise<TeacherProfile> {
    let teacherProfile = await this.teacherProfileRepository.findOne({
      where: { userProfile: { id: profileId } },
      relations: ['userProfile'],
    });

    if (!teacherProfile) {
      const userProfile = await this.userProfileRepository.findOne({ where: { id: profileId } });
      if (!userProfile) {
        throw new NotFoundException(`UserProfile with ID ${profileId} not found`);
      }

      teacherProfile = this.teacherProfileRepository.create({ userProfile });
      await this.teacherProfileRepository.save(teacherProfile);
    }

    return teacherProfile;
  }

  /**
   * Create a new teacher profile.
   */
  async create(data: Partial<TeacherProfile>): Promise<TeacherProfile> {
    const newProfile = this.teacherProfileRepository.create(data);
    return this.teacherProfileRepository.save(newProfile);
  }

  /**
   * Update an existing teacher profile by ID.
   */
  async update(id: number, data: Partial<TeacherProfile>): Promise<TeacherProfile> {
    const profile = await this.findOne(id);
    Object.assign(profile, data);
    return this.teacherProfileRepository.save(profile);
  }

  /**
   * Delete a teacher profile by ID.
   */
  async delete(id: number): Promise<void> {
    const result = await this.teacherProfileRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TeacherProfile with ID ${id} not found`);
    }
  }
}
